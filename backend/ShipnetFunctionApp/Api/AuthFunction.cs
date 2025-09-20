using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Auth.DTOs;
using ShipnetFunctionApp.Auth.Services;

public class AuthFunction
{
    private readonly AuthService _authService;
    private readonly ISchemaAccessor _schemaAccessor;
    private readonly ITenantContext _tenantContext;
    private static readonly ConcurrentDictionary<string, string> ShortTokenStore = new();
    private readonly UserService _userService;
    private readonly ILogger<AuthFunction> _logger;

    public AuthFunction(
        AuthService authService, 
        ISchemaAccessor schemaAccessor, 
        ITenantContext tenantContext, 
        UserService userService,
        ILogger<AuthFunction> logger)
    {
        _authService = authService;
        _schemaAccessor = schemaAccessor;
        _tenantContext = tenantContext;
        _userService = userService;
        _logger = logger;
    }


    [Function("Login")]
    public async Task<HttpResponseData> Login(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/login")] HttpRequestData req)
    {
        try
        {
            var body = await req.ReadFromJsonAsync<LoginRequest>();
            if (body == null || string.IsNullOrEmpty(body.username) ||
                string.IsNullOrEmpty(body.password) || string.IsNullOrEmpty(body.accountCode))
            {
                return req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
            }

            // 1. Validate account code and get subscription
            var subscription = await _authService.GetSubscriptionByAccountCodeAsync(body.accountCode);
            if (subscription == null)
            {
                return req.CreateResponse(System.Net.HttpStatusCode.Unauthorized);
            }

            // 2. Set schema in tenant context
            _tenantContext.AccountCode = body.accountCode;
            _tenantContext.Schema = subscription.Schema;

            // 3. Authenticate user in the correct schema
            var userWithToken = await _userService.AuthenticateUserAsync(
                body.username, body.password, body.accountCode);

            if (userWithToken == null)
            {
                return req.CreateResponse(System.Net.HttpStatusCode.NotFound);
            }

            // 4. Return user with token
            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
            await response.WriteAsJsonAsync(new
            {
                user = userWithToken.User,
                longToken = userWithToken.LongToken
            });

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An error occurred while processing your request.");
            return errorResponse;
        }
    }

    [Function("CreateShortToken")]
    public async Task<HttpResponseData> CreateShortToken(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "auth/CreateShortToken")] HttpRequestData req,
        FunctionContext context)
    {
        try
        {
            // Get the token that was validated by the middleware
            if (!context.Items.TryGetValue("validatedToken", out var tokenObj) || tokenObj == null)
            {
                _logger.LogWarning("No validated token found in context");
                var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.Unauthorized);
                await errorResponse.WriteStringAsync("No valid token found.");
                return errorResponse;
            }

            var longToken = tokenObj.ToString();
            
            // Generate a short token (unique identifier)
            var shortToken = Guid.NewGuid().ToString("N");
            
            // Store the short token with the long token
            ShortTokenStore[shortToken] = longToken;

            // Set expiration for the short token (30 seconds)
            _ = Task.Run(async () =>
            {
                await Task.Delay(TimeSpan.FromSeconds(30));
                ShortTokenStore.TryRemove(shortToken, out _);
                _logger.LogInformation("Short token {ShortToken} expired and removed", shortToken);
            });

            _logger.LogInformation("Created short token {ShortToken}", shortToken);

            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
            await response.WriteAsJsonAsync(new { shortToken });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating short token");
            var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An error occurred while processing your request.");
            return errorResponse;
        }
    }

    [Function("ExchangeShortToken")]
    public async Task<HttpResponseData> ExchangeShortToken(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/ExchangeShortToken")] HttpRequestData req)
    {
        try
        {
            var body = await req.ReadFromJsonAsync<ExchangeShortTokenRequest>();
            if (body == null || string.IsNullOrEmpty(body.ShortToken))
            {
                var badRequestResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                await badRequestResponse.WriteStringAsync("Short token is required.");
                return badRequestResponse;
            }

            // Try to retrieve and remove the long token
            if (ShortTokenStore.TryRemove(body.ShortToken, out var longToken))
            {
                _logger.LogInformation("Exchanged short token {ShortToken} for long token", body.ShortToken);
                
                var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new { longToken });
                return response;
            }

            // Short token not found or already used
            _logger.LogWarning("Invalid or expired short token: {ShortToken}", body.ShortToken);
            var unauthorizedResponse = req.CreateResponse(System.Net.HttpStatusCode.Unauthorized);
            await unauthorizedResponse.WriteStringAsync("Invalid or expired short token.");
            return unauthorizedResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error exchanging short token");
            var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync("An error occurred while processing your request.");
            return errorResponse;
        }
    }

    [Function("GetUsers")]
    public async Task<HttpResponseData> GetUsers(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "auth/GetUsers")] HttpRequestData req)
    {
        var users = await _userService.GetUsers();

        var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
        await response.WriteAsJsonAsync(users);

        return response;

    }
}
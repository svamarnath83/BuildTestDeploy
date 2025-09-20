using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Azure.Functions.Worker.Http;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Auth.DTOs;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

public class JwtValidationMiddleware : IFunctionsWorkerMiddleware
{
    private readonly JwtConfig _jwtConfig;
    private readonly ILogger<JwtValidationMiddleware> _logger;

    public JwtValidationMiddleware(JwtConfig jwtConfig, ILogger<JwtValidationMiddleware> logger)
    {
        _jwtConfig = jwtConfig;
        _logger = logger;
    }

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var functionName = context.FunctionDefinition.Name;

        // List of functions to allow anonymous access
        var anonymousFunctions = new List<string> { "Login", "ExchangeShortToken", "CreateTenantSchema", "MigrateTenantSchema", "MigrateAllDatabases" };

        if (anonymousFunctions.Contains(functionName))
        {
            // Skip authentication for these functions
            await next(context);
            return;
        }

        var req = await context.GetHttpRequestDataAsync();
        if (req != null)
        {
            var path = req.Url.AbsolutePath;
            
            // Check for Authorization header
            if (!req.Headers.TryGetValues("Authorization", out var authValues) || !authValues.Any())
            {
                _logger.LogWarning("No Authorization header found for path: {Path}", path);
                var res = req.CreateResponse(System.Net.HttpStatusCode.Unauthorized);
                await res.WriteStringAsync("Authorization header is required.");
                context.GetInvocationResult().Value = res;
                return;
            }

            var authHeader = authValues.First();
            if (authHeader == null || !authHeader.StartsWith("Bearer "))
            {
                _logger.LogWarning("Invalid Authorization header format for path: {Path}", path);
                var res = req.CreateResponse(System.Net.HttpStatusCode.Unauthorized);
                await res.WriteStringAsync("Invalid Authorization header format. Bearer token required.");
                context.GetInvocationResult().Value = res;
                return;
            }

            var token = authHeader.Substring("Bearer ".Length);
            var jwtService = new JwtService(_jwtConfig);
            var principal = jwtService.ValidateJwt(token);
            if (principal == null)
            {
                _logger.LogWarning("Invalid or expired token for path: {Path}", path);
                var res = req.CreateResponse(System.Net.HttpStatusCode.Unauthorized);
                await res.WriteStringAsync("Invalid or expired token.");
                context.GetInvocationResult().Value = res;
                return;
            }

            // Store the token in context Items for CreateShortToken endpoint
            if (path.Equals("/api/auth/createShortToken", StringComparison.OrdinalIgnoreCase))
            {
                // Create Items collection if it doesn't exist
                if (context.Items == null)
                {
                    context.Items = new System.Collections.Generic.Dictionary<object, object>();
                }
                
                // Store the validated token in the Items collection
                context.Items["validatedToken"] = token;
                _logger.LogInformation("Token stored in context for CreateShortToken endpoint");
                
                // Continue processing without setting tenant context
                await next(context);
                return;
            }

            // For all other endpoints, extract claims and set tenant context
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = jwtService.GetValidationParameters();
            principal = tokenHandler.ValidateToken(token, validationParameters, out _);
            var accountCode = principal.FindFirst("accountCode")?.Value;

            if (!string.IsNullOrEmpty(accountCode))
            {
                var tenantContext = context.InstanceServices.GetRequiredService<ITenantContext>();
                tenantContext.AccountCode = accountCode;

                var schemaAccessor = context.InstanceServices.GetRequiredService<ISchemaAccessor>();
                var schema = await schemaAccessor.GetSchemaForAccountCodeAsync(accountCode) ?? "public";
                tenantContext.Schema = schema;
                
                _logger.LogInformation("Set tenant context for account {AccountCode} with schema {Schema}", 
                    accountCode, schema);
            }
            else
            {
                _logger.LogWarning("Token is valid but does not contain accountCode claim");
            }

            // Populate current user accessor with principal for downstream services
            var currentUserAccessor = context.InstanceServices.GetService<ICurrentUserAccessor>();
            if (currentUserAccessor != null)
            {
                currentUserAccessor.Principal = principal;
            }
        }
        
        await next(context);
    }
}
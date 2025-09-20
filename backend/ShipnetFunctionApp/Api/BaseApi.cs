using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Api.Models;
using System.Net;

namespace ShipnetFunctionApp.Api
{
    /// <summary>
    /// Base abstract class for all API functions
    /// Provides common functionality and DbContext access
    /// </summary>
    public abstract class BaseApi
    {
        protected readonly MultiTenantSnContext? _context;
        protected readonly ILogger? _logger;

        protected BaseApi(MultiTenantSnContext? context, ILogger? logger = null)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Creates a standardized error response
        /// </summary>
        protected async Task<HttpResponseData> CreateErrorResponse(HttpRequestData req, HttpStatusCode statusCode, string message)
        {
            var response = req.CreateResponse(statusCode);
            await response.WriteAsJsonAsync(ApiResponse<object>.ErrorResponse(message));
            return response;
        }

        /// <summary>
        /// Creates a standardized success response with JSON data
        /// </summary>
        protected async Task<HttpResponseData> CreateSuccessResponse<T>(HttpRequestData req, T data)
        {
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(data);
            return response;
        }

        /// <summary>
        /// Creates a standardized success response without data
        /// </summary>
        protected async Task<HttpResponseData> CreateSuccessResponse(HttpRequestData req)
        {
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(ApiResponse<object>.SuccessResponse());
            return response;
        }
    }
}

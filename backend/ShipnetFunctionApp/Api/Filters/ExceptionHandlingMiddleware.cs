using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Threading.Tasks;

namespace ShipnetFunctionApp.Api.Filters
{
    /// <summary>
    /// Middleware for handling exceptions in Azure Functions
    /// </summary>
    public class ExceptionHandlingMiddleware : IFunctionsWorkerMiddleware
    {
        public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                // Get the logger
                var loggerFactory = context.InstanceServices.GetService(typeof(ILoggerFactory)) as ILoggerFactory;
                var logger = loggerFactory?.CreateLogger("FunctionExceptionMiddleware");

                // Log the exception
                var functionName = context.FunctionDefinition.Name;
                logger?.LogError(ex, "Error in {FunctionName}: {Message}", functionName, ex.Message);

                // For migration functions, extract schema parameter if present
                var routeValues = context.BindingContext.BindingData;
                string schemaInfo = "";
                
                if (routeValues.TryGetValue("schema", out var schemaValue))
                {
                    schemaInfo = $" for schema '{schemaValue}'";
                }

                // Get the HTTP request data and create an error response
                var httpReqData = await context.GetHttpRequestDataAsync();
                if (httpReqData != null)
                {
                    var response = httpReqData.CreateResponse(HttpStatusCode.InternalServerError);
                    await response.WriteStringAsync($"Error in {functionName}{schemaInfo}: {ex.Message}");
                    
                    context.GetInvocationResult().Value = response;
                }
            }
        }
    }
}

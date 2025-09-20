using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Azure.Functions.Worker;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Extensions.DependencyInjection;
using ShipnetFunctionApp.Auth.Services;

public class TenantSchemaMiddleware : IFunctionsWorkerMiddleware
{
    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var httpReqData = await context.GetHttpRequestDataAsync();
        var services = context.InstanceServices;

        // Get account code from header or query
        string accountCode = null;

        // Try header first
        if (httpReqData != null && httpReqData.Headers.Contains("X-Account-Code"))
        {
            accountCode = httpReqData.Headers.GetValues("X-Account-Code").FirstOrDefault();
        }

        // Fallback to query string
        if (string.IsNullOrEmpty(accountCode) && httpReqData?.Url != null)
        {
            accountCode = HttpUtility.ParseQueryString(httpReqData.Url.Query)["accountCode"];
        }

        // Optionally: fallback to a default or log a warning if still null

        var tenantContext = services.GetRequiredService<ITenantContext>();
        tenantContext.AccountCode = accountCode;

        // Get schema from subscriptions table
        var schemaAccessor = services.GetRequiredService<ISchemaAccessor>();
        string schema = "public";
        if (!string.IsNullOrEmpty(accountCode))
        {
            schema = await schemaAccessor.GetSchemaForAccountCodeAsync(accountCode) ?? "public";
        }
        tenantContext.Schema = schema;

        await next(context);
    }
}

using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using ShipnetFunctionApp.Services;

namespace ShipnetFunctionApp.Api
{
    public class AuditLogFunction : BaseApi
    {
        private readonly AuditLogQueryService _service;

        public AuditLogFunction(AuditLogQueryService service) : base(null)
        {
            _service = service;
        }

        // GET /api/auditlogs/{moduleId}/{recordId}
        [Function("GetAuditLogByRecord")]
        public async Task<HttpResponseData> GetAuditLogByRecord(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "auditlogs/GetAuditLogByRecord/{moduleId:int}/{recordId:long}")] HttpRequestData req,
            int moduleId,
            long recordId)
        {
            if (moduleId <= 0 || recordId <= 0)
                return await CreateErrorResponse(req, HttpStatusCode.BadRequest, "moduleId and recordId must be positive.");

            var logs = await _service.GetByModuleAndRecordAsync(moduleId, recordId);
            return await CreateSuccessResponse(req, logs);
        }
    }
}

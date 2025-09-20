using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using ShipnetFunctionApp.Registers.DTOs;
using ShipnetFunctionApp.Registers.Services;

namespace ShipnetFunctionApp.Api.Operations
{
    public class ActivityLogFunction : BaseApi
    {
        private readonly ActivityLogService _service;

        public ActivityLogFunction(ActivityLogService service) : base(null)
        {
            _service = service;
        }

        [Function("GetActivityLogById")]
        public async Task<HttpResponseData> GetById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "activitylogs/GetById/{id:long}")] HttpRequestData req,
            long id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"ActivityLog with ID {id} not found.");
            }
            return await CreateSuccessResponse(req, result);
        }

        [Function("GetByRecord")]
        public async Task<HttpResponseData> GetByRecord(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "activitylogs/GetByRecord/{moduleId:int}/{recordId:long}")] HttpRequestData req,
            int moduleId, long recordId)
        {
            var result = await _service.GetByRecordAsync(moduleId, recordId);
            return await CreateSuccessResponse(req, result);
        }

        [Function("AddOrUpdate")]
        public async Task<HttpResponseData> AddOrUpdate(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "activitylogs/AddOrUpdate")] HttpRequestData req)
        {
            var dto = await req.ReadFromJsonAsync<ActivityLogDto>();
            if (dto == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid activity log data.");
            }

            var saved = await _service.AddOrUpdateAsync(dto);
            return await CreateSuccessResponse(req, saved);
        }

        [Function("DeleteActivityLog")]
        public async Task<HttpResponseData> Delete(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "activitylogs/Delete/{id:long}")] HttpRequestData req,
            long id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"ActivityLog with ID {id} not found.");
            }
            return await CreateSuccessResponse(req);
        }
    }
}

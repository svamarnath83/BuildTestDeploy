using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using ShipnetFunctionApp.Chartering.DTOs;
using ShipnetFunctionApp.Chartering.Services;
using ShipnetFunctionApp.Operations.Services;
using ShipnetFunctionApp.Thirdparty.Services;

namespace ShipnetFunctionApp.Api.Chartering
{
    public class EstimateFunction : BaseApi
    {
        private readonly EstimateService _estimateService;
        private readonly VoyageManagerService _voyageManagerService;


        public EstimateFunction(
            EstimateService estimateService,
            VoyageManagerService voyageManagerService)
            : base(null)
        {
            _estimateService = estimateService;
            _voyageManagerService = voyageManagerService;
        }

        [Function("GetEstimates")]
        public async Task<HttpResponseData> GetEstimates(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "estimates/GetEstimates")] HttpRequestData req)
        {
            var estimates = await _estimateService.GetEstimatesAsync();
            return await CreateSuccessResponse(req, estimates);
        }
 
        [Function("GetEstimateById")]
        public async Task<HttpResponseData> GetEstimateById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "estimates/GetEstimateById/{id:long}")] HttpRequestData req, long id)
        {
            var estimate = await _estimateService.GetEstimateByIdAsync(id);
            if (estimate == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Estimate with ID {id} not found.");
            }
            return await CreateSuccessResponse(req, estimate);
        }

        [Function("AddOrUpdateEstimate")]
        public async Task<HttpResponseData> AddOrUpdateEstimate(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "estimates/AddOrUpdateEstimate")] HttpRequestData req)
        {
            var dto = await req.ReadFromJsonAsync<EstimateDto>();
            if (dto == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid estimate data.");
            }
            var saved = await _estimateService.AddOrUpdateEstimateAsync(dto);
            return await CreateSuccessResponse(req, saved);
        }

        [Function("DeleteEstimate")]
        public async Task<HttpResponseData> DeleteEstimate(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "estimates/DeleteEstimate/{id:long}")] HttpRequestData req, long id)
        {
            var deleted = await _estimateService.DeleteEstimateAsync(id);
            if (!deleted)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Estimate with ID {id} not found.");
            }
            return await CreateSuccessResponse(req);
        }
        [Function("GenerateVoyage")]
        public async Task<HttpResponseData> GenerateVoyage(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "estimates/GenerateVoyage/{id:long}")] HttpRequestData req, long id)
        {
            await _voyageManagerService.GenerateVoyage(id);
            
            return await CreateSuccessResponse(req);
        }
    }

}
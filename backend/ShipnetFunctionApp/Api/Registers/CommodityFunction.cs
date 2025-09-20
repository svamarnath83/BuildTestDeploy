using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using ShipnetFunctionApp.Registers.DTOs;
using ShipnetFunctionApp.Registers.Services;

namespace ShipnetFunctionApp.Api.Registers
{
    public class CommodityFunction : BaseApi
    {
        private readonly CommodityService _commodityService;

        public CommodityFunction(
            CommodityService commodityService)
            : base(null)
        {
            _commodityService = commodityService;
        }

        // GET: /api/commodities/GetCommodities
        [Function("GetCommodities")]
        public async Task<HttpResponseData> GetCommodities(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "commodities/GetCommodities")] HttpRequestData req)
        {
            var commodities = await _commodityService.GetCommoditiesAsync();
            return await CreateSuccessResponse(req, commodities);
        }

        // GET: /api/commodities/GetCommodityById/{id}
        [Function("GetCommodityById")]
        public async Task<HttpResponseData> GetCommodityById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "commodities/GetCommodityById/{id:int}")] HttpRequestData req,
            int id)
        {
            var commodity = await _commodityService.GetCommodityByIdAsync(id);

            if (commodity == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Commodity with ID {id} not found.");
            }

            return await CreateSuccessResponse(req, commodity);
        }
    }
}
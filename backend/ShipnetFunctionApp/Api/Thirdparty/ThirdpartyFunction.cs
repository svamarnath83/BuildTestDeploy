using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using ShipnetFunctionApp.Thirdparty.Services;

namespace ShipnetFunctionApp.Api.Operations
{
    public class ThirdpartyFunction : BaseApi
    {
        private readonly TideformBunkerPriceService _bunkerPriceService;

        public ThirdpartyFunction(
            TideformBunkerPriceService bunkerPriceService)
            : base(null)
        {
            _bunkerPriceService = bunkerPriceService;
        }

        [Function("GetLastestBunkerPrice")]
        public async Task<HttpResponseData> GetLastestBunkerPrice(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "thirdparty/GetLastestBunkerPrice")] HttpRequestData req)
        {
            var result = await _bunkerPriceService.GetLastestBunkerPriceAsync();

            return await CreateSuccessResponse(req, result);
        }

        [Function("GetAvgBunkerPrice")]
        public async Task<HttpResponseData> GetAvgBunkerPrice(
           [HttpTrigger(AuthorizationLevel.Function, "get", Route = "thirdparty/GetAvgBunkerPrice")] HttpRequestData req)
        {
            var result = await _bunkerPriceService.GetAvgBunkerPriceAsync();

            return await CreateSuccessResponse(req, result);
        }

    }

}
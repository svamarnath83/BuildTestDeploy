using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using ShipnetFunctionApp.Registers.Services;

namespace ShipnetFunctionApp.Api.Registers
{
    public class CurrencyTypeFunction : BaseApi
    {
        private readonly CurrencyTypeService _currencyTypeService;

        public CurrencyTypeFunction(
            CurrencyTypeService currencyTypeService)
            : base(null)
        {
            _currencyTypeService = currencyTypeService;
        }

        [Function("GetCurrencyTypes")]
        public async Task<HttpResponseData> GetCurrencyTypes(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "currencies/GetCurrencyTypes")] HttpRequestData req)
        {
            var currencies = await _currencyTypeService.GetCurrencyTypesAsync();
            return await CreateSuccessResponse(req, currencies);
        }

        [Function("GetCurrencyTypeById")]
        public async Task<HttpResponseData> GetCurrencyTypeById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "currencies/GetCurrencyTypeById/{id:int}")] HttpRequestData req,
            int id)
        {
            var currency = await _currencyTypeService.GetCurrencyTypeByIdAsync(id);

            if (currency == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Currency Type with ID {id} not found.");
            }

            return await CreateSuccessResponse(req, currency);
        }
    }
}
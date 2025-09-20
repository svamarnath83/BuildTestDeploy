using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using ShipnetFunctionApp.Registers.Services;

namespace ShipnetFunctionApp.Api.Registers
{
    public class UnitOfMeasureFunction : BaseApi
    {
        private readonly UnitOfMeasureService _unitOfMeasureService;

        public UnitOfMeasureFunction(
            UnitOfMeasureService unitOfMeasureService)
            : base(null)
        {
            _unitOfMeasureService = unitOfMeasureService;
        }

        [Function("GetUnitsOfMeasure")]
        public async Task<HttpResponseData> GetUnitsOfMeasure(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "units/GetUnitsOfMeasure")] HttpRequestData req)
        {
            var units = await _unitOfMeasureService.GetUnitsOfMeasureAsync();
            return await CreateSuccessResponse(req, units);
        }

        [Function("GetUnitOfMeasureById")]
        public async Task<HttpResponseData> GetUnitOfMeasureById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "units/GetUnitOfMeasureById/{id:int}")] HttpRequestData req,
            int id)
        {
            var unit = await _unitOfMeasureService.GetUnitOfMeasureByIdAsync(id);

            if (unit == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Unit of Measure with ID {id} not found.");
            }

            return await CreateSuccessResponse(req, unit);
        }
    }
}
using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using ShipnetFunctionApp.Registers.DTOs;
using ShipnetFunctionApp.Registers.Services;

namespace ShipnetFunctionApp.Api.Registers
{
    public class VesselTypeFunction : BaseApi
    {
        private readonly VesselTypeService _vesselTypeService;

        public VesselTypeFunction(
            VesselTypeService vesselTypeService)
            : base(null)
        {
            _vesselTypeService = vesselTypeService;
        }

        [Function("GetVesselTypes")]
        public async Task<HttpResponseData> GetVesselTypes(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "vesseltypes/GetVesselTypes")] HttpRequestData req)
        {
            var vesselTypes = await _vesselTypeService.GetVesselTypesAsync();
            return await CreateSuccessResponse(req, vesselTypes);
        }

        [Function("GetVesselTypeById")]
        public async Task<HttpResponseData> GetVesselTypeById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "vesseltypes/GetVesselTypeById/{id:long}")] HttpRequestData req,
            long id)
        {
            var vesselType = await _vesselTypeService.GetVesselTypeByIdAsync(id);

            if (vesselType == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Vessel type with ID {id} not found.");
            }

            return await CreateSuccessResponse(req, vesselType);
        }

        [Function("AddOrUpdateVesselType")]
        public async Task<HttpResponseData> AddOrUpdateVesselType(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "vesseltypes/AddOrUpdateVesselType")] HttpRequestData req)
        {
            var vesselTypeDto = await req.ReadFromJsonAsync<VesselTypeDto>();
            if (vesselTypeDto == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid vessel type data.");
            }

            var savedVesselType = await _vesselTypeService.AddOrUpdateVesselTypeAsync(vesselTypeDto);

            return await CreateSuccessResponse(req, savedVesselType);
        }

        [Function("GetVesselCategory")]
        public async Task<HttpResponseData> GetVesselCategory(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "vesseltypes/GetVesselCategory")] HttpRequestData req)
        {
            var vesselCategories = await _vesselTypeService.GetVesselCategoryAsync();
            return await CreateSuccessResponse(req, vesselCategories);
        }

        [Function("DeleteVesselType")]
        public async Task<HttpResponseData> DeleteVesselType(
           [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "vesseltypes/DeleteVesselType/{id:long}")] HttpRequestData req,
           long id)
        {
            var result = await _vesselTypeService.DeleteVesselTypeAsync(id);

            if (!result)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Vessel type with ID {id} not found.");
            }

            return await CreateSuccessResponse(req, new { deleted = true, id });
        }
    }
}
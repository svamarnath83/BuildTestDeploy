using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using ShipnetFunctionApp.Registers.DTOs;
using ShipnetFunctionApp.Registers.Services;

namespace ShipnetFunctionApp.Api.Registers
{
    public class VesselFunction : BaseApi
    {
        private readonly VesselService _vesselService;

        public VesselFunction(
            VesselService vesselService)
            : base(null)
        {
            _vesselService = vesselService;
        }

        [Function("GetVessels")]
        public async Task<HttpResponseData> GetVessels(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "vessels/GetVessels")] HttpRequestData req)
        {
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            bool includeBunker = false;
            if (bool.TryParse(query["includeBunker"], out var parsed))
                includeBunker = parsed;

            var vessels = await _vesselService.GetVesselsAsync(includeBunker);
            return await CreateSuccessResponse(req, vessels);
        }

        [Function("GetVesselById")]
        public async Task<HttpResponseData> GetVesselById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "vessels/GetVesselById/{id:long}")] HttpRequestData req,
            long id)
        {
            var vessel = await _vesselService.GetVesselByIdAsync(id);

            if (vessel == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Vessel with ID {id} not found.");
            }

            return await CreateSuccessResponse(req, vessel);
        }

        [Function("AddOrUpdateVessel")]
        public async Task<HttpResponseData> AddOrUpdateVessel(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "vessels/AddOrUpdateVessel")] HttpRequestData req)
        {
            var vesselDto = await req.ReadFromJsonAsync<VesselDto>();
            if (vesselDto == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid vessel data.");
            }

            var savedVessel = await _vesselService.AddOrUpdateVesselAsync(vesselDto);

            return await CreateSuccessResponse(req, savedVessel);
        }

        [Function("DeleteVessel")]
        public async Task<HttpResponseData> DeleteVessel(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "vessels/DeleteVessel/{id:long}")] HttpRequestData req,
            long id)
        {
            var deleted = await _vesselService.DeleteVesselAsync(id);

            if (!deleted)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Vessel with ID {id} not found.");
            }

            return await CreateSuccessResponse(req);
        }

        [Function("ValidateVesselCode")]
        public async Task<HttpResponseData> ValidateVesselCode(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "vessels/ValidateVesselCode")] HttpRequestData req)
        {
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            var code = query["code"];
            long? excludeId = null;
            if (long.TryParse(query["excludeId"], out var id))
                excludeId = id;

            var exists = await _vesselService.VesselCodeExistsAsync(code, excludeId);

            return await CreateSuccessResponse(req, new { exists });
        }
    }
}
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using ShipnetFunctionApp.Operations.Services;
using ShipnetFunctionApp.Registers.Services;
using ShipnetFunctionApp.VoyageManager.DTOs;

namespace ShipnetFunctionApp.Api.Operation
{
    public class VoyageFunction : BaseApi
    {
        private readonly VesselService _vesselService;
        private readonly VoyageManagerService _voyageService;
        public VoyageFunction(VesselService vesselService, VoyageManagerService voyageManagerService) : base(null)
        {
            _vesselService = vesselService;
            _voyageService = voyageManagerService;
        }

        // GET: /api/voyages/GetVoyages
        [Function("GetVoyages")]
        public async Task<HttpResponseData> GetVoyages(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "voyage/GetVoyages")] HttpRequestData req)
        {
            // Placeholder response - return empty array until DB is implemented
            var placeholderVoyages = new List<VoyageDto>();

            return await CreateSuccessResponse(req, placeholderVoyages);
        }

        // GET: /api/voyages/GetVoyageById/{id}
        [Function("GetVoyageById")]
        public async Task<HttpResponseData> GetVoyageById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "voyages/GetVoyageById/{id:long}")] HttpRequestData req,
            long id)
        {
            // Placeholder response - return null until DB is implemented
            VoyageDto? voyage = await _voyageService.GetVoyageByIdAsync(id);

            if (voyage == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Voyage with ID {id} not found.");
            }

            return await CreateSuccessResponse(req, voyage);
        }

        // PUT: /api/voyages/UpdateVoyage/{id}
        [Function("SaveVoyage")]
        public async Task<HttpResponseData> SaveVoyage(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "voyage/UpdateVoyage/{id:long}")] HttpRequestData req,
            long id)
        {
            try
            {
                var requestBody = await req.ReadFromJsonAsync<VoyageDto>();

                // Placeholder response - return updated voyage until DB is implemented
                requestBody.id = id;
                requestBody.updatedAt = DateTime.UtcNow;

                return await CreateSuccessResponse(req, requestBody);
            }
            catch (Exception ex)
            {
                return await CreateErrorResponse(req, HttpStatusCode.BadRequest, $"Error updating voyage: {ex.Message}");
            }
        }

        // DELETE: /api/voyages/DeleteVoyage/{id}
        [Function("DeleteVoyage")]
        public async Task<HttpResponseData> DeleteVoyage(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "voyage/DeleteVoyage/{id:long}")] HttpRequestData req,
            long id)
        {
            try
            {
                // Placeholder response - return success until DB is implemented
                var result = new { Success = true, Message = $"Voyage {id} deleted successfully" };

                return await CreateSuccessResponse(req, result);
            }
            catch (Exception ex)
            {
                return await CreateErrorResponse(req, HttpStatusCode.BadRequest, $"Error deleting voyage: {ex.Message}");
            }
        }

        [Function("VesselPositions")]
        public async Task<HttpResponseData> VesselPositions(
           [HttpTrigger(AuthorizationLevel.Function, "get", Route = "voyages/VesselPositions")] HttpRequestData req)
        {
            var res = await _vesselService.GetVesselPosition();
            return await CreateSuccessResponse(req, res);
        }


        [Function("VesselOverview")]
        public async Task<HttpResponseData> VesselOverview(
           [HttpTrigger(AuthorizationLevel.Function, "get", Route = "voyages/VesselOverview/{id:long}")] HttpRequestData req, long id)
        {
            var res = await _voyageService.GetVesselOverviewAsync(id);
            return await CreateSuccessResponse(req, res);
        }
    }
}
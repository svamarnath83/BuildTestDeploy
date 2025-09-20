using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using ShipnetFunctionApp.Registers.DTOs;
using ShipnetFunctionApp.Registers.Services;

namespace ShipnetFunctionApp.Api.Registers
{
    public class VesselGradeFunction : BaseApi
    {
        private readonly VesselGradeService _vesselGradeService;

        public VesselGradeFunction(
            VesselGradeService vesselGradeService)
            : base(null)
        {
            _vesselGradeService = vesselGradeService;
        }

        [Function("GetVesselGrades")]
        public async Task<HttpResponseData> GetVesselGrades(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "vesselgrades/GetVesselGrades")] HttpRequestData req)
        {
            var vesselGrades = await _vesselGradeService.GetVesselGradesAsync();
            return await CreateSuccessResponse(req, vesselGrades);
        }

        [Function("GetVesselGradeById")]
        public async Task<HttpResponseData> GetVesselGradeById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "vesselgrades/GetVesselGradeById/{id:long}")] HttpRequestData req,
            long id)
        {
            var vesselGrade = await _vesselGradeService.GetVesselGradeByIdAsync(id);

            if (vesselGrade == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Vessel grade with ID {id} not found.");
            }

            return await CreateSuccessResponse(req, vesselGrade);
        }
    }
}
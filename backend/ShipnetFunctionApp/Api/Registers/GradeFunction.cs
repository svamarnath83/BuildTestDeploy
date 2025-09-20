using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using ShipnetFunctionApp.Registers.DTOs;
using ShipnetFunctionApp.Registers.Services;

namespace ShipnetFunctionApp.Api.Registers
{
    public class GradeFunction : BaseApi
    {
        private readonly GradeService _gradeService;

        public GradeFunction(GradeService gradeService)
            : base(null)
        {
            _gradeService = gradeService;
        }

        [Function("GetGrades")]
        public async Task<HttpResponseData> GetGrades(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "grades/GetGrades")] HttpRequestData req)
        {
            var grades = await _gradeService.GetGradesAsync();
            return await CreateSuccessResponse(req, grades);
        }

        [Function("GetGradeById")]
        public async Task<HttpResponseData> GetGradeById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "grades/GetGradeById/{id:long}")] HttpRequestData req, long id)
        {
            var grade = await _gradeService.GetGradeByIdAsync(id);
            if (grade == null)
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Grade with ID {id} not found.");
            return await CreateSuccessResponse(req, grade);
        }

        [Function("AddOrUpdateGrade")]
        public async Task<HttpResponseData> AddOrUpdateGrade(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "grades/AddOrUpdateGrade")] HttpRequestData req)
        {
            var dto = await req.ReadFromJsonAsync<GradeDto>();
            if (dto == null)
                return await CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid grade data.");
            var saved = await _gradeService.AddOrUpdateGradeAsync(dto);
            return await CreateSuccessResponse(req, saved);
        }

        [Function("DeleteGrade")]
        public async Task<HttpResponseData> DeleteGrade(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "grades/DeleteGrade/{id:long}")] HttpRequestData req, long id)
        {
            var deleted = await _gradeService.DeleteGradeAsync(id);
            if (!deleted)
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Grade with ID {id} not found.");
            return await CreateSuccessResponse(req);
        }
    }
}
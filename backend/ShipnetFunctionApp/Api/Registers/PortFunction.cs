using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Registers.DTOs;
using ShipnetFunctionApp.Registers.Services;
using ShipnetFunctionApp.Data;

namespace ShipnetFunctionApp.Api
{
    public class PortFunction : BaseApi
    {
        private readonly PortService _portService;
        private readonly DistanceService _distanceService;


        public PortFunction( ILogger<PortFunction> logger, PortService portService, DistanceService distanceService)
            : base(null, logger)
        {
            _distanceService = distanceService ?? throw new ArgumentNullException(nameof(distanceService));
            _portService = portService ?? throw new ArgumentNullException(nameof(portService));
        }

        [Function("GetPorts")]
        public async Task<HttpResponseData> GetPorts(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "ports/GetPorts")] HttpRequestData req)
        {
            var ports = await _portService.GetPortsAsync();

            return await CreateSuccessResponse(req, ports);
        }

        [Function("AddOrUpdatePort")]
        public async Task<HttpResponseData> AddOrUpdatePort(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "ports/AddOrUpdatePort")] HttpRequestData req)
        {
            var portDto = await req.ReadFromJsonAsync<PortDto>();
            if (portDto == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid port data.");
            }

            var savedPort = await _portService.AddOrUpdatePortAsync(portDto);

            return await CreateSuccessResponse(req, savedPort);
        }

        [Function("GetPortById")]
        public async Task<HttpResponseData> GetPortById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "ports/GetPortById/{id:int}")] HttpRequestData req,
            int id)
        {
            var port = await _portService.GetPortByIdAsync(id);

            if (port == null)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Port with ID {id} not found.");
            }

            return await CreateSuccessResponse(req, port);

        }

        [Function("DeletePort")]
        public async Task<HttpResponseData> DeletePort(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "ports/DeletePort/{id:int}")] HttpRequestData req,
            int id)
        {
            var deleted = await _portService.DeletePortAsync(id);

            if (!deleted)
            {
                return await CreateErrorResponse(req, HttpStatusCode.NotFound, $"Port with ID {id} not found.");
            }

            return await CreateSuccessResponse(req);
        }
        
           [Function("getPortDistance")]
        public async Task<HttpResponseData> GetPortDistance(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "ports/getPortDistance")] HttpRequestData req)
        {
            // Expecting a JSON array of port names in the request body
            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var ports = System.Text.Json.JsonSerializer.Deserialize<List<DistanceRequest>>(requestBody);
            if (ports == null || ports.Count < 2)
            {
                var badResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                await badResponse.WriteStringAsync("At least two ports are required.");
                return badResponse;
            }

            var distances = await _distanceService.GetDistance(ports);
            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
            await response.WriteAsJsonAsync(distances);
            return response;
        }

        [Function("GetCountries")]
        public async Task<HttpResponseData> GetCountries(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "ports/GetCountries")] HttpRequestData req)
        {
            var countries = await _portService.GetCountryAsync();

            return await CreateSuccessResponse(req, countries);
        }
    }
}
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Api.Models;
using ShipnetFunctionApp.Registers.Services;
using ShipnetFunctionApp.Services.Registers.DTOs;
using System.Net;
using System.Text.Json;

namespace ShipnetFunctionApp.Api.Registers
{
    public class AccountGroupFunction
    {
        private readonly ILogger<AccountGroupFunction> _logger;
        private readonly AccountGroupService _accountGroupService;

        public AccountGroupFunction(
            ILogger<AccountGroupFunction> logger,
            AccountGroupService accountGroupService)
        {
            _logger = logger;
            _accountGroupService = accountGroupService;
        }

        [Function("GetAccountGroups")]
        public async Task<HttpResponseData> GetAccountGroups(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "account-groups")] HttpRequestData req)
        {
            _logger.LogInformation("GetAccountGroups called");
            try
            {
                _logger.LogInformation("Calling AccountGroupService.GetAllAsync()");
                var accountGroups = await _accountGroupService.GetAllAsync();
                _logger.LogInformation("Retrieved {Count} account groups", accountGroups?.Count ?? 0);
                
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new ApiResponse<List<AccountGroupDto>>
                {
                    Success = true,
                    Data = accountGroups,
                    Message = "Account groups retrieved successfully"
                });
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving account groups: {Message}", ex.Message);
                _logger.LogError(ex, "Stack trace: {StackTrace}", ex.StackTrace);
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Internal server error: {ex.Message}"
                });
                return response;
            }
        }

        [Function("GetAccountGroup")]
        public async Task<HttpResponseData> GetAccountGroup(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "account-groups/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                var accountGroup = await _accountGroupService.GetByIdAsync(id);
                if (accountGroup == null)
                {
                    var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                    await notFoundResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Account group not found"
                    });
                    return notFoundResponse;
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new ApiResponse<AccountGroupDto>
                {
                    Success = true,
                    Data = accountGroup,
                    Message = "Account group retrieved successfully"
                });
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving account group with ID {Id}", id);
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
                return response;
            }
        }

        [Function("CreateAccountGroup")]
        public async Task<HttpResponseData> CreateAccountGroup(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "account-groups")] HttpRequestData req)
        {
            try
            {
                var requestBody = await req.ReadAsStringAsync();
                if (string.IsNullOrEmpty(requestBody))
                {
                    var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Request body is empty"
                    });
                    return badRequestResponse;
                }

                var createDto = JsonSerializer.Deserialize<AccountGroupDto>(requestBody, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (createDto == null)
                {
                    var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invalid request data"
                    });
                    return badRequestResponse;
                }

                var accountGroup = await _accountGroupService.CreateAsync(createDto);
                var response = req.CreateResponse(HttpStatusCode.Created);
                await response.WriteAsJsonAsync(new ApiResponse<AccountGroupDto>
                {
                    Success = true,
                    Data = accountGroup,
                    Message = "Account group created successfully"
                });
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating account group");
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
                return response;
            }
        }

        [Function("UpdateAccountGroup")]
        public async Task<HttpResponseData> UpdateAccountGroup(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "account-groups/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                var requestBody = await req.ReadAsStringAsync();
                if (string.IsNullOrEmpty(requestBody))
                {
                    var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Request body is empty"
                    });
                    return badRequestResponse;
                }

                var updateDto = JsonSerializer.Deserialize<AccountGroupDto>(requestBody, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (updateDto == null)
                {
                    var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invalid request data"
                    });
                    return badRequestResponse;
                }

                var accountGroup = await _accountGroupService.UpdateAsync(id, updateDto);
                if (accountGroup == null)
                {
                    var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                    await notFoundResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Account group not found"
                    });
                    return notFoundResponse;
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new ApiResponse<AccountGroupDto>
                {
                    Success = true,
                    Data = accountGroup,
                    Message = "Account group updated successfully"
                });
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating account group with ID {Id}", id);
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
                return response;
            }
        }

        [Function("DeleteAccountGroup")]
        public async Task<HttpResponseData> DeleteAccountGroup(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "account-groups/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                var deleted = await _accountGroupService.DeleteAsync(id);
                if (!deleted)
                {
                    var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                    await notFoundResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Account group not found"
                    });
                    return notFoundResponse;
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Account group deleted successfully"
                });
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting account group with ID {Id}", id);
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
                return response;
            }
        }
    }
}
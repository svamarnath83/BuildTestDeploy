using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Api.Models;
using ShipnetFunctionApp.Registers.Services;
using ShipnetFunctionApp.Services.Registers.DTOs;
using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace ShipnetFunctionApp.Api.Registers
{
    public class AccountFunction
    {
        private readonly ILogger<AccountFunction> _logger;
        private readonly AccountService _accountService;

        public AccountFunction(
            ILogger<AccountFunction> logger,
            AccountService accountService)
        {
            _logger = logger;
            _accountService = accountService;
        }

        [Function("GetAccounts")]
        public async Task<HttpResponseData> GetAccounts(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "accounts")] HttpRequestData req)
        {
            try
            {
                var accounts = await _accountService.GetAllAsync();
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new ApiResponse<List<AccountDto>>
                {
                    Success = true,
                    Data = accounts,
                    Message = "Accounts retrieved successfully"
                });
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving accounts");
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
                return response;
            }
        }

        [Function("GetAccount")]
        public async Task<HttpResponseData> GetAccount(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "accounts/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                var account = await _accountService.GetByIdAsync(id);
                if (account == null)
                {
                    var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                    await notFoundResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Account not found"
                    });
                    return notFoundResponse;
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new ApiResponse<AccountDto>
                {
                    Success = true,
                    Data = account,
                    Message = "Account retrieved successfully"
                });
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving account with ID {Id}", id);
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
                return response;
            }
        }

        [Function("CreateAccount")]
        public async Task<HttpResponseData> CreateAccount(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "accounts")] HttpRequestData req)
        {
            try
            {
                var body = await new StreamReader(req.Body).ReadToEndAsync();
                _logger.LogInformation("📄 Raw JSON received: {RawJson}", body);
                
                if (string.IsNullOrWhiteSpace(body))
                {
                    _logger.LogWarning("⚠️ Empty request body received");
                    var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Request body cannot be empty"
                    });
                    return badRequestResponse;
                }

                var jsonOptions = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    AllowTrailingCommas = true,
                    ReadCommentHandling = JsonCommentHandling.Skip
                };

                AccountDto? accountDto;
                try
                {
                    accountDto = JsonSerializer.Deserialize<AccountDto>(body, jsonOptions);
                }
                catch (JsonException jsonEx)
                {
                    _logger.LogError("❌ JSON deserialization failed: {Error}", jsonEx.Message);
                    var jsonErrorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await jsonErrorResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = $"Invalid JSON format: {jsonEx.Message}"
                    });
                    return jsonErrorResponse;
                }

                if (accountDto == null)
                {
                    _logger.LogWarning("⚠️ Deserialized accountDto is null");
                    var nullResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await nullResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invalid account data provided"
                    });
                    return nullResponse;
                }

                _logger.LogInformation("🚀 Starting account creation for account number: {AccountNumber}", accountDto.AccountNumber);
                _logger.LogInformation("📋 Account data: AccountName={AccountName}, Type={Type}, LedgerType={LedgerType}, Currency={Currency}, Status={Status}", 
                    accountDto.AccountName, accountDto.Type, accountDto.LedgerType, accountDto.Currency, accountDto.Status);
                _logger.LogInformation("🔍 AccountGroupId={AccountGroupId}, ExternalAccountNumber={ExternalAccountNumber}, Dimension={Dimension}, CurrencyCode={CurrencyCode}", 
                    accountDto.AccountGroupId, accountDto.ExternalAccountNumber, accountDto.Dimension, accountDto.CurrencyCode);

                // Validate required fields
                if (string.IsNullOrWhiteSpace(accountDto.AccountNumber))
                {
                    _logger.LogWarning("⚠️ Account number is required but not provided");
                    var validationResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await validationResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Account number is required"
                    });
                    return validationResponse;
                }

                if (string.IsNullOrWhiteSpace(accountDto.AccountName))
                {
                    _logger.LogWarning("⚠️ Account name is required but not provided");
                    var validationResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await validationResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Account name is required"
                    });
                    return validationResponse;
                }

                // Check if account number already exists BEFORE attempting to create
                var existingAccount = await _accountService.AccountNumberExistsAsync(accountDto.AccountNumber);
                _logger.LogInformation("🔍 Account number {AccountNumber} exists check: {Exists}", accountDto.AccountNumber, existingAccount);
                
                if (existingAccount)
                {
                    _logger.LogWarning("🚫 Account number {AccountNumber} already exists. Returning conflict.", accountDto.AccountNumber);
                    var conflictResponse = req.CreateResponse(HttpStatusCode.Conflict);
                    await conflictResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = $"Account number '{accountDto.AccountNumber}' already exists."
                    });
                    return conflictResponse;
                }

                var createdAccount = await _accountService.CreateAsync(accountDto);

                _logger.LogInformation("✅ Account created successfully with ID: {AccountId}", createdAccount.Id);

                var response = req.CreateResponse(HttpStatusCode.Created);
                await response.WriteAsJsonAsync(new ApiResponse<AccountDto>
                {
                    Success = true,
                    Data = createdAccount,
                    Message = "Account created successfully"
                });
                return response;
            }
            catch (InvalidOperationException invalidOpEx)
            {
                _logger.LogWarning("🚫 Business rule violation: {Message}", invalidOpEx.Message);
                var conflictResponse = req.CreateResponse(HttpStatusCode.Conflict);
                await conflictResponse.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = invalidOpEx.Message
                });
                return conflictResponse;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError("🔄 DbUpdateException caught: {Message}", dbEx.Message);
                _logger.LogError("🔄 DbUpdateException InnerException: {InnerMessage}", dbEx.InnerException?.Message);
                
                // Check if this is a PostgreSQL exception
                if (dbEx.InnerException is PostgresException pgEx)
                {
                    _logger.LogError("🔍 PostgresException details - SqlState: {SqlState}, Message: {Message}, Detail: {Detail}, ConstraintName: {ConstraintName}", 
                        pgEx.SqlState, pgEx.Message, pgEx.Detail, pgEx.ConstraintName);
                    
                    // PostgreSQL unique constraint violation code is 23505
                    if (pgEx.SqlState == "23505")
                    {
                        _logger.LogWarning("🔥 Confirmed duplicate key constraint violation - constraint: {ConstraintName}", pgEx.ConstraintName);
                        
                        var conflictResponse = req.CreateResponse(HttpStatusCode.Conflict);
                        await conflictResponse.WriteAsJsonAsync(new ApiResponse<object>
                        {
                            Success = false,
                            Message = $"Duplicate key constraint violation: {pgEx.ConstraintName ?? "unique constraint"}. {pgEx.Message}"
                        });
                        return conflictResponse;
                    }
                    else
                    {
                        // Return the actual PostgreSQL error details for other database errors
                        _logger.LogError("🔍 Other PostgreSQL error - SqlState: {SqlState}", pgEx.SqlState);
                        var errorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                        await errorResponse.WriteAsJsonAsync(new ApiResponse<object>
                        {
                            Success = false,
                            Message = $"Database error (Code: {pgEx.SqlState}): {pgEx.Message}"
                        });
                        return errorResponse;
                    }
                }
                
                _logger.LogError(dbEx, "❌ Database update error occurred during account creation");
                var finalResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await finalResponse.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Database error: {dbEx.InnerException?.Message ?? dbEx.Message}"
                });
                return finalResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Unexpected error during account creation");
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
                return response;
            }
        }

        [Function("UpdateAccount")]
        public async Task<HttpResponseData> UpdateAccount(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "accounts/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                var body = await new StreamReader(req.Body).ReadToEndAsync();
                var accountDto = JsonSerializer.Deserialize<AccountDto>(body, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                var updatedAccount = await _accountService.UpdateAsync(id, accountDto);
                if (updatedAccount == null)
                {
                    var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                    await notFoundResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Account not found"
                    });
                    return notFoundResponse;
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new ApiResponse<AccountDto>
                {
                    Success = true,
                    Data = updatedAccount,
                    Message = "Account updated successfully"
                });
                return response;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError("🔄 DbUpdateException caught during update: {Message}", dbEx.Message);
                _logger.LogError("🔄 DbUpdateException InnerException: {InnerMessage}", dbEx.InnerException?.Message);
                
                // Check if this is a PostgreSQL exception
                if (dbEx.InnerException is PostgresException pgEx)
                {
                    _logger.LogError("🔍 PostgresException details - SqlState: {SqlState}, Message: {Message}, Detail: {Detail}, ConstraintName: {ConstraintName}", 
                        pgEx.SqlState, pgEx.Message, pgEx.Detail, pgEx.ConstraintName);
                    
                    // PostgreSQL unique constraint violation code is 23505
                    if (pgEx.SqlState == "23505")
                    {
                        _logger.LogWarning("🔥 Confirmed duplicate key constraint violation during update - constraint: {ConstraintName}", pgEx.ConstraintName);
                        
                        var conflictResponse = req.CreateResponse(HttpStatusCode.Conflict);
                        await conflictResponse.WriteAsJsonAsync(new ApiResponse<object>
                        {
                            Success = false,
                            Message = $"Duplicate key constraint violation: {pgEx.ConstraintName ?? "unique constraint"}. {pgEx.Message}"
                        });
                        return conflictResponse;
                    }
                    else
                    {
                        // Return the actual PostgreSQL error details for other database errors
                        _logger.LogError("🔍 Other PostgreSQL error during update - SqlState: {SqlState}", pgEx.SqlState);
                        var errorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                        await errorResponse.WriteAsJsonAsync(new ApiResponse<object>
                        {
                            Success = false,
                            Message = $"Database error (Code: {pgEx.SqlState}): {pgEx.Message}"
                        });
                        return errorResponse;
                    }
                }
                
                _logger.LogError(dbEx, "❌ Database update error occurred during account update");
                var finalResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await finalResponse.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Database error: {dbEx.InnerException?.Message ?? dbEx.Message}"
                });
                return finalResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating account with ID {Id}", id);
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
                return response;
            }
        }

        [Function("DeleteAccount")]
        public async Task<HttpResponseData> DeleteAccount(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "accounts/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                var deleted = await _accountService.DeleteAsync(id);
                if (!deleted)
                {
                    var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                    await notFoundResponse.WriteAsJsonAsync(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Account not found"
                    });
                    return notFoundResponse;
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Account deleted successfully"
                });
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting account with ID {Id}", id);
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
                return response;
            }
        }

        [Function("GetAccountsByGroup")]
        public async Task<HttpResponseData> GetAccountsByGroup(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "accounts/by-group/{groupId:int}")] HttpRequestData req,
            int groupId)
        {
            try
            {
                var accounts = await _accountService.GetByAccountGroupAsync(groupId);
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new ApiResponse<List<AccountDto>>
                {
                    Success = true,
                    Data = accounts,
                    Message = "Accounts retrieved successfully"
                });
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving accounts by group {GroupId}", groupId);
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteAsJsonAsync(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
                return response;
            }
        }

        [Function("CheckAccountNumber")]
        public async Task<HttpResponseData> CheckAccountNumber(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "accounts/check-number/{accountNumber}")] HttpRequestData req,
            string accountNumber)
        {
            try
            {
                var exists = await _accountService.AccountNumberExistsAsync(accountNumber);
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new ApiResponse<bool>
                {
                    Success = true,
                    Data = exists,
                    Message = exists ? "Account number already exists" : "Account number is available"
                });
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking account number {AccountNumber}", accountNumber);
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
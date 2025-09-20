using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ShipnetFunctionApp.Api.Models
{
    /// <summary>
    /// Standard API response wrapper for consistent responses
    /// </summary>
    public class ApiResponse<T>
    {
        /// <summary>
        /// Whether the request was successful
        /// </summary>
        public bool Success { get; set; }
        
        /// <summary>
        /// The data payload (null if error)
        /// </summary>
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public T? Data { get; set; }
        
        /// <summary>
        /// Error message if any
        /// </summary>
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Message { get; set; }
        
        /// <summary>
        /// Create a successful response with data
        /// </summary>
        public static ApiResponse<T> SuccessResponse(T data) => new() { Success = true, Data = data };
        
        /// <summary>
        /// Create a successful response without data
        /// </summary>
        public static ApiResponse<T> SuccessResponse() => new() { Success = true };
        
        /// <summary>
        /// Create an error response
        /// </summary>
        public static ApiResponse<T> ErrorResponse(string message) => new() { Success = false, Message = message };
    }
}

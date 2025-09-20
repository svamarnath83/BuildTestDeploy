using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Auth.DTOs;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.Services;

namespace ShipnetFunctionApp.Auth.Services
{
    public class AuthService
    {
        private readonly AdminContext _adminContext;
        private readonly JwtService _jwtService;
        private new readonly ILogger<AuthService>? _logger;

        public AuthService(
            AdminContext adminContext,
            JwtService jwtService,
            ITenantContext tenantContext,
            ILogger<AuthService>? logger = null) 
        {   
            _adminContext = adminContext;
            _jwtService = jwtService;
            _logger = logger;
        }

        /// <summary>
        /// Validates account code and returns subscription if valid
        /// </summary>
        public async Task<Subscription?> GetSubscriptionByAccountCodeAsync(string accountCode)
        {
            if (string.IsNullOrEmpty(accountCode))
            {
                _logger?.LogWarning("Account code is null or empty");
                return null;
            }

            try
            {
                var subscription = await _adminContext.Subscriptions
                    .FirstOrDefaultAsync(s => s.AccountCode == accountCode);

                if (subscription == null)
                {
                    _logger?.LogWarning("No subscription found for account code: {AccountCode}", accountCode);
                }

                return subscription;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error getting subscription for account code: {AccountCode}", accountCode);
                return null;
            }
        }

        /// <summary>
        /// Authenticates a user with username, password, and account code
        /// </summary>
    }

    
}
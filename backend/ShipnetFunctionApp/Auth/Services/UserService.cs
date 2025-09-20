using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Auth.DTOs;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Services;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace ShipnetFunctionApp.Auth.Services
{
    public class UserService : BaseService
    {
        private readonly JwtService _jwtService;
        private readonly ICurrentUserAccessor _currentUserAccessor;

        public UserService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext,
            JwtService jwtService,
            ICurrentUserAccessor currentUserAccessor,
            ILogger<UserService>? logger = null)
            : base(dbContextFactory, tenantContext, logger)
        {   
            _jwtService = jwtService ?? throw new ArgumentNullException(nameof(jwtService));
            _currentUserAccessor = currentUserAccessor ?? throw new ArgumentNullException(nameof(currentUserAccessor));
        }

        public async Task<UserWithToken?> AuthenticateUserAsync(string username, string password, string accountCode)
        {
            // Validate input
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(accountCode))
            {
                _logger?.LogWarning("Invalid authentication attempt: missing required fields");
                return null;
            }

            try
            {
                // Find user in the database (schema already set by tenant context)
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Name == username && u.Password == password);

              

                if (user == null)
                {
                    _logger?.LogWarning("User not found or invalid credentials for: {Username}, {AccountCode}",
                        username, accountCode);
                    return null;
                }

                // Generate JWT token
                var token = _jwtService.GenerateJwt(
                    userId: user.Id,
                    username: user.Name ?? string.Empty,
                    accountCode: accountCode,
                    role: user.Role ?? "User"
                );

                // Return user with token
                return new UserWithToken
                {
                    User = user,
                    LongToken = token
                };
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error authenticating user: {Username}, {AccountCode}",
                    username, accountCode);
                return null;
            }
        }

        public async Task<IEnumerable<UserDto>> GetUsers()
        {
            return await (from u in _context.Users
                          select new UserDto()
                          {
                              Id = u.Id,
                              Name = u.Name
                          }).ToListAsync();
        }

        /// <summary>
        /// Gets the currently logged-in user details from a ClaimsPrincipal.
        /// Assumes tenant context (schema) has been set by middleware.
        /// </summary>
        public async Task<UserDto?> GetCurrentUserAsync(ClaimsPrincipal? principal)
        {
            if (principal == null)
            {
                _logger?.LogWarning("GetCurrentUserAsync called with null principal");
                return null;
            }

            try
            {
                // Prefer user id from standard JWT subject (sub)
                var subClaim = principal.FindFirst(JwtRegisteredClaimNames.Sub) ?? principal.FindFirst(ClaimTypes.NameIdentifier);
                if (subClaim != null && long.TryParse(subClaim.Value, out var userId))
                {
                    var userById = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
                    if (userById != null)
                    {
                        return new UserDto { Id = userById.Id, Name = userById.Name };
                    }
                }

                // Fallback to username claim
                var username = principal.FindFirst("username")?.Value ?? principal.Identity?.Name;
                if (!string.IsNullOrWhiteSpace(username))
                {
                    var userByName = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Name == username);
                    if (userByName != null)
                    {
                        return new UserDto { Id = userByName.Id, Name = userByName.Name };
                    }
                }

                _logger?.LogWarning("GetCurrentUserAsync: no matching user found for provided claims");
                return null;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error getting current user from claims");
                return null;
            }
        }

        /// <summary>
        /// Gets the currently logged-in user details from a JWT token string.
        /// </summary>
        public async Task<UserDto?> GetCurrentUserAsync(string jwtToken)
        {
            if (string.IsNullOrWhiteSpace(jwtToken)) return null;
            var principal = _jwtService.ValidateJwt(jwtToken);
            if (principal == null) return null;
            return await GetCurrentUserAsync(principal);
        }

        /// <summary>
        /// Gets the current user without passing any parameters. The JwtValidationMiddleware populates the current user accessor.
        /// </summary>
        public async Task<UserDto?> GetCurrentUserAsync()
        {
            var principal = _currentUserAccessor.Principal;
            if (principal == null) return null;
            return await GetCurrentUserAsync(principal);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Registers.DTOs;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Services;

namespace ShipnetFunctionApp.Registers.Services
{
    /// <summary>
    /// Service for managing commodity entities and related operations.
    /// </summary>
    public class CommodityService : BaseService
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CommodityService"/> class.
        /// </summary>
        public CommodityService(
            Func<string, MultiTenantSnContext> dbContextFactory, 
            ITenantContext tenantContext)
            : base(dbContextFactory, tenantContext)
        {
        }

        /// <summary>
        /// Retrieves all commodities ordered by name.
        /// </summary>
        /// <returns>List of commodity DTOs.</returns>
        public async Task<IEnumerable<CommodityDto>> GetCommoditiesAsync()
        {
            return await _context.Commodities
                .OrderBy(c => c.Name)
                .Select(c => new CommodityDto
                {
                    Id = c.Id,
                    Code = c.Code ?? string.Empty,
                    Name = c.Name ?? string.Empty,
                    IsActive = c.IsActive
                })
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a commodity by its ID.
        /// </summary>
        /// <param name="id">Commodity ID.</param>
        /// <returns>Commodity DTO or null if not found.</returns>
        public async Task<CommodityDto?> GetCommodityByIdAsync(int id)
        {
            var commodity = await _context.Commodities.FindAsync(id);
            if (commodity == null)
            {
                return null;
            }
            return new CommodityDto
            {
                Id = commodity.Id,
                Code = commodity.Code ?? string.Empty,
                Name = commodity.Name ?? string.Empty,
                IsActive = commodity.IsActive
            };
        }
    }
}
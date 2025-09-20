using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.Registers.DTOs;
using ShipnetFunctionApp.Services;

namespace ShipnetFunctionApp.Registers.Services
{
    /// <summary>
    /// Service for managing currency type entities and related operations.
    /// </summary>
    public class CurrencyTypeService : BaseService
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CurrencyTypeService"/> class.
        /// </summary>
        public CurrencyTypeService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext)
            : base(dbContextFactory, tenantContext)
        {
        }

        /// <summary>
        /// Retrieves all currency types ordered by name.
        /// </summary>
        /// <returns>List of currency type DTOs.</returns>
        public async Task<IEnumerable<CurrencyTypeDto>> GetCurrencyTypesAsync()
        {
            return await _context.CurrencyTypes
                .OrderBy(c => c.Name)
                .Select(c => new CurrencyTypeDto
                {
                    Id = c.Id,
                    Code = c.Code ?? string.Empty,
                    Name = c.Name ?? string.Empty,
                    IsActive = c.IsActive
                })
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a currency type by its ID.
        /// </summary>
        /// <param name="id">Currency type ID.</param>
        /// <returns>Currency type DTO or null if not found.</returns>
        public async Task<CurrencyTypeDto?> GetCurrencyTypeByIdAsync(int id)
        {
            var currencyType = await _context.CurrencyTypes.FindAsync(id);
            if (currencyType == null)
                return null;
            return new CurrencyTypeDto
            {
                Id = currencyType.Id,
                Code = currencyType.Code ?? string.Empty,
                Name = currencyType.Name ?? string.Empty,
                IsActive = currencyType.IsActive
            };
        }
    }
}
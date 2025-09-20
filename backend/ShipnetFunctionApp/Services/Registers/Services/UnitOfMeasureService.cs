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
    /// Service for managing unit of measure entities and related operations.
    /// </summary>
    public class UnitOfMeasureService : BaseService
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="UnitOfMeasureService"/> class.
        /// </summary>
        /// <param name="dbContextFactory">The database context factory.</param>
        /// <param name="tenantContext">The tenant context.</param>
        public UnitOfMeasureService(
           Func<string, MultiTenantSnContext> dbContextFactory,
           ITenantContext tenantContext)
           : base(dbContextFactory, tenantContext)
        {
        }

        /// <summary>
        /// Retrieves all units of measure ordered by name.
        /// </summary>
        /// <returns>List of unit of measure DTOs.</returns>
        public async Task<IEnumerable<UnitOfMeasureDto>> GetUnitsOfMeasureAsync()
        {
            return await _context.UnitsOfMeasure
                .OrderBy(u => u.Name)
                .Select(u => new UnitOfMeasureDto
                {
                    id = u.Id,
                    code = u.Code ?? string.Empty,
                    name = u.Name ?? string.Empty,
                    isDefault = u.Code == "M",
                    isActive = u.IsActive
                })
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a unit of measure by its ID.
        /// </summary>
        /// <param name="id">Unit of measure ID.</param>
        /// <returns>Unit of measure DTO or null if not found.</returns>
        public async Task<UnitOfMeasureDto?> GetUnitOfMeasureByIdAsync(int id)
        {
            var unit = await _context.UnitsOfMeasure.FindAsync(id);
            if (unit == null)
            {
                return null;
            }
            return new UnitOfMeasureDto
            {
                id = unit.Id,
                code = unit.Code ?? string.Empty,
                name = unit.Name ?? string.Empty,
                isDefault = unit.Code == "M",
                isActive = unit.IsActive
            };
        }
    }
}
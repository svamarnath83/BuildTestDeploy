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
    /// Service for managing vessel type entities and related operations.
    /// </summary>
    public class VesselTypeService : BaseService
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="VesselTypeService"/> class.
        /// </summary>
        /// <param name="dbContextFactory">The database context factory.</param>
        /// <param name="tenantContext">The tenant context.</param>
        public VesselTypeService(
               Func<string, MultiTenantSnContext> dbContextFactory,
               ITenantContext tenantContext)
               : base(dbContextFactory, tenantContext)
        {
        }

        /// <summary>
        /// Retrieves all vessel types ordered by name.
        /// </summary>
        /// <returns>List of vessel type DTOs.</returns>
        public async Task<IEnumerable<VesselTypeDto>> GetVesselTypesAsync()
        {
            return await _context.VesselTypes.Join(
        _context.VesselCategories,
        vt => vt.Category,          
        vc => vc.Id,                  
        (vt, vc) => new { vt, vc }   
    )
                .OrderBy(x => x.vt.Name)
                .Select(x => new VesselTypeDto
                {
                    id = x.vt.Id,
                    name = x.vt.Name ?? string.Empty,
                    category = x.vt.Category,
                    categoryName = x.vc.Name,
                    calcType = x.vt.CalcType ?? string.Empty,
                    isActive = x.vt.IsActive
                   
                })
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a vessel type by its ID.
        /// </summary>
        /// <param name="id">Vessel type ID.</param>
        /// <returns>Vessel type DTO or null if not found.</returns>
        public async Task<VesselTypeDto?> GetVesselTypeByIdAsync(long id)
        {
            var vt = await _context.VesselTypes.FindAsync(id);
            if (vt == null)
            {
                return null;
            }
            return new VesselTypeDto
            {
                id = vt.Id,
                name = vt.Name ?? string.Empty,
                category = vt.Category,
                calcType = vt.CalcType ?? string.Empty,
                isActive = vt.IsActive
                
            };
        }

        /// <summary>
        /// Adds a new vessel type or updates an existing vessel type.
        /// </summary>
        /// <param name="vesselTypeDto">Vessel type DTO to add or update.</param>
        /// <returns>Saved vessel type DTO.</returns>
        public async Task<VesselTypeDto> AddOrUpdateVesselTypeAsync(VesselTypeDto vesselTypeDto)
        {
            if (vesselTypeDto == null)
                throw new ArgumentNullException(nameof(vesselTypeDto));

            VesselType? entity = null;
            if (vesselTypeDto.id > 0)
            {
                entity = await _context.VesselTypes.FirstOrDefaultAsync(vt => vt.Id == vesselTypeDto.id);
            }

            if (entity == null)
            {
                // Add new vessel type
                entity = new VesselType
                {
                    Name = vesselTypeDto.name ?? string.Empty,
                    Category = vesselTypeDto.category,
                    CalcType = vesselTypeDto.calcType ?? string.Empty,
                    IsActive = vesselTypeDto.isActive,
                    CreatedAt = DateTime.Now,
                };
                _context.VesselTypes.Add(entity);
            }
            else
            {
                // Update existing vessel type
                entity.Name = vesselTypeDto.name ?? string.Empty;
                entity.Category = vesselTypeDto.category;
                entity.CalcType = vesselTypeDto.calcType ?? string.Empty;
                entity.IsActive = vesselTypeDto.isActive;
               // entity.UpdatedBy = vesselTypeDto.updatedBy;
                entity.UpdatedAt = DateTime.Now;
            }

            await _context.SaveChangesAsync();
            vesselTypeDto.id = entity.Id;
            return vesselTypeDto;
        }

        public async Task<IEnumerable<VesselTypeDto>> GetVesselCategoryAsync()
        {
            return await _context.VesselCategories
                .OrderBy(vt => vt.Name)
                .Select(vt => new VesselTypeDto
                {
                    id = vt.Id,
                    name = vt.Name ?? string.Empty,
                    isActive = vt.IsActive

                })
                .ToListAsync();
        }

        public async Task<bool> DeleteVesselTypeAsync(long id)
        {
            var vesselType = await _context.VesselTypes.FindAsync(id);
            if (vesselType == null)
            {
                return false;
            }

            _context.VesselTypes.Remove(vesselType);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
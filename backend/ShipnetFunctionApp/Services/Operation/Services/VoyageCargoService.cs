using Microsoft.EntityFrameworkCore;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models.Operation;
using ShipnetFunctionApp.VoyageManager.DTOs;

namespace ShipnetFunctionApp.Services.Operation.Services
{
    /// <summary>
    /// Service for managing voyage cargo
    /// </summary>
    public class VoyageCargoService : BaseService
    {
        public VoyageCargoService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext)
            : base(dbContextFactory, tenantContext)
        {
        }

        /// <summary>
        /// Add or update voyage cargo (merged create/update method)
        /// </summary>
        public async Task<VoyageCargoDto> SaveVoyageCargo(VoyageCargoDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            return null;

            // Voyagecargo? entity = null;
            // if (dto.Id > 0)
            //     entity = await _context.Voyagecargos.FindAsync(dto.Id);

            // if (entity == null)
            // {
            //     // Create new voyage cargo
            //     entity = new Voyagecargo
            //     {
            //         VoyageId = dto.VoyageId,
            //         ChartererId = dto.ChartererId,
            //         CommodityId = dto.CommodityId,
            //         Rate = dto.Rate,
            //         RateTypeId = dto.RateTypeId,
            //         Qty = dto.Qty,
            //         UomId = dto.UomId,
            //         LoadPorts = dto.LoadPorts,
            //         DischargePorts = dto.DischargePorts,
            //         CargoDescription = dto.CargoDescription,
            //         LaycanStart = dto.LaycanStart,
            //         LaycanEnd = dto.LaycanEnd,
            //         CommissionRate = dto.CommissionRate,
            //         Terms = dto.Terms,
            //         Notes = dto.Notes,
            //         IsActive = dto.IsActive,
            //         CreatedBy = dto.CreatedBy,
            //         CreatedAt = DateTime.Now,
            //         UpdatedAt = DateTime.Now
            //     };
            //     _context.Voyagecargos.Add(entity);
            // }
            // else
            // {
            //     // Update existing voyage cargo
            //     entity.VoyageId = dto.VoyageId;
            //     entity.ChartererId = dto.ChartererId;
            //     entity.CommodityId = dto.CommodityId;
            //     entity.Rate = dto.Rate;
            //     entity.RateTypeId = dto.RateTypeId;
            //     entity.Qty = dto.Qty;
            //     entity.UomId = dto.UomId;
            //     entity.LoadPorts = dto.LoadPorts;
            //     entity.DischargePorts = dto.DischargePorts;
            //     entity.CargoDescription = dto.CargoDescription;
            //     entity.LaycanStart = dto.LaycanStart;
            //     entity.LaycanEnd = dto.LaycanEnd;
            //     entity.CommissionRate = dto.CommissionRate;
            //     entity.Terms = dto.Terms;
            //     entity.Notes = dto.Notes;
            //     entity.IsActive = dto.IsActive;
            //     entity.UpdatedBy = dto.UpdatedBy;
            //     entity.UpdatedAt = DateTime.Now;
            //     // Keep CreatedBy and CreatedAt as-is
            // }

            // await _context.SaveChangesAsync();
            // dto.Id = entity.Id;
            // dto.CreatedAt = entity.CreatedAt;
            // dto.UpdatedAt = entity.UpdatedAt;
            // return dto;
        }

        /// <summary>
        /// Delete a voyage cargo (soft delete)
        /// </summary>
        public async Task<bool> DeleteVoyageCargoAsync(long id)
        {
            var cargo = await _context.Voyagecargos
                .FirstOrDefaultAsync(x => x.Id == id);

            if (cargo == null)
                return false;

            cargo.IsActive = false;
            cargo.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Map Voyagecargo entity to DTO
        /// </summary>
        private static VoyageCargoDto MapToDto(VoyageCargo cargo)
        {
            return new VoyageCargoDto
            {
              
            };
        }
    }
}
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models.Charterering;
using ShipnetFunctionApp.VoyageManager.DTOs;

namespace ShipnetFunctionApp.Services.Operation.Services
{
    /// <summary>
    /// Service for managing voyage port rotations
    /// </summary>
    public class VoyagePortRotationService : BaseService
    {
        public VoyagePortRotationService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext
          )
            : base(dbContextFactory, tenantContext)
        {
        }

        /// <summary>
        /// Get all voyage port rotations with optional filtering
        /// </summary>
        public async Task<List<VoyagePortCallDto>> GetVoyagePortCallslAsync(long? voyageId = null)
        {
            var portrotationsStr = await _context.VoyageHeaders.FirstOrDefaultAsync(x => x.Id == voyageId);
            var parshedData = JsonConvert.DeserializeObject<VoyageDto>(portrotationsStr.AdditionalData);
            if (parshedData != null)
                return parshedData.portCalls;

            var query = _context.VoyagePortrotations.AsQueryable();

            if (voyageId.HasValue)
                query = query.Where(x => x.VoyageId == voyageId.Value);

            var rotations = await query
                .OrderBy(x => x.VoyageId)
                .ThenBy(x => x.SequenceOrder)
                .ToListAsync();

            return rotations.Select(MapToDto).ToList();
        }

        /// <summary>
        /// Add or update voyage port rotation (merged create/update method)
        /// </summary>
        public async Task<VoyagePortCallDto> SaveVoyagePortCalls(VoyagePortCallDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            VoyagePortRotation? entity = null;
            if (dto.id > 0)
                entity = await _context.VoyagePortrotations.FindAsync(dto.id);

            if (entity == null)
            {
                // Create new voyage port rotation
                entity = new VoyagePortRotation
                {
                    PortId = dto.portId,
                    // ArrivalDate = dto.ArrivalDate,
                    // DepartureDate = dto.DepartureDate,
                    // PortCost = dto.PortCost,
                    // CargoCost = dto.CargoCost,
                    // AgentId = dto.AgentId,
                    // PortTypeId = dto.PortTypeId,
                    // TimeOfBert = dto.TimeOfBert,
                    // Distance = dto.Distance,
                    // VoyageId = dto.VoyageId,
                    // SequenceOrder = dto.SequenceOrder,
                    // Notes = dto.Notes,
                    // IsActive = dto.IsActive,
                    // CreatedBy = dto.CreatedBy,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _context.VoyagePortrotations.Add(entity);
            }
            else
            {
                // Update existing voyage port rotation
                entity.PortId = dto.portId;
                // entity.ArrivalDate = dto.ArrivalDate;
                // entity.DepartureDate = dto.DepartureDate;
                // entity.PortCost = dto.PortCost;
                // entity.CargoCost = dto.CargoCost;
                // entity.AgentId = dto.AgentId;
                // entity.PortTypeId = dto.PortTypeId;
                // entity.TimeOfBert = dto.TimeOfBert;
                // entity.Distance = dto.Distance;
                // entity.VoyageId = dto.VoyageId;
                // entity.SequenceOrder = dto.SequenceOrder;
                // entity.Notes = dto.Notes;
                // entity.IsActive = dto.IsActive;
                // entity.UpdatedBy = dto.UpdatedBy;
                entity.UpdatedAt = DateTime.Now;
                // Keep CreatedBy and CreatedAt as-is
            }

            await _context.SaveChangesAsync();
            dto.id = entity.Id;
            //dto.CreatedAt = entity.CreatedAt;
            //dto.UpdatedAt = entity.UpdatedAt;
            return dto;
        }

        /// <summary>
        /// Delete a voyage port rotation (soft delete)
        /// </summary>
        public async Task<bool> DeleteVoyagePortCallAsync(long id)
        {
            var rotation = await _context.VoyagePortrotations
                .FirstOrDefaultAsync(x => x.Id == id);

            if (rotation == null)
                return false;

            rotation.IsActive = false;
            rotation.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }


        /// <summary>
        /// Map VoyagePortrotation entity to DTO
        /// </summary>
        private static VoyagePortCallDto MapToDto(VoyagePortRotation rotation)
        {
            return new VoyagePortCallDto
            {
                id = rotation.Id,
                // PortId = rotation.PortId,
                // ArrivalDate = rotation.ArrivalDate,
                // DepartureDate = rotation.DepartureDate,
                // PortCost = rotation.PortCost,
                // CargoCost = rotation.CargoCost,
                // AgentId = rotation.AgentId,
                // PortTypeId = rotation.PortTypeId,
                // TimeOfBert = rotation.TimeOfBert,
                // Distance = rotation.Distance,
                // VoyageId = rotation.VoyageId,
                // SequenceOrder = rotation.SequenceOrder,
                // Notes = rotation.Notes,
                // IsActive = rotation.IsActive,
                // CreatedBy = rotation.CreatedBy,
                // UpdatedBy = rotation.UpdatedBy,
                createdAt = rotation.CreatedAt,
                updatedAt = rotation.UpdatedAt
            };
        }
    }
}
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
    /// Service for managing vessel entities and related operations.
    /// </summary>
    public class VesselService : BaseService
    {
        private readonly VesselGradeService _vesselGradeService;

        public VesselService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext,
            VesselGradeService vesselGradeService)
            : base(dbContextFactory, tenantContext)
        {
            _vesselGradeService = vesselGradeService ?? throw new ArgumentNullException(nameof(vesselGradeService));
        }

        /// <summary>
        /// Retrieves all vessels, optionally including bunker grades, optimized for fewer queries.
        /// </summary>
        /// <param name="includeBunker">Whether to include bunker grades for each vessel.</param>
        /// <returns>List of vessels.</returns>
        public async Task<IEnumerable<VesselDto>> GetVesselsAsync(bool includeBunker)
        {
            if (!includeBunker)
            {
                // Simple query if bunker grades are not needed
                return await (from v in _context.Vessels
                              join vt in _context.VesselTypes on v.Type equals vt.Id into vtj
                              from vt in vtj.DefaultIfEmpty()
                              orderby v.Name
                              select new VesselDto
                              {
                                  id = v.Id,
                                  name = v.Name,
                                  code = v.Code,
                                  dwt = v.Dwt,
                                  type = v.Type,
                                  imo = v.IMO ,
                                  runningCost = v.RunningCost,
                                  vesselJson = v.vesseljson,
                                  vesselTypeName = vt != null ? vt.Name : null
                              }).ToListAsync();
            }
            // Optimized query: fetch vessels and grades in one go
            var vesselWithGrades = await (from v in _context.Vessels
                                          join vt in _context.VesselTypes on v.Type equals vt.Id into vtj
                                          from vt in vtj.DefaultIfEmpty()
                                          orderby v.Name
                                          select new VesselDto
                                          {
                                              id = v.Id,
                                              name = v.Name,
                                              code = v.Code,
                                              dwt = v.Dwt,
                                              type = v.Type,
                                              imo = v.IMO,
                                              runningCost = v.RunningCost,
                                              vesselJson = v.vesseljson,
                                              vesselTypeName = vt != null ? vt.Name : null,
                                              vesselGrades = _context.VesselGrades.Where(g => g.vesselId == v.Id).Select(g => new VesselGradeDto
                                              {
                                                  id = g.Id,
                                                  gradeId = g.GradeId,
                                                  type = g.Type,
                                                  uomId = g.UomId,
                                                  vesselId = g.vesselId,
                                                  gradeName = g.GradeName
                                              }).ToList()
                                          }).ToListAsync();
            return vesselWithGrades;
        }

        /// <summary>
        /// Retrieves a vessel by its ID.
        /// </summary>
        /// <param name="id">Vessel ID.</param>
        /// <returns>Vessel DTO or null if not found.</returns>
        public async Task<VesselDto?> GetVesselByIdAsync(long id)
        {
            var vessel = await _context.Vessels.FindAsync(id);
            if (vessel == null)
            {
                return null;
            }
            var vesselGrades = await _vesselGradeService.GetVesselGradeByVesselId(id);
            return new VesselDto
            {
                id = vessel.Id,
                name = vessel.Name,
                code = vessel.Code,
                dwt = vessel.Dwt,
                imo = vessel.IMO,
                type = vessel.Type,
                runningCost = vessel.RunningCost,
                vesselJson = vessel.vesseljson,
                vesselGrades = vesselGrades
            };
        }

        /// <summary>
        /// Adds a new vessel or updates an existing vessel.
        /// </summary>
        /// <param name="vesselDto">Vessel DTO to add or update.</param>
        /// <returns>Saved vessel DTO.</returns>
        public async Task<VesselDto> AddOrUpdateVesselAsync(VesselDto vesselDto)
        {
            if (vesselDto == null)
                throw new ArgumentNullException(nameof(vesselDto));

            Vessels? vesselEntity = null;

            if (vesselDto.id > 0)
            {
                vesselEntity = await _context.Vessels.FirstOrDefaultAsync(v => v.Id == vesselDto.id);
            }

            if (vesselEntity == null)
            {
                // Add new vessel
                vesselEntity = new Vessels
                {
                    Name = vesselDto.name,
                    Code = vesselDto.code,
                    Dwt = vesselDto.dwt,
                    Type = vesselDto.type,
                    IMO = vesselDto.imo,
                    RunningCost = vesselDto.runningCost,
                    vesseljson = vesselDto.vesselJson
                };
                _context.Vessels.Add(vesselEntity);
            }
            else
            {
                // Update existing vessel
                vesselEntity.Name = vesselDto.name;
                vesselEntity.Code = vesselDto.code;
                vesselEntity.Dwt = vesselDto.dwt;
                vesselEntity.Type = vesselDto.type;
                vesselEntity.IMO = vesselDto.imo;
                vesselEntity.RunningCost = vesselDto.runningCost;
                vesselEntity.vesseljson = vesselDto.vesselJson;
            }

            await _context.SaveChangesAsync();

            // Update vessel grades if provided
            if (vesselDto.vesselGrades != null)
            {
                await _vesselGradeService.UpdateVesselGradesForVesselAsync(vesselEntity.Id, vesselDto.vesselGrades);
            }

            vesselDto.id = vesselEntity.Id;
            return vesselDto;
        }

        /// <summary>
        /// Deletes a vessel and its related grades.
        /// </summary>
        /// <param name="id">Vessel ID to delete.</param>
        /// <returns>True if deleted, false if not found.</returns>
        public async Task<bool> DeleteVesselAsync(long id)
        {
            var vessel = await _context.Vessels.FirstOrDefaultAsync(v => v.Id == id);
            if (vessel == null)
            {
                return false;
            }

            // Remove related vessel grades
            var relatedGrades = _context.VesselGrades.Where(vg => vg.vesselId == id);
            _context.VesselGrades.RemoveRange(relatedGrades);

            // Remove vessel
            _context.Vessels.Remove(vessel);

            await _context.SaveChangesAsync();

            return true;
        }

        /// <summary>
        /// Checks if a vessel code exists, optionally excluding a specific vessel ID.
        /// </summary>
        /// <param name="code">Vessel code to check.</param>
        /// <param name="excludeId">Vessel ID to exclude from check.</param>
        /// <returns>True if code exists, otherwise false.</returns>
        public async Task<bool> VesselCodeExistsAsync(string code, long? excludeId = null)
        {
            if (string.IsNullOrWhiteSpace(code))
                return false;

            var query = _context.Vessels.AsQueryable();

            // Exclude a specific vessel (useful for update scenarios)
            if (excludeId.HasValue)
                query = query.Where(v => v.Id != excludeId.Value);

            // Check for code existence (case-insensitive)
            bool exists = await query.AnyAsync(v => v.Code.ToLower() == code.ToLower());
            return exists;
        }

        public async Task<List<VesselPositionsDto>> GetVesselPosition()
        {
            var vessels = await (from v in _context.Vessels
                           select new VesselPositionsDto()
                           {
                               id = v.Id,
                               name = v.Name,
                               latitude = v.Latitude,
                               longitude = v.Longitude
                           }).ToListAsync();

            return vessels;
        }
    }
}
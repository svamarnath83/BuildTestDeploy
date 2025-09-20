using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.Registers.DTOs;

namespace ShipnetFunctionApp.Registers.Services
{
    /// <summary>
    /// Service for managing vessel grade entities and related operations.
    /// </summary>
    public class VesselGradeService
    {
        private readonly Func<string, MultiTenantSnContext> _dbContextFactory;
        private readonly ITenantContext _tenantContext;
        private readonly Lazy<MultiTenantSnContext> _dbContextLazy;

        public VesselGradeService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext)
        {
            _dbContextFactory = dbContextFactory;
            _tenantContext = tenantContext;
            _dbContextLazy = new Lazy<MultiTenantSnContext>(() => _dbContextFactory(_tenantContext.Schema));
        }

        // Use this property in all methods
        private MultiTenantSnContext _context => _dbContextLazy.Value;

        /// <summary>
        /// Retrieves all vessel grades ordered by ID.
        /// </summary>
        /// <returns>List of vessel grade DTOs.</returns>
        public async Task<IEnumerable<VesselGradeDto>> GetVesselGradesAsync()
        {
            return await _context.VesselGrades
                .OrderBy(vg => vg.SortOrder)
                .Select(vg => new VesselGradeDto
                {
                    id = vg.Id,
                    vesselId = vg.vesselId,
                    gradeId = vg.GradeId,
                    sortOrder = vg.SortOrder,
                    uomId = vg.UomId,
                    type = vg.Type ?? string.Empty
                })
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a vessel grade by its ID.
        /// </summary>
        /// <param name="id">Vessel grade ID.</param>
        /// <returns>Vessel grade DTO or null if not found.</returns>
        public async Task<VesselGradeDto?> GetVesselGradeByIdAsync(long id)
        {
            var vg = await _context.VesselGrades.FindAsync(id);
            if (vg == null)
            {
                return null;
            }
            return new VesselGradeDto
            {
                id = vg.Id,
                vesselId = vg.vesselId,
                gradeId = vg.GradeId,
                uomId = vg.UomId,
                sortOrder = vg.SortOrder,
                type = vg.Type ?? string.Empty
            };
        }

        /// <summary>
        /// Adds a new vessel grade or updates an existing vessel grade.
        /// </summary>
        /// <param name="vesselGradeDto">Vessel grade DTO to add or update.</param>
        /// <returns>Saved vessel grade DTO.</returns>
        public async Task<VesselGradeDto> AddOrUpdateVesselGradeAsync(VesselGradeDto vesselGradeDto)
        {
            if (vesselGradeDto == null)
                throw new ArgumentNullException(nameof(vesselGradeDto));

            VesselGrade? entity = null;
            if (vesselGradeDto.id > 0)
            {
                entity = await _context.VesselGrades.FirstOrDefaultAsync(vg => vg.Id == vesselGradeDto.id);
            }

            if (entity == null)
            {
                // Add new vessel grade
                entity = new VesselGrade
                {
                    vesselId = vesselGradeDto.vesselId,
                    GradeId = vesselGradeDto.gradeId,
                    UomId = vesselGradeDto.uomId,
                    SortOrder=vesselGradeDto.sortOrder,
                    Type = vesselGradeDto.type ?? string.Empty
                };
                _context.VesselGrades.Add(entity);
            }
            else
            {
                // Update existing vessel grade
                entity.vesselId = vesselGradeDto.vesselId;
                entity.GradeId = vesselGradeDto.gradeId;
                entity.UomId = vesselGradeDto.uomId;
                entity.SortOrder = vesselGradeDto.sortOrder;
                entity.Type = vesselGradeDto.type ?? string.Empty;
            }

            await _context.SaveChangesAsync();
            vesselGradeDto.id = entity.Id;
            return vesselGradeDto;
        }

        /// <summary>
        /// Updates vessel grades for a specific vessel by replacing all existing grades.
        /// </summary>
        /// <param name="vesselId">Vessel ID.</param>
        /// <param name="vesselGrades">List of vessel grade DTOs.</param>
        public async Task UpdateVesselGradesForVesselAsync(long vesselId, List<VesselGradeDto> vesselGrades)
        {
            var existingGrades = _context.VesselGrades.Where(vg => vg.vesselId == vesselId);
            _context.VesselGrades.RemoveRange(existingGrades);

            if (vesselGrades != null && vesselGrades.Any())
            {
                foreach (var gradeDto in vesselGrades)
                {
                    var vesselGrade = new VesselGrade
                    {
                        vesselId = vesselId,
                        GradeId = gradeDto.gradeId,
                        UomId = gradeDto.uomId,
                        Type = gradeDto.type ?? string.Empty,
                        SortOrder=gradeDto.sortOrder,
                        GradeName = gradeDto.gradeName
                    };
                    _context.VesselGrades.Add(vesselGrade);
                }
            }

            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Retrieves all vessel grades for a specific vessel.
        /// </summary>
        /// <param name="vesselId">Vessel ID.</param>
        /// <returns>List of vessel grade DTOs or empty list if none found.</returns>
        public async Task<List<VesselGradeDto>> GetVesselGradeByVesselId(long vesselId)
        {
            var vgLst = await _context.VesselGrades
                .Where(vg => vg.vesselId == vesselId)
                .OrderBy(x=>x.SortOrder)
                .Select(vg => new VesselGradeDto
                {
                    id = vg.Id,
                    vesselId = vg.vesselId,
                    gradeId = vg.GradeId,
                    sortOrder=vg.SortOrder,
                    type = vg.Type ?? string.Empty,
                    uomId = vg.UomId
                })
                .ToListAsync();
            return vgLst;
        }
    }
}
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
    /// Service for managing grade entities and related operations.
    /// </summary>
    public class GradeService : BaseService
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GradeService"/> class.
        /// </summary>
        public GradeService(
           Func<string, MultiTenantSnContext> dbContextFactory,
           ITenantContext tenantContext) 
           : base(dbContextFactory, tenantContext)
        {
        }

        /// <summary>
        /// Retrieves all grades ordered by name.
        /// </summary>
        /// <returns>List of grade DTOs.</returns>
        public async Task<IEnumerable<GradeDto>> GetGradesAsync()
        {
            return await _context.Grades
                .OrderBy(g => g.Name)
                .Select(g => new GradeDto
                {
                    id = g.Id,
                    name = g.Name ?? string.Empty,
                    price = g.Price,
                    inUse = g.InUse
                })
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a grade by its ID.
        /// </summary>
        /// <param name="id">Grade ID.</param>
        /// <returns>Grade DTO or null if not found.</returns>
        public async Task<GradeDto?> GetGradeByIdAsync(long id)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null)
            {
                return null;
            }
            return new GradeDto
            {
                id = grade.Id,
                name = grade.Name ?? string.Empty,
                price = grade.Price,
                inUse = grade.InUse
            };
        }

        /// <summary>
        /// Adds a new grade or updates an existing grade.
        /// </summary>
        /// <param name="dto">Grade DTO to add or update.</param>
        /// <returns>Saved grade DTO.</returns>
        public async Task<GradeDto> AddOrUpdateGradeAsync(GradeDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            Grade? entity = null;
            if (dto.id > 0)
                entity = await _context.Grades.FindAsync(dto.id);

            if (entity == null)
            {
                // Add new grade
                entity = new Grade
                {
                    Name = dto.name ?? string.Empty,
                    Price = dto.price,
                    InUse = dto.inUse,
                    CreatedAt = DateTime.Now
                };
                _context.Grades.Add(entity);
            }
            else
            {
                // Update existing grade
                entity.Name = dto.name ?? string.Empty;
                entity.Price = dto.price;
                entity.InUse = dto.inUse;
                entity.UpdatedAt = DateTime.Now;
            }

            await _context.SaveChangesAsync();
            dto.id = entity.Id;
            return dto;
        }

        /// <summary>
        /// Deletes a grade by its ID.
        /// </summary>
        /// <param name="id">Grade ID to delete.</param>
        /// <returns>True if deleted, false if not found.</returns>
        public async Task<bool> DeleteGradeAsync(long id)
        {
            var entity = await _context.Grades.FindAsync(id);
            if (entity == null)
            {
                return false;
            }
            _context.Grades.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
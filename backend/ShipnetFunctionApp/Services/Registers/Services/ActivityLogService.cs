using Microsoft.EntityFrameworkCore;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.Registers.DTOs;
using ShipnetFunctionApp.Services;

namespace ShipnetFunctionApp.Registers.Services
{
    public class ActivityLogService : BaseService
    {
        public readonly UserService _userService;
        public ActivityLogService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext,
            UserService userService
        ) : base(dbContextFactory, tenantContext)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }

        // Create: inserts a new activity log. Sets CreatedDate if not provided.
        public async Task<ActivityLogDto> CreateAsync(ActivityLogDto dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));

            var entity = new ActivityLog
            {
                ModuleId = dto.moduleId,
                RecordId = dto.recordId,
                ActivityName = dto.activityName,
                AssignedTo = dto.assignedTo,
                ParentId = dto.parentId,
                Status = dto.status,
                DueDate = dto.dueDate,
                CreatedBy = dto.createdBy,
                CreatedDate = dto.createdDate ?? DateTime.Now,
                AdditionalData = dto.additionalData,
                Notes = dto.notes,
                Summary = dto.summary
            };

            _context.ActivityLogs.Add(entity);

            // If a parentId is provided and not zero, cascade status update to parent and all its children
            if (dto.parentId.HasValue && dto.parentId.Value != 0 && !string.IsNullOrWhiteSpace(dto.status))
            {
                var parentId = dto.parentId.Value;
                var siblings = _context.ActivityLogs.Where(x => x.Id == parentId || x.ParentId == parentId);
                await siblings.ExecuteUpdateAsync(s => s.SetProperty(x => x.Status, dto.status));
            }

            await _context.SaveChangesAsync();

            dto.id = entity.Id;
            dto.createdDate = entity.CreatedDate;
            return dto;
        }

        // Update: updates an existing activity log. Does not change CreatedDate or CreatedBy.
        public async Task<ActivityLogDto?> UpdateAsync(ActivityLogDto dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));
            if (dto.id <= 0) throw new ArgumentException("id must be provided for update", nameof(dto.id));

            var entity = await _context.ActivityLogs.FirstOrDefaultAsync(x => x.Id == dto.id);
            if (entity == null)
            {
                return null; // Not found
            }

            entity.ModuleId = dto.moduleId;
            entity.RecordId = dto.recordId;
            entity.ActivityName = dto.activityName;
            entity.AssignedTo = dto.assignedTo;
            entity.ParentId = dto.parentId;
            entity.Status = dto.status;
            entity.DueDate = dto.dueDate;
            // Keep CreatedBy and CreatedDate as-is
            entity.AdditionalData = dto.additionalData;
            entity.Notes = dto.notes;
            entity.Summary = dto.summary;

            // If a parentId is provided and not zero on update, cascade status update as well
            if (dto.parentId.HasValue && dto.parentId.Value != 0 && !string.IsNullOrWhiteSpace(dto.status))
            {
                var parentId = dto.parentId.Value;
                var siblings = _context.ActivityLogs.Where(x => x.Id == parentId || x.ParentId == parentId);
                await siblings.ExecuteUpdateAsync(s => s.SetProperty(x => x.Status, dto.status));
            }

            await _context.SaveChangesAsync();
            dto.id = entity.Id;

            if (dto.id > 0)
            {
                await HandleActivity(dto);
            }

            return dto;
        }

        // Backward-compatible upsert delegating to Create/Update
        public async Task<ActivityLogDto> AddOrUpdateAsync(ActivityLogDto dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));
            if (dto.id > 0)
            {
                var updated = await UpdateAsync(dto);
                if (updated == null)
                {
                    // If strict behavior is required, throw here instead of creating
                    throw new KeyNotFoundException($"ActivityLog with id {dto.id} not found");
                }
                return updated;
            }
            return await CreateAsync(dto);
        }

        public async Task<ActivityLogDto?> GetByIdAsync(long id)
        {
            var e = await _context.ActivityLogs.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (e == null) return null;
            return MapToDto(e);
        }

        public async Task<IEnumerable<ActivityLogDto>> GetByRecordAsync(int moduleId, long recordId)
        {
            var query = _context.ActivityLogs.AsNoTracking()
                .Where(x => x.ModuleId == moduleId && x.RecordId == recordId)
                .OrderByDescending(x => x.CreatedDate);

            var list = await query.ToListAsync();
            return list.Select(MapToDto);
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var e = await _context.ActivityLogs.FirstOrDefaultAsync(x => x.Id == id);
            if (e == null) return false;
            _context.ActivityLogs.Remove(e);
            await _context.SaveChangesAsync();
            return true;
        }

        private static ActivityLogDto MapToDto(ActivityLog e) => new ActivityLogDto
        {
            id = e.Id,
            moduleId = e.ModuleId,
            recordId = e.RecordId,
            activityName = e.ActivityName,
            assignedTo = e.AssignedTo,
            parentId = e.ParentId,
            status = e.Status,
            dueDate = e.DueDate,
            createdBy = e.CreatedBy,
            createdDate = e.CreatedDate,
            additionalData = e.AdditionalData,
            notes = e.Notes,
            summary = e.Summary
        };

        //

        private async Task HandleActivity(ActivityLogDto activityLog)
        {
            if (activityLog.activityName == "approval")
            {
                if (activityLog.moduleId == 1) // Assuming 1 is the module ID for "Estimate"
                {
                    // Handle Estimated-related activity
                    await HandleEstimateActivity(activityLog);
                }
                else if (activityLog.moduleId == 2) // Assuming 2 is the module ID for "Port"
                {
                    // Handle Port-related activity
                }
            }
        }

        //estimated related activities
        private async Task HandleEstimateActivity(ActivityLogDto activityLog)
        {
            if (activityLog.activityName == "approval")
            {
                var entity = await _context.Estimates.FindAsync(activityLog.recordId);

                if (entity != null)
                {
                    if (activityLog.status == "pending")
                        entity.Status = "Draft";
                    else if (activityLog.status == "completed")
                        entity.Status = "Approved";
                    else if (activityLog.status == "cancelled")
                        entity.Status = "Rejected";

                    await _context.SaveChangesAsync();
                }
            }
        }
    }
}

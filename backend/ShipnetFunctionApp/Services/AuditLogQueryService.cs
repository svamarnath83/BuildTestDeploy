using Microsoft.EntityFrameworkCore;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.DTOs;

namespace ShipnetFunctionApp.Services
{
    public class AuditLogQueryService : BaseService
    {
        public AuditLogQueryService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext) : base(dbContextFactory, tenantContext)
        {
        }

        private static string ToActionName(long action)
        {
            return action switch
            {
                1L => "INSERT",
                2L => "UPDATE",
                3L => "DELETE",
                _ => "UNKNOWN"
            };
        }

        private static AuditLogDto Map(AuditLog a)
        {
            return new AuditLogDto
            {
                id = a.Id,
                tableName = a.TableName,
                action = a.Action,
                actionName = ToActionName(a.Action),
                keyValues = a.KeyValues,
                changes = a.Changes,
                userName = a.UserName,
                changedAt = a.ChangedAt
            };
        }

        public async Task<List<AuditLogDto>> GetByModuleAndRecordAsync(int moduleId, long recordId, CancellationToken ct = default)
        {
            var tableName = await _context.ModuleConfigs
                .AsNoTracking()
                .Where(m => m.IsActive && m.ModuleId == moduleId)
                .Select(m => m.TableName)
                .FirstOrDefaultAsync(ct);

            if (string.IsNullOrWhiteSpace(tableName))
                return new List<AuditLogDto>();

            var data = await _context.AuditLogs
                .AsNoTracking()
                .Where(a => a.TableName == tableName && a.KeyValues == recordId)
                .OrderByDescending(a => a.ChangedAt)
                .ToListAsync(ct);

            return data.Select(Map).ToList();
        }
    }
}

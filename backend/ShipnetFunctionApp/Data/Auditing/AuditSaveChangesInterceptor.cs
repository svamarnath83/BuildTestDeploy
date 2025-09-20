using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data.Auditing
{
    public class AuditSaveChangesInterceptor : SaveChangesInterceptor
    {
        private readonly ICurrentUserAccessor _currentUserAccessor;

        public AuditSaveChangesInterceptor(ICurrentUserAccessor currentUserAccessor)
        {
            _currentUserAccessor = currentUserAccessor;
        }

        private static string GetTableName(EntityEntry entry)
            => entry.Metadata.GetTableName() ?? entry.Entity.GetType().Name;

        private static string Serialize(object obj)
            => JsonSerializer.Serialize(obj, new JsonSerializerOptions { WriteIndented = false });

        private string? GetUserName()
        {
            var principal = _currentUserAccessor.Principal;
            return principal?.Identity?.Name
                   ?? principal?.Claims?.FirstOrDefault(c => c.Type.EndsWith("/name") || c.Type.Contains("name", StringComparison.OrdinalIgnoreCase))?.Value
                   ?? "system";
        }

        private static long? GetPrimaryKeyAsLong(EntityEntry entry)
        {
            var pkProp = entry.Properties.FirstOrDefault(p => p.Metadata.IsPrimaryKey());
            if (pkProp == null)
                return null;

            var value = pkProp.CurrentValue ?? pkProp.OriginalValue;
            if (value == null)
                return null;

            try
            {
                return Convert.ToInt64(value);
            }
            catch
            {
                return null; // non-numeric PKs won't fit into long
            }
        }

        private static int MapAction(EntityState state) => state switch
        {
            EntityState.Added => 1,
            EntityState.Modified => 2,
            EntityState.Deleted => 3,
            _ => 0
        };

        private IEnumerable<AuditLog> CreateAuditLogs(DbContext context)
        {
            var userName = GetUserName();
            var currentDate = DateTime.Now;

            foreach (var entry in context.ChangeTracker.Entries()
                         .Where(e => e.State != EntityState.Unchanged && e.State != EntityState.Detached))
            {
                if (entry.Entity is AuditLog) continue;

                var actionCode = MapAction(entry.State);
                if (actionCode == 0L) continue;

                var tableName = GetTableName(entry);
                var changeItems = new List<object>();

                if (entry.State == EntityState.Added)
                {
                    foreach (var prop in entry.Properties)
                    {
                        if (prop.IsTemporary) continue;
                        changeItems.Add(new { FieldName = prop.Metadata.Name, OldValue = (string?)null, NewValue = prop.CurrentValue });
                    }
                }
                else if (entry.State == EntityState.Modified)
                {
                    foreach (var prop in entry.Properties.Where(p => p.IsModified))
                    {
                        var oldVal = prop.OriginalValue;
                        var newVal = prop.CurrentValue;
                        if (Equals(oldVal, newVal)) continue;
                        changeItems.Add(new { FieldName = prop.Metadata.Name, OldValue = oldVal, NewValue = newVal });
                    }
                }
                else if (entry.State == EntityState.Deleted)
                {
                    foreach (var prop in entry.Properties)
                    {
                        changeItems.Add(new { FieldName = prop.Metadata.Name, OldValue = prop.OriginalValue, NewValue = (string?)null });
                    }
                }

                yield return new AuditLog
                {
                    TableName = tableName,
                    Action = actionCode,
                    KeyValues = GetPrimaryKeyAsLong(entry),
                    Changes = changeItems.Count > 0 ? Serialize(changeItems) : null,
                    UserName = userName,
                    ChangedAt = currentDate
                };
            }
        }

        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            if (eventData.Context is null) return base.SavingChanges(eventData, result);

            var logs = CreateAuditLogs(eventData.Context).ToList();
            if (logs.Count > 0)
            {
                eventData.Context.Set<AuditLog>().AddRange(logs);
            }

            return base.SavingChanges(eventData, result);
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
            DbContextEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default)
        {
            if (eventData.Context is not null)
            {
                var logs = CreateAuditLogs(eventData.Context).ToList();
                if (logs.Count > 0)
                {
                    eventData.Context.Set<AuditLog>().AddRange(logs);
                }
            }

            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }
    }
}

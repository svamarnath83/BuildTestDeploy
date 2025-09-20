using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ShipnetFunctionApp.Data;

namespace ShipnetFunctionApp.Auth.Services
{
    public class SchemaAccessor : ISchemaAccessor
    {
        private readonly AdminContext _adminContext;

        public SchemaAccessor(AdminContext adminContext)
        {
            _adminContext = adminContext;
        }

        public async Task<string?> GetSchemaForAccountCodeAsync(string accountCode)
        {
            // Use the AdminContext which always uses the public schema for subscription lookup
            var subscription = await _adminContext.Subscriptions
                .Where(s => s.AccountCode == accountCode)
                .FirstOrDefaultAsync();
            return subscription?.Schema;
        }
    }

    public interface ISchemaAccessor
    {
        Task<string?> GetSchemaForAccountCodeAsync(string accountCode);
    }
}
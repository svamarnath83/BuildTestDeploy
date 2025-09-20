using System.Globalization;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using ShipnetFunctionApp.Data;

namespace ShipnetFunctionApp.Data.Seed
{
    public static class PortSeeder
    {
        
        // Bulk load with COPY FROM STDIN (FORMAT CSV, HEADER TRUE)
        public static async Task SeedPortsFromCsvAsync(MultiTenantSnContext ctx, Stream csvStream, CancellationToken ct = default)
        {
            // Only seed if table is empty
            var hasAny = await ctx.Ports.AsNoTracking().AnyAsync(ct);
            if (hasAny) return;

            var conn = (NpgsqlConnection)ctx.Database.GetDbConnection();
            var shouldClose = conn.State != System.Data.ConnectionState.Open;
            if (shouldClose) await conn.OpenAsync(ct);

            // Adjust column list to your actual columns
            // Treat literal "NULL" in CSV as SQL NULL
            var copySql = @"COPY ports (portcode,name,unctad,netpascode,ets,ishistorical,isactive,additionaldata,rankorder)
                            FROM STDIN (FORMAT CSV, HEADER TRUE, NULL 'NULL')";

            await using var importer = await conn.BeginTextImportAsync(copySql, ct);

            using var reader = new StreamReader(csvStream, Encoding.UTF8, detectEncodingFromByteOrderMarks: true, bufferSize: 1 << 16, leaveOpen: true);
            // We write the entire CSV as-is into the COPY stream (server parses CSV)
            // Ensure your CSV uses proper quoting for commas/quotes.
            // If you need to transform rows, parse and rebuild lines here instead.
            char[] buffer = new char[1 << 16];
            int n;
            while ((n = await reader.ReadAsync(buffer, 0, buffer.Length)) > 0)
            {
                await importer.WriteAsync(new ReadOnlyMemory<char>(buffer, 0, n), ct);
            }

            await importer.DisposeAsync();

            if (shouldClose) await conn.CloseAsync();
        }
    }
}
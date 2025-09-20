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
    public static class SnDistanceSeeder
    {
        /// <summary>
        /// Seeds SN Distance data from CSV file using PostgreSQL COPY command for optimal performance
        /// Only seeds if the sndistance table is empty
        /// </summary>
        /// <param name="ctx">AdminContext instance since DistanceSource is in public schema</param>
        /// <param name="csvStream">Stream containing the CSV data</param>
        /// <param name="ct">Cancellation token</param>
        public static async Task SeedSnDistanceFromCsvAsync(AdminContext ctx, Stream csvStream, CancellationToken ct = default)
        {
            // Only seed if table is empty
            var hasAny = await ctx.DistanceSources.AsNoTracking().AnyAsync(ct);
            if (hasAny) return;

            var conn = (NpgsqlConnection)ctx.Database.GetDbConnection();
            var shouldClose = conn.State != System.Data.ConnectionState.Open;
            if (shouldClose) await conn.OpenAsync(ct);

            // COPY command for sndistance table structure
            // Columns: id, fromport, toport, distance, xmldata
            // Treat literal "NULL" in CSV as SQL NULL
            var copySql = @"COPY sndistance (fromport,toport,distance,xmldata)
                            FROM STDIN (FORMAT CSV, HEADER TRUE, NULL 'NULL')";

            await using var importer = await conn.BeginTextImportAsync(copySql, ct);

            using var reader = new StreamReader(csvStream, Encoding.UTF8, detectEncodingFromByteOrderMarks: true, bufferSize: 1 << 16, leaveOpen: true);
            
            // Write the entire CSV as-is into the COPY stream (server parses CSV)
            // Ensure your CSV uses proper quoting for commas/quotes and handles NULL values properly
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
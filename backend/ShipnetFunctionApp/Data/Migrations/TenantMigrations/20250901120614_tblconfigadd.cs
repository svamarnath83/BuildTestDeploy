using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class tblconfigadd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "moduleconfig",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    moduleid = table.Column<int>(type: "integer", nullable: false),
                    tablename = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    isactive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_moduleconfig", x => x.id);
                });

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 1L,
                column: "createdat",
                value: new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6126));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 2L,
                column: "createdat",
                value: new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6175));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 3L,
                column: "createdat",
                value: new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6178));

            migrationBuilder.InsertData(
                table: "moduleconfig",
                columns: new[] { "id", "isactive", "moduleid", "tablename" },
                values: new object[,]
                {
                    { 1, true, 1, "estimates" },
                    { 2, true, 2, "ports" }
                });

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 1,
                column: "createdate",
                value: new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6054));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 2,
                column: "createdate",
                value: new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6081));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 3,
                column: "createdate",
                value: new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6084));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 4,
                column: "createdate",
                value: new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6086));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 5,
                column: "createdate",
                value: new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6088));

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6341), new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6342) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6344), new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6345) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6307), new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6309) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 4L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6314), new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6315) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 5L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6318), new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6319) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 6L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6322), new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6323) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 7L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6326), new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6327) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 8L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6330), new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6330) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 9L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6333), new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6334) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 10L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6337), new DateTime(2025, 9, 1, 17, 36, 13, 641, DateTimeKind.Local).AddTicks(6338) });

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_table_key",
                table: "auditlogs",
                columns: new[] { "tablename", "keyvalues" });

            migrationBuilder.CreateIndex(
                name: "ix_module_config_tablename",
                table: "moduleconfig",
                column: "tablename");

            migrationBuilder.CreateIndex(
                name: "ux_module_config_moduleid",
                table: "moduleconfig",
                column: "moduleid",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "moduleconfig");

            migrationBuilder.DropIndex(
                name: "ix_audit_logs_table_key",
                table: "auditlogs");

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 1L,
                column: "createdat",
                value: new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1234));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 2L,
                column: "createdat",
                value: new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1238));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 3L,
                column: "createdat",
                value: new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1240));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 1,
                column: "createdate",
                value: new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1033));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 2,
                column: "createdate",
                value: new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1055));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 3,
                column: "createdate",
                value: new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1058));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 4,
                column: "createdate",
                value: new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1060));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 5,
                column: "createdate",
                value: new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1062));

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1407), new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1408) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1411), new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1412) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1372), new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1374) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 4L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1380), new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1381) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 5L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1384), new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1385) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 6L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1388), new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1389) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 7L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1391), new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1392) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 8L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1395), new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1396) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 9L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1399), new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1400) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 10L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1403), new DateTime(2025, 9, 1, 14, 35, 18, 566, DateTimeKind.Local).AddTicks(1404) });
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class auditlogtbladd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "auditlogs",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tablename = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    action = table.Column<int>(type: "integer", nullable: false),
                    keyvalues = table.Column<long>(type: "bigint", nullable: true),
                    changes = table.Column<string>(type: "text", nullable: true),
                    username = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    changedat = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_auditlogs", x => x.id);
                });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "auditlogs");

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 1L,
                column: "createdat",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4695));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 2L,
                column: "createdat",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4699));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 3L,
                column: "createdat",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4701));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 1,
                column: "createdate",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4468));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 2,
                column: "createdate",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4492));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 3,
                column: "createdate",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4494));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 4,
                column: "createdate",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4497));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 5,
                column: "createdate",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4498));

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4869), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4870) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4873), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4874) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4836), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4838) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 4L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4842), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4843) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 5L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4846), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4847) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 6L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4850), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4851) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 7L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4854), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4855) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 8L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4857), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4859) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 9L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4861), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4862) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 10L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4865), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4866) });
        }
    }
}

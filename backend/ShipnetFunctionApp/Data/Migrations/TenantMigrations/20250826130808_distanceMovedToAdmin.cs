using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class distanceMovedToAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "sndistance");

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 1L,
                column: "createdat",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7955));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 2L,
                column: "createdat",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7959));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 3L,
                column: "createdat",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7961));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 1,
                column: "createdate",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7761));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 2,
                column: "createdate",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7784));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 3,
                column: "createdate",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7786));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 4,
                column: "createdate",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7788));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 5,
                column: "createdate",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7790));

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8125), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8125) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8128), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8129) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8092), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8094) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 4L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8098), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8099) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 5L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8102), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8103) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 6L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8106), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8107) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 7L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8110), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8111) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 8L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8113), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8114) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 9L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8117), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8118) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 10L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8121), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8122) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "sndistance",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    distance = table.Column<decimal>(type: "numeric", nullable: false),
                    fromport = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    toport = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    xmldata = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sndistance", x => x.id);
                });

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 1L,
                column: "createdat",
                value: new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5314));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 2L,
                column: "createdat",
                value: new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5318));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 3L,
                column: "createdat",
                value: new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5321));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 1,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5111));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 2,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5135));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 3,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5138));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 4,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5139));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 5,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5141));

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5484), new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5484) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5487), new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5488) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5449), new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5450) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 4L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5456), new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5457) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 5L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5460), new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5461) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 6L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5464), new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5465) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 7L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5468), new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5469) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 8L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5472), new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5473) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 9L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5476), new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5477) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 10L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5480), new DateTime(2025, 8, 25, 16, 40, 31, 269, DateTimeKind.Local).AddTicks(5481) });
        }
    }
}

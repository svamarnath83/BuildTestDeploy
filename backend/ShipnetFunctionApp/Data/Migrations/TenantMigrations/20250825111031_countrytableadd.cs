using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class countrytableadd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Country",
                table: "ports",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "countries",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    isactive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_countries", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "countries",
                columns: new[] { "id", "code", "isactive", "name" },
                values: new object[,]
                {
                    { 1, "AE", true, "United Arab Emirates" },
                    { 2, "SA", true, "Saudi Arabia" },
                    { 3, "QA", true, "Qatar" },
                    { 4, "KW", true, "Kuwait" },
                    { 5, "IN", true, "India" },
                    { 6, "JP", true, "Japan" },
                    { 7, "SG", true, "Singapore" },
                    { 8, "CN", true, "China" },
                    { 9, "KR", true, "South Korea" },
                    { 10, "MY", true, "Malaysia" },
                    { 11, "TH", true, "Thailand" },
                    { 12, "GB", true, "United Kingdom" },
                    { 13, "DE", true, "Germany" },
                    { 14, "FR", true, "France" },
                    { 15, "NO", true, "Norway" },
                    { 16, "SE", true, "Sweden" },
                    { 17, "ES", true, "Spain" },
                    { 18, "IT", true, "Italy" },
                    { 19, "NL", true, "Netherlands" },
                    { 20, "BE", true, "Belgium" }
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

            migrationBuilder.CreateIndex(
                name: "IX_countries_code",
                table: "countries",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_countries_name",
                table: "countries",
                column: "name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "countries");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "ports");

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 1L,
                column: "createdat",
                value: new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7603));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 2L,
                column: "createdat",
                value: new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7607));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 3L,
                column: "createdat",
                value: new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7609));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 1,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7383));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 2,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7416));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 3,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7418));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 4,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7420));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 5,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7422));

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7850), new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7851) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7854), new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7855) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7818), new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7819) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 4L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7823), new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7824) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 5L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7827), new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7828) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 6L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7831), new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7832) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 7L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7835), new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7836) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 8L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7839), new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7840) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 9L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7843), new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7843) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 10L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7846), new DateTime(2025, 8, 25, 12, 44, 7, 745, DateTimeKind.Local).AddTicks(7847) });
        }
    }
}

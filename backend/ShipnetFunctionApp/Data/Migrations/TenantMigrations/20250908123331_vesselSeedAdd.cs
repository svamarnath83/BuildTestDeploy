using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class vesselSeedAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "vessels",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { "57.5429", "4.9995" });

            migrationBuilder.UpdateData(
                table: "vessels",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { "53.34499", "-6.19605" });

            migrationBuilder.UpdateData(
                table: "vessels",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { "51.89", "4.24" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "vessels",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "vessels",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "vessels",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { null, null });
        }
    }
}

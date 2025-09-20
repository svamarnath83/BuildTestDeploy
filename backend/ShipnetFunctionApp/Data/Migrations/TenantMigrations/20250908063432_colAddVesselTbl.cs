using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class colAddVesselTbl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "latitude",
                table: "vessels",
                type: "character varying(60)",
                maxLength: 60,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "longitude",
                table: "vessels",
                type: "character varying(60)",
                maxLength: 60,
                nullable: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "latitude",
                table: "vessels");

            migrationBuilder.DropColumn(
                name: "longitude",
                table: "vessels");
        }
    }
}

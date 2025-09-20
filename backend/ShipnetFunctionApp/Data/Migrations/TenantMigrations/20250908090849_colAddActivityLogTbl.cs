using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class colAddActivityLogTbl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "activityimpactdata",
                table: "activitylog",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "activityimpactdata",
                table: "activitylog");
        }
    }
}

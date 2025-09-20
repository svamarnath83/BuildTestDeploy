using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class AddUniqueIndexToAccountGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "act_type",
                table: "account_groups",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "act_type",
                table: "account_groups");
        }
    }
}

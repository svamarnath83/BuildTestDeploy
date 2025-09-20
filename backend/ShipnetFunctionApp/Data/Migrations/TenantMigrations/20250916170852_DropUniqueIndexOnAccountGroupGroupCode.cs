using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class DropUniqueIndexOnAccountGroupGroupCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the unique index on GroupCode
            migrationBuilder.DropIndex(
                name: "IX_account_groups_group_code",
                table: "account_groups");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Recreate the unique index on GroupCode (for rollback)
            migrationBuilder.CreateIndex(
                name: "IX_account_groups_group_code",
                table: "account_groups",
                column: "group_code",
                unique: true);
        }
    }
}

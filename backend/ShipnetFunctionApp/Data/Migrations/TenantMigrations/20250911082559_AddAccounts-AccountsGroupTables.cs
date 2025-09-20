using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class AddAccountsAccountsGroupTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "account_groups",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    level1_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    level1_code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    level2_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    level2_code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    level3_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    level3_code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    group_code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    description = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ifrs_reference = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    saft_code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_account_groups", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "accounts",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    account_number = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    account_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    external_account_number = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ledger_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    dimension = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    currency = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    currency_code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    status = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false, defaultValue: "Free"),
                    type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    account_group_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_accounts", x => x.id);
                    table.ForeignKey(
                        name: "FK_accounts_account_groups_account_group_id",
                        column: x => x.account_group_id,
                        principalTable: "account_groups",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_account_groups_group_code",
                table: "account_groups",
                column: "group_code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_accounts_account_group_id",
                table: "accounts",
                column: "account_group_id");

            migrationBuilder.CreateIndex(
                name: "IX_accounts_account_number",
                table: "accounts",
                column: "account_number",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "accounts");

            migrationBuilder.DropTable(
                name: "account_groups");
        }
    }
}

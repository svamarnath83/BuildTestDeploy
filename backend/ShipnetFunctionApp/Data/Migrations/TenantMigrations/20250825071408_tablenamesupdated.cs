using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class tablenamesupdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_grade",
                table: "grade");

            migrationBuilder.DropPrimaryKey(
                name: "PK_currencytype",
                table: "currencytype");

            migrationBuilder.RenameTable(
                name: "grade",
                newName: "grades");

            migrationBuilder.RenameTable(
                name: "currencytype",
                newName: "currencies");

            migrationBuilder.RenameIndex(
                name: "IX_grade_name",
                table: "grades",
                newName: "IX_grades_name");

            migrationBuilder.AlterColumn<string>(
                name: "unctad",
                table: "ports",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "portcode",
                table: "ports",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(10)",
                oldMaxLength: 10,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "netpascode",
                table: "ports",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ets",
                table: "ports",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_grades",
                table: "grades",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_currencies",
                table: "currencies",
                column: "id");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_grades",
                table: "grades");

            migrationBuilder.DropPrimaryKey(
                name: "PK_currencies",
                table: "currencies");

            migrationBuilder.RenameTable(
                name: "grades",
                newName: "grade");

            migrationBuilder.RenameTable(
                name: "currencies",
                newName: "currencytype");

            migrationBuilder.RenameIndex(
                name: "IX_grades_name",
                table: "grade",
                newName: "IX_grade_name");

            migrationBuilder.AlterColumn<string>(
                name: "unctad",
                table: "ports",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "portcode",
                table: "ports",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "netpascode",
                table: "ports",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ets",
                table: "ports",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_grade",
                table: "grade",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_currencytype",
                table: "currencytype",
                column: "id");

            migrationBuilder.UpdateData(
                table: "grade",
                keyColumn: "id",
                keyValue: 1L,
                column: "createdat",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7622));

            migrationBuilder.UpdateData(
                table: "grade",
                keyColumn: "id",
                keyValue: 2L,
                column: "createdat",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7626));

            migrationBuilder.UpdateData(
                table: "grade",
                keyColumn: "id",
                keyValue: 3L,
                column: "createdat",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7629));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 1,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7412));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 2,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7434));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 3,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7436));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 4,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7438));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 5,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7440));

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7844), new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7845) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7848), new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7849) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7810), new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7813) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 4L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7817), new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7818) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 5L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7821), new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7822) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 6L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7825), new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7826) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 7L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7829), new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7829) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 8L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7832), new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7833) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 9L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7836), new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7837) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 10L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7840), new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7841) });
        }
    }
}

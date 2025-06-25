using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpiceAPI.Migrations
{
    /// <inheritdoc />
    public partial class ipauthsec : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LoginErrorAttempts",
                columns: table => new
                {
                    Ip = table.Column<string>(type: "text", nullable: false),
                    RetryCount = table.Column<int>(type: "integer", nullable: false),
                    LastRetry = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoginErrorAttempts", x => x.Ip);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LoginErrorAttempts");
        }
    }
}

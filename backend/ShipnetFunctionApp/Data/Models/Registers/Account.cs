using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShipnetFunctionApp.Data.Models.Registers
{
    [Table("accounts")]
    public class Account
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("account_number")]
        [StringLength(20)]
        public string AccountNumber { get; set; } = string.Empty;

        [Required]
        [Column("account_name")]
        [StringLength(100)]
        public string AccountName { get; set; } = string.Empty;

        [Column("external_account_number")]
        [StringLength(50)]
        public string? ExternalAccountNumber { get; set; }

        [Column("ledger_type")]
        [StringLength(20)]
        public string? LedgerType { get; set; } // e.g. GL, AR, AP

        [Column("dimension")]
        [StringLength(50)]
        public string? Dimension { get; set; }

        [Column("currency")]
        [StringLength(10)]
        public string? Currency { get; set; }

        [Column("currency_code")]
        [StringLength(10)]
        public string? CurrencyCode { get; set; }

        [Column("status")]
        [StringLength(10)]
        public string Status { get; set; } = "Free"; // Free / Locked

        [Column("type")]
        [StringLength(20)]
        public string? Type { get; set; } // Balance / P&L

        [Column("account_group_id")]
        public int? AccountGroupId { get; set; }

        // Navigation property
        [ForeignKey("AccountGroupId")]
        public virtual AccountGroup? AccountGroup { get; set; }
    }
}
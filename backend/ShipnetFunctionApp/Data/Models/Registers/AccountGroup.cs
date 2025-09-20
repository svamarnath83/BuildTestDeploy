using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShipnetFunctionApp.Data.Models.Registers
{
    [Table("account_groups")]
    public class AccountGroup
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        // new column to store Balance / Profit & Loss
        [Column("act_type")]
        [StringLength(50)]
        public string? ActType { get; set; }

        [Column("level1_name")]
        [StringLength(50)]
        public string? Level1Name { get; set; }

        [Column("level1_code")]
        [StringLength(10)]
        public string? Level1Code { get; set; }

        [Column("level2_name")]
        [StringLength(50)]
        public string? Level2Name { get; set; }

        [Column("level2_code")]
        [StringLength(10)]
        public string? Level2Code { get; set; }

        [Column("level3_name")]
        [StringLength(50)]
        public string? Level3Name { get; set; }

        [Column("level3_code")]
        [StringLength(10)]
        public string? Level3Code { get; set; }

        [Column("group_code")]
        [StringLength(10)]
        public string? GroupCode { get; set; }

        [Column("description")]
        [StringLength(100)]
        public string? Description { get; set; }

        [Column("ifrs_reference")]
        [StringLength(50)]
        public string? IfrsReference { get; set; }

        [Column("saft_code")]
        [StringLength(50)]
        public string? SaftCode { get; set; }
    }
}
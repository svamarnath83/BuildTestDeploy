using Microsoft.EntityFrameworkCore;
using ShipnetFunctionApp.Data.Models.Registers;
using ShipnetFunctionApp.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShipnetFunctionApp.Data.Seed
{
    public static class SeedAccgroupextensions
    {
        /// <summary>
        /// Seeds AccountGroups by fetching the last max identity value and assigning incrementing Ids.
        /// Only inserts missing GroupCodes (idempotent).
        /// </summary>
        public static async Task SeedAccountGroupsAsync(this MultiTenantSnContext ctx)
        {
            var seeds = new List<AccountGroup>
            {
                new AccountGroup { ActType = "Balance",      Level1Code = "10", Level1Name = "Assets", Level2Code = "110", Level2Name = "Non-Current Assets", Level3Code = "11100", Level3Name = "Property, Plant & Equipment", GroupCode = "SN-Def1", Description = "Property, Plant & Equipment", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "10", Level1Name = "Assets", Level2Code = "110", Level2Name = "Non-Current Assets", Level3Code = "11200", Level3Name = "Intangible Assets", GroupCode = "SN-Def1", Description = "Intangible Assets", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "10", Level1Name = "Assets", Level2Code = "110", Level2Name = "Non-Current Assets", Level3Code = "11300", Level3Name = "Investments", GroupCode = "SN-Def1", Description = "Investments", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "10", Level1Name = "Assets", Level2Code = "110", Level2Name = "Non-Current Assets", Level3Code = "11400", Level3Name = "Deferred Tax Assets", GroupCode = "SN-Def1", Description = "Deferred Tax Assets", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "10", Level1Name = "Assets", Level2Code = "110", Level2Name = "Non-Current Assets", Level3Code = "11500", Level3Name = "Other Non-Current Assets", GroupCode = "SN-Def1", Description = "Other Non-Current Assets", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "10", Level1Name = "Assets", Level2Code = "120", Level2Name = "Current Assets", Level3Code = "12100", Level3Name = "Inventories", GroupCode = "SN-Def1", Description = "Inventories", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "10", Level1Name = "Assets", Level2Code = "120", Level2Name = "Current Assets", Level3Code = "12200", Level3Name = "Trade & Other Receivables", GroupCode = "SN-Def1", Description = "Trade & Other Receivables", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "10", Level1Name = "Assets", Level2Code = "120", Level2Name = "Current Assets", Level3Code = "12300", Level3Name = "Cash & Cash Equivalents", GroupCode = "SN-Def1", Description = "Cash & Cash Equivalents", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "10", Level1Name = "Assets", Level2Code = "120", Level2Name = "Current Assets", Level3Code = "12400", Level3Name = "Prepayments & Accrued Income", GroupCode = "SN-Def1", Description = "Prepayments & Accrued Income", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "10", Level1Name = "Assets", Level2Code = "120", Level2Name = "Current Assets", Level3Code = "12500", Level3Name = "Other Current Assets", GroupCode = "SN-Def1", Description = "Other Current Assets", IfrsReference = null, SaftCode = null },

                new AccountGroup { ActType = "Balance",      Level1Code = "20", Level1Name = "Equity", Level2Code = "210", Level2Name = "Equity", Level3Code = "21100", Level3Name = "Share Capital", GroupCode = "SN-Def1", Description = "Share Capital", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "20", Level1Name = "Equity", Level2Code = "210", Level2Name = "Equity", Level3Code = "21200", Level3Name = "Additional Paid-in Capital", GroupCode = "SN-Def1", Description = "Additional Paid-in Capital", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "20", Level1Name = "Equity", Level2Code = "210", Level2Name = "Equity", Level3Code = "21300", Level3Name = "Retained Earnings", GroupCode = "SN-Def1", Description = "Retained Earnings", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "20", Level1Name = "Equity", Level2Code = "210", Level2Name = "Equity", Level3Code = "21400", Level3Name = "Other Reserves", GroupCode = "SN-Def1", Description = "Other Reserves", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "20", Level1Name = "Equity", Level2Code = "210", Level2Name = "Equity", Level3Code = "21500", Level3Name = "Non-controlling Interests", GroupCode = "SN-Def1", Description = "Non-controlling Interests", IfrsReference = null, SaftCode = null },

                new AccountGroup { ActType = "Balance",      Level1Code = "30", Level1Name = "Liabilities", Level2Code = "310", Level2Name = "Non-Current Liabilities", Level3Code = "31100", Level3Name = "Borrowings", GroupCode = "SN-Def1", Description = "Borrowings", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "30", Level1Name = "Liabilities", Level2Code = "310", Level2Name = "Non-Current Liabilities", Level3Code = "31200", Level3Name = "Provisions", GroupCode = "SN-Def1", Description = "Provisions", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "30", Level1Name = "Liabilities", Level2Code = "310", Level2Name = "Non-Current Liabilities", Level3Code = "31300", Level3Name = "Deferred Tax Liabilities", GroupCode = "SN-Def1", Description = "Deferred Tax Liabilities", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "30", Level1Name = "Liabilities", Level2Code = "310", Level2Name = "Non-Current Liabilities", Level3Code = "31400", Level3Name = "Other Non-Current Liabilities", GroupCode = "SN-Def1", Description = "Other Non-Current Liabilities", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "30", Level1Name = "Liabilities", Level2Code = "320", Level2Name = "Current Liabilities", Level3Code = "32100", Level3Name = "Trade & Other Payables", GroupCode = "SN-Def1", Description = "Trade & Other Payables", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "30", Level1Name = "Liabilities", Level2Code = "320", Level2Name = "Current Liabilities", Level3Code = "32200", Level3Name = "Accruals & Deferred Income", GroupCode = "SN-Def1", Description = "Accruals & Deferred Income", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "30", Level1Name = "Liabilities", Level2Code = "320", Level2Name = "Current Liabilities", Level3Code = "32300", Level3Name = "Current Portion of Borrowings / Leases", GroupCode = "SN-Def1", Description = "Current Portion of Borrowings / Leases", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Balance",      Level1Code = "30", Level1Name = "Liabilities", Level2Code = "320", Level2Name = "Current Liabilities", Level3Code = "32400", Level3Name = "Other Current Liabilities", GroupCode = "SN-Def1", Description = "Other Current Liabilities", IfrsReference = null, SaftCode = null },

                new AccountGroup { ActType = "Profit & Loss", Level1Code = "40", Level1Name = "Income", Level2Code = "410", Level2Name = "Operating Income", Level3Code = "41100", Level3Name = "Voyage Revenue", GroupCode = "SN-Def1", Description = "Voyage Revenue", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "40", Level1Name = "Income", Level2Code = "410", Level2Name = "Operating Income", Level3Code = "41200", Level3Name = "Management Income", GroupCode = "SN-Def1", Description = "Management Income", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "40", Level1Name = "Income", Level2Code = "410", Level2Name = "Operating Income", Level3Code = "41300", Level3Name = "Other Operating Income", GroupCode = "SN-Def1", Description = "Other Operating Income", IfrsReference = null, SaftCode = null },

                new AccountGroup { ActType = "Profit & Loss", Level1Code = "50", Level1Name = "Cost of Sales", Level2Code = "510", Level2Name = "Direct Expenses", Level3Code = "51100", Level3Name = "Bunkers Consumed", GroupCode = "SN-Def1", Description = "Bunkers Consumed", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "50", Level1Name = "Cost of Sales", Level2Code = "510", Level2Name = "Direct Expenses", Level3Code = "51200", Level3Name = "Port, Canal & Agency Costs", GroupCode = "SN-Def1", Description = "Port, Canal & Agency Costs", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "50", Level1Name = "Cost of Sales", Level2Code = "510", Level2Name = "Direct Expenses", Level3Code = "51300", Level3Name = "Commissions", GroupCode = "SN-Def1", Description = "Commissions", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "50", Level1Name = "Cost of Sales", Level2Code = "510", Level2Name = "Direct Expenses", Level3Code = "51400", Level3Name = "Other Direct Expenses", GroupCode = "SN-Def1", Description = "Other Direct Expenses", IfrsReference = null, SaftCode = null },

                new AccountGroup { ActType = "Profit & Loss", Level1Code = "60", Level1Name = "Operating Expenses", Level2Code = "610", Level2Name = "Operating Expenses", Level3Code = "61100", Level3Name = "Crew Wages & Related Costs", GroupCode = "SN-Def1", Description = "Crew Wages & Related Costs", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "60", Level1Name = "Operating Expenses", Level2Code = "610", Level2Name = "Operating Expenses", Level3Code = "61200", Level3Name = "Lubricants, Spares & Stores Consumed", GroupCode = "SN-Def1", Description = "Lubricants, Spares & Stores Consumed", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "60", Level1Name = "Operating Expenses", Level2Code = "610", Level2Name = "Operating Expenses", Level3Code = "61300", Level3Name = "Repairs & Maintenance", GroupCode = "SN-Def1", Description = "Repairs & Maintenance", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "60", Level1Name = "Operating Expenses", Level2Code = "610", Level2Name = "Operating Expenses", Level3Code = "61400", Level3Name = "Insurance (Hull & Machinery, P&I)", GroupCode = "SN-Def1", Description = "Insurance (Hull & Machinery, P&I)", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "60", Level1Name = "Operating Expenses", Level2Code = "610", Level2Name = "Operating Expenses", Level3Code = "61500", Level3Name = "Technical Management Fees", GroupCode = "SN-Def1", Description = "Technical Management Fees", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "60", Level1Name = "Operating Expenses", Level2Code = "610", Level2Name = "Operating Expenses", Level3Code = "61600", Level3Name = "Other Operating Expenses", GroupCode = "SN-Def1", Description = "Other Operating Expenses", IfrsReference = null, SaftCode = null },

                new AccountGroup { ActType = "Profit & Loss", Level1Code = "60", Level1Name = "Operating Expenses", Level2Code = "650", Level2Name = "General & Administrative Expenses", Level3Code = "65100", Level3Name = "Salaries(Admin)", GroupCode = "SN-Def1", Description = "Salaries(Admin)", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "60", Level1Name = "Operating Expenses", Level2Code = "650", Level2Name = "General & Administrative Expenses", Level3Code = "65200", Level3Name = "IT & Communication", GroupCode = "SN-Def1", Description = "IT & Communication", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "60", Level1Name = "Operating Expenses", Level2Code = "650", Level2Name = "General & Administrative Expenses", Level3Code = "65300", Level3Name = "Professional Fees (Audit, Legal)", GroupCode = "SN-Def1", Description = "Professional Fees (Audit, Legal)", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "60", Level1Name = "Operating Expenses", Level2Code = "650", Level2Name = "General & Administrative Expenses", Level3Code = "65400", Level3Name = "Office Rent & Admin", GroupCode = "SN-Def1", Description = "Office Rent & Admin", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "60", Level1Name = "Operating Expenses", Level2Code = "650", Level2Name = "General & Administrative Expenses", Level3Code = "65500", Level3Name = "Other Gen & Admin Expenses", GroupCode = "SN-Def1", Description = "Other Gen & Admin Expenses", IfrsReference = null, SaftCode = null },

                new AccountGroup { ActType = "Profit & Loss", Level1Code = "70", Level1Name = "Depreciation Expenses", Level2Code = "710", Level2Name = "Depreciation & Amortization", Level3Code = "71100", Level3Name = "Depreciation – Vessels", GroupCode = "SN-Def1", Description = "Depreciation – Vessels", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "70", Level1Name = "Depreciation Expenses", Level2Code = "710", Level2Name = "Depreciation & Amortization", Level3Code = "71200", Level3Name = "Depreciation – Dry Dock / Special Survey", GroupCode = "SN-Def1", Description = "Depreciation – Dry Dock / Special Survey", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "70", Level1Name = "Depreciation Expenses", Level2Code = "710", Level2Name = "Depreciation & Amortization", Level3Code = "71300", Level3Name = "Depreciation – Other PPE", GroupCode = "SN-Def1", Description = "Depreciation – Other PPE", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "70", Level1Name = "Depreciation Expenses", Level2Code = "710", Level2Name = "Depreciation & Amortization", Level3Code = "71400", Level3Name = "Deprecation (Others)", GroupCode = "SN-Def1", Description = "Deprecation (Others)", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "70", Level1Name = "Depreciation Expenses", Level2Code = "710", Level2Name = "Depreciation & Amortization", Level3Code = "71500", Level3Name = "Amortization – Intangibles", GroupCode = "SN-Def1", Description = "Amortization – Intangibles", IfrsReference = null, SaftCode = null },

                new AccountGroup { ActType = "Profit & Loss", Level1Code = "80", Level1Name = "Financial Expenses", Level2Code = "810", Level2Name = "Finance Costs", Level3Code = "81100", Level3Name = "Interest Expenses", GroupCode = "SN-Def1", Description = "Interest Expenses", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "80", Level1Name = "Financial Expenses", Level2Code = "810", Level2Name = "Finance Costs", Level3Code = "81200", Level3Name = "Lease Interest", GroupCode = "SN-Def1", Description = "Lease Interest", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "80", Level1Name = "Financial Expenses", Level2Code = "810", Level2Name = "Finance Costs", Level3Code = "81300", Level3Name = "Bank Charges", GroupCode = "SN-Def1", Description = "Bank Charges", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "80", Level1Name = "Financial Expenses", Level2Code = "810", Level2Name = "Finance Costs", Level3Code = "81400", Level3Name = "Other Finance Costs", GroupCode = "SN-Def1", Description = "Other Finance Costs", IfrsReference = null, SaftCode = null },

                new AccountGroup { ActType = "Profit & Loss", Level1Code = "90", Level1Name = "Other Income & Expenses", Level2Code = "910", Level2Name = "Other Income & Expenses", Level3Code = "91100", Level3Name = "Foreign Exchange Gain/Loss", GroupCode = "SN-Def1", Description = "Foreign Exchange Gain/Loss", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "90", Level1Name = "Other Income & Expenses", Level2Code = "910", Level2Name = "Other Income & Expenses", Level3Code = "91200", Level3Name = "Fair Value Gain/Loss on Derivatives", GroupCode = "SN-Def1", Description = "Fair Value Gain/Loss on Derivatives", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "90", Level1Name = "Other Income & Expenses", Level2Code = "910", Level2Name = "Other Income & Expenses", Level3Code = "91300", Level3Name = "Impairment Losses (Vessels, Goodwill)", GroupCode = "SN-Def1", Description = "Impairment Losses (Vessels, Goodwill)", IfrsReference = null, SaftCode = null },

                new AccountGroup { ActType = "Profit & Loss", Level1Code = "90", Level1Name = "Other Income & Expenses", Level2Code = "950", Level2Name = "Taxes", Level3Code = "95100", Level3Name = "Current Income Tax", GroupCode = "SN-Def1", Description = "Current Income Tax", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "90", Level1Name = "Other Income & Expenses", Level2Code = "950", Level2Name = "Taxes", Level3Code = "95200", Level3Name = "Deferred Tax", GroupCode = "SN-Def1", Description = "Deferred Tax", IfrsReference = null, SaftCode = null },

                new AccountGroup { ActType = "Profit & Loss", Level1Code = "90", Level1Name = "Other Income & Expenses", Level2Code = "980", Level2Name = "Extraordinary Items", Level3Code = "98100", Level3Name = "Restructuring Costs", GroupCode = "SN-Def1", Description = "Restructuring Costs", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "90", Level1Name = "Other Income & Expenses", Level2Code = "980", Level2Name = "Extraordinary Items", Level3Code = "98200", Level3Name = "Impairment Losses", GroupCode = "SN-Def1", Description = "Impairment Losses", IfrsReference = null, SaftCode = null },

                new AccountGroup { ActType = "Profit & Loss", Level1Code = "90", Level1Name = "Other Income & Expenses", Level2Code = "990", Level2Name = "Closing", Level3Code = "99100", Level3Name = "Year-End Adjustments", GroupCode = "SN-Def1", Description = "Year-End Adjustments", IfrsReference = null, SaftCode = null },
                new AccountGroup { ActType = "Profit & Loss", Level1Code = "90", Level1Name = "Other Income & Expenses", Level2Code = "990", Level2Name = "Closing", Level3Code = "99200", Level3Name = "Consolidation Entries", GroupCode = "SN-Def1", Description = "Consolidation Entries", IfrsReference = null, SaftCode = null }
            };

            
            var newSeeds = seeds;  // Insert all seeds, allowing duplicates

            if (newSeeds.Count == 0)
                return;

            // Fetch current max Id
            int maxId = 0;
            if (await ctx.AccountGroups.AnyAsync())
            {
                maxId = await ctx.AccountGroups.MaxAsync(a => a.Id);
            }

            // Assign incrementing Ids to new seeds
            for (int i = 0; i < newSeeds.Count; i++)
            {
                newSeeds[i].Id = ++maxId;
            }

            await ctx.AccountGroups.AddRangeAsync(newSeeds);
            await ctx.SaveChangesAsync();
        }
    }
}
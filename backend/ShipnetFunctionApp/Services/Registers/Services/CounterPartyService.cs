
using System.Text.Json;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.Services;
using ShipnetFunctionApp.Services.Registers.DTOs;


namespace ShipnetFunctionApp.Registers.Services
{
    public class CounterPartyService : BaseService
    {
        private readonly ConfigurationService _configurationService;
        private const string GROUP_NAME = "Registers";
        private const string CATEGORY = "CounterParty";
        private const string SUB_CATEGORY = "List";
        private const string CONFIG_TYPE = "CounterPartyList";

        public CounterPartyService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext,
            ConfigurationService configurationService,
            ILogger<CounterPartyService>? logger = null)
            : base(dbContextFactory, tenantContext, logger)
        {
            _configurationService = configurationService ?? throw new ArgumentNullException(nameof(configurationService));
        }

        /// <summary>
        /// Gets all counter parties from the configuration settings
        /// </summary>
        /// <returns>List of counter party DTOs</returns>
        public async Task<List<CounterPartyDto>> GetCounterParties()
        {
            var configSetting = new ConfigSetting
            {
                GroupName = GROUP_NAME,
                Category = CATEGORY,
                SubCategory = SUB_CATEGORY,
                ConfigType = CONFIG_TYPE,
            };

            var result = await _configurationService.GetConfiguration(configSetting);

            if (string.IsNullOrEmpty(result?.Data))
            {
                return new List<CounterPartyDto>();
            }

            return JsonSerializer.Deserialize<List<CounterPartyDto>>(result.Data) ?? new List<CounterPartyDto>();

        }

        /// <summary>
        /// Saves a counter party to the configuration settings
        /// </summary>
        /// <param name="counterParty">The counter party to save</param>
        /// <returns>The saved counter party DTO</returns>
        public async Task<CounterPartyDto> SaveCounterParty(CounterPartyDto counterParty)
        {
            if (counterParty == null)
            {
                throw new ArgumentNullException(nameof(counterParty));
            }

            // Get existing counter parties
            var counterParties = await GetCounterParties();

            // If updating existing counter party
            var existingIndex = counterParties.FindIndex(x => x.Id == counterParty.Id);
            if (existingIndex >= 0)
            {
                counterParties[existingIndex] = counterParty;
            }
            else
            {
                // Set new ID if not provided
                if (counterParty.Id <= 0)
                {
                    counterParty.Id = counterParties.Count > 0 ?
                        counterParties.Max(x => x.Id) + 1 : 1;
                }
                counterParty.CreatedAt = DateTime.UtcNow;
                counterParties.Add(counterParty);
            }

            counterParty.UpdatedAt = DateTime.UtcNow;

            // Serialize and save all counter parties

            var serializedData = JsonSerializer.Serialize(counterParties);
            var configSetting = new ConfigSettingDto
            {
                GroupName = GROUP_NAME,
                Category = CATEGORY,
                SubCategory = SUB_CATEGORY,
                ConfigType = CONFIG_TYPE,
                Data = serializedData,
            };

            await _configurationService.SaveConfiguration(configSetting);
            return counterParty;
        }

    }
}


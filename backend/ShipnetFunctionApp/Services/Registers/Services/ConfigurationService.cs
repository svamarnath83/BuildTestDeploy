

using Microsoft.EntityFrameworkCore;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.Services;
using ShipnetFunctionApp.Services.Registers.DTOs;

namespace ShipnetFunctionApp.Registers.Services
{
    public class ConfigurationService : BaseService
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ConfigurationService"/> class.
        /// </summary>
        /// <param name="dbContextFactory">The database context factory.</param>
        /// <param name="tenantContext">The tenant context.</param>
        public ConfigurationService(
               Func<string, MultiTenantSnContext> dbContextFactory,
               ITenantContext tenantContext)
               : base(dbContextFactory, tenantContext)
        {
        }

        /// <summary>
        /// Gets the configuration settings.
        /// </summary>
        /// <param name="configData">The configuration data.</param>
        /// <returns>The configuration settings DTO.</returns>
        public async Task<ConfigSettingDto> GetConfiguration(ConfigSetting configData)
        {
            var resultData = await _context.Configurations.FirstOrDefaultAsync(vt => vt.GroupName == configData.GroupName && vt.Category == configData.Category && vt.SubCategory == configData.SubCategory
            && vt.OwnerId == configData.OwnerId && vt.ConfigType == configData.ConfigType);

            if (resultData == null)
            {
                return new ConfigSettingDto();
            }

            return new ConfigSettingDto
            {
                Id = resultData.Id,
                ConfigType = resultData.ConfigType,
                OwnerId = resultData.OwnerId,
                GroupName = resultData.GroupName,
                Category = resultData.Category,
                SubCategory = resultData.SubCategory,
                Data = resultData.Data,
                Source = resultData.Source,
                CreatedAt = resultData.CreatedAt,
                UpdatedAt = resultData.UpdatedAt
            };
        }

        /// <summary>
        /// Saves or updates a configuration setting.
        /// </summary>
        /// <param name="settingDto">The configuration setting to save.</param>
        /// <returns>The saved configuration setting DTO.</returns>
        /// <exception cref="ArgumentNullException">Thrown when settingDto is null.</exception>
        public async Task<ConfigSettingDto> SaveConfiguration(ConfigSettingDto settingDto)
        {
            if (settingDto == null)
            {
                throw new ArgumentNullException(nameof(settingDto));
            }

            ConfigSetting? entity = null;

            var searchList = await _context.Configurations.Where(vt =>
                vt.GroupName == settingDto.GroupName &&
                vt.Category == settingDto.Category &&
                vt.SubCategory == settingDto.SubCategory &&
                vt.OwnerId == settingDto.OwnerId &&
                vt.ConfigType == settingDto.ConfigType).ToListAsync();

            if (searchList.Count > 1)
                throw new InvalidOperationException("Multiple configuration settings found with the same identifiers.");
            else if (searchList.Count == 1)
                entity = searchList.First();

            if (entity == null)
            {
                entity = new ConfigSetting
                {
                    ConfigType = settingDto.ConfigType,
                    OwnerId = settingDto.OwnerId,
                    GroupName = settingDto.GroupName,
                    Category = settingDto.Category,
                    SubCategory = settingDto.SubCategory,
                    Data = settingDto.Data,
                    Source = settingDto.Source,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.Configurations.Add(entity);
            }
            else
            {
                entity.ConfigType = settingDto.ConfigType;
                entity.OwnerId = settingDto.OwnerId;
                entity.GroupName = settingDto.GroupName;
                entity.Category = settingDto.Category;
                entity.SubCategory = settingDto.SubCategory;
                entity.Data = settingDto.Data;
                entity.Source = settingDto.Source;
                entity.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            settingDto.Id = entity.Id;
            return settingDto;
        }
    }

}

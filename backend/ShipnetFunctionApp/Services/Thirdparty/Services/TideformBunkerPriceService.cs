using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.Thirdparty.DTOs;

namespace ShipnetFunctionApp.Thirdparty.Services
{
    public class TideformBunkerPriceService
    {
        private static readonly HttpClient _http = new HttpClient();

        // Use AdminContext for system-wide configurations like bunker prices
        private readonly AdminContext _adminContext;

        public TideformBunkerPriceService(AdminContext adminContext)
        {
            _adminContext = adminContext;
        }

        private const string Endpoint = "https://api.tideform.io/graphql";
        private const string DefaultAcceptLanguage = "en-US,en;q=0.9,es;q=0.8,ru;q=0.7,uk;q=0.6";

        private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        public async Task<List<AvgBunkerPrice>> GetAvgBunkerPriceAsync()
        {
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");

            var dataFromDb = await _adminContext.SystemConfigurations
                .OrderByDescending(p => p.CreatedAt)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.ConfigType == "Thirdparty" &&
                p.GroupName == "AvgBunkerPrice" &&
                p.Category == "Tidefrom");

            if (dataFromDb != null)
            {
                var result = JsonSerializer.Deserialize<List<AvgBunkerPrice>>(dataFromDb.Data, JsonOptions);
                return result ?? new List<AvgBunkerPrice>();
            }

            return new List<AvgBunkerPrice>();
        }

        public async Task<List<ThirdpartyBunkerPriceDto>> GetLastestBunkerPriceAsync()
        {
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            var dataFromDb = await _adminContext.SystemConfigurations
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.ConfigType == "Thirdparty" &&
                p.GroupName == "BunkerPrice" &&
                p.Category == "Tidefrom" &&
                p.SubCategory == today);

            if (dataFromDb != null && 1 == 2)
            {
                //print
                Console.WriteLine($"Bunker Data found in DB");

                var result = JsonSerializer.Deserialize<List<ThirdpartyBunkerPriceDto>>(dataFromDb.Data, JsonOptions);
                return result ?? new List<ThirdpartyBunkerPriceDto>();
            }
            else
            {
                var result = await GetLastestBunkerPriceFromApiAsync("GfpNTjssWCztT2xcdHNKRo");

                //convert result to jsonstring
                var jsonString = JsonSerializer.Serialize(result, JsonOptions);

                //store it in the database
                var configSetting = new ConfigSetting
                {
                    ConfigType = "Thirdparty",
                    GroupName = "BunkerPrice",
                    Category = "Tidefrom",
                    SubCategory = today,
                    Data = jsonString,
                    //CreatedAt = DateTime.UtcNow,
                    //UpdatedAt = DateTime.UtcNow
                };

                _adminContext.SystemConfigurations.Add(configSetting);


                //store average price of major ports
                //filter result with port name in singapore/rotterdam
                var majorPorts = result.Where(p => p.PortName == "Singapore" || p.PortName == "Rotterdam" || p.PortName == "Fujairah").ToList();
                //calculate average bunker price by grade from majorports
                var averagePrices = majorPorts
                    .GroupBy(p => p.FuelGradeId)
                    .Select(g => new
                    {
                        Grade = g.Key,
                        AveragePrice = g.Average(p => p.Price)
                    }).ToList();

                var jsonAvgPrice = JsonSerializer.Serialize(averagePrices, JsonOptions);

                //store it in the database
                var avgPriceInfo = new ConfigSetting
                {
                    ConfigType = "Thirdparty",
                    GroupName = "AvgBunkerPrice",
                    Category = "Tidefrom",
                    SubCategory = today,
                    Data = jsonAvgPrice,
                    //CreatedAt = DateTime.UtcNow,
                    //UpdatedAt = DateTime.UtcNow
                };

                _adminContext.SystemConfigurations.Add(avgPriceInfo);

                await _adminContext.SaveChangesAsync();

                return result;
            }
        }

        /// <summary>
        /// Calls Tideform GraphQL to get latest bunker prices for given fuel grades.
        /// </summary>
        /// <param name="bearerToken">API Bearer token (do not hardcode; pass from config)</param>
        /// <param name="fuelGradeIds">Fuel grade IDs (e.g., MGO, VLSFO). Defaults to ["MGO","VLSFO"].</param>
        /// <param name="acceptLanguage">Optional Accept-Language header.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Flattened list of latest bunker prices.</returns>
        public async Task<List<ThirdpartyBunkerPriceDto>> GetLastestBunkerPriceFromApiAsync(
                string bearerToken,
                IEnumerable<string>? fuelGradeIds = null,
                string? acceptLanguage = null,
                CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(bearerToken))
                throw new ArgumentException("Bearer token is required", nameof(bearerToken));

            var grades = (fuelGradeIds == null || !fuelGradeIds.Any())
                ? new[] { "MGO", "VLSFO" }
                : fuelGradeIds.Select(g => g?.Trim()).Where(g => !string.IsNullOrEmpty(g)).ToArray();

            // Build GraphQL query string with inline fuelGradeIds as provided in the sample
            var gradesQuoted = string.Join(", ", grades.Select(g => "\"" + g + "\""));
            var graphQuery = @"query allSpotPrices {
  latestSpotPrices {
    port {
      id
      name
      countryName
      portRank
    }
    fuelGrade {
      id
      description
    }
    latestPrices {
      publishedDate
      price
    }
  }
}";

            var payload = new GraphQLRequest
            {
                Query = graphQuery,
                Variables = new { }
            };

            using var req = new HttpRequestMessage(HttpMethod.Post, Endpoint)
            {
                Content = new StringContent(JsonSerializer.Serialize(payload, JsonOptions), Encoding.UTF8, "application/json")
            };

            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);
            req.Headers.TryAddWithoutValidation("Accept-Language", string.IsNullOrWhiteSpace(acceptLanguage) ? DefaultAcceptLanguage : acceptLanguage);

            using var res = await _http.SendAsync(req, cancellationToken);
            res.EnsureSuccessStatusCode();

            var json = await res.Content.ReadAsStringAsync(cancellationToken);
            var graphResponse = JsonSerializer.Deserialize<GraphQLResponse<TideformLatestSpotPricesData>>(json, JsonOptions);

            var items = graphResponse?.Data?.LatestSpotPrices ?? new List<TideformSpotPriceItem>();
            var result = new List<ThirdpartyBunkerPriceDto>(items.Count);

            foreach (var sp in items)
            {
                if (sp == null) continue;
                // Use the first/latest price if present
                var latest = sp.LatestPrices?.FirstOrDefault();
                if (latest == null) continue;

                result.Add(new ThirdpartyBunkerPriceDto
                {
                    PortId = sp.Port?.id ?? string.Empty,
                    PortName = sp.Port?.Name ?? string.Empty,
                    CountryName = sp.Port?.CountryName ?? string.Empty,
                    PortRank = sp.Port?.PortRank,
                    FuelGradeId = sp.FuelGrade?.id ?? string.Empty,
                    FuelGradeDescription = sp.FuelGrade?.Description ?? string.Empty,
                    PublishedDate = latest.PublishedDate,
                    Price = latest.Price
                });
            }

            return result;
        }

        // -------- DTOs for parsing GraphQL --------
        private sealed class GraphQLRequest
        {
            [JsonPropertyName("query")] public string Query { get; set; } = string.Empty;
            [JsonPropertyName("variables")] public object Variables { get; set; } = new { };
        }

        private sealed class GraphQLResponse<T>
        {
            [JsonPropertyName("data")] public T? Data { get; set; }
            [JsonPropertyName("errors")] public JsonElement? Errors { get; set; }
        }

        private sealed class TideformLatestSpotPricesData
        {
            [JsonPropertyName("latestSpotPrices")] public List<TideformSpotPriceItem>? LatestSpotPrices { get; set; }
        }

        private sealed class TideformSpotPriceItem
        {
            [JsonPropertyName("port")] public TideformPort? Port { get; set; }
            [JsonPropertyName("fuelGrade")] public TideformFuelGrade? FuelGrade { get; set; }
            [JsonPropertyName("latestPrices")] public List<TideformPrice>? LatestPrices { get; set; }
        }

        private sealed class TideformPort
        {
            [JsonPropertyName("id")] public string? id { get; set; } // Changed to lowercase to match db column
            [JsonPropertyName("name")] public string? Name { get; set; }
            [JsonPropertyName("countryName")] public string? CountryName { get; set; }
            [JsonPropertyName("portRank")] public int? PortRank { get; set; }
        }

        private sealed class TideformFuelGrade
        {
            [JsonPropertyName("id")] public string? id { get; set; } // Changed to lowercase to match db column
            [JsonPropertyName("description")] public string? Description { get; set; }
        }

        private sealed class TideformPrice
        {
            [JsonPropertyName("publishedDate")] public DateTime? PublishedDate { get; set; }
            [JsonPropertyName("price")] public decimal? Price { get; set; }
        }

        public sealed class AvgBunkerPrice
        {
            public string Grade { get; set; } = string.Empty;
            public decimal AveragePrice { get; set; }
        }
    }
    



}
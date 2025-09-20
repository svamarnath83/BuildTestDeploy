using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.Registers.DTOs;

namespace ShipnetFunctionApp.Registers.Services
{
    public class DistanceService
    {
        private readonly AdminContext _context;

        public DistanceService(
            AdminContext adminContext)
        {
            _context = adminContext;
        }
        
        public async Task<IEnumerable<DistanceResult>> GetDistance(List<DistanceRequest> distanceRequests)
        {
            var result = new List<DistanceResult>();
        
            var rpGroupList = await GetRoutingPointGroupsAsync();

            var rpsToIntoRotation = "Suez Canal (RP);KIEL CANAL (RP)".ToUpper().Split(';').ToList();

            foreach (var portPair in distanceRequests)
            {
                portPair.FromPort = portPair.FromPort?.Trim().ToUpper();
                portPair.ToPort = portPair.ToPort?.Trim().ToUpper();
                portPair.RoutingPoint = portPair.RoutingPoint?.Trim().ToUpper();

                var distanceEntity = await _context.DistanceSources
                    .FirstOrDefaultAsync(x => (x.FromPort == portPair.FromPort && x.ToPort == portPair.ToPort));

                if (!string.IsNullOrEmpty(portPair.RoutingPoint))
                {
                    distanceEntity = await _context.DistanceSources
                            .FirstOrDefaultAsync(x => (x.FromPort == portPair.FromPort
                                && x.ToPort == portPair.ToPort && x.xmldata != null && x.xmldata.Contains(portPair.RoutingPoint)));
                }

                // If no direct distance found, try reverse order
                var distance = 0;

                var rpList = new List<RoutingPoint>();
                var distanceSegments = new List<RouteSegment>();
                var routingPathList = new List<RoutingPath>();

                if (distanceEntity != null)
                {
                    distance = (int)distanceEntity.Distance;

                    if (distanceEntity.xmldata != null)
                    {
                        var root = JsonConvert.DeserializeObject<Root>(distanceEntity.xmldata);

                        // Accessing the list of waypoints
                        if (root?.Section?.WPList != null)
                        {
                            var waypoints = root.Section.WPList;

                            var waypointNames = waypoints.Where(x => !string.IsNullOrEmpty(x.Name)).Select(wp => wp.Name).Distinct().ToList();

                            foreach (var wpName in waypointNames)
                            {
                                var grpItem = rpGroupList.LastOrDefault(rp => rp.RpName.Trim().ToUpper() == wpName.Trim().ToUpper());
                                if (grpItem != null)
                                {
                                    //fromSegment
                                    var frmSegment = new RouteSegment
                                    {
                                        FromPort = portPair.FromPort ?? string.Empty,
                                        ToPort = wpName ?? string.Empty,
                                    };

                                    // Find index of target
                                    var rpIndex = waypoints.FindLastIndex(c => c.Name.Equals(wpName, StringComparison.OrdinalIgnoreCase));

                                    //Console.WriteLine($"Waypoint: {wpName}, Index: {rpIndex}, Total waypoints: {waypoints.Count}");

                                    if (rpIndex >= 0 && rpIndex < waypoints.Count)
                                    {
                                        // FromSegment: from start to current waypoint (exclusive)
                                        if (rpIndex > 0)
                                        {
                                            //Console.WriteLine($"FromSegment GetRange(0, {rpIndex})");
                                            frmSegment.Distance = waypoints.GetRange(0, rpIndex + 1).ToList().Sum(x => x.DistanceValue);
                                        }
                                        else
                                        {
                                            frmSegment.Distance = 0;
                                        }

                                        //To Segment
                                        var toSegment = new RouteSegment
                                        {
                                            FromPort = wpName ?? string.Empty,
                                            ToPort = portPair.ToPort ?? string.Empty,
                                        };

                                        // ToSegment: from current waypoint (exclusive) to end
                                        var startIndex = rpIndex + 1;
                                        var remainingCount = waypoints.Count - startIndex;

                                        //Console.WriteLine($"ToSegment startIndex: {startIndex}, remainingCount: {remainingCount}, waypoints.Count: {waypoints.Count}");

                                        if (remainingCount > 0 && startIndex < waypoints.Count)
                                        {
                                            Console.WriteLine($"ToSegment GetRange({startIndex}, {remainingCount})");
                                            toSegment.Distance = waypoints.GetRange(startIndex, remainingCount).ToList().Sum(x => x.DistanceValue);
                                        }
                                        else
                                        {
                                            toSegment.Distance = 0;
                                        }

                                        distanceSegments.Add(frmSegment);
                                        distanceSegments.Add(toSegment);
                                    }

                                    // Create routing point item

                                    var rpItem = new RoutingPoint
                                    {
                                        Name = wpName,
                                        AddToRotation = rpsToIntoRotation.Contains(wpName.Trim().ToUpper())
                                    };
                                    rpList.Add(rpItem);

                                    // Get alternate routing points from the same group
                                    var alternateList = rpGroupList.Where(rp => rp.GroupId == grpItem.GroupId && rp.RpName.ToUpper() != wpName.ToUpper()).ToList();

                                    foreach (var alt in alternateList)
                                    {
                                        rpItem.AlternateRPs.Add(new RoutingPoint
                                        {
                                            Name = alt.RpName,
                                        });
                                    }
                                }
                            }
                      
                      
                            using var doc = JsonDocument.Parse(distanceEntity.xmldata); 

                            foreach (var wp in doc.RootElement
                                                .GetProperty("Section")
                                                .GetProperty("WPList").EnumerateArray())
                            {
                                routingPathList.Add(new RoutingPath
                                {
                                    Name = wp.GetProperty("name").GetString(),
                                    Latitude = Convert.ToDecimal(wp.GetProperty("lat").GetString().Replace(",", ".")),
                                    Longitude = Convert.ToDecimal(wp.GetProperty("lon").GetString().Replace(",", ".")),
                                });
                            }
                        }
                    }
                }

                // Create distance result object
                var distanceObj = new DistanceResult
                {
                    FromPort = portPair.FromPort ?? string.Empty,
                    ToPort = portPair.ToPort ?? string.Empty,
                    Distance = distance,
                    RoutingPoints = rpList,
                    RouteSegments = distanceSegments,
                    RoutingPath = routingPathList
                };

                result.Add(distanceObj);
            }

            return result;
        }

        /// <summary>
        /// Reads routing point groups from embedded routingPointGroup.json resource
        /// Returns a list of routing point groups for navigation calculations
        /// </summary>
        public async Task<List<RoutingPointGroup>> GetRoutingPointGroupsAsync()
        {
            try
            {
                var assembly = System.Reflection.Assembly.GetExecutingAssembly();
                var resourceName = "ShipnetFunctionApp.Registers.Services.routingPointGroup.json";

                using var stream = assembly.GetManifestResourceStream(resourceName);
                if (stream == null)
                {
                    return new List<RoutingPointGroup>();
                }

                using var reader = new StreamReader(stream);
                var jsonContent = await reader.ReadToEndAsync();

                if (string.IsNullOrWhiteSpace(jsonContent))
                {
                    return new List<RoutingPointGroup>();
                }

                var routingPointGroups = System.Text.Json.JsonSerializer.Deserialize<List<RoutingPointGroup>>(jsonContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return routingPointGroups ?? new List<RoutingPointGroup>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading routing point groups from embedded resource: {ex.Message}");
                return new List<RoutingPointGroup>();
            }
        }

        /// <summary>
        /// Gets routing points by group ID
        /// </summary>
        public async Task<List<RoutingPointGroup>> GetRoutingPointsByGroupIdAsync(int groupId)
        {
            var allRoutingPoints = await GetRoutingPointGroupsAsync();
            return allRoutingPoints.Where(rp => rp.GroupId == groupId).ToList();
        }

        /// <summary>
        /// Gets default routing points (where IsDefault = 1)
        /// </summary>
        public async Task<List<RoutingPointGroup>> GetDefaultRoutingPointsAsync()
        {
            var allRoutingPoints = await GetRoutingPointGroupsAsync();
            return allRoutingPoints.Where(rp => rp.IsDefault == 1).ToList();
        }

        /// <summary>
        /// Gets routing points that should be added to rotation
        /// </summary>
        public async Task<List<RoutingPointGroup>> GetRoutingPointsForRotationAsync()
        {
            var allRoutingPoints = await GetRoutingPointGroupsAsync();
            return allRoutingPoints.Where(rp => rp.AddToRotation == true).ToList();
        }
    }


    // Classes for XML data deserialization
    public class Root
    {
        public Section? Section { get; set; }
    }

    public class Section
    {
        public List<WayPoint>? WPList { get; set; }
    }


    public class WayPoint
    {
        public string? Name { get; set; }
        public string Distance { get; set; }

        public int DistanceValue
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Distance))
                    return 0;

                // Handle decimal numbers by converting to double first, then to int
                var cleanDistance = Distance.Replace(",", ".").Trim();
                if (double.TryParse(cleanDistance, System.Globalization.NumberStyles.Float, 
                    System.Globalization.CultureInfo.InvariantCulture, out double doubleValue))
                {
                    return (int)Math.Round(doubleValue);
                }
                return 0;
            }
        }
    }
}
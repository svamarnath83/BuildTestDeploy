import { PortCall, BunkerRate, BunkerConsumption, Vessel, DistanceResult, RoutingPoint } from './models';
import { createApiClient, getApiUrl } from '@commercialapp/ui';
import { API_CONFIG } from '@commercialapp/ui/config/api';


// Enhanced distance cache for storing port-to-port distances with routing points
const distanceCache = new Map<string, DistanceResult>();

// Call tracking to prevent infinite loops
// const recentApiCalls = new Map<string, number>(); // Track recent calls with timestamps

// Debug flag - set to true to disable distance API calls temporarily
// const DISABLE_DISTANCE_API = false;

/**
 * Process initial API response and insert routing points based on AddToRotation
 */
export function processInitialApiResponseAndInsertRoutingPoints(
  schedule: PortCall[], 
  apiResponse: DistanceResult[]
): PortCall[] {
  console.log('🔄 Processing initial API response and inserting routing points...');
  
  //print schedule
  console.log('schedule', schedule);

  // First, process and cache the API response
  processDistanceApiResponse(apiResponse);
  
  const updatedSchedule = [...schedule];
  
  // Process each port pair and insert routing points where AddToRotation = true
  for (let i = 0; i < updatedSchedule.length - 1; i++) {
    const currentPort = updatedSchedule[i];
    const nextPort = updatedSchedule[i + 1];
    
    //print currentPort
    console.log('currentPort', currentPort);
    //print nextPort
    console.log('nextPort', nextPort);

    if (!currentPort.portName || !nextPort.portName) continue;
    
    // Get distance result for this port pair
    const distanceResult = getDistanceResultFromCache(currentPort.portName, nextPort.portName);
    
            // Assign the distance result to the current port call
        if (distanceResult) {
          updatedSchedule[i] = {
            ...updatedSchedule[i],
            DistanceResult: distanceResult,
            secDistance: distanceResult.SecaDistance || 0
          };
        }
    
    if (distanceResult && distanceResult.RoutingPoints) {
      console.log(`📍 Processing routing points for ${currentPort.portName} → ${nextPort.portName}`);
      
      // Filter routing points that should be added to rotation
      const routingPointsToAdd = distanceResult.RoutingPoints.filter(rp => rp.AddToRotation === true);
      
      if (routingPointsToAdd.length > 0) {
        console.log(`✅ Adding ${routingPointsToAdd.length} routing points with AddToRotation=true`);
        
        // Generate unique IDs
        const existingIds = new Set(updatedSchedule.map(call => call.id));
        
        // Create routing points and insert them
        const newRoutingPoints: PortCall[] = routingPointsToAdd.map((rp, index) => {
          let uniqueId;
          do {
            uniqueId = Date.now() + Math.floor(Math.random() * 1000000) + (index * 10000);
          } while (existingIds.has(uniqueId));
          
          return {
            id: uniqueId,
            portName: rp.Name,
            activity: 'Canal' as const,
            portDays: 0,
            secPortDays: 0,
            additionalCosts: rp.Name.includes('CANAL') ? 0 : 0,
            eta: '',
            etd: '',
            isFixed: false,
            isDeletable: true,
            hfoDays: 0,
            lsfoDays: 0,
            mgoDays: 0,
            distance: 0, // Will be set from RouteSegments later
            secDistance: 0,
            secSteamDays: 0,
            speedSetting: currentPort.speedSetting,
            isRoutingPoint: true,
            currentRoutingPoint: []
          };
        });
        
        // Insert routing points after the current port
        updatedSchedule.splice(i + 1, 0, ...newRoutingPoints);
        
        // Add routing point references to the destination port (ToPort)
        const nextPortIndex = i + 1 + newRoutingPoints.length;
        if (nextPortIndex < updatedSchedule.length) {
          const destinationPort = updatedSchedule[nextPortIndex];
          
          // Collect only alternate routing points from the main routing points
          const alternateRoutingPoints: RoutingPoint[] = [];
          
          // Check if any routing point has alternate routing points and collect them
          distanceResult.RoutingPoints?.forEach((rp) => {
            if (rp.AlternateRPs && rp.AlternateRPs.length > 0) {
              // Add alternate routing points with PortCallId
              rp.AlternateRPs.forEach(altRP => {
                const exists = alternateRoutingPoints.some(existingRP => existingRP.Name === altRP.Name);
                if (!exists) {
                  alternateRoutingPoints.push({
                    ...altRP,
                    PortCallId: 0 
                  });
                }
              });
            }
          });
          
          // Assign the newly added routing points to currentRoutingPoint with their PortCallId
          const currentRoutingPoints = newRoutingPoints.map((rp) => ({
            Name: rp.portName,
            PortCallId: rp.id, // Use the actual ID of the inserted routing point
            AddToRotation: true, // These are routing points that were added to rotation
            AlternateRPs: []
          }));
          
          updatedSchedule[nextPortIndex] = {
            ...destinationPort,
            availableRoutingPoints: alternateRoutingPoints,
            currentRoutingPoint: currentRoutingPoints
          };

          console.log('portcall info:::', updatedSchedule[nextPortIndex] );
          
          const currentRoutingPointNames = currentRoutingPoints.map(rp => rp.Name).join(', ');
          console.log(`📌 Added routing point references to ${destinationPort.portName}: ${alternateRoutingPoints.length} alternate routing points available, ${currentRoutingPoints.length} current routing points assigned: [${currentRoutingPointNames}]`);
        }
        
        // Update indices for subsequent iterations
        i += newRoutingPoints.length;
        
        console.log(`✅ Inserted ${newRoutingPoints.length} routing points between ${currentPort.portName} and ${nextPort.portName}`);
    
    
      } else {
        console.log(`⏭️ No routing points with AddToRotation=true for ${currentPort.portName} → ${nextPort.portName}`);
        
        // Even if no routing points are added, still add the routing point references to the destination port
        const nextPortIndex = i + 1;
        if (nextPortIndex < updatedSchedule.length) {
          const destinationPort = updatedSchedule[nextPortIndex];
          
          // Collect only alternate routing points from the main routing points
          const alternateRoutingPoints: RoutingPoint[] = [];
          
          // Check if any routing point has alternate routing points and collect them
          distanceResult.RoutingPoints?.forEach((rp) => {
            if (rp.AlternateRPs && rp.AlternateRPs.length > 0) {
              // Add alternate routing points with PortCallId
              rp.AlternateRPs.forEach(altRP => {
                const exists = alternateRoutingPoints.some(existingRP => existingRP.Name === altRP.Name);
                if (!exists) {
                  alternateRoutingPoints.push({
                    ...altRP,
                    PortCallId: 0 // No routing points were added, so use 0 as placeholder
                  });
                }
              });
            }
          });
          
          updatedSchedule[nextPortIndex] = {
            ...destinationPort,
            availableRoutingPoints: alternateRoutingPoints
          };
          console.log(`📌 Added routing point references to ${destinationPort.portName}: ${alternateRoutingPoints.length} alternate routing points available (not added to rotation)`);
        }
      }
    }
  }
  
  console.log('✅ Initial API response processing and routing point insertion complete');
  return updatedSchedule;
}

/**
 * Process port call distances by calling the API and handling routing points
 */
export async function ProcessPortCallDistance(
    schedule: PortCall[],
    bunkerRates: BunkerRate[],
    vessel: Vessel
  ): Promise<PortCall[]> {
    console.log('🔄 ProcessPortCallDistance: Starting distance processing...');
    
    // Input validation
    if (!schedule || schedule.length === 0) {
      console.warn('⚠️ ProcessPortCallDistance: Empty schedule provided');
      return schedule;
    }
    
    if (!bunkerRates || bunkerRates.length === 0) {
      console.warn('⚠️ ProcessPortCallDistance: No bunker rates provided');
      return schedule;
    }
    
    if (!vessel) {
      console.warn('⚠️ ProcessPortCallDistance: No vessel provided');
      return schedule;
    }
    
    try {
      // Get all port names from schedule (excluding routing points)
      const distanceData = convertScheduleToPortCallDataObject(schedule);
      console.log('distanceData', distanceData);
  
      // Call the backend API
      const shipApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.PORTS));

      const response = await shipApi.post('/getPortDistance', distanceData);
      console.log('✅ API Response received:', response);
      
      // Extract the data from the Axios response
      const apiResponse: DistanceResult[] = response.data;
      
      // Process the API response and insert routing points
      const updatedSchedule = processInitialApiResponseAndInsertRoutingPoints(schedule, apiResponse);
      
      // Call updatePortCallDistances to assign distances and calculate bunker consumption
      const scheduleWithDistances = await updatePortCallDistances(updatedSchedule, bunkerRates, vessel);
  
      // Print scheduleWithDistances
      console.log('scheduleWithDistances', scheduleWithDistances);
      
      console.log('✅ ProcessPortCallDistance: Distance processing completed');
      return scheduleWithDistances;
      
    } catch (error) {
      console.error('❌ ProcessPortCallDistance: Error processing distances:', error);
      // Return original schedule on error to prevent UI from breaking
      console.log('🔄 Returning original schedule due to error');
      return schedule;
    }
  }

  
/**
 * Process API response and store in cache (case-insensitive)
 */
export function processDistanceApiResponse(data: DistanceResult[]): void {
  console.log('🔄 Processing distance API response:', data);
  
  data.forEach((result) => {
    if (result.FromPort && result.ToPort) {
      const fromKey = result.FromPort.trim().toUpperCase();
      const toKey = result.ToPort.trim().toUpperCase();
      const cacheKey = `${fromKey}|${toKey}`;
      
      // Store the result in cache with normalized case
      distanceCache.set(cacheKey, {
        ...result,
        FromPort: fromKey,
        ToPort: toKey
      });
      
      console.log(`✅ Cached: ${fromKey} → ${toKey} (Distance: ${result.Distance}, RPs: ${result.RoutingPoints?.length || 0})`);
      console.log(`📊 Cache size after storing: ${distanceCache.size}`);
      console.log(`📊 Cache contents:`, Array.from(distanceCache.entries()).map(([key, value]) => `${key} => ${value.FromPort} → ${value.ToPort}`));
    }
  });
}

/**
 * Get distance result from cache (case-insensitive)
 */
export function getDistanceResultFromCache(fromPort: string, toPort: string): DistanceResult | null {
  const fromKey = fromPort.trim().toUpperCase();
  const toKey = toPort.trim().toUpperCase();
  const cacheKey = `${fromKey}|${toKey}`;
  
  // First try exact match
  let result = distanceCache.get(cacheKey);
  
  //print distanceCache
  console.log('distanceCache', distanceCache);

  //print cacheKey
  console.log('cacheKey', cacheKey);

  //print result
  console.log('result', result);


  // If not found, try case-insensitive search
  if (!result) {
    console.log(`🔍 No exact match, searching cache entries...`);
    for (const [key, value] of distanceCache.entries()) {
      const [cachedFrom, cachedTo] = key.split('|');
      console.log(`🔍 Checking cache entry: ${cachedFrom} → ${cachedTo} vs ${fromKey} → ${toKey}`);
      if (cachedFrom.toUpperCase() === fromKey && cachedTo.toUpperCase() === toKey) {
        console.log(`✅ Case-insensitive cache match found: ${key}`);
        result = value;
        break;
      }
    }
  }
  
  if (!result) {
    console.log(`❌ No cache match found for ${fromKey} → ${toKey}`);
  }
  
  return result || null;
}


/**
 * Clear the distance cache
 */
export function clearDistanceCache(): void {
    console.log('🧹 Clearing distance cache...');
    const previousSize = distanceCache.size;
    distanceCache.clear();
    console.log(`✅ Distance cache cleared: ${previousSize} entries removed`);
  }
  
  /**
   * Clear all distances from port calls in schedule
   */
  export function clearAllDistancesFromSchedule(schedule: PortCall[]): PortCall[] {
    console.log('🧹 Clearing all distances from schedule...');
    return schedule.map(call => ({
      ...call,
      distance: 0,
      DistanceResult: undefined
    }));
  }
  
  /**
   * Remove all routing points from schedule
   */
  export function removeAllRoutingPointsFromSchedule(schedule: PortCall[]): PortCall[] {
    console.log('🧹 Removing all routing points from schedule...');
    const cleanedSchedule = schedule.filter(call => !call.isRoutingPoint);
    console.log(`✅ Removed ${schedule.length - cleanedSchedule.length} routing points`);
    return cleanedSchedule;
  }


/**
 * Update distances in a port call schedule based on port names
 * Enhanced implementation with routing point logic
 */
export async function updatePortCallDistances(
    schedule: PortCall[], 
    bunkerRates: BunkerRate[], 
    vessel: Vessel
  ): Promise<PortCall[]> {
    console.log('🔄 Starting updatePortCallDistances with routing point logic');
    
    const updatedSchedule = [...schedule];
    
    // Process each port pair and assign distances
    console.log('🔄 Processing port pairs and assigning distances...');
    for (let i = 0; i < updatedSchedule.length - 1; i++) {
      const currentPort = updatedSchedule[i];
      const nextPort = updatedSchedule[i + 1];
      
      if (!currentPort.portName || !nextPort.portName) continue;
      
      // Try to get distance result for this port pair
      let distanceResult = getDistanceResultFromCache(currentPort.portName, nextPort.portName);
      
      // If not found, try to find a cached result that contains this route as part of its segments
      if (!distanceResult) {
        console.log(`🔍 Looking for cached route containing ${currentPort.portName} → ${nextPort.portName}...`);
        
        for (const [cacheKey, cachedResult] of distanceCache.entries()) {
          if (cachedResult.RouteSegments && cachedResult.RouteSegments.length > 0) {
            // Check if this route contains our port pair
            const hasRoute = cachedResult.RouteSegments.some(seg => 
              seg.FromPort.trim().toUpperCase() === currentPort.portName.trim().toUpperCase() &&
              seg.ToPort.trim().toUpperCase() === nextPort.portName.trim().toUpperCase()
            );
            
            if (hasRoute) {
              console.log(`✅ Found route in cache: ${cacheKey}`);
              distanceResult = cachedResult;
              break;
            }
          }
        }
      }
      
      if (distanceResult) {
        console.log(`📍 Processing: ${currentPort.portName} → ${nextPort.portName}`);
        
        // Check if there are routing points between these ports
        const routingPointsBetween = updatedSchedule
          .slice(i + 1)
          .filter(call => call.isRoutingPoint)
          .filter(call => {
            const nextMainPortIndex = updatedSchedule.findIndex((p, idx) => 
              idx > i && !p.isRoutingPoint && p.portName === nextPort.portName
            );
            return nextMainPortIndex === -1 || updatedSchedule.indexOf(call) < nextMainPortIndex;
          });
        
        if (distanceResult.RouteSegments && distanceResult.RouteSegments.length > 0) {
          // Check if there are routing points between these ports
          const routingPointsBetween = updatedSchedule
            .slice(i + 1)
            .filter(call => call.isRoutingPoint)
            .filter(call => {
              const nextMainPortIndex = updatedSchedule.findIndex((p, idx) => 
                idx > i && !p.isRoutingPoint && p.portName === nextPort.portName
              );
              return nextMainPortIndex === -1 || updatedSchedule.indexOf(call) < nextMainPortIndex;
            });
          
          if (routingPointsBetween.length > 0) {
            // Assign distances using RouteSegments
            let currentFromPort = currentPort.portName;
            
            routingPointsBetween.forEach((rp, rpIndex) => {
              // Find the segment for this routing point (case-insensitive)
              const segment = distanceResult.RouteSegments?.find(seg => 
                seg.FromPort.trim().toUpperCase() === currentFromPort.trim().toUpperCase() && 
                seg.ToPort.trim().toUpperCase() === rp.portName.trim().toUpperCase()
              );
              
              if (segment) {
                // Update the routing point's distance
                const rpIndexInSchedule = updatedSchedule.findIndex(call => call.id === rp.id);
                if (rpIndexInSchedule !== -1) {
                  updatedSchedule[rpIndexInSchedule] = {
                    ...rp,
                    distance: segment.Distance,
                    secDistance: segment.SecaDistance || 0
                  };
                  console.log(`✅ Set ${rp.portName} distance to ${segment.Distance} NM (SECA: ${segment.SecaDistance || 0} NM) (from ${currentFromPort} → ${rp.portName})`);
                }
                currentFromPort = rp.portName;
              } else {
                console.log(`⚠️ No route segment found for ${currentFromPort} → ${rp.portName}`);
                console.log(`🔍 Available segments:`, distanceResult.RouteSegments?.map(seg => `${seg.FromPort} → ${seg.ToPort}`));
              }
            });
            
            // Set distance for the final destination port (case-insensitive)
            const finalSegment = distanceResult.RouteSegments?.find(seg => 
              seg.FromPort.trim().toUpperCase() === currentFromPort.trim().toUpperCase() && 
              seg.ToPort.trim().toUpperCase() === nextPort.portName.trim().toUpperCase()
            );
            
            if (finalSegment) {
              updatedSchedule[i + 1] = {
                ...nextPort,
                distance: finalSegment.Distance,
                secDistance: finalSegment.SecaDistance || 0,
                DistanceResult: distanceResult
              };
              console.log(`✅ Set ${nextPort.portName} distance to ${finalSegment.Distance} NM (SECA: ${finalSegment.SecaDistance || 0} NM) (from ${currentFromPort} → ${nextPort.portName})`);
            } else {
              console.log(`⚠️ No final route segment found for ${currentFromPort} → ${nextPort.portName}`);
            }
          } else {
            // No routing points, but we have route segments - find the direct segment
            console.log(`🛤️ No routing points between ${currentPort.portName} and ${nextPort.portName}, looking for direct segment`);
            
            const directSegment = distanceResult.RouteSegments?.find(seg => 
              seg.FromPort.trim().toUpperCase() === currentPort.portName.trim().toUpperCase() && 
              seg.ToPort.trim().toUpperCase() === nextPort.portName.trim().toUpperCase()
            );
            
            if (directSegment) {
              updatedSchedule[i + 1] = {
                ...nextPort,
                distance: directSegment.Distance,
                secDistance: directSegment.SecaDistance || 0,
                DistanceResult: distanceResult
              };
              console.log(`✅ Set ${nextPort.portName} distance to ${directSegment.Distance} NM (SECA: ${directSegment.SecaDistance || 0} NM) (direct segment: ${currentPort.portName} → ${nextPort.portName})`);
            } else {
              console.log(`⚠️ No direct route segment found for ${currentPort.portName} → ${nextPort.portName}`);
              console.log(`🔍 Available segments:`, distanceResult.RouteSegments?.map(seg => `${seg.FromPort} → ${seg.ToPort}`));
              // Fallback to total distance
              updatedSchedule[i + 1] = {
                ...nextPort,
                distance: distanceResult.Distance,
                secDistance: distanceResult.SecaDistance || 0,
                DistanceResult: distanceResult
              };
              console.log(`✅ Set ${nextPort.portName} distance to ${distanceResult.Distance} NM (SECA: ${distanceResult.SecaDistance || 0} NM) (fallback to total distance)`);
            }
          }
        } else {
          // No route segments, use total distance
          updatedSchedule[i + 1] = {
            ...nextPort,
            distance: distanceResult.Distance,
            secDistance: distanceResult.SecaDistance || 0,
            DistanceResult: distanceResult
          };
          console.log(`✅ Set ${nextPort.portName} distance to ${distanceResult.Distance} NM (SECA: ${distanceResult.SecaDistance || 0} NM) (no route segments available)`);
        }
      } else {
        console.log(`⚠️ No distance data found for ${currentPort.portName} → ${nextPort.portName}`);
        console.log(`🔄 This should be handled by ProcessPortCallDistance which calls the API first`);
      }
    }
    
    // Calculate bunker consumption for each port call
    console.log('🛢️ Calculating bunker consumption...');
    for (let i = 0; i < updatedSchedule.length; i++) {
      const portCall = updatedSchedule[i];
      
      const bunkerConsumption = calculateBunkerConsumption(
        portCall,
        bunkerRates,
        vessel,
        i,
        updatedSchedule
      );
      
      updatedSchedule[i] = {
        ...portCall,
        bunkerConsumption
      };
    }
    
    console.log('✅ updatePortCallDistances completed');

    console.log('updatedSchedule:::', updatedSchedule);
    return updatedSchedule;
  }
  
  
  
  /**
   * Add routing point from available options
   */
  export function addRoutingPointFromAvailable(
    schedule: PortCall[], 
    mainPortIndex: number, 
    selectedRoutingPoint: RoutingPoint
  ): PortCall[] {
  
    const newSchedule = [...schedule];
    
    // Find the ToPort (destination port) - it's the next non-routing point after the main port
    let toPortIndex = mainPortIndex + 1;
    while (toPortIndex < newSchedule.length && newSchedule[toPortIndex].isRoutingPoint) {
      toPortIndex++;
    }
    
    if (toPortIndex >= newSchedule.length) {
      const currentPort = newSchedule[mainPortIndex];
      
      newSchedule[mainPortIndex] = {
        ...currentPort
      };
      
      // For the last port, we need to find and remove routing points that come before it
      // Find the previous main port to get the correct distance result
      let previousMainPortIndex = mainPortIndex - 1;
      while (previousMainPortIndex >= 0 && newSchedule[previousMainPortIndex].isRoutingPoint) {
        previousMainPortIndex--;
      }
      
      if (previousMainPortIndex < 0) {
        console.log('⚠️ No previous main port found for last port');
        return newSchedule;
      }
      
      const previousMainPort = newSchedule[previousMainPortIndex];
      const lastPort = newSchedule[mainPortIndex];
      const distanceResult = getDistanceResultFromCache(previousMainPort.portName, lastPort.portName);
      
      // Assign the distance result to the previous main port call
      if (distanceResult) {
        newSchedule[previousMainPortIndex] = {
          ...newSchedule[previousMainPortIndex],
          DistanceResult: distanceResult
        };
      }
      
      const routingPointsToRemove: number[] = [];
      
      if (distanceResult && distanceResult.RoutingPoints) {
        // Check which routing points are actually part of the route to this port
        const routeRoutingPoints = distanceResult.RoutingPoints.map(rp => rp.Name);
        
        // Only remove routing points that are between the previous main port and the last port
        for (let i = previousMainPortIndex + 1; i < mainPortIndex; i++) {
          if (newSchedule[i].isRoutingPoint) {
            const currentRP = newSchedule[i];
            // Only remove routing points that are part of the route to this port
            if (routeRoutingPoints.includes(currentRP.portName)) {
              console.log(`🎯 Found routing point ${currentRP.portName} that is part of route to ${lastPort.portName} (last port)`);
              routingPointsToRemove.push(i);
            } else {
              console.log(`⏭️ Skipping routing point ${currentRP.portName} - not part of route to ${lastPort.portName} (last port)`);
            }
          }
        }
        console.log(`⚠️ No distance result found for ${lastPort.portName} (last port), removing all routing points before it`);
        // Fallback: remove all routing points before the last port
        for (let i = 0; i < mainPortIndex; i++) {
          if (newSchedule[i].isRoutingPoint) {
            routingPointsToRemove.push(i);
          }
        }
      }
      
      // Remove routing points in reverse order to maintain correct indices
      routingPointsToRemove.reverse().forEach(index => {
        const removedRP = newSchedule[index];
        console.log(`🗑️ Removing routing point ${removedRP.portName} from index ${index} (last port case)`);
        newSchedule.splice(index, 1);
      });
      
                console.log(`✅ Removed ${routingPointsToRemove.length} routing points (last port)`);
      return newSchedule;
    }
    
    const toPort = newSchedule[toPortIndex];
    console.log(`📍 Found ToPort: ${toPort.portName} at index ${toPortIndex}`);
    
    // Update the ToPort (no ExceptionRPs needed)
    newSchedule[toPortIndex] = {
      ...toPort
    };
    
    // Find and remove routing points that are specifically part of the route to this ToPort
    const routingPointsToRemove: number[] = [];
    
    // Get the distance result to understand the routing structure
    const mainPort = newSchedule[mainPortIndex];
    const distanceResult = getDistanceResultFromCache(mainPort.portName, toPort.portName);
    
    // Assign the distance result to the main port call
    if (distanceResult) {
      newSchedule[mainPortIndex] = {
        ...newSchedule[mainPortIndex],
        DistanceResult: distanceResult
      };
    }
    
    if (distanceResult && distanceResult.RoutingPoints) {
      // Check which routing points are actually part of the route to this ToPort
      const routeRoutingPoints = distanceResult.RoutingPoints.map(rp => rp.Name);
      
      for (let i = mainPortIndex + 1; i < toPortIndex; i++) {
        if (newSchedule[i].isRoutingPoint) {
          const currentRP = newSchedule[i];
          // Only remove routing points that are part of the route to this specific ToPort
          if (routeRoutingPoints.includes(currentRP.portName)) {
            console.log(`🎯 Found routing point ${currentRP.portName} that is part of route to ${toPort.portName}`);
            routingPointsToRemove.push(i);
          } else {
            console.log(`⏭️ Skipping routing point ${currentRP.portName} - not part of route to ${toPort.portName}`);
          }
        }
      }
    } else {
      console.log(`⚠️ No distance result found for ${mainPort.portName} → ${toPort.portName}, removing all routing points between them`);
      // Fallback: remove all routing points between main port and ToPort
      for (let i = mainPortIndex + 1; i < toPortIndex; i++) {
        if (newSchedule[i].isRoutingPoint) {
          routingPointsToRemove.push(i);
        }
      }
    }
    
    // Also check if there are routing points between the previous port and the current port (mainPort)
    // Find the previous main port
    let previousMainPortIndex = mainPortIndex - 1;
    while (previousMainPortIndex >= 0 && newSchedule[previousMainPortIndex].isRoutingPoint) {
      previousMainPortIndex--;
    }
    
    if (previousMainPortIndex >= 0) {
      const previousMainPort = newSchedule[previousMainPortIndex];
      const previousDistanceResult = getDistanceResultFromCache(previousMainPort.portName, mainPort.portName);
      
      // Assign the previous distance result to the previous main port call
      if (previousDistanceResult) {
        newSchedule[previousMainPortIndex] = {
          ...newSchedule[previousMainPortIndex],
          DistanceResult: previousDistanceResult
        };
      }
      
      if (previousDistanceResult && previousDistanceResult.RoutingPoints) {
        const previousRouteRoutingPoints = previousDistanceResult.RoutingPoints.map(rp => rp.Name);
        
        // Check routing points between previous main port and current main port
        for (let i = previousMainPortIndex + 1; i < mainPortIndex; i++) {
          if (newSchedule[i].isRoutingPoint) {
            const currentRP = newSchedule[i];
            if (previousRouteRoutingPoints.includes(currentRP.portName)) {
              console.log(`🎯 Found routing point ${currentRP.portName} that is part of route from ${previousMainPort.portName} to ${mainPort.portName}`);
              routingPointsToRemove.push(i);
            } else {
              console.log(`⏭️ Skipping routing point ${currentRP.portName} - not part of route from ${previousMainPort.portName} to ${mainPort.portName}`);
            }
          }
        }
      }
    }
    
    // Remove routing points in reverse order to maintain correct indices
    routingPointsToRemove.reverse().forEach(index => {
      const removedRP = newSchedule[index];
      console.log(`🗑️ Removing routing point ${removedRP.portName} from index ${index} (route to ${toPort.portName})`);
      newSchedule.splice(index, 1);
    });
    
    // Clear distances from the schedule since routing points were removed
    console.log(`🧹 Clearing distances from schedule due to routing point removal`);
    newSchedule.forEach(call => {
      call.distance = 0;
    });
    
    console.log(`✅ Removed ${routingPointsToRemove.length} routing points from schedule`);
    return newSchedule;
  }
  
  
  
  /**
   * Find routing point by ID in schedule
   */
  export function findRoutingPointById(schedule: PortCall[], routingPointId: number): PortCall | undefined {
    return schedule.find(call => call.id === routingPointId && call.isRoutingPoint);
  }
  
  /**
   * Check if a routing point is currently selected for a port
   */
  export function isRoutingPointSelected(portCall: PortCall, routingPointId: number): boolean {
    return portCall.currentRoutingPoint?.some(rp => rp.PortCallId === routingPointId) || false;
  }

  
/**
 * Convert schedule to port call data format with FromPort, ToPort, and RoutingPoints
 */
export function convertScheduleToPortCallData(schedule: PortCall[]): Array<{
    FromPort: string;
    ToPort: string;
    RoutingPoints: RoutingPoint[];
  }> {
    const portCallData: Array<{
      FromPort: string;
      ToPort: string;
      RoutingPoints: RoutingPoint[];
    }> = [];
  
    for (let i = 0; i < schedule.length - 1; i++) {
      const currentPort = schedule[i];
      const nextPort = schedule[i + 1];
  
      if (!currentPort.portName || !nextPort.portName) continue;
  
      // Get routing points from the ToPort's availableRoutingPoints
      const routingPoints = nextPort.availableRoutingPoints || [];
  
      portCallData.push({
        FromPort: currentPort.portName,
        ToPort: nextPort.portName,
        RoutingPoints: routingPoints
      });
    }
  
    return portCallData;
  }



/**
 * Get port call data for a specific port pair
 */
export function getPortCallDataForPair(
    schedule: PortCall[], 
    fromPortName: string, 
    toPortName: string
  ): {
    FromPort: string;
    ToPort: string;
    RoutingPoints: RoutingPoint[];
  } | null {
    for (let i = 0; i < schedule.length - 1; i++) {
      const currentPort = schedule[i];
      const nextPort = schedule[i + 1];
  
      if (currentPort.portName === fromPortName && nextPort.portName === toPortName) {
        return {
          FromPort: currentPort.portName,
          ToPort: nextPort.portName,
          RoutingPoints: nextPort.availableRoutingPoints || []
        };
      }
    }
  
    return null;
  }

  

/**
 * Get current routing points for a specific port pair
 */
export function getCurrentRoutingPointsForPair(
    schedule: PortCall[], 
    fromPortName: string, 
    toPortName: string
  ): RoutingPoint[] {
    for (let i = 0; i < schedule.length - 1; i++) {
      const currentPort = schedule[i];
      const nextPort = schedule[i + 1];
  
      if (currentPort.portName === fromPortName && nextPort.portName === toPortName) {
        return nextPort.currentRoutingPoint || [];
      }
    }
  
    return [];
  }



/**
 * Convert schedule to JSON string format with FromPort, ToPort, and RoutingPoint
 */
export function convertScheduleToJsonString(schedule: PortCall[]): string {
    const portCallData: Array<{
      FromPort: string;
      ToPort: string;
      RoutingPoint: string;
    }> = [];
  
    for (let i = 0; i < schedule.length - 1; i++) {
      const currentPort = schedule[i];
      const nextPort = schedule[i + 1];
  
      if (!currentPort.portName || !nextPort.portName) continue;
  
      // Get the current routing point name (first one if multiple)
      let routingPointName = "";
      if (nextPort.currentRoutingPoint && nextPort.currentRoutingPoint.length > 0) {
        routingPointName = nextPort.currentRoutingPoint[0].Name;
      }
  
      portCallData.push({
        FromPort: currentPort.portName,
        ToPort: nextPort.portName,
        RoutingPoint: routingPointName
      });
    }
  
    return JSON.stringify(portCallData, null, 2);
  }

  

/**
 * Convert schedule to port call data object format (not JSON string)
 */
export function convertScheduleToPortCallDataObject(schedule: PortCall[]): Array<{
    FromPort: string;
    ToPort: string;
    RoutingPoint: string;
  }> {
    const portCallData: Array<{
      FromPort: string;
      ToPort: string;
      RoutingPoint: string;
    }> = [];
  
    for (let i = 0; i < schedule.length - 1; i++) {
      const currentPort = schedule[i];
      const nextPort = schedule[i + 1];
  
      if (!currentPort.portName || !nextPort.portName) continue;
  
      // Get the current routing point name (first one if multiple)
      let routingPointName = "";
      if (nextPort.currentRoutingPoint && nextPort.currentRoutingPoint.length > 0) {
        routingPointName = nextPort.currentRoutingPoint[0].Name;
      }
  
      portCallData.push({
        FromPort: currentPort.portName,
        ToPort: nextPort.portName,
        RoutingPoint: routingPointName
      });
    }
  
    return portCallData;
  }



/**
 * Handle switching routing point for a port
 */
export function handleSwitchRoutingPoint(
    schedule: PortCall[],
    selectedPortIndex: number,
    selectedRoutingPoint: RoutingPoint
  ): PortCall[] {
    console.log(`🔄 Switching routing point for port ${schedule[selectedPortIndex].portName} to ${selectedRoutingPoint.Name}`);
    
    const newSchedule = [...schedule];
    const selectedPortCall = newSchedule[selectedPortIndex];
  
    console.log('selectedPortCall before switch :::', selectedPortCall);
  
    // 1. Add selectedPortCall.routingPoint into selectedPortCall.availableRoutingPoints
    const currentRoutingPoints = selectedPortCall.currentRoutingPoint || [];
    const updatedAvailableRoutingPoints = [...(selectedPortCall.availableRoutingPoints || [])];
    
    // Add current routing points to available routing points
    currentRoutingPoints.forEach(rp => {
      const exists = updatedAvailableRoutingPoints.some(availableRP => availableRP.Name === rp.Name);
      if (!exists) {
        updatedAvailableRoutingPoints.push(rp);
      }
    });
    
    // 2. Add selectedRoutingPoint into selectedPortCall.currentRoutingPoint
    const updatedCurrentRoutingPoint = [{
      Name: selectedRoutingPoint.Name,
      PortCallId: selectedRoutingPoint.PortCallId,
      AddToRotation: selectedRoutingPoint.AddToRotation,
      AlternateRPs: selectedRoutingPoint.AlternateRPs || []
    }];
    
    // 3. Remove schedule items where id exists in selectedPortCall.currentRoutingPoint list
    const routingPointIdsToRemove = currentRoutingPoints.map(rp => rp.PortCallId);
    const indicesToRemove: number[] = [];
    
    console.log(`🔍 Looking for routing points to remove:`, routingPointIdsToRemove);
    console.log(`🔍 Current schedule before removal:`, newSchedule.map(call => ({ id: call.id, portName: call.portName, isRoutingPoint: call.isRoutingPoint })));
    
    // Find indices of routing points to remove
    newSchedule.forEach((call, index) => {
      if (routingPointIdsToRemove.includes(call.id) && call.isRoutingPoint) {
        indicesToRemove.push(index);
        console.log(`🎯 Found routing point to remove: ${call.portName} (ID: ${call.id}) at index ${index}`);
      }
    });
    
    // Remove routing points in reverse order to maintain correct indices
    indicesToRemove.reverse().forEach(index => {
      const removedRP = newSchedule[index];
      console.log(`🗑️ Removing routing point ${removedRP.portName} from index ${index}`);
      newSchedule.splice(index, 1);
    });
    
    // Also clear currentRoutingPoint references to removed routing points in other ports
    newSchedule.forEach(call => {
      if (call.currentRoutingPoint && call.currentRoutingPoint.length > 0) {
        call.currentRoutingPoint = call.currentRoutingPoint.filter(rp => 
          !routingPointIdsToRemove.includes(rp.PortCallId)
        );
      }
    });
    
    // 4. Update the selected port call with new routing point configuration
    // Find the correct index after removals
    const updatedSelectedPortIndex = newSchedule.findIndex(call => call.id === selectedPortCall.id);
    if (updatedSelectedPortIndex !== -1) {
      newSchedule[updatedSelectedPortIndex] = {
        ...selectedPortCall,
        availableRoutingPoints: updatedAvailableRoutingPoints,
        currentRoutingPoint: updatedCurrentRoutingPoint
      };
    } else {
      console.warn(`⚠️ Could not find selected port ${selectedPortCall.portName} after routing point removal`);
    }
    
    // 5. Remove distances for all ports
    console.log(`🧹 Clearing distances from schedule due to routing point switch`);
    newSchedule.forEach(call => {
      call.distance = 0;
    });
  
    console.log('selectedPortCall after switch :::', selectedPortCall);
  
    console.log(`✅ Switched routing point for ${selectedPortCall.portName} to ${selectedRoutingPoint.Name}`);
    return newSchedule;
  }


/**
 * Add a new port call to the schedule
 */
export function addPortCallToSchedule(schedule: PortCall[], index: number): PortCall[] {
    const newSchedule = [...schedule];
    
    // Generate truly unique ID using robust approach
    const existingIds = new Set(newSchedule.map(call => call.id));
    let newId;
    do {
      newId = Date.now() + Math.floor(Math.random() * 1000000);
    } while (existingIds.has(newId));
    
    const newPortCall: PortCall = {
      id: newId,
      portName: '',
      activity: 'Bunker',
      portDays: 1,
      secPortDays: 0,
      additionalCosts: 0,
      eta: '',
      etd: '',
      isFixed: false,
      isDeletable: true,
      hfoDays: 0,
      lsfoDays: 0,
      mgoDays: 0,
      distance: 0,
      secDistance: 0,
      secSteamDays: 0,
      speedSetting: 'Ballast',
      currentRoutingPoint: [],
      bunkerConsumption: []
    };
    newSchedule.splice(index + 1, 0, newPortCall);
    return newSchedule;
  }
  
  /**
   * Remove a port call from the schedule
   */
  export function removePortCallFromSchedule(schedule: PortCall[], id: number): PortCall[] {
    return schedule.filter(call => call.id !== id);
  }
  
/**
 * Calculate bunker consumption for a single port call
 */
export function calculateBunkerConsumption(
  portCall: PortCall,
  bunkerRates: BunkerRate[],
  vessel: Vessel,
  portIndex: number,
  schedule: PortCall[]
): BunkerConsumption[] {
  const speed = portCall.speedSetting === 'Ballast' ? (vessel.ballastSpeed || 12) : (vessel.ladenSpeed || 14);
  const steamingTime = speed > 0 ? portCall.distance / (speed * 24) : 0; // Days
  
  // Find the first load port to determine if we're before or after loading
  const firstLoadPortIndex = schedule.findIndex(call => call.activity === 'Load');
  const isBeforeFirstLoad = firstLoadPortIndex === -1 || portIndex < firstLoadPortIndex;
  
  return bunkerRates.map(bunker => {

    const isEuropePort = !!portCall.europe;

    let effectivePortDays = portCall.portDays;
    
    if (bunker.isPrimary) {
      effectivePortDays = portCall.portDays - (portCall.secPortDays || 0);
    }
    else{
      if (bunkerRates.some(b => b.isPrimary)) {
        if (isEuropePort) {
          effectivePortDays = portCall.secPortDays || 0;
        }
      }
      else{
        effectivePortDays = portCall.portDays;
      }
    }

    // Port consumption: use portConsumption from bunker rate
    const portConsumptionBase = bunker.portConsumption * effectivePortDays;
 
    // EU rule: if port is in Europe, secondary grades exist, and this bunker is not primary, set consumption to 0
    let portConsumption = portConsumptionBase;

    // Steam consumption: use ballast rates if before first load, laden rates if after
    const steamConsumptionRate = isBeforeFirstLoad 
      ? bunker.ballastPerDayConsumption 
      : bunker.ladenPerDayConsumption;
    
    const steamConsumption = steamConsumptionRate * steamingTime;

    //print portname and distance
    return {
      grade: bunker.grade,
      portConsumption: Math.round(portConsumption * 100) / 100,
      steamConsumption: Math.round(steamConsumption * 100) / 100
    };
  });
}

/**
 * Calculate bunker consumption for entire schedule
 */
export function calculateBunkerConsumptionForSchedule(
  schedule: PortCall[], 
  bunkerRates: BunkerRate[], 
  vessel: Vessel
): PortCall[] {
  
  const updatedSchedule = [...schedule];
  
  // Calculate bunker consumption for each port call based on existing distances
  for (let i = 0; i < updatedSchedule.length; i++) {
    const portCall = updatedSchedule[i];
    
    // Calculate bunker consumption based on distance to next port and port days
    const bunkerConsumption = calculateBunkerConsumption(
      portCall,
      bunkerRates,
      vessel,
      i,
      updatedSchedule
    );
    
    updatedSchedule[i] = {
      ...portCall,
      bunkerConsumption
    };
    
    // Calculate steam days for logging
    const speed = portCall.speedSetting === 'Ballast' ? (vessel.ballastSpeed || 12) : (vessel.ladenSpeed || 14);
    const steamDays = speed > 0 ? portCall.distance / (speed * 24) : 0; // Days
    
    // Find the first load port to determine if we're before or after loading
    const firstLoadPortIndex = updatedSchedule.findIndex(call => call.activity === 'Load');
    const isBeforeFirstLoad = firstLoadPortIndex === -1 || i < firstLoadPortIndex;
    const steamRateType = isBeforeFirstLoad ? 'Ballast' : 'Laden';
    
    // Enhanced console.log with detailed bunker consumption by grade
    if (bunkerConsumption.length > 0) {
      bunkerConsumption.forEach(consumption => {
        const total = consumption.portConsumption + consumption.steamConsumption;
        
        // Get the bunker rate for this grade to show the per-day values
        const bunkerRate = bunkerRates.find(b => b.grade === consumption.grade);
        const portConsumptionPerDay = bunkerRate?.portConsumption || 0;
        
        // Determine steam consumption per day based on ballast/laden
        let steamConsumptionPerDayFromRate = 0;
        if (bunkerRate) {
          const firstLoadPortIndex = updatedSchedule.findIndex(call => call.activity === 'Load');
          const isBeforeFirstLoad = firstLoadPortIndex === -1 || i < firstLoadPortIndex;
          steamConsumptionPerDayFromRate = isBeforeFirstLoad 
            ? bunkerRate.ballastPerDayConsumption 
            : bunkerRate.ladenPerDayConsumption;
        }
      });
    } else {
      console.log(`   ⚠️ No bunker consumption data available`);
    }
  }
  
  return updatedSchedule;
}
  

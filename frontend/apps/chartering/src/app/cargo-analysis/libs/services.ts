// Cargo Analysis Services and Business Logic

import { CargoInput, shipAnalysis, PortCall, BunkerRate, FinanceMetrics, EstimateCalculationParams, Vessel, SpeedConsumption } from './models';
import { ANALYSIS_CONSTANTS } from './constants';
import { updatePortCallDistances } from './distanceServices';
import { getShips } from '@commercialapp/ui';
import { getavgBunkrPrice } from './estimate-api-services';

/**
 * Generate ship analysis for a cargo requirement
 */
export async function generateShipAnalysis(
  cargoInput: CargoInput, 
  selectedShipIds?: number[],
  ports?: Array<{ Name: string; IsEurope?: boolean }>
): Promise<shipAnalysis[]> {
  const baseRevenue = cargoInput.quantity * cargoInput.rate;
  const { HOURS_PER_DAY } = ANALYSIS_CONSTANTS;

  const vesselsResponse = await getShips(true);
  let vessels = (vesselsResponse.data || []) as unknown as Vessel[];
  

  // Filter vessels if specific ships are selected
  if (selectedShipIds && selectedShipIds.length > 0) {
    vessels = vessels.filter(vessel => selectedShipIds.includes(vessel.id));
    console.log(`🎯 Filtering analysis to ${vessels.length} selected ships out of ${vesselsResponse.data?.length || 0} total ships`);
  }

  //get avgbunker price from getlatestBunkerPrice 
  const avgBunkerPriceResponse = await getavgBunkrPrice();
  const avgPriceData = avgBunkerPriceResponse.data || [];

  const results = await Promise.all(vessels.map(async (vessel: Vessel) => {
    // Parse vesselJson to get speed consumptions if not already present
    let speedConsumptions = vessel.speedConsumptions || [];
    if (speedConsumptions.length === 0 && vessel.vesselJson) {
      try {
        const parsed = typeof vessel.vesselJson === 'string' ? JSON.parse(vessel.vesselJson) : vessel.vesselJson;
        speedConsumptions = parsed?.speedConsumptions || [];
      } catch (e) {
        console.warn('Failed to parse vesselJson for speed consumptions:', e);
        speedConsumptions = [];
      }
    }

    // Map vessel properties for compatibility
    const mappedVessel = {
      ...vessel,
      vesselName: vessel.name, // Map name to vesselName for UI compatibility
      speedConsumptions: speedConsumptions, // Add parsed speed consumptions
      ballastSpeed: speedConsumptions?.find(sc => sc.mode === 'ballast' && sc.isDefault === true)?.speed || 12,
      ladenSpeed: speedConsumptions?.find(sc => sc.mode === 'laden' && sc.isDefault === true)?.speed || 14
    };



    const dwt = mappedVessel.dwt || 0;
    const ballastSpeed = mappedVessel.ballastSpeed;
    const ladenSpeed = mappedVessel.ladenSpeed || 14;
    const runningCost = mappedVessel.runningCost || 0;
    const ballastDate = mappedVessel.ballastDate || new Date().toISOString().split('T')[0];

    // Build bunker rates from vessel speed consumptions
    const bunkerRates = buildBunkerRatesFromSpeedConsumptions(mappedVessel, ballastSpeed, ladenSpeed);

    //assign bunkergrates.rate from avgbunkerpricesponse.data where Grade = grade from mappedVessel.vesselGrades
    if (avgPriceData && avgPriceData.length > 0) {
      bunkerRates.forEach(bunkerRate => {
        const avgPrice = avgPriceData.find((b: any) =>
          b.Grade?.toLowerCase() === bunkerRate.grade?.toLowerCase()
        )?.AveragePrice || 0;
        bunkerRate.price = Math.floor(avgPrice);
      });
    }

    if (cargoInput.quantity > dwt) {
      return {
        vessel: mappedVessel,
        portCalls: [],
        bunkerRates: bunkerRates,
        financeMetrics: {
          revenue: 0,
          voyageCosts: 0,
          totalOpEx: 0,
          finalProfit: 0,
          tce: 0,
          totalVoyageDuration: 0,
          totalBunkerCost: 0,
          totalAdditionalCosts: 0,
          totalPortDays: 0,
          totalSeaDays: 0,
          margin: 0,
          marginPercent: 0,
          // Add missing properties that UI expects
          duration: 0,
          eta: '',
          profit: 0,
          fuelCost: 0,
          operatingCost: 0,
          totalCost: 0
        },
        suitable: false,
        cargoes: [cargoInput]
      };
    }

    // Calculate sea days (simplified)
    const totalDistance = cargoInput.loadPorts.length * 4000; // Default distance per leg
    const avgSpeed = (ballastSpeed + ladenSpeed) / 2;
    const seaDays = totalDistance / (avgSpeed * HOURS_PER_DAY);

    // Estimate arrival date (simplified)
    const ballastEta = new Date(ballastDate);
    ballastEta.setDate(ballastEta.getDate() + (seaDays / 2));
    const etaString = ballastEta.toISOString().split('T')[0];

    // Create initial port calls schedule
    const initialPortCalls = await createInitialSchedule(mappedVessel, cargoInput, ports);

    return {
      vessel: mappedVessel,
      portCalls: initialPortCalls,
      bunkerRates: bunkerRates,
      financeMetrics: {
        revenue: baseRevenue,
        voyageCosts: 0,
        totalOpEx: runningCost * (seaDays + 4), // Default 4 port days
        finalProfit: baseRevenue - (runningCost * (seaDays + 4)),
        tce: baseRevenue / (seaDays + 4),
        totalVoyageDuration: seaDays + 4,
        totalBunkerCost: 0,
        totalAdditionalCosts: 0,
        totalPortDays: 4, // Default 4 port days
        totalSeaDays: seaDays,
        margin: baseRevenue - (runningCost * (seaDays + 4)),
        marginPercent: ((baseRevenue - (runningCost * (seaDays + 4))) / baseRevenue) * 100,
        // Add missing properties that UI expects
        duration: seaDays + 4,
        eta: etaString,
        profit: baseRevenue - (runningCost * (seaDays + 4)),
        fuelCost: 0,
        operatingCost: runningCost * (seaDays + 4),
        totalCost: runningCost * (seaDays + 4)
      },
      suitable: cargoInput.quantity <= dwt,
      cargoes: [cargoInput]
    };
  }));

  return results;
}


/**
 * Calculate financial metrics for detailed estimate
 */
export function calculateFinancialMetrics(params: EstimateCalculationParams): FinanceMetrics {
  const { shipAnalysis, cargoInput } = params;
  const { portCalls: schedule, bunkerRates, vessel: selectedVessel } = shipAnalysis;

  const totalPortDays = schedule.reduce((acc: number, leg: PortCall) => acc + leg.portDays, 0);

  const totalBunkerCost = bunkerRates.reduce((totalForGrade: number, rate: BunkerRate) => {
    // Calculate total consumption for this grade using bunkerConsumption array
    const totalConsumption = schedule.reduce((consumptionForLeg, leg) => {
      if (leg.bunkerConsumption && leg.bunkerConsumption.length > 0) {
        const consumption = leg.bunkerConsumption.find(c => c.grade === rate.grade);
        if (consumption) {
          return consumptionForLeg + consumption.portConsumption + consumption.steamConsumption;
        }
      }
      return consumptionForLeg;
    }, 0);

    // Cost for this grade
    const costForGrade = totalConsumption * rate.price;

    return totalForGrade + costForGrade;
  }, 0);

  const totalAdditionalCosts = schedule.reduce((acc, call) => acc + call.additionalCosts, 0);

  const totalSeaDays = schedule.reduce((acc: number, leg: PortCall) => {
    const ballastSpeed = selectedVessel.ballastSpeed || 0;
    const ladenSpeed = selectedVessel.ladenSpeed || 0;
    const speed = leg.speedSetting === 'Ballast' ? ballastSpeed : ladenSpeed;
    const steamDays = speed > 0 ? leg.distance / (speed * 24) : 0;
    return acc + steamDays;
  }, 0);


  const totalVoyageDuration = totalSeaDays + totalPortDays;
  
  // Use totalGrossFreight if available, otherwise calculate basic revenue
  const revenue = cargoInput.totalGrossFreight !== undefined && cargoInput.totalGrossFreight > 0 
    ? cargoInput.totalGrossFreight 
    : cargoInput.quantity * cargoInput.rate;
    
  const runningCost = selectedVessel.runningCost || 0;
  const totalOpEx = runningCost * totalVoyageDuration;
  const voyageCosts = totalBunkerCost + totalAdditionalCosts;
  const tce = totalVoyageDuration > 0 ? (revenue - voyageCosts) / totalVoyageDuration : 0;

  const finalProfit = revenue - (totalOpEx + voyageCosts);

  return {
    revenue,
    voyageCosts,
    totalOpEx,
    finalProfit,
    tce,
    totalVoyageDuration,
    totalBunkerCost,
    totalAdditionalCosts,
    totalPortDays,
    totalSeaDays,
    eta: '',
    fuelCost: totalBunkerCost,
    operatingCost: totalOpEx,
    totalCost: totalOpEx + voyageCosts,
    duration: totalVoyageDuration,
    profit: finalProfit,
    margin: revenue > 0 ? (finalProfit / revenue) * 100 : 0
  };
}

/**
 * Recalculate schedule dates based on vessel speeds and distances
 */
export function recalculateScheduleDates(currentSchedule: PortCall[], vessel: Vessel | null): PortCall[] {
  if (!vessel) return currentSchedule;

  const recalculated = [...currentSchedule];

  const formatModelDateTime = (d: Date): string => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const HH = String(d.getHours()).padStart(2, '0');
    const Min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${HH}:${Min}`; // store with space separator (parser supports space or T)
  };

  for (let i = 0; i < recalculated.length; i++) {
    const currentLeg = recalculated[i];

    // DATE CASCADE LOGIC
    if (i > 0) { // All legs after the first one
      const prevLeg = recalculated[i - 1];
      const prevEtdRaw = prevLeg.etd;
      // Support both 'YYYY-MM-DD HH:mm' and 'YYYY-MM-DDTHH:mm'
      const prevEtdIso = prevEtdRaw && prevEtdRaw.includes('T') ? prevEtdRaw : (prevEtdRaw ? prevEtdRaw.replace(' ', 'T') : '');
      const prevEtd = new Date(prevEtdIso);
      // Use CURRENT leg's speed/distance for travel time to this leg
      const ballastSpeed = vessel.ballastSpeed || 12;
      const ladenSpeed = vessel.ladenSpeed || 14;
      const speedForCurrentLeg = currentLeg.speedSetting === 'Ballast' ? ballastSpeed : ladenSpeed;

      if (!isNaN(prevEtd.getTime()) && speedForCurrentLeg > 0) {
        const travelTimeDays = currentLeg.distance / (speedForCurrentLeg * 24);
        const travelMs = travelTimeDays * 24 * 60 * 60 * 1000;
        const newEta = new Date(prevEtd.getTime() + travelMs);
        currentLeg.eta = formatModelDateTime(newEta);
      }
    }

    // Recalculate ETD for current leg based on its own ETA and portDays
    const currentEtaRaw = currentLeg.eta;
    const currentEtaIso = currentEtaRaw && currentEtaRaw.includes('T') ? currentEtaRaw : (currentEtaRaw ? currentEtaRaw.replace(' ', 'T') : '');
    const currentEta = new Date(currentEtaIso);
    if (!isNaN(currentEta.getTime())) {
      const newEtd = new Date(currentEta);
      newEtd.setDate(newEtd.getDate() + currentLeg.portDays);
      currentLeg.etd = formatModelDateTime(newEtd);
    }

    // HFO DEFAULT LOGIC
    const ballastSpeed = vessel.ballastSpeed || 12;
    const ladenSpeed = vessel.ladenSpeed || 14;
    const speedForThisLeg = currentLeg.speedSetting === 'Ballast' ? ballastSpeed : ladenSpeed;
    if (speedForThisLeg > 0) {
      const steamingTime = currentLeg.distance / (speedForThisLeg * 24);
      if (currentLeg.hfoDays === 0 && currentLeg.lsfoDays === 0 && currentLeg.mgoDays === 0) {
        currentLeg.hfoDays = steamingTime;
      }
    }
  }
  return recalculated;
}

/**
 * Create initial schedule for a vessel
 */
export async function createInitialSchedule(
  selectedVessel: Vessel, 
  cargoInput: CargoInput, 
  ports?: Array<{ Name: string; IsEurope?: boolean; Id?: number }>
): Promise<PortCall[]> {
  const ballastPort = selectedVessel.ballastPort || 'Unknown Port';
  const ballastDate = selectedVessel.ballastDate || new Date().toISOString().split('T')[0];

  // Calculate total ports for speed assignment logic
  const totalLoadPorts = cargoInput.loadPorts.length;
  const totalDischargePorts = cargoInput.dischargePorts.length;

  // Helper function to get europe property for a port
  const getEuropeProperty = (portName: string): boolean => {
    if (!ports) return false;
    const port = ports.find(p => p.Name === portName);
    return port?.IsEurope === true;
  };

  const initialSchedule: PortCall[] = [
    {
      id: 1,
      portName: ballastPort,
      activity: 'Ballast',
      portDays: 0,
      secPortDays: 0,
      additionalCosts: 0,
      eta: '',
      etd: ballastDate,
      isFixed: true,
      isDeletable: false,
      hfoDays: 0,
      lsfoDays: 0,
      mgoDays: 0,
      distance: 0,
      secDistance: 0,
      secSteamDays: 0,
      speedSetting: 'Ballast', // Use case 1: Ballast speed until first load port
      currentRoutingPoint: [],
      bunkerConsumption: [],
      europe: getEuropeProperty(ballastPort) // ✅ Set europe property for ballast port
    },
    ...cargoInput.loadPorts.map((portName: string, index: number) => ({
      id: 2 + index,
      portId: ports?.find(p => (p.Name || '').trim().toLowerCase() === (portName || '').trim().toLowerCase())?.Id,
      portName: portName,
      activity: 'Load' as const,
      portDays: 0,
      secPortDays: 0,
      additionalCosts: 0,
      eta: '2024-12-25',
      etd: '2024-12-27',
      isFixed: false,
      isDeletable: false,
      hfoDays: 0,
      lsfoDays: 0,
      mgoDays: 0,
      distance: 0,
      secDistance: 0,
      secSteamDays: 0,
      speedSetting: 'Laden' as const, // Use case 2: Laden speed from first load to last discharge
      currentRoutingPoint: [],
      bunkerConsumption: [],
      europe: getEuropeProperty(portName) // ✅ Set europe property for load ports
    })),
    ...cargoInput.dischargePorts.map((portName: string, index: number) => ({
      id: 2 + totalLoadPorts + index,
      portId: ports?.find(p => (p.Name || '').trim().toLowerCase() === (portName || '').trim().toLowerCase())?.Id,
      portName: portName,
      activity: 'Discharge' as const,
      portDays: 0,
      secPortDays: 0,
      additionalCosts: 0,
      eta: '2025-01-05',
      etd: '2025-01-07',
      isFixed: false,
      isDeletable: false,
      hfoDays: 0,
      lsfoDays: 0,
      mgoDays: 0,
      distance: 0,
      secDistance: 0,
      secSteamDays: 0,
      speedSetting: (index === totalDischargePorts - 1 ? 'Ballast' : 'Laden') as 'Ballast' | 'Laden', // Use case 3: After last discharge, use ballast speed
      currentRoutingPoint: [],
      bunkerConsumption: [],
      europe: getEuropeProperty(portName) // ✅ Set europe property for discharge ports
    })),
  ];

  // Auto-lookup distances based on port names, then recalculate dates
  const scheduleWithDistances = await updatePortCallDistances(initialSchedule, [], selectedVessel);
  return recalculateScheduleDates(scheduleWithDistances, selectedVessel);
}

/**
 * Update a specific field in a port call
 */
export function updatePortCallField(
  schedule: PortCall[],
  index: number,
  field: keyof PortCall,
  value: string | number,
  ports?: Array<{ Name: string; IsEurope?: boolean; Id?: number }>
): PortCall[] {
  const newSchedule = [...schedule];
  const updatedPortCall = { ...newSchedule[index] };
  const originalValue = updatedPortCall[field];

  // Update the specific field that was changed
  let numericValue = 0;
  if (field === 'portDays' || field === 'secPortDays' || field === 'additionalCosts' || field === 'distance' || field === 'secDistance' || field === 'secSteamDays') {
    numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    (updatedPortCall as Record<string, unknown>)[field] = numericValue;
  } else if (field === 'eta' || field === 'etd' || field === 'portName' || field === 'activity' || field === 'speedSetting') {
    (updatedPortCall as Record<string, unknown>)[field] = value as string;
    
    // When port name changes, automatically set the europe and portId properties from ports list
    if (field === 'portName' && typeof value === 'string') {
      if (ports) {
        const port = ports.find(p => p.Name === value);
        if (port) {
          (updatedPortCall as Record<string, unknown>).europe = port.IsEurope === true;
          (updatedPortCall as Record<string, unknown>).portId = port.Id;
          console.log('🔍 port props set for:', value, 'IsEurope:', port.IsEurope, 'Id:', port.Id);
        } else {
          (updatedPortCall as Record<string, unknown>).europe = false;
          (updatedPortCall as Record<string, unknown>).portId = undefined;
          console.log('🔍 europe set to false and portId cleared for:', value);
        }
      } else {
        (updatedPortCall as Record<string, unknown>).europe = false;
        (updatedPortCall as Record<string, unknown>).portId = undefined;
        console.warn('⚠️ No ports data provided, cannot determine europe/portId for port:', value);
      }
    }
  }

  // Replace in schedule
  newSchedule[index] = updatedPortCall;
  return newSchedule;
}

/**
 * Validate fuel days against steaming time
 */
export function validateFuelDays(
  portCall: PortCall,
  vessel: Vessel,
  field: keyof PortCall,
  value: number
): { isValid: boolean; message?: string } {
  if (field === 'hfoDays' || field === 'lsfoDays' || field === 'mgoDays') {
    const ballastSpeed = vessel.ballastSpeed || 12;
    const ladenSpeed = vessel.ladenSpeed || 14;
    const speed = portCall.speedSetting === 'Ballast' ? ballastSpeed : ladenSpeed;
    const steamingTime = speed > 0 ? portCall.distance / (speed * 24) : 0;

    // Calculate total fuel days with the new value
    const updatedPortCall = { ...portCall, [field]: value };
    const totalFuelDays = updatedPortCall.hfoDays + updatedPortCall.lsfoDays + updatedPortCall.mgoDays;

    if (totalFuelDays > steamingTime) {
      return {
        isValid: false,
        message: `Total fuel days (${totalFuelDays.toFixed(2)}) cannot exceed steaming time (${steamingTime.toFixed(2)}).`
      };
    }
  }

  return { isValid: true };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Format number for display
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Parse vesselJson to extract speed consumptions
 */
export function parseVesselJson(vessel: Vessel): SpeedConsumption[] {
  if (!vessel.vesselJson) {
    return [];
  }

  try {
    const parsed = typeof vessel.vesselJson === 'string' ? JSON.parse(vessel.vesselJson) : vessel.vesselJson;
    return parsed?.speedConsumptions || [];
  } catch (e) {
    console.warn('Failed to parse vesselJson for speed consumptions:', e);
    return [];
  }
}

/**
 * Get distinct ballast speeds from vessel speed consumptions
 */
export function getBallastSpeedList(vessel: Vessel): string[] {

  // First try to get speeds from speedConsumptions
  if (vessel.speedConsumptions && vessel.speedConsumptions.length > 0) {
    const ballastSpeeds = vessel.speedConsumptions
      .filter(sc => sc.mode === 'ballast')
      .map(sc => sc.speed.toString())
      .filter(speed => speed && speed.trim() !== '');

    if (ballastSpeeds.length > 0) {
      console.log('✅ Found ballast speeds from speedConsumptions:', ballastSpeeds);
      // Remove duplicates and sort
      return [...new Set(ballastSpeeds)].sort((a, b) => parseFloat(a) - parseFloat(b));
    }
  }

  // Fallback: try to parse vesselJson for speed consumptions
  if (vessel.vesselJson) {
    try {
      const parsed = typeof vessel.vesselJson === 'string' ? JSON.parse(vessel.vesselJson) : vessel.vesselJson;
      const sc = parsed?.speedConsumptions;
      if (sc && Array.isArray(sc)) {
        const ballastSpeeds = sc
          .filter((row: any) => row.mode === 'ballast')
          .map((row: any) => row.speed?.toString())
          .filter(speed => speed && speed.trim() !== '');

        if (ballastSpeeds.length > 0) {
          console.log('✅ Found ballast speeds from vesselJson:', ballastSpeeds);
          return [...new Set(ballastSpeeds)].sort((a, b) => parseFloat(a) - parseFloat(b));
        }
      }
    } catch (e) {
      console.warn('Failed to parse vesselJson for ballast speeds:', e);
    }
  }

  // Fallback: use the ballastSpeed property if available
  if (vessel.ballastSpeed && vessel.ballastSpeed > 0) {
    console.log('✅ Using fallback ballastSpeed:', vessel.ballastSpeed);
    return [vessel.ballastSpeed.toString()];
  }

  // Default fallback speeds for common vessel types
  console.log('⚠️ Using default fallback ballast speeds');
  return ['10', '11', '12', '13', '14', '15'];
}

/**
 * Get distinct laden speeds from vessel speed consumptions
 */
export function getLadenSpeedList(vessel: Vessel): string[] {

  // First try to get speeds from speedConsumptions
  if (vessel.speedConsumptions && vessel.speedConsumptions.length > 0) {
    const ladenSpeeds = vessel.speedConsumptions
      .filter(sc => sc.mode === 'laden')
      .map(sc => sc.speed.toString())
      .filter(speed => speed && speed.trim() !== '');

    if (ladenSpeeds.length > 0) {
      // Remove duplicates and sort
      return [...new Set(ladenSpeeds)].sort((a, b) => parseFloat(a) - parseFloat(b));
    }
  }

  // Fallback: try to parse vesselJson for speed consumptions
  if (vessel.vesselJson) {
    try {
      const parsed = typeof vessel.vesselJson === 'string' ? JSON.parse(vessel.vesselJson) : vessel.vesselJson;
      const sc = parsed?.speedConsumptions;
      if (sc && Array.isArray(sc)) {
        const ladenSpeeds = sc
          .filter((row: any) => row.mode === 'laden')
          .map((row: any) => row.speed?.toString())
          .filter(speed => speed && speed.trim() !== '');

        if (ladenSpeeds.length > 0) {
          console.log('✅ Found laden speeds from vesselJson:', ladenSpeeds);
          return [...new Set(ladenSpeeds)].sort((a, b) => parseFloat(a) - parseFloat(b));
        }
      }
    } catch (e) {
      console.warn('Failed to parse vesselJson for laden speeds:', e);
    }
  }

  // Fallback: use the ladenSpeed property if available
  if (vessel.ladenSpeed && vessel.ladenSpeed > 0) {
    return [vessel.ladenSpeed.toString()];
  }

  return [];
}

/**
 * Get consumption for a specific speed and mode
 */
export function getConsumptionForSpeed(vessel: Vessel, speed: string, mode: 'ballast' | 'laden', gradeId: number): number {
  if (!vessel.speedConsumptions || vessel.speedConsumptions.length === 0) {
    return 0;
  }

  const consumption = vessel.speedConsumptions.find(sc =>
    sc.speed.toString() === speed &&
    sc.mode === mode &&
    sc.gradeId === gradeId
  );

  return consumption ? consumption.consumption : 0;
}

/**
 * Determine speed setting for a port call based on its position and activity
 * Use case 1: Until first load port → Ballast speed
 * Use case 2: Until last discharge port → Laden speed  
 * Use case 3: After last discharge → Ballast speed again
 */
export function getSpeedSettingForPortCall(
  portCall: PortCall,
  allPortCalls: PortCall[],
  portCallIndex: number
): 'Ballast' | 'Laden' {
  const { activity } = portCall;

  console.log('getSpeedSettingForPortCall::::', portCall.portName);

  // Use case 1: Ballast port always uses ballast speed
  if (activity === 'Ballast') {
    return 'Ballast';
  }

  // Use case 2: Load and discharge ports use laden speed until last discharge
  if (activity === 'Load' || activity === 'Discharge') {
    // Check if this is the last discharge port
    const isLastDischarge = activity === 'Discharge' &&
      portCallIndex === allPortCalls.length - 1;

    console.log('Speed setting for port call:', portCall.portName, 'is:', isLastDischarge ? 'Ballast' : 'Laden');

    // If it's the last discharge port, use ballast speed (Use case 3)
    // Otherwise, use laden speed (Use case 2)
    return isLastDischarge ? 'Ballast' : 'Laden';
  }


  // Default fallback
  return 'Ballast';
}

/**
 * Update all port call speeds in a schedule based on the use cases
 * This function should be called when vessel speeds change
 */
export function updateScheduleSpeedsBasedOnUseCases(schedule: PortCall[]): PortCall[] {
  console.log('updateScheduleSpeedsBasedOnUseCases::::', schedule);
  return schedule.map((portCall, index) => ({
    ...portCall,
    speedSetting: getSpeedSettingForPortCall(portCall, schedule, index)
  }));
}

/**
 * Build bunker rates from vessel speed consumptions
 */
export function buildBunkerRatesFromSpeedConsumptions(vessel: Vessel, ballastSpeed: number, ladenSpeed: number): BunkerRate[] {
  const bunkerRates: BunkerRate[] = [];

  // First, build the list with grade names from vessel.vesselGrades
  if (vessel.vesselGrades && vessel.vesselGrades.length > 0) {
    vessel.vesselGrades.forEach(gradeDetail => {
      bunkerRates.push({
        grade: gradeDetail.gradeName,
        price: 0, // Placeholder, will be set by user or default values
        portConsumption: 0,
        ballastPerDayConsumption: 0,
        ladenPerDayConsumption: 0,
        isPrimary: gradeDetail.type === 'primary'
      });
    });

    // Now fill in the consumptions based on speeds from speedConsumptions
    if (vessel.speedConsumptions && vessel.speedConsumptions.length > 0) {
      bunkerRates.forEach(bunkerRate => {
        // Find the grade detail for this bunker rate
        const gradeDetail = vessel.vesselGrades?.find(vg => vg.gradeName === bunkerRate.grade);

        if (gradeDetail && vessel.speedConsumptions) {
          const gradeId = gradeDetail.gradeId;
          // Find consumptions for this grade
          const consumptionsForGrade = vessel.speedConsumptions.filter(sc => sc.gradeId === gradeId);

          const ballastConsumption = consumptionsForGrade.find(sc =>
            sc.mode === 'ballast' && sc.speed === ballastSpeed
          );

          // Find laden consumption for the vessel's laden speed
          const ladenConsumption = consumptionsForGrade.find(sc =>
            sc.mode === 'laden' && sc.speed === ladenSpeed
          );

          // Find port consumption (mode = 'port')
          const portConsumption = consumptionsForGrade.find(sc => sc.mode === 'port');

          // Update the bunker rate with consumption data
          if (ballastConsumption) {
            bunkerRate.ballastPerDayConsumption = ballastConsumption.consumption;
          }

          if (ladenConsumption) {
            bunkerRate.ladenPerDayConsumption = ladenConsumption.consumption;
          }

          if (portConsumption) {
            bunkerRate.portConsumption = portConsumption.consumption;
          }
        }
      });
    } else {
      console.log('No speed consumptions found for vessel');
    }
  } else {
    console.log('No vessel grades found for vessel');
  }

  return bunkerRates;
}
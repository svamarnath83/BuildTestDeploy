import { showErrorNotification } from '@commercialapp/ui';
import { shipAnalysis, CargoInput, PortCall } from './models';

// API Model type definition
export type ApiModel = {
  id: number;
  estimateNo: string;
  estimateDate: string;
  shipType: string;
  ship: string;
  commodity: string;
  loadPorts: string;
  dischargePorts: string;
  status: string;
  voyageNo: string;
  shipAnalysis: string; // JSON string containing all ships + detailed estimate
};

// Detailed estimate data structure for the best ship
export interface DetailedEstimate {
  portCalls: shipAnalysis['portCalls'];
  bunkerRates: shipAnalysis['bunkerRates'];
  financeMetrics: shipAnalysis['financeMetrics'];
  vessel: shipAnalysis['vessel'];
  cargoes: CargoInput[];
}

// Complete ship analysis data for API submission
export interface ShipAnalysisApiData {
  allShips: shipAnalysis[];
  bestShipDetailed: DetailedEstimate;
  bestShipId: number;
  analysisDate: string;
  currency: string;
}

/**
 * Converts UI cargo analysis data into ApiModel format for API submission
 * @param allShips - All ship analysis results from the UI
 * @param bestSuitableVessel - The ship marked as "Best" in the UI
 * @param cargoInput - The cargo input data from the form
 * @param estimateNo - Optional estimate number (auto-generated if not provided)
 * @param voyageNo - Optional voyage number
 * @returns ApiModel ready for API submission
 */
export function convertToApiModel(
  allShips: shipAnalysis[],
  cargoInputOrList: CargoInput | CargoInput[],
  currentSchedule?: PortCall[],
  estimateNo?: string,
  voyageNo?: string
): ApiModel {
  // Generate estimate number if not provided
  const generatedEstimateNo = estimateNo || generateEstimateNumber();
  
  // Find the best suitable vessel
  const bestSuitableVessel = allShips.find(ship => ship.suitable);
  
  if (!bestSuitableVessel) {
    throw new Error('No suitable vessel found');
  }

  //bestSuitableVessel.portCalls first portcall eta and etd is empty or null, use etd of first portcall
  if (bestSuitableVessel.portCalls[0]?.eta === null || bestSuitableVessel.portCalls[0]?.eta === '') {
    bestSuitableVessel.portCalls[0].eta = bestSuitableVessel.portCalls[0].etd;
  }

  
  // Normalize to a cargo list
  const cargoes: CargoInput[] = Array.isArray(cargoInputOrList)
    ? cargoInputOrList
    : [cargoInputOrList];

  // Aggregate fields across all cargoes
  const uniqueCommodities = Array.from(new Set(cargoes.map(c => c.commodity).filter(Boolean)));
  const aggregatedCargo: CargoInput = {
    commodity: uniqueCommodities.length <= 1 ? (uniqueCommodities[0] || '') : 'Multiple',
    quantity: cargoes.reduce((sum, c) => sum + (c.quantity || 0), 0),
    quantityType: cargoes[0]?.quantityType || '',
    loadPorts: Array.from(new Set(cargoes.flatMap(c => c.loadPorts || []))),
    dischargePorts: Array.from(new Set(cargoes.flatMap(c => c.dischargePorts || []))),
    selectedShips: cargoes[0]?.selectedShips || [],
    rate: cargoes[0]?.rate || 0,
    currency: cargoes[0]?.currency || 'USD',
    rateType: cargoes[0]?.rateType || '',
    laycanFrom: cargoes.reduce((min, c) => !min || (c.laycanFrom && c.laycanFrom < min) ? (c.laycanFrom || min) : min, cargoes[0]?.laycanFrom || ''),
    laycanTo: cargoes.reduce((max, c) => !max || (c.laycanTo && c.laycanTo > max) ? (c.laycanTo || max) : max, cargoes[0]?.laycanTo || ''),
    totalGrossFreight: cargoes.reduce((sum, c) => sum + (c.totalGrossFreight || ((c.rate || 0) * (c.quantity || 0))), 0)
  } as CargoInput;

  // Create detailed estimate for the best ship - use currentSchedule if provided, otherwise use original
  const detailedEstimate: DetailedEstimate = {
    portCalls: currentSchedule || bestSuitableVessel.portCalls,
    bunkerRates: bestSuitableVessel.bunkerRates,
    financeMetrics: bestSuitableVessel.financeMetrics,
    vessel: bestSuitableVessel.vessel,
    cargoes: cargoes
  };

  // Create complete ship analysis data
  const shipAnalysisData: ShipAnalysisApiData = {
    allShips: allShips,
    bestShipDetailed: detailedEstimate,
    bestShipId: bestSuitableVessel.vessel.id,
    analysisDate: new Date().toISOString(),
    currency: aggregatedCargo.currency
  };

  // Create the API model
  const apiModel: ApiModel = {
    id: 0, // Will be set by the backend
    estimateNo: generatedEstimateNo,
    estimateDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    shipType: 'Bulk',
    ship: bestSuitableVessel.vessel.name || bestSuitableVessel.vessel.vesselName || 'Unknown Vessel',
    commodity: aggregatedCargo.commodity,
    loadPorts: aggregatedCargo.loadPorts.join(', '),
    dischargePorts: aggregatedCargo.dischargePorts.join(', '),
    status: 'Draft',
    voyageNo: voyageNo || '',
    shipAnalysis: JSON.stringify(shipAnalysisData, null, 2) // Pretty formatted JSON string
  };

  return apiModel;
}

/**
 * Generates a unique estimate number
 * Format: EST-YYYYMMDD-HHMMSS
 */
function generateEstimateNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `EST-${year}${month}${day}-${hours}${minutes}${seconds}`;
}

/**
 * Validates that all required data is present for API submission
 * @param allShips - All ship analysis results
 * @param bestSuitableVessel - The best suitable vessel
 * @param cargoInput - Cargo input data
 * @returns Validation result with any error messages
 */
export function validateApiModelData(
  allShips: shipAnalysis[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check if we have ships
  if (!allShips || allShips.length === 0) {
    errors.push('No ship analysis results available');
    return { isValid: false, errors };
  }

  // Check if we have a suitable vessel
  if (!allShips.some(ship => ship.suitable)) {
    errors.push('Best suitable vessel not found in ship analysis results');
    return { isValid: false, errors };
  }

  const bestSuitableVessel = allShips.find(ship => ship.suitable);

  if (bestSuitableVessel?.portCalls[0]?.eta === null || bestSuitableVessel?.portCalls[0]?.eta === '') {
    bestSuitableVessel.portCalls[0].eta = bestSuitableVessel.portCalls[0].etd;
  }

  // Validate port names in schedule - use currentSchedule if provided, otherwise use suitable vessel's schedule
  const scheduleToValidate = (bestSuitableVessel?.portCalls || []);
  
  if (scheduleToValidate.length > 0) {
    console.log('🔍 Validating port names in schedule:', scheduleToValidate.map((p: PortCall) => ({ portName: p.portName, activity: p.activity })));
    
    // More explicit check for empty port names
    const emptyPorts = scheduleToValidate.filter((call: PortCall, index: number) => {
      const isEmpty = !call.portName || call.portName.trim() === '';
      console.log(`🔍 Port ${index + 1}: "${call.portName}" (isEmpty: ${isEmpty})`);
      return isEmpty;
    });
    
    console.log('🔍 Empty ports found:', emptyPorts.length, emptyPorts.map((p: PortCall) => ({ portName: p.portName, activity: p.activity })));
    
    if (emptyPorts.length > 0) {
      const emptyPortIndices = emptyPorts.map((_: PortCall, index: number) => scheduleToValidate.indexOf(emptyPorts[index]) + 1);
      const errorMessage = `${emptyPorts.length} port(s) at position(s) ${emptyPortIndices.join(', ')} have empty names. Please fill in all port names before saving.`;
      errors.push(errorMessage);
      console.log('❌ Port validation error added:', errorMessage);
      console.log('❌ Total errors now:', errors);
    } else {
      console.log('✅ No empty port names found');
    }
  } else {
    console.log('⚠️ No schedule to validate');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Converts string values to numbers for numeric fields
 * This is needed because data from API/database might come as strings
 */
function convertNumericFields(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(convertNumericFields);
    }
    
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertNumericFields(value);
    }
    return converted;
  }
  
  // Convert string numbers to actual numbers
  if (typeof obj === 'string' && !isNaN(Number(obj)) && obj.trim() !== '') {
    const num = Number(obj);
    // Only convert if it's a finite number (not NaN, Infinity, or -Infinity)
    return isFinite(num) ? num : obj;
  }
  
  return obj;
}

/**
 * Parses the shipAnalysis JSON string back into structured data
 * Useful for loading saved estimates
 * @param shipAnalysisJson - The JSON string from ApiModel.shipAnalysis
 * @returns Parsed ship analysis data with proper numeric types
 */
export function parseShipAnalysisFromApi(shipAnalysisJson: string): ShipAnalysisApiData {
  try {
    const parsed = JSON.parse(shipAnalysisJson);
    // Convert numeric fields to proper numbers
    return convertNumericFields(parsed) as ShipAnalysisApiData;
  } catch (error) {
    throw new Error(`Failed to parse ship analysis data: ${error}`);
  }
}

/**
 * Creates a summary object with key metrics for quick display
 * @param bestSuitableVessel - The best suitable vessel
 * @param cargoInput - Cargo input data
 * @returns Summary object with key metrics
 */
export function createEstimateSummary(
  allShips: shipAnalysis[],
  cargoInputOrList: CargoInput | CargoInput[]
) {
  const bestSuitableVessel = allShips.find(ship => ship.suitable);
  
  if (!bestSuitableVessel) {
    throw new Error('No suitable vessel found');
  }
  
  const { financeMetrics, vessel } = bestSuitableVessel;

  const list = Array.isArray(cargoInputOrList) ? cargoInputOrList : [cargoInputOrList];
  const uniqueCommodities = Array.from(new Set(list.map(c => c.commodity).filter(Boolean)));
  const aggregatedQuantity = list.reduce((sum, c) => sum + (c.quantity || 0), 0);
  const quantityType = list[0]?.quantityType || '';
  const loadPorts = Array.from(new Set(list.flatMap(c => c.loadPorts || [])));
  const dischargePorts = Array.from(new Set(list.flatMap(c => c.dischargePorts || [])));
  const currency = list[0]?.currency || 'USD';
  
  return {
    vesselName: vessel.vesselName,
    commodity: uniqueCommodities.length <= 1 ? (uniqueCommodities[0] || '') : 'Multiple',
    quantity: `${aggregatedQuantity.toLocaleString()} ${quantityType}T`,
    loadPorts: loadPorts.join(', '),
    dischargePorts: dischargePorts.join(', '),
    revenue: financeMetrics.revenue,
    profit: financeMetrics.finalProfit,
    margin: financeMetrics.margin,
    duration: `${financeMetrics.totalVoyageDuration} days`,
    tce: financeMetrics.tce,
    eta: financeMetrics.eta,
    currency,
    dailyOpEx: vessel.runningCost
  };
}
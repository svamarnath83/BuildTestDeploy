import { getEstimateById } from '../../cargo-analysis/libs/estimate-api-services';
import { parseShipAnalysisFromApi, type ApiModel } from '../../cargo-analysis/libs/api-model-converter';
import { shipAnalysis, CargoInput } from '../../cargo-analysis/libs/models';

/**
 * Get estimate details by ID and parse for CargoAnalysisExplorer
 * @param estimateId - The estimate ID to fetch
 * @returns Promise with parsed estimate data
 */
export async function getEstimateDetails(estimateId: number): Promise<{
  allShips: shipAnalysis[];
  bestSuitableVessel: shipAnalysis | null;
  cargoInput: CargoInput;
  estimateInfo: ApiModel;
}> {
  try {
    // Get estimate from API
    const response = await getEstimateById(estimateId);
    const estimate = response.data;
    console.log(estimate.shipAnalysis);
    // Parse the shipAnalysis JSON string
    const shipAnalysisData = parseShipAnalysisFromApi(estimate.shipAnalysis);
    
    // Find the best suitable vessel
    const bestSuitableVessel = shipAnalysisData.allShips.find(
      ship => ship.vessel.id === shipAnalysisData.bestShipId
    ) || null;
    
    return {
      allShips: shipAnalysisData.allShips,
      bestSuitableVessel,
      cargoInput: (shipAnalysisData as any).bestShipDetailed?.cargoes?.[0] || (shipAnalysisData as any).bestShipDetailed?.cargoInput,
      estimateInfo: estimate
    };
  } catch (error) {
    console.error('❌ Failed to get estimate details:', error);
    throw error;
  }
}
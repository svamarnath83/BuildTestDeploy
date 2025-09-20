'use client';

import { useEffect, useState } from 'react';
import { shipAnalysis, CargoInput } from '../../cargo-analysis/libs/models';
import { ApiModel } from '../../cargo-analysis/libs/api-model-converter';
import EstimateCargoAnalysisWrapper from './EstimateCargoAnalysisWrapper';

interface EstimateViewerProps {
  estimateId: number;
  getEstimateDetails: (id: number) => Promise<{
    allShips: shipAnalysis[];
    bestSuitableVessel: shipAnalysis | null;
    cargoInput: CargoInput;
    estimateInfo: ApiModel;
  }>;
}

interface EstimateData {
  allShips: shipAnalysis[];
  bestSuitableVessel: shipAnalysis | null;
  cargoInput: CargoInput;
  estimateInfo: ApiModel;
}

export default function EstimateViewer({ estimateId, getEstimateDetails }: EstimateViewerProps) {
  const [estimateData, setEstimateData] = useState<EstimateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (estimateId) {
      loadEstimateData();
    }
  }, [estimateId]);

  const loadEstimateData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEstimateDetails(estimateId);
      setEstimateData(data);
    } catch (err: unknown) {
      console.error('Failed to load estimate:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load estimate';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading estimate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Estimate</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadEstimateData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!estimateData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No estimate data found</p>
      </div>
    );
  }

  // Render the CargoAnalysisExplorer with pre-loaded estimate data
  return <EstimateCargoAnalysisWrapper estimateData={estimateData} estimateId={estimateId} />;
}
'use client';

import { useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button
} from '@commercialapp/ui';
import { formatCurrency, formatNumber } from '../libs';
import { shipAnalysis, CargoInput } from '../libs';


interface ShipAnalysisResultProps {
  showResults: boolean;
  shipAnalysisResults: shipAnalysis[];
  selectedVessel: shipAnalysis | null;
  bestSuitableVessel: shipAnalysis | null;
  cargoInput: CargoInput;
  onVesselSelection: (ship: shipAnalysis | null) => void;
  onBestSuitableToggle: (ship: shipAnalysis) => void;
  onRemoveShip: (ship: shipAnalysis) => void;
  hideButtons?: boolean; // Optional prop to hide Mark/Remove buttons
}

export default function ShipAnalysisResult({ 
  showResults, 
  shipAnalysisResults, 
  selectedVessel, 
  bestSuitableVessel,
  cargoInput, 
  onVesselSelection,
  onBestSuitableToggle,
  onRemoveShip,
  hideButtons = false // Default to false (show buttons)
}: ShipAnalysisResultProps) {
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResults]);



  if (!showResults) {
    return null;
  }

  return (
    <div ref={resultsRef} className="space-y-4">
      <div className="text-sm font-medium mb-4">
        Ship Analysis Results for {cargoInput.commodity} ({formatNumber(cargoInput.quantity)} {cargoInput.quantityType} @ {cargoInput.currency} {cargoInput.rate}/{cargoInput.rateType})
        <br />
        <span className="text-xs text-gray-600">Route: {cargoInput.loadPorts} → {cargoInput.dischargePorts.join(', ')}</span>
        {bestSuitableVessel && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
            <span className="text-xs text-amber-700 flex items-center gap-1">
              ⭐ <strong>Best Suitable:</strong> {bestSuitableVessel.vessel.vesselName || bestSuitableVessel.vessel.name} - {formatCurrency(bestSuitableVessel.financeMetrics.profit)} profit
            </span>
          </div>
        )}
      </div>
      
      {shipAnalysisResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shipAnalysisResults.map((ship) => (
            <Card 
              key={ship.vessel.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                bestSuitableVessel?.vessel.id === ship.vessel.id
                  ? 'border-2 border-amber-500 bg-amber-50 shadow-lg'
                  : selectedVessel?.vessel.id === ship.vessel.id 
                    ? 'border-2 border-blue-600 bg-blue-50' 
                    : 'border border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onVesselSelection(selectedVessel?.vessel.id === ship.vessel.id ? null : ship)}
            >
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {bestSuitableVessel?.vessel.id === ship.vessel.id && (
                    <span className="text-amber-500">⭐</span>
                  )}
                  {ship.vessel.vesselName || ship.vessel.name}
                </CardTitle>
                {!hideButtons && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-7 px-2 text-xs border-blue-600 text-blue-600 hover:bg-blue-50 ${
                        bestSuitableVessel?.vessel.id === ship.vessel.id 
                          ? 'bg-amber-50 border-amber-500 text-amber-700 hover:bg-amber-100' 
                          : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBestSuitableToggle(ship);
                      }}
                    >
                      {bestSuitableVessel?.vessel.id === ship.vessel.id ? '★ Best' : '☆ Mark'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs border-red-600 text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveShip(ship);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Prominent Profit Display */}
                <div className="text-center p-3 bg-green-50 border border-green-200 rounded">
                  <div className="text-xs text-gray-600 mb-1">Estimated Profit</div>
                  <div className={`text-lg font-bold ${ship.financeMetrics.profit >= 0 ? 'text-green-700' : 'text-red-600'}`}>{formatCurrency(ship.financeMetrics.profit)}</div>
                  <div className="text-xs text-gray-600">{Number(ship.financeMetrics.margin).toFixed(1)}% margin</div>
                </div>
                
                {/* Key Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Capacity:</span>
                    <div className="font-medium">{formatNumber(ship.vessel.dwt)} MT</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <div className="font-medium">{Number(ship.financeMetrics.duration).toFixed(2)} days</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Ballast:</span>
                    <div className="font-medium">{ship.vessel.ballastPort}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">ETA:</span>
                    <div className="font-medium">{ship.financeMetrics.eta}</div>
                  </div>
                </div>
                
                {/* Click to expand indicator */}
                <div className="text-center text-xs mt-2">
                  <div className="text-blue-600">
                    {selectedVessel?.vessel.id === ship.vessel.id ? 'Click to collapse details' : 'Click for detailed breakdown'}
                  </div>
                  {bestSuitableVessel?.vessel.id === ship.vessel.id && (
                    <div className="text-amber-600 font-medium mt-1">
                      ⭐ Marked as Best Suitable
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No suitable vessels found for the specified cargo quantity.
        </div>
      )}
    </div>
  );
} 
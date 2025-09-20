'use client';

import { useState, useRef, useEffect } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Button } from '@commercialapp/ui';
import { showSuccessNotification, showErrorNotification, showWarningNotification } from '@commercialapp/ui';
import { ChevronDown } from 'lucide-react';


import { 
  CargoInput,
  shipAnalysis,
  PortCall,
  BunkerRate,
  generateShipAnalysis,
  recalculateScheduleDates,
  addPortCallToSchedule,
  removePortCallFromSchedule,
  updatePortCallField,
  validateFuelDays,
  updatePortCallDistances,
  clearDistanceCache,
  clearAllDistancesFromSchedule,
  removeAllRoutingPointsFromSchedule,

  type ApiModel 
} from '../../cargo-analysis/libs';
import { convertToApiModel, createEstimateSummary, validateApiModelData, addOrUpdateEstimate, calculateFinancialMetrics } from '../../cargo-analysis/libs';

import { getPort } from '@commercialapp/ui/libs/registers/ports/services';
import { generateEstimate } from '../../cargo-analysis/libs/estimate-api-services';

import ShipAnalysisResult from '../../cargo-analysis/components/ShipAnalysisResult';
import EstDetailedEstimate from '../../cargo-analysis/components/estDetailedEstimate';

interface EstimateCargoAnalysisWrapperProps {
  estimateData: {
    allShips: shipAnalysis[];
    bestSuitableVessel: shipAnalysis | null;
    cargoInput: CargoInput;
    estimateInfo: ApiModel;
  };
  estimateId?: number;
}

export default function EstimateCargoAnalysisWrapper({ estimateData, estimateId }: EstimateCargoAnalysisWrapperProps) {
  // Debug: Log the received estimate data
  console.log('📊 EstimateCargoAnalysisWrapper received data:', {
    allShips: estimateData.allShips.length,
    bestSuitableVessel: estimateData.bestSuitableVessel?.vessel.vesselName || estimateData.bestSuitableVessel?.vessel.name,
    cargoInput: estimateData.cargoInput,
    estimateInfo: estimateData.estimateInfo
  });

  // Initialize state with the loaded estimate data
  const [cargoInput, setCargoInput] = useState<CargoInput>(estimateData.cargoInput);
  const [showResults, setShowResults] = useState(true); // Always show results for estimates
  const [shipAnalysisResults, setShipAnalysisResults] = useState<shipAnalysis[]>(estimateData.allShips);
  const [selectedVessel, setSelectedVessel] = useState<shipAnalysis | null>(estimateData.bestSuitableVessel);
  const [estimateCache, setEstimateCache] = useState<Record<number, PortCall[]>>({});
  const [bestSuitableVessel, setBestSuitableVessel] = useState<shipAnalysis | null>(estimateData.bestSuitableVessel);
  const [isSaving, setIsSaving] = useState(false);
  const [ports, setPorts] = useState<Array<{ Id?: number; Name: string; IsEurope?: boolean }>>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await getPort();
        setPorts(res.data || []);
      } catch (e) {
        console.warn('Failed to load ports', e);
      }
    })();
  }, []);
  
  // State to control ShipAnalysisResult visibility for existing estimates
  const [showShipAnalysis, setShowShipAnalysis] = useState(true); // Show by default

  // Update state when estimateData changes (in case of re-loading)
  useEffect(() => {
    setCargoInput(estimateData.cargoInput);
    setShipAnalysisResults(estimateData.allShips);
    setSelectedVessel(estimateData.bestSuitableVessel);
    setBestSuitableVessel(estimateData.bestSuitableVessel);
    
    // Initialize cache with best vessel's port calls if available
    if (estimateData.bestSuitableVessel) {
      setEstimateCache({
        [estimateData.bestSuitableVessel.vessel.id]: estimateData.bestSuitableVessel.portCalls
      });
    }
  }, [estimateData]);


  const resultsRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResults]);

  useEffect(() => {
    if (selectedVessel && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedVessel]);



  const handleVesselSelection = (ship: shipAnalysis | null) => {
    setSelectedVessel(ship);

    if (ship) {
      if (estimateCache[ship.vessel.id]) {
        const updatedShip = {
          ...ship,
          portCalls: estimateCache[ship.vessel.id]
        };
        setSelectedVessel(updatedShip);
      } else {
        setEstimateCache(prevCache => ({
          ...prevCache,
          [ship.vessel.id]: ship.portCalls
        }));
      }
    }
  };

  // All the other handlers from CargoAnalysisExplorer...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasAtLeastOneLoadPort = cargoInput.loadPorts.length > 0;
    const hasAtLeastOneDischargePort = cargoInput.dischargePorts.length > 0;
    if (cargoInput.commodity && cargoInput.quantity > 0 && hasAtLeastOneLoadPort && hasAtLeastOneDischargePort && cargoInput.rate > 0) {
      // Pass selected ships to generateShipAnalysis if any are selected
      const analysisResults = await generateShipAnalysis(cargoInput, cargoInput.selectedShips);
      const results = analysisResults.sort((a: shipAnalysis, b: shipAnalysis) => b.financeMetrics.finalProfit - a.financeMetrics.finalProfit);
      setShipAnalysisResults(results);
      setShowResults(true);
      
      console.log('📏 Ship Analysis completed - distances calculated');
      if (cargoInput.selectedShips && cargoInput.selectedShips.length > 0) {
        console.log(`🎯 Analysis limited to ${cargoInput.selectedShips.length} selected ships`);
      } else {
        console.log('🚢 Analyzing all available ships');
      }
    }
  };



  // Simplified handlers for the estimate view (you can implement full functionality if needed)
  const handleScheduleChange = async (index: number, field: keyof PortCall, value: string | number) => {
    if (!selectedVessel) return;
    
    console.log(`🔧 Schedule change: index=${index}, field=${field}, value=${value} (type: ${typeof value})`);
    
    // Create updated port calls array
    const updatedPortCalls = [...selectedVessel.portCalls];
    updatedPortCalls[index] = {
      ...updatedPortCalls[index],
      [field]: value
    };
    
    // Update the selected vessel with new port calls
    const updatedVessel = {
      ...selectedVessel,
      portCalls: updatedPortCalls
    };
    
    setSelectedVessel(updatedVessel);
    
    // Update the cache
    setEstimateCache(prevCache => ({
      ...prevCache,
      [updatedVessel.vessel.id]: updatedPortCalls
    }));
    
    // Also update in ship analysis results
    setShipAnalysisResults(prevResults => 
      prevResults.map(ship => 
        ship.vessel.id === updatedVessel.vessel.id ? updatedVessel : ship
      )
    );
    
    console.log('✅ Schedule updated successfully');
  };
  const addPortCall = async () => {};
  const removePortCall = async () => {};
  const handleDragEnd = async () => {};
  const handleBunkerRateChange = (index: number, field: keyof BunkerRate, value: string) => {
    if (!selectedVessel) return;
    
    console.log(`⛽ Bunker rate change: index=${index}, field=${field}, value=${value}`);
    
    // Create updated bunker rates array
    const updatedBunkerRates = [...selectedVessel.bunkerRates];
    updatedBunkerRates[index] = {
      ...updatedBunkerRates[index],
      [field]: typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value
    } as BunkerRate;
    
    // Update the selected vessel
    const updatedVessel = {
      ...selectedVessel,
      bunkerRates: updatedBunkerRates
    };
    
    setSelectedVessel(updatedVessel);
    
    // Also update in ship analysis results
    setShipAnalysisResults(prevResults => 
      prevResults.map(ship => 
        ship.vessel.id === updatedVessel.vessel.id ? updatedVessel : ship
      )
    );
    
    console.log('✅ Bunker rates updated successfully');
  };
  const handleShipChange = () => {};
  const handleCurrencyChange = () => {};
  const handleRunningCostChange = (field: string, value: number | string) => {
    if (!selectedVessel) return;
    
    console.log(`💵 Running cost change: field=${field}, value=${value}`);
    
    const updatedVessel = {
      ...selectedVessel,
      vessel: {
        ...selectedVessel.vessel,
        [field]: typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value
      }
    };
    
    setSelectedVessel(updatedVessel);
    
    // Also update in ship analysis results
    setShipAnalysisResults(prevResults => 
      prevResults.map(ship => 
        ship.vessel.id === updatedVessel.vessel.id ? updatedVessel : ship
      )
    );
    
    console.log('✅ Running cost updated successfully');
  };
  const handleScheduleUpdate = async () => {};
  const handleGetDistances = async () => {};
  const handleLoadPortsChange = (newLoadPorts: string[], previousLoadPorts: string[], cargoTerms?: { loadTerms?: number; dischargeTerms?: number }) => {
    if (!selectedVessel) return;

    // 1) Update cargo input state (used when no explicit cargoes array is present)
    setCargoInput(prev => ({ ...prev, loadPorts: newLoadPorts }));

    const currentSchedule = [...(selectedVessel.portCalls || [])];
    const newSchedule = [...currentSchedule];
    const firstDischargePortIndex = currentSchedule.findIndex(call => call.activity === 'Discharge');
    const lastLoadPortIndex = currentSchedule.findIndex(call => call.activity === 'Load');
    let insertIndex: number;
    if (firstDischargePortIndex !== -1) insertIndex = firstDischargePortIndex; else if (lastLoadPortIndex !== -1) insertIndex = lastLoadPortIndex + 1; else insertIndex = 1;

    const existingLoadPorts = currentSchedule.filter(call => call.activity === 'Load');
    const portsToRemove = existingLoadPorts.filter(existingPort => !newLoadPorts.includes(existingPort.portName));
    portsToRemove.forEach(portToRemove => {
      const removeIndex = newSchedule.findIndex(call => call.id === portToRemove.id);
      if (removeIndex !== -1) newSchedule.splice(removeIndex, 1);
    });

    let newPortsAdded = 0;
    newLoadPorts.forEach((portName, index) => {
      const exists = existingLoadPorts.find(ep => ep.portName === portName);
      if (!exists) {
        const meta = ports.find(p => p.Name === portName);
        const isEurope = meta?.IsEurope === true;
        const defaultPortDays = cargoTerms?.loadTerms ?? cargoInput.loadPorts ? (cargoTerms?.loadTerms ?? (cargoInput.loadTerms || 0)) : 0;
        const portCall = {
          id: Date.now() + index + Math.random(),
          portName,
          portId: meta?.Id,
          activity: 'Load' as const,
          portDays: defaultPortDays,
          secPortDays: 0,
          additionalCosts: 0,
          eta: '',
          etd: '',
          isFixed: false,
          isDeletable: false,
          hfoDays: 0,
          lsfoDays: 0,
          mgoDays: 0,
          distance: 0,
          secDistance: 0,
          secSteamDays: 0,
          speedSetting: 'Laden' as const,
          currentRoutingPoint: [],
          bunkerConsumption: [],
          europe: isEurope
        } as any;
        newSchedule.splice(insertIndex + newPortsAdded, 0, portCall);
        newPortsAdded++;
      }
    });

    // 2) Sync cargoes on the selected vessel so save uses updated ports
    const updatedCargoes = (selectedVessel.cargoes && selectedVessel.cargoes.length > 0)
      ? selectedVessel.cargoes.map(c => ({ ...c, loadPorts: newLoadPorts }))
      : [{ ...cargoInput, loadPorts: newLoadPorts }];

    const recalculated = recalculateScheduleDates(newSchedule, selectedVessel.vessel);
    const updatedShip = { ...selectedVessel, portCalls: recalculated, cargoes: updatedCargoes };
    setSelectedVessel(updatedShip);
    setShipAnalysisResults(prev => prev.map(s => s.vessel.id === updatedShip.vessel.id ? updatedShip : s));
  };

  const handleDischargePortsChange = (newDischargePorts: string[], previousDischargePorts: string[], cargoTerms?: { loadTerms?: number; dischargeTerms?: number }) => {
    if (!selectedVessel) return;

    // 1) Update cargo input state
    setCargoInput(prev => ({ ...prev, dischargePorts: newDischargePorts }));

    const currentSchedule = [...(selectedVessel.portCalls || [])];
    const newSchedule = [...currentSchedule];
    const firstLoadPortIndex = currentSchedule.findIndex(call => call.activity === 'Load');
    const existingDischargePorts = currentSchedule.filter(call => call.activity === 'Discharge');
    let insertIndex: number;
    if (existingDischargePorts.length > 0) {
      const lastExistingDischargePort = existingDischargePorts[existingDischargePorts.length - 1];
      const lastDischargePortIndex = currentSchedule.findIndex(call => call.id === lastExistingDischargePort.id);
      insertIndex = lastDischargePortIndex + 1;
    } else if (firstLoadPortIndex !== -1) {
      insertIndex = firstLoadPortIndex + 1;
      for (let i = firstLoadPortIndex; i < currentSchedule.length; i++) {
        if (currentSchedule[i].activity === 'Load') insertIndex = i + 1; else break;
      }
    } else {
      insertIndex = 1;
    }

    const portsToRemove = existingDischargePorts.filter(existingPort => !newDischargePorts.includes(existingPort.portName));
    portsToRemove.forEach(portToRemove => {
      const removeIndex = newSchedule.findIndex(call => call.id === portToRemove.id);
      if (removeIndex !== -1) newSchedule.splice(removeIndex, 1);
    });

    let newPortsAdded = 0;
    newDischargePorts.forEach((portName, index) => {
      const exists = existingDischargePorts.find(ep => ep.portName === portName);
      if (!exists) {
        const meta = ports.find(p => p.Name === portName);
        const isEurope = meta?.IsEurope === true;
        const defaultPortDays = cargoTerms?.dischargeTerms ?? (cargoInput.dischargeTerms || 0);
        const portCall = {
          id: Date.now() + index + Math.random(),
          portName,
          portId: meta?.Id,
          activity: 'Discharge' as const,
          portDays: defaultPortDays,
          secPortDays: 0,
          additionalCosts: 0,
          eta: '',
          etd: '',
          isFixed: false,
          isDeletable: false,
          hfoDays: 0,
          lsfoDays: 0,
          mgoDays: 0,
          distance: 0,
          secDistance: 0,
          secSteamDays: 0,
          speedSetting: 'Laden' as const,
          currentRoutingPoint: [],
          bunkerConsumption: [],
          europe: isEurope
        } as any;
        newSchedule.splice(insertIndex + newPortsAdded, 0, portCall);
        newPortsAdded++;
      }
    });

    // 2) Sync cargoes on the selected vessel so save uses updated ports
    const updatedCargoes = (selectedVessel.cargoes && selectedVessel.cargoes.length > 0)
      ? selectedVessel.cargoes.map(c => ({ ...c, dischargePorts: newDischargePorts }))
      : [{ ...cargoInput, dischargePorts: newDischargePorts }];

    const recalculated = recalculateScheduleDates(newSchedule, selectedVessel.vessel);
    const updatedShip = { ...selectedVessel, portCalls: recalculated, cargoes: updatedCargoes };
    setSelectedVessel(updatedShip);
    setShipAnalysisResults(prev => prev.map(s => s.vessel.id === updatedShip.vessel.id ? updatedShip : s));
  };
  const handleBallastSpeedChange = (speed: string) => {
    if (!selectedVessel) return;
    
    console.log(`🚢 Ballast speed change: ${speed}`);
    
    const updatedVessel = {
      ...selectedVessel,
      vessel: {
        ...selectedVessel.vessel,
        ballastSpeed: parseFloat(speed) || 0
      }
    };
    
    setSelectedVessel(updatedVessel);
    
    // Also update in ship analysis results
    setShipAnalysisResults(prevResults => 
      prevResults.map(ship => 
        ship.vessel.id === updatedVessel.vessel.id ? updatedVessel : ship
      )
    );
    
    console.log('✅ Ballast speed updated successfully');
  };

  const handleLadenSpeedChange = (speed: string) => {
    if (!selectedVessel) return;
    
    console.log(`🚢 Laden speed change: ${speed}`);
    
    const updatedVessel = {
      ...selectedVessel,
      vessel: {
        ...selectedVessel.vessel,
        ladenSpeed: parseFloat(speed) || 0
      }
    };
    
    setSelectedVessel(updatedVessel);
    
    // Also update in ship analysis results
    setShipAnalysisResults(prevResults => 
      prevResults.map(ship => 
        ship.vessel.id === updatedVessel.vessel.id ? updatedVessel : ship
      )
    );
    
    console.log('✅ Laden speed updated successfully');
  };

  // Generate (Create Voyage) for existing estimate
  const handleGenerateEstimate = async () => {
    if (!estimateId) return;
    try {
      const response = await generateEstimate(estimateId);
      const result = response.data as any;

      //print result
      console.log('🔍 handleGenerateEstimate result:', result);

      const isSuccess = (result && (result.success === true || result.Success === true));
      const voyageNo = result?.voyageNo ?? result?.VoyageNo ?? result?.data?.voyageNo ?? result?.Data?.voyageNo;

      if (isSuccess) {
        showSuccessNotification({
          title: 'Voyage Created Successfully',
          description: `Voyage No: ${voyageNo ?? 'N/A'} | Estimate No: ${estimateData.estimateInfo.estimateNo}`,
          duration: 6000
        });
      } else {
        const message = result?.message || result?.Message || 'Voyage creation failed - no success response';
        throw new Error(message);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showErrorNotification({
        title: 'Error Creating Voyage',
        description: errorMessage,
        duration: 5000
      });
    }
  };

  // Save estimate with multi-cargo aggregation (aligned with CargoAnalysisExplorer)
  const handleSaveEstimate = async () => {
    if (isSaving) return; // Prevent double-clicking
    
    //print handleSaveEstimate called
    console.log('🔍 handleSaveEstimate #### called....');


    setIsSaving(true);
    try {
      const actualEstimate = shipAnalysisResults.find(ship => ship.suitable);

      if (actualEstimate === undefined) {
        showErrorNotification({
          title: 'No suitable vessel found',
          description: 'Best suitable vessel not found in ship analysis results',
          duration: 6000
        });
        return;
      }

      // Validate that we have all required data
      const validation = validateApiModelData(shipAnalysisResults);
      if (!validation.isValid) {
        showWarningNotification({
          title: 'Cannot Save Estimate',
          description: validation.errors.join('. '),
          duration: 8000
        });
        console.log('❌ Returning early due to validation failure');
        return;
      }


      //if selectedVessel.Portcalls[0].eta == empty or null, assign selectedvessel.portcalls[0].etd
      if (selectedVessel?.portCalls[0]?.eta === '' || selectedVessel?.portCalls[0]?.eta === null) {
        selectedVessel.portCalls[0].eta = selectedVessel.portCalls[0].etd;
      } 

      //print selectedVessel.portCalls[0].eta
      console.log('🔍 selectedVessel.portCalls[0].eta:::', selectedVessel?.portCalls[0]?.eta);

      // If user added multiple cargoes in detailed view, aggregate them
      const cargoesForSelected = selectedVessel?.cargoes && selectedVessel.cargoes.length > 0
        ? selectedVessel.cargoes
        : [cargoInput];

      const uniqueCommodities = Array.from(new Set(cargoesForSelected.map(c => c.commodity).filter(Boolean)));
      const aggregatedCargoInput: CargoInput = {
        commodity: uniqueCommodities.length <= 1 ? (uniqueCommodities[0] || cargoInput.commodity) : 'Multiple',
        quantity: cargoesForSelected.reduce((sum, c) => sum + (c.quantity || 0), 0),
        quantityType: cargoesForSelected[0]?.quantityType || cargoInput.quantityType,
        loadPorts: Array.from(new Set(cargoesForSelected.flatMap(c => c.loadPorts || []))),
        dischargePorts: Array.from(new Set(cargoesForSelected.flatMap(c => c.dischargePorts || []))),
        selectedShips: cargoInput.selectedShips || [],
        rate: cargoesForSelected[0]?.rate ?? cargoInput.rate,
        currency: cargoesForSelected[0]?.currency || cargoInput.currency,
        rateType: cargoesForSelected[0]?.rateType || cargoInput.rateType,
        laycanFrom: cargoesForSelected.reduce((min, c) => !min || (c.laycanFrom && c.laycanFrom < min) ? (c.laycanFrom || min) : min, cargoInput.laycanFrom),
        laycanTo: cargoesForSelected.reduce((max, c) => !max || (c.laycanTo && c.laycanTo > max) ? (c.laycanTo || max) : max, cargoInput.laycanTo),
        totalGrossFreight: cargoesForSelected.reduce((sum, c) => sum + (c.totalGrossFreight || ((c.rate || 0) * (c.quantity || 0))), 0)
      } as CargoInput;

      // Recalculate finance metrics using aggregated cargo data for selected vessel
      let shipsForSave = shipAnalysisResults;
      if (selectedVessel) {
        const recalculatedMetrics = calculateFinancialMetrics({
          shipAnalysis: selectedVessel,
          cargoInput: aggregatedCargoInput
        });
        shipsForSave = shipAnalysisResults.map(s => s.vessel.id === selectedVessel.vessel.id
          ? { ...s, financeMetrics: recalculatedMetrics, cargoes: cargoesForSelected }
          : s
        );
      }

      // Convert to API model format
      const apiModel: ApiModel = convertToApiModel(
        shipsForSave,
        aggregatedCargoInput,
        selectedVessel?.portCalls,
        estimateData.estimateInfo.estimateNo
      );
      // Ensure update vs. create: set existing estimate id when present
      apiModel.id = estimateId ?? 0;

      // Create summary for user confirmation
      const summary = createEstimateSummary(shipsForSave, aggregatedCargoInput);

      // Call AddOrUpdateEstimate API
      const response = await addOrUpdateEstimate(apiModel);
      const savedEstimate = response.data;

      // Show success message with estimate details
      showSuccessNotification({
        title: 'Estimate Saved Successfully',
        description: `Estimate No: ${savedEstimate.estimateNo} | Vessel: ${summary.vesselName} | Profit: ${summary.currency} ${summary.profit.toLocaleString()} | Margin: ${summary.margin.toFixed(2)}%`,
        duration: 6000
      });

      return savedEstimate;
      
    } catch (error: unknown) {
      console.error('❌ Error saving estimate:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      showErrorNotification({
        title: 'Error Saving Estimate',
        description: errorMessage,
        duration: 5000
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Toggle button for existing estimates to show/hide ShipAnalysisResult */}
      {shipAnalysisResults.length > 0 && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => setShowShipAnalysis(!showShipAnalysis)}
            className="flex items-center gap-2 px-6 py-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            {showShipAnalysis ? 'Hide Ship Analysis' : 'Show Ship Analysis'}
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showShipAnalysis ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      )}

      {/* ShipAnalysisResult - show based on toggle state when there are results */}
      {shipAnalysisResults.length > 0 && showShipAnalysis && (
        <ShipAnalysisResult 
          showResults={showResults}
          shipAnalysisResults={shipAnalysisResults}
          selectedVessel={selectedVessel}
          bestSuitableVessel={bestSuitableVessel}
          cargoInput={cargoInput}
          onVesselSelection={handleVesselSelection}
          onBestSuitableToggle={() => {}} // Disable best suitable toggle
          onRemoveShip={() => {}} // Disable remove ship
          hideButtons={true} // Hide buttons for estimate view
        />
      )}

      {/* Detailed Estimate Section */}
      <div ref={detailsRef}>
        {selectedVessel && (
          <>
            <EstDetailedEstimate
              shipAnalysis={selectedVessel}
              cargoInput={cargoInput}
              availableShips={shipAnalysisResults}
              estimateId={estimateId}
              estimateStatus={estimateData.estimateInfo.status}
              onSaveEstimate={handleSaveEstimate}
              onGenerateEstimate={handleGenerateEstimate}
              onScheduleChange={handleScheduleChange}
              onAddPortCall={addPortCall}
              onRemovePortCall={removePortCall}
              onDragEnd={handleDragEnd}
              onBunkerRateChange={handleBunkerRateChange}
              onShipChange={handleShipChange}
              onCurrencyChange={handleCurrencyChange}
              onRunningCostChange={handleRunningCostChange}
              onScheduleUpdate={handleScheduleUpdate}
              onGetDistances={handleGetDistances}
              onLoadPortsChange={handleLoadPortsChange}
              onDischargePortsChange={handleDischargePortsChange}
              onBallastSpeedChange={handleBallastSpeedChange}
              onLadenSpeedChange={handleLadenSpeedChange}
            />


          </>
        )}
      </div>
    </div>
  );
}
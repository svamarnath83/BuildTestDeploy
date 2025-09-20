'use client';

import { useState, useRef, useEffect } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { 
  heading,
  Button,
  showWarningNotification,
  showErrorNotification,
  showSuccessNotification,
  getUnitOfMeasure,
  getPort
} from '@commercialapp/ui';
import { ChevronDown } from 'lucide-react';
import { UnitOfMeasure } from '@commercialapp/ui/libs/registers/unit-of-measure/models';
// All imports now from local cargo-analysis libs
import { 
  CargoInput,
  shipAnalysis,
  PortCall,
  generateShipAnalysis,
  recalculateScheduleDates,
  addPortCallToSchedule,
  removePortCallFromSchedule,
  updatePortCallField,
  validateFuelDays,
  updatePortCallDistances,
  ProcessPortCallDistance,
  calculateBunkerConsumptionForSchedule,
  clearDistanceCache,
  clearAllDistancesFromSchedule,
  removeAllRoutingPointsFromSchedule,
  updateScheduleSpeedsBasedOnUseCases,
  calculateFinancialMetrics,
} from '../libs';
import { 
  convertToApiModel, 
  validateApiModelData, 
  createEstimateSummary,
  addOrUpdateEstimate,
  generateEstimate,
  type ApiModel 
} from '../libs';
import CargoDetails from './CargoDetails';
import ShipAnalysisResult from './ShipAnalysisResult';
import EstDetailedEstimate from './estDetailedEstimate';







export default function CargoAnalysisExplorer() {
  const [cargoInput, setCargoInput] = useState<CargoInput>({
    commodity: '',
    quantity: 0,
    quantityType: '',
    loadPorts: [],
    dischargePorts: [],
    selectedShips: [], // Initialize empty array for selected ships
    rate: 0,
    currency: 'USD',
    rateType: '',
    laycanFrom: new Date().toISOString().split('T')[0],
    laycanTo: new Date().toISOString().split('T')[0]
  });

  const [showResults, setShowResults] = useState(false);
  const [shipAnalysisResults, setShipAnalysisResults] = useState<shipAnalysis[]>([]);
  const [selectedVessel, setSelectedVessel] = useState<shipAnalysis | null>(null);
  const [estimateCache, setEstimateCache] = useState<Record<number, PortCall[]>>({});
  const [bestSuitableVessel, setBestSuitableVessel] = useState<shipAnalysis | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingVoyage, setIsCreatingVoyage] = useState(false);
  const [ports, setPorts] = useState<Array<{ Id?: number; Name: string; IsEurope?: boolean }>>([]);
  
  // State to track if this is an existing estimate and whether to show ShipAnalysisResult
  const [isExistingEstimate, setIsExistingEstimate] = useState(false);
  const [showShipAnalysis, setShowShipAnalysis] = useState(true); // Show by default

  const resultsRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const shipAnalysisRef = useRef<HTMLDivElement>(null);

  const loadDefaultUnits = async () => {
    try {
      const units = await getUnitOfMeasure();
      const defaultUnit = units.data.find((unit: UnitOfMeasure) => unit.isDefault);
      
      if (defaultUnit && defaultUnit.id) {
        setCargoInput(prev => ({
          ...prev,
          quantityType: defaultUnit.id.toString(),
          rateType: defaultUnit.id.toString()
        }));
      }
    } catch (error) {
      console.error('Failed to load default units:', error);
    }
  };

  const loadPorts = async () => {
    try {
      const portsResponse = await getPort();
      setPorts(portsResponse.data);
    } catch (error) {
      console.error('Failed to load ports:', error);
    }
  };

  useEffect(() => {
    loadDefaultUnits();
    loadPorts();
  }, []);

  // Detect if this is an existing estimate by checking if we already have ship analysis results
  useEffect(() => {
    if (shipAnalysisResults.length > 0) {
      setIsExistingEstimate(true);
      // Don't automatically hide ShipAnalysisResult - let user control it
      // setShowShipAnalysis(false); // Hide ShipAnalysisResult by default for existing estimates
    }
  }, [shipAnalysisResults]);

  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResults]);

  useEffect(() => {
    if (selectedVessel && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100); // A small delay ensures the element is rendered before scrolling
    }
  }, [selectedVessel]);

  // Handler for marking/unmarking best suitable vessel
  const handleBestSuitableToggle = (ship: shipAnalysis) => {
    setBestSuitableVessel(prevBest => 
      prevBest?.vessel.id === ship.vessel.id ? null : ship
    );
  };

  // Handler for removing ship from analysis results
  const handleRemoveShip = (ship: shipAnalysis) => {
    // Remove from results
    setShipAnalysisResults(prevResults => 
      prevResults.filter(result => result.vessel.id !== ship.vessel.id)
    );
    
    // Clear selection if the removed ship was selected
    if (selectedVessel?.vessel.id === ship.vessel.id) {
      setSelectedVessel(null);
    }
    
    // Clear best suitable if the removed ship was marked as best
    if (bestSuitableVessel?.vessel.id === ship.vessel.id) {
      setBestSuitableVessel(null);
    }
    
    // Remove from cache
    setEstimateCache(prevCache => {
      const newCache = { ...prevCache };
      delete newCache[ship.vessel.id];
      return newCache;
    });
  };

  // Handler for toggling ShipAnalysisResult visibility
  const handleToggleShipAnalysis = () => {
    const newShowShipAnalysis = !showShipAnalysis;
    setShowShipAnalysis(newShowShipAnalysis);
    
    // Scroll to ShipAnalysisResult when showing it
    if (newShowShipAnalysis && shipAnalysisRef.current) {
      setTimeout(() => {
        shipAnalysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Handler for ship change in detailed estimate
  const handleShipChange = (shipId: number) => {
    // Find the ship in results and select it
    const ship = shipAnalysisResults.find(s => s.vessel.id === shipId);
    if (ship) {
      setSelectedVessel(ship);
    }
  };

  // Handler for currency change in detailed estimate
  const handleCurrencyChange = (currency: string) => {
    setCargoInput(prev => ({
      ...prev,
      currency: currency as 'USD' | 'EUR' | 'GBP' | 'INR' | 'SGD' | 'AUD'
    }));
  };

  // Handler for running cost changes
  const handleRunningCostChange = (field: string, value: number | string) => {
    if (!selectedVessel) return;
    
    const updatedVessel = {
      ...selectedVessel,
      vessel: {
        ...selectedVessel.vessel,
        [field]: value
      }
    };
    
    setSelectedVessel(updatedVessel);
    
    // Update in ship analysis results
    setShipAnalysisResults(prevResults => 
      prevResults.map(ship => 
        ship.vessel.id === selectedVessel.vessel.id ? updatedVessel : ship
      )
    );
  };

  // Handler for ballast speed changes
  const handleBallastSpeedChange = (speed: string) => {
    if (!selectedVessel) return;
    
    console.log(`\n🚢 BALLAST SPEED CHANGE DETECTED - Vessel: ${selectedVessel.vessel.name}, New Speed: ${speed}`);
    
    const updatedVessel = {
      ...selectedVessel,
      vessel: {
        ...selectedVessel.vessel,
        ballastSpeed: parseFloat(speed) || 0
      }
    };
    
    // Update schedule speeds based on use cases
    console.log('🔄 About to call updateScheduleSpeedsBasedOnUseCases...');
    console.log('🔄 Current portCalls:', selectedVessel.portCalls);
    const updatedSchedule = updateScheduleSpeedsBasedOnUseCases(selectedVessel.portCalls);
    console.log('🔄 Updated schedule returned:', updatedSchedule);
    
    // Recalculate bunker consumption for all ports with updated speeds
    const scheduleWithRecalculatedBunker = calculateBunkerConsumptionForSchedule(
      updatedSchedule, 
      selectedVessel.bunkerRates, 
      updatedVessel.vessel
    );
    
    const updatedShipAnalysis = {
      ...updatedVessel,
      portCalls: scheduleWithRecalculatedBunker
    };
    
    setSelectedVessel(updatedShipAnalysis);
    
    // Update in ship analysis results
    setShipAnalysisResults(prevResults => 
      prevResults.map(ship => 
        ship.vessel.id === selectedVessel.vessel.id ? updatedShipAnalysis : ship
      )
    );
    
    console.log(`✅ Ballast speed change and schedule speed update completed for ${selectedVessel.vessel.vesselName || selectedVessel.vessel.name}`);
  };

  // Handler for laden speed changes
  const handleLadenSpeedChange = (speed: string) => {
    if (!selectedVessel) return;
    
    console.log(`\n🚢 LADEN SPEED CHANGE DETECTED - Vessel: ${selectedVessel.vessel.vesselName || selectedVessel.vessel.name}, New Speed: ${speed}`);
    
    const updatedVessel = {
      ...selectedVessel,
      vessel: {
        ...selectedVessel.vessel,
        ladenSpeed: parseFloat(speed) || 0
      }
    };
    
    // Update schedule speeds based on use cases
    console.log('🔄 About to call updateScheduleSpeedsBasedOnUseCases...');
    console.log('🔄 Current portCalls:', selectedVessel.portCalls);
    const updatedSchedule = updateScheduleSpeedsBasedOnUseCases(selectedVessel.portCalls);
    console.log('🔄 Updated schedule returned:', updatedSchedule);
    
    // Recalculate bunker consumption for all ports with updated speeds
    const scheduleWithRecalculatedBunker = calculateBunkerConsumptionForSchedule(
      updatedSchedule, 
      selectedVessel.bunkerRates, 
      updatedVessel.vessel
    );
    
    const updatedShipAnalysis = {
      ...updatedVessel,
      portCalls: scheduleWithRecalculatedBunker
    };
    
    setSelectedVessel(updatedShipAnalysis);
    
    // Update in ship analysis results
    setShipAnalysisResults(prevResults => 
      prevResults.map(ship => 
        ship.vessel.id === selectedVessel.vessel.id ? updatedShipAnalysis : ship
      )
    );
    
    console.log(`✅ Laden speed change and schedule speed update completed for ${selectedVessel.vessel.vesselName || selectedVessel.vessel.name}`);
  };

  const handleBunkerRateChange = (index: number, field: string, value: string) => {
    if (!selectedVessel) return;
    const newRates = [...selectedVessel.bunkerRates];
    (newRates[index] as unknown as Record<string, unknown>)[field] = parseFloat(value) || 0;
    
    console.log(`\n⛽ BUNKER RATE CHANGE DETECTED - Grade: ${newRates[index].grade}, Field: ${field}, New Value: ${value}`);
    
    // Recalculate bunker consumption for all ports with new rates
    const scheduleWithRecalculatedBunker = calculateBunkerConsumptionForSchedule(
      selectedVessel.portCalls, 
      newRates, 
      selectedVessel.vessel
    );
    
    const updatedShipAnalysis = {
      ...selectedVessel,
      bunkerRates: newRates,
      portCalls: scheduleWithRecalculatedBunker
    };
    setSelectedVessel(updatedShipAnalysis);
    
    // Update cache
    setEstimateCache(prevCache => ({
      ...prevCache,
      [selectedVessel.vessel.id]: scheduleWithRecalculatedBunker
    }));
    
    console.log(`✅ Bunker rate change and consumption recalculation completed for ${newRates[index].grade}`);
  };

  const addPortCall = async (index: number) => {
    if (!selectedVessel) return;
    
    // Clear distance cache due to port count change
    clearDistanceCache();
    
    const newSchedule = addPortCallToSchedule(selectedVessel.portCalls, index);
    
    // Clear all distances from schedule (per DistanceUsecases.md requirement)
    const scheduleWithClearedDistances = clearAllDistancesFromSchedule(newSchedule);
    
    // Only recalculate dates, no automatic distance lookup
    const recalculatedSchedule = recalculateScheduleDates(scheduleWithClearedDistances, selectedVessel.vessel);
    
    const updatedShipAnalysis = {
      ...selectedVessel,
      portCalls: recalculatedSchedule
    };
    setSelectedVessel(updatedShipAnalysis);
    
    // Update shipAnalysisResults to keep it in sync
    setShipAnalysisResults(prevResults => 
      prevResults.map(ship => 
        ship.vessel.id === selectedVessel.vessel.id ? updatedShipAnalysis : ship
      )
    );
  };

  const removePortCall = async (id: number) => {
    if (!selectedVessel) return;
    
    // Clear distance cache due to port count change
    clearDistanceCache();
    
    const newSchedule = removePortCallFromSchedule(selectedVessel.portCalls, id);
    
    // Clear all distances from schedule (per DistanceUsecases.md requirement)
    const scheduleWithClearedDistances = clearAllDistancesFromSchedule(newSchedule);
    
    // Only recalculate dates, no automatic distance lookup
    const recalculatedSchedule = recalculateScheduleDates(scheduleWithClearedDistances, selectedVessel.vessel);
    
    const updatedShipAnalysis = {
      ...selectedVessel,
      portCalls: recalculatedSchedule
    };
    setSelectedVessel(updatedShipAnalysis);
    
    // Update shipAnalysisResults to keep it in sync
    setShipAnalysisResults(prevResults => 
      prevResults.map(ship => 
        ship.vessel.id === selectedVessel.vessel.id ? updatedShipAnalysis : ship
      )
    );
  };



    const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && selectedVessel) {
      const currentSchedule = selectedVessel.portCalls;
      const oldIndex = currentSchedule.findIndex((item: PortCall) => item.id === active.id);
      const newIndex = currentSchedule.findIndex((item: PortCall) => item.id === over.id);

      // Prevent moving the Ballast leg (always at index 0)
      if (oldIndex === 0 || newIndex === 0) {
        return;
      }

      console.log('🔄 Port drag and drop detected - clearing distances (per DistanceUsecases.md)');
      console.log('📋 Moving port from index', oldIndex, 'to index', newIndex);
      console.log('📊 Current schedule before drag:', currentSchedule.map(p => ({ port: p.portName, distance: p.distance })));

      // Clear distance cache due to port position change
      clearDistanceCache();

      const newOrderedSchedule = arrayMove(currentSchedule, oldIndex, newIndex);
      
      // Clear all distances from schedule (per DistanceUsecases.md requirement)
      const scheduleWithClearedDistances = clearAllDistancesFromSchedule(newOrderedSchedule);
      
      // Only recalculate dates, no automatic distance lookup
      const recalculatedSchedule = recalculateScheduleDates(scheduleWithClearedDistances, selectedVessel.vessel);
      
      console.log('📊 Schedule after drag and distance clearing:', recalculatedSchedule.map(p => ({ port: p.portName, distance: p.distance })));
      
      // Update selectedVessel with new schedule
      const updatedShipAnalysis = {
        ...selectedVessel,
        portCalls: recalculatedSchedule
      };
      setSelectedVessel(updatedShipAnalysis);
      
      // Update shipAnalysisResults to keep it in sync
      setShipAnalysisResults(prevResults => 
        prevResults.map(ship => 
          ship.vessel.id === selectedVessel.vessel.id ? updatedShipAnalysis : ship
        )
      );
      
      // Update cache
      setEstimateCache(prevCache => ({
        ...prevCache,
        [selectedVessel.vessel.id]: recalculatedSchedule
      }));
      
      console.log('✅ Port drag and drop completed - distances cleared');
    }
  };

  const handleVesselSelection = (ship: shipAnalysis | null) => {
    setSelectedVessel(ship);

    if (ship) {
      // Check cache for existing estimate
      if (estimateCache[ship.vessel.id]) {
        // Update the ship analysis with cached schedule
        const updatedShip = {
          ...ship,
          portCalls: estimateCache[ship.vessel.id]
        };
        setSelectedVessel(updatedShip);
      } else {
        // Cache the initial schedule
        setEstimateCache(prevCache => ({
          ...prevCache,
          [ship.vessel.id]: ship.portCalls
        }));
      }
    }
  };



  const handleScheduleChange = async (index: number, field: string, value: string | number) => {
    if (!selectedVessel) return;

    const newSchedule = updatePortCallField(selectedVessel.portCalls, index, field as keyof PortCall, value, ports);
    
    // Clear distance cache if port name changed (but don't auto-lookup distances)
    if (field === 'portName') {
      clearDistanceCache();
    }
    
    // If distance changed, calculate bunker consumption
    if (field === 'distance') {
      // For distance changes, recalculate bunker consumption and dates
      const scheduleWithBunkerConsumption = calculateBunkerConsumptionForSchedule(newSchedule, selectedVessel.bunkerRates, selectedVessel.vessel);
      const recalculatedSchedule = recalculateScheduleDates(scheduleWithBunkerConsumption, selectedVessel.vessel);
      
      const updatedShipAnalysis = {
        ...selectedVessel,
        portCalls: recalculatedSchedule
      };
      
      setSelectedVessel(updatedShipAnalysis);
      
      // Update shipAnalysisResults to keep it in sync
      setShipAnalysisResults(prevResults => 
        prevResults.map(ship => 
          ship.vessel.id === selectedVessel.vessel.id ? updatedShipAnalysis : ship
        )
      );
      
      // Save updated schedule to cache
      setEstimateCache(prevCache => ({
        ...prevCache,
        [selectedVessel.vessel.id]: recalculatedSchedule
      }));
      
      return;
    }
    if (field === 'portDays') {
      // For port days changes, recalculate bunker consumption and dates
      const scheduleWithBunkerConsumption = calculateBunkerConsumptionForSchedule(newSchedule, selectedVessel.bunkerRates, selectedVessel.vessel);
      const recalculatedSchedule = recalculateScheduleDates(scheduleWithBunkerConsumption, selectedVessel.vessel);
      
      const updatedShipAnalysis = {
        ...selectedVessel,
        portCalls: recalculatedSchedule
      };
      
      setSelectedVessel(updatedShipAnalysis);
      
      // Update shipAnalysisResults to keep it in sync
      setShipAnalysisResults(prevResults => 
        prevResults.map(ship => 
          ship.vessel.id === selectedVessel.vessel.id ? updatedShipAnalysis : ship
        )
      );
      
      // Save updated schedule to cache
      setEstimateCache(prevCache => ({
        ...prevCache,
        [selectedVessel.vessel.id]: recalculatedSchedule
      }));
      
      return;
    }
    
    // Only recalculate dates for other field changes, no automatic distance lookup
    const recalculatedSchedule = recalculateScheduleDates(newSchedule, selectedVessel.vessel);
    
    const updatedShipAnalysis = {
      ...selectedVessel,
      portCalls: recalculatedSchedule
    };
    setSelectedVessel(updatedShipAnalysis);
    
    // Update shipAnalysisResults to keep it in sync
    setShipAnalysisResults(prevResults => 
      prevResults.map(ship => 
        ship.vessel.id === selectedVessel.vessel.id ? updatedShipAnalysis : ship
      )
    );
    
    // Save updated schedule to cache
    setEstimateCache(prevCache => ({
      ...prevCache,
      [selectedVessel.vessel.id]: recalculatedSchedule
    }));
  };

  // Handle complete schedule update (for routing point alternatives)
  const handleScheduleUpdate = async (newSchedule: PortCall[]) => {
    if (!selectedVessel) return;
    
    console.log('🔄 CargoAnalysisExplorer: Handling complete schedule update...', newSchedule.map(p => ({ port: p.portName, activity: p.activity, distance: p.distance })));
    
    // Check if this is from alternate route selection (distances are cleared)
    const hasClearedDistances = newSchedule.some(call => call.distance === 0 && !call.isRoutingPoint);
    
    if (hasClearedDistances) {
      // Only recalculate dates (distances remain cleared)
      const recalculatedSchedule = recalculateScheduleDates(newSchedule, selectedVessel.vessel);
      
      // Update the selected vessel
      const updatedShipAnalysis = {
        ...selectedVessel,
        portCalls: recalculatedSchedule
      };
      setSelectedVessel(updatedShipAnalysis);
      
      // Update shipAnalysisResults to keep it in sync
      setShipAnalysisResults(prevResults => 
        prevResults.map(ship => 
          ship.vessel.id === selectedVessel.vessel.id ? updatedShipAnalysis : ship
        )
      );
      
      // Save updated schedule to cache
      setEstimateCache(prevCache => ({
        ...prevCache,
        [selectedVessel.vessel.id]: recalculatedSchedule
      }));
      
      console.log('✅ CargoAnalysisExplorer: Schedule update complete (distances remain cleared)');
    } else {
      console.log('📏 Normal schedule update - recalculating distances...');
      
      // Update distances for the new schedule
      const scheduleWithDistances = await updatePortCallDistances(newSchedule, selectedVessel.bunkerRates, selectedVessel.vessel);
      
      // Recalculate dates based on distances
      const recalculatedSchedule = recalculateScheduleDates(scheduleWithDistances, selectedVessel.vessel);
      
      // Update the selected vessel
      const updatedShipAnalysis = {
        ...selectedVessel,
        portCalls: recalculatedSchedule
      };
      setSelectedVessel(updatedShipAnalysis);
      
      // Update shipAnalysisResults to keep it in sync
      setShipAnalysisResults(prevResults => 
        prevResults.map(ship => 
          ship.vessel.id === selectedVessel.vessel.id ? updatedShipAnalysis : ship
        )
      );
      
      // Save updated schedule to cache
      setEstimateCache(prevCache => ({
        ...prevCache,
        [selectedVessel.vessel.id]: recalculatedSchedule
      }));
      
      console.log('✅ CargoAnalysisExplorer: Schedule update complete');
    }
  };



  // Handle load ports change to update ship analysis positions
  const handleLoadPortsChange = (newLoadPorts: string[], previousLoadPorts: string[], cargoTerms?: { loadTerms?: number; dischargeTerms?: number }) => {
    console.log('🚀 handleLoadPortsChange called in CargoAnalysisExplorer:', { newLoadPorts, previousLoadPorts });
    
    // Only proceed if we have ship analysis results and a selected vessel
    if (!selectedVessel || shipAnalysisResults.length === 0) {
      console.log('ℹ️ Load ports changed but no ship analysis available yet');
      return;
    }
    
    console.log('🔄 Load ports changed:', { previous: previousLoadPorts, new: newLoadPorts });
    
    const currentSchedule = [...selectedVessel.portCalls];
    const newSchedule = [...currentSchedule];
    
    // Find the first discharge port index
    const firstDischargePortIndex = currentSchedule.findIndex(call => call.activity === 'Discharge');
    
    // Find the last load port index
    const lastLoadPortIndex = currentSchedule.findIndex(call => call.activity === 'Load');
    
    // Determine where to insert new load ports
    let insertIndex: number;
    if (firstDischargePortIndex !== -1) {
      // Insert before first discharge port
      insertIndex = firstDischargePortIndex;
    } else if (lastLoadPortIndex !== -1) {
      // Insert after last load port
      insertIndex = lastLoadPortIndex + 1;
    } else {
      // No load/discharge ports yet, insert after ballast
      insertIndex = 1;
    }
    
    // Smart port synchronization: preserve existing ports and only add/remove what changed
    const updatedSchedule = [...currentSchedule];
    
    // Find existing load ports in the schedule
    const existingLoadPorts = currentSchedule.filter(call => call.activity === 'Load');
    
    console.log('🔄 Smart load port sync:', {
      existingLoadPorts: existingLoadPorts.map(p => ({ name: p.portName, days: p.portDays, id: p.id })),
      newLoadPorts,
      currentScheduleLength: currentSchedule.length
    });
    
    // Remove load ports that are no longer in the new list
    const portsToRemove = existingLoadPorts.filter(existingPort => 
      !newLoadPorts.includes(existingPort.portName)
    );
    
    console.log('🗑️ Removing load ports:', portsToRemove.map(p => p.portName));
    
    // Remove the ports that are no longer needed
    portsToRemove.forEach(portToRemove => {
      const removeIndex = updatedSchedule.findIndex(call => call.id === portToRemove.id);
      if (removeIndex !== -1) {
        updatedSchedule.splice(removeIndex, 1);
      }
    });
    
    // Add new load ports that don't exist yet
    let newPortsAdded = 0;
    newLoadPorts.forEach((portName, index) => {
      const existingPort = existingLoadPorts.find(ep => ep.portName === portName);
      
      if (!existingPort) {
        // This is a new port, create it with sensible defaults
        const portData = ports.find(p => p.Name === portName);
        const isEurope = portData?.IsEurope === true;
        
        // Try to get default port days from passed cargo terms or cargo input
        const defaultPortDays = cargoTerms?.loadTerms || cargoInput.loadTerms || 0;
        
        console.log('🔍 Cargo terms for load port defaults:', {
          passedLoadTerms: cargoTerms?.loadTerms,
          cargoInputLoadTerms: cargoInput.loadTerms,
          defaultPortDays,
          cargoInputKeys: Object.keys(cargoInput)
        });
        
        const newLoadPort: PortCall = {
          id: Date.now() + index + Math.random(),
          portName,
          portId: portData?.Id,
          activity: 'Load',
          portDays: defaultPortDays, // Use cargo load terms as default
          secPortDays: 0, // Default secondary port days
          additionalCosts: 0, // Default additional costs
          eta: '', // Will be calculated
          etd: '', // Will be calculated
          isFixed: false, // Not fixed by default
          isDeletable: false, // Load ports should not be deletable or editable
          hfoDays: 0, // Will be calculated based on distance
          lsfoDays: 0, // Will be calculated based on distance
          mgoDays: 0, // Will be calculated based on distance
          distance: 0, // Will be calculated
          secDistance: 0, // Will be calculated
          secSteamDays: 0, // Will be calculated
          speedSetting: 'Laden', // Use laden speed for load ports
          currentRoutingPoint: [], // No routing points initially
          bunkerConsumption: [], // Will be calculated
          europe: isEurope // Set based on port data
        };
        
        // Insert at the calculated position
        updatedSchedule.splice(insertIndex + newPortsAdded, 0, newLoadPort);
        newPortsAdded++;
        
        console.log('➕ Added new load port:', portName, 'with default portDays:', defaultPortDays);
        console.log('🔍 New load port complete object:', newLoadPort);
        console.log('🔍 New load port activity field:', newLoadPort.activity);
      } else {
        console.log('✅ Preserved existing load port:', portName, 'with properties:', {
          portDays: existingPort.portDays,
          secPortDays: existingPort.secPortDays,
          additionalCosts: existingPort.additionalCosts,
          id: existingPort.id
        });
      }
      // If port already exists, keep it as is (preserving all properties)
    });
    
    // Recalculate dates for the updated schedule
    const recalculatedSchedule = recalculateScheduleDates(updatedSchedule, selectedVessel.vessel);
    
    // Update the selected vessel
    const updatedShipAnalysis = {
      ...selectedVessel,
      portCalls: recalculatedSchedule
    };
    setSelectedVessel(updatedShipAnalysis);
    
    // Update shipAnalysisResults to keep it in sync
    setShipAnalysisResults(prevResults => 
      prevResults.map(ship => 
        ship.vessel.id === selectedVessel.vessel.id ? updatedShipAnalysis : ship
      )
    );
    
    // Save updated schedule to cache
    setEstimateCache(prevCache => ({
      ...prevCache,
      [selectedVessel.vessel.id]: recalculatedSchedule
    }));
    
    console.log('✅ Load ports updated in ship analysis schedule');
    console.log('🔍 Final updated schedule:', updatedShipAnalysis.portCalls.map(p => ({ 
      portName: p.portName, 
      activity: p.activity, 
      portDays: p.portDays 
    })));
  };

  // Handle discharge ports change to update ship analysis positions
  const handleDischargePortsChange = (newDischargePorts: string[], previousDischargePorts: string[], cargoTerms?: { loadTerms?: number; dischargeTerms?: number }) => {
    console.log('🚀 handleDischargePortsChange called in CargoAnalysisExplorer:', { newDischargePorts, previousDischargePorts });
    
    // Only proceed if we have ship analysis results and a selected vessel
    if (!selectedVessel || shipAnalysisResults.length === 0) {
      console.log('ℹ️ Discharge ports changed but no ship analysis available yet');
      return;
    }
    
    console.log('🔄 Discharge ports changed:', { previous: previousDischargePorts, new: newDischargePorts });
    
    const currentSchedule = [...selectedVessel.portCalls];
    const newSchedule = [...currentSchedule];
    
    // Find the first load port index
    const firstLoadPortIndex = currentSchedule.findIndex(call => call.activity === 'Load');
    
    // Smart port synchronization: preserve existing ports and only add/remove what changed
    const updatedSchedule = [...currentSchedule];
    
    // Find existing discharge ports in the schedule
    const existingDischargePorts = currentSchedule.filter(call => call.activity === 'Discharge');
    
    // Determine where to insert new discharge ports
    let insertIndex: number;
    if (existingDischargePorts.length > 0) {
      // Find the last existing discharge port and insert after it
      const lastExistingDischargePort = existingDischargePorts[existingDischargePorts.length - 1];
      const lastDischargePortIndex = currentSchedule.findIndex(call => call.id === lastExistingDischargePort.id);
      insertIndex = lastDischargePortIndex + 1;
      console.log('🔍 Inserting after last existing discharge port:', {
        lastDischargePort: lastExistingDischargePort.portName,
        lastDischargePortIndex,
        insertIndex
      });
    } else if (firstLoadPortIndex !== -1) {
      // No existing discharge ports, insert after last load port
      insertIndex = firstLoadPortIndex + 1;
      // Find the actual last load port
      for (let i = firstLoadPortIndex; i < currentSchedule.length; i++) {
        if (currentSchedule[i].activity === 'Load') {
          insertIndex = i + 1;
        } else {
          break;
        }
      }
      console.log('🔍 No existing discharge ports, inserting after last load port:', {
        firstLoadPortIndex,
        insertIndex
      });
    } else {
      // No load ports yet, insert after ballast
      insertIndex = 1;
      console.log('🔍 No load ports, inserting after ballast:', { insertIndex });
    }
    
    console.log('🔄 Smart discharge port sync:', {
      existingDischargePorts: existingDischargePorts.map(p => ({ name: p.portName, days: p.portDays, id: p.id })),
      newDischargePorts,
      currentScheduleLength: currentSchedule.length
    });
    
    // Remove discharge ports that are no longer in the new list
    const portsToRemove = existingDischargePorts.filter(existingPort => 
      !newDischargePorts.includes(existingPort.portName)
    );
    
    console.log('🗑️ Removing discharge ports:', portsToRemove.map(p => p.portName));
    
    // Remove the ports that are no longer needed
    portsToRemove.forEach(portToRemove => {
      const removeIndex = updatedSchedule.findIndex(call => call.id === portToRemove.id);
      if (removeIndex !== -1) {
        updatedSchedule.splice(removeIndex, 1);
      }
    });
    
    // Add new discharge ports that don't exist yet
    let newPortsAdded = 0;
    newDischargePorts.forEach((portName, index) => {
      const existingPort = existingDischargePorts.find(ep => ep.portName === portName);
      
      if (!existingPort) {
        // This is a new port, create it with sensible defaults
        const portData = ports.find(p => p.Name === portName);
        const isEurope = portData?.IsEurope === true;
        
        // Try to get default port days from passed cargo terms or cargo input
        const defaultPortDays = cargoTerms?.dischargeTerms || cargoInput.dischargeTerms || 0;
        
        console.log('🔍 Cargo terms for discharge port defaults:', {
          passedDischargeTerms: cargoTerms?.dischargeTerms,
          cargoInputDischargeTerms: cargoInput.dischargeTerms,
          defaultPortDays,
          cargoInputKeys: Object.keys(cargoInput)
        });
        
        const newDischargePort: PortCall = {
          id: Date.now() + index + Math.random(),
          portName,
          portId: portData?.Id,
          activity: 'Discharge',
          portDays: defaultPortDays, // Use cargo discharge terms as default
          secPortDays: 0, // Default secondary port days
          additionalCosts: 0, // Default additional costs
          eta: '', // Will be calculated
          etd: '', // Will be calculated
          isFixed: false, // Not fixed by default
          isDeletable: false, // Discharge ports should not be deletable or editable
          hfoDays: 0, // Will be calculated based on distance
          lsfoDays: 0, // Will be calculated based on distance
          mgoDays: 0, // Will be calculated based on distance
          distance: 0, // Will be calculated
          secDistance: 0, // Will be calculated
          secSteamDays: 0, // Will be calculated
          speedSetting: 'Laden', // Use laden speed for discharge ports
          currentRoutingPoint: [], // No routing points initially
          bunkerConsumption: [], // Will be calculated
          europe: isEurope // Set based on port data
        };
        
        // Insert at the calculated position
        updatedSchedule.splice(insertIndex + newPortsAdded, 0, newDischargePort);
        newPortsAdded++;
        
        console.log('➕ Added new discharge port:', portName, 'with default portDays:', defaultPortDays);
        console.log('🔍 New discharge port complete object:', newDischargePort);
        console.log('🔍 New discharge port activity field:', newDischargePort.activity);
      } else {
        console.log('✅ Preserved existing discharge port:', portName, 'with properties:', {
          portDays: existingPort.portDays,
          secPortDays: existingPort.secPortDays,
          additionalCosts: existingPort.additionalCosts,
          id: existingPort.id
        });
      }
      // If port already exists, keep it as is (preserving all properties)
    });
    
    // Recalculate dates for the updated schedule
    const recalculatedSchedule = recalculateScheduleDates(updatedSchedule, selectedVessel.vessel);
    
    // Update the selected vessel
    const updatedShipAnalysis = {
      ...selectedVessel,
      portCalls: recalculatedSchedule
    };
    setSelectedVessel(updatedShipAnalysis);
    
    // Update shipAnalysisResults to keep it in sync
    setShipAnalysisResults(prevResults => 
      prevResults.map(ship => 
        ship.vessel.id === selectedVessel.vessel.id ? updatedShipAnalysis : ship
      )
    );
    
    // Save updated schedule to cache
    setEstimateCache(prevCache => ({
      ...prevCache,
      [selectedVessel.vessel.id]: recalculatedSchedule
    }));
    
    console.log('✅ Discharge ports updated in ship analysis schedule');
    console.log('🔍 Final updated schedule:', updatedShipAnalysis.portCalls.map(p => ({ 
      portName: p.portName, 
      activity: p.activity, 
      portDays: p.portDays 
    })));
  };

  // Debug: Log when handlers are created and passed
  useEffect(() => {
    console.log('🔍 CargoAnalysisExplorer handlers created:', { 
      hasHandleLoadPortsChange: !!handleLoadPortsChange,
      hasHandleDischargePortsChange: !!handleDischargePortsChange,
      handleLoadPortsChangeType: typeof handleLoadPortsChange,
      handleDischargePortsChangeType: typeof handleDischargePortsChange,
      handleLoadPortsChangeValue: handleLoadPortsChange,
      handleDischargePortsChangeValue: handleDischargePortsChange
    });
  }, [handleLoadPortsChange, handleDischargePortsChange]);


  const handleGetDistances = async () => {
    if (!selectedVessel) return;
    
    // Check if we need pre-calculation cleanup (per DistanceUsecases.md)
    const hasRoutingPoints = selectedVessel.portCalls.some(call => call.isRoutingPoint);
    const hasMissingDistances = selectedVessel.portCalls.some(call => call.distance === 0 && !call.isRoutingPoint);
    
    let scheduleToProcess = selectedVessel.portCalls;
    
    // Only do pre-calculation cleanup if there are routing points AND missing distances
    // AND the routing points don't have proper alternatives set up (indicating they're stale)
    const hasStaleRoutingPoints = hasRoutingPoints && selectedVessel.portCalls.some(call => 
      call.isRoutingPoint && (!call.availableRoutingPoints || call.availableRoutingPoints.length === 0)
    );
    
    if (hasStaleRoutingPoints && hasMissingDistances) {
     
      
      // Remove all routing points and clear distances (per DistanceUsecases.md pre-calculation cleanup)
      scheduleToProcess = removeAllRoutingPointsFromSchedule(selectedVessel.portCalls);
      scheduleToProcess = clearAllDistancesFromSchedule(scheduleToProcess);
    } else {
    }
    
    // Call ProcessPortCallDistance to handle API call and distance processing
    const scheduleWithDistances = await ProcessPortCallDistance(scheduleToProcess, selectedVessel.bunkerRates, selectedVessel.vessel);
    
    const recalculatedSchedule = recalculateScheduleDates(scheduleWithDistances, selectedVessel.vessel);
    
    // Recalculate bunker consumption for all ports with updated distances
    const scheduleWithRecalculatedBunker = calculateBunkerConsumptionForSchedule(
      recalculatedSchedule, 
      selectedVessel.bunkerRates, 
      selectedVessel.vessel
    );
    
    const updatedShipAnalysis = {
      ...selectedVessel,
      portCalls: scheduleWithRecalculatedBunker
    };
    setSelectedVessel(updatedShipAnalysis);
    
    // Update cache
    setEstimateCache(prevCache => ({
      ...prevCache,
      [selectedVessel.vessel.id]: scheduleWithRecalculatedBunker
    }));
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasAtLeastOneLoadPort = cargoInput.loadPorts.length > 0;
    const hasAtLeastOneDischargePort = cargoInput.dischargePorts.length > 0;
    if (cargoInput.commodity && cargoInput.quantity > 0 && hasAtLeastOneLoadPort && hasAtLeastOneDischargePort && cargoInput.rate > 0) {
      // Pass selected ships to generateShipAnalysis if any are selected
      const analysisResults = await generateShipAnalysis(cargoInput, cargoInput.selectedShips, ports);
      const results = analysisResults.sort((a: shipAnalysis, b: shipAnalysis) => b.financeMetrics.finalProfit - a.financeMetrics.finalProfit);
      setShipAnalysisResults(results);
      setShowResults(true);
      
      // Always show ShipAnalysisResult when analysis is performed
      setIsExistingEstimate(false);
      setShowShipAnalysis(true);
      
      console.log('📏 Ship Analysis completed - distances calculated');
      if (cargoInput.selectedShips && cargoInput.selectedShips.length > 0) {
        console.log(`🎯 Analysis limited to ${cargoInput.selectedShips.length} selected ships`);
      } else {
        console.log('🚢 Analyzing all available ships');
      }
    }
  };

  //tobe deleted, not used anymore ********
  const handleSaveEstimate = async () => {

    //print handleSaveEstimate called
    console.log('🔍 handleSaveEstimate $$$$$$ called....');

    if (isSaving) return; // Prevent double-clicking
    
    setIsSaving(true);
    try {
      
      const actualEstimate = shipAnalysisResults.find(ship => ship.suitable);

      if (actualEstimate === undefined) {
        showErrorNotification({
          title: "No suitable vessel found",
          description: "Best suitable vessel not found in ship analysis results",
          duration: 6000
        });
        return;
      }
   
      // Validate that we have all required data
      const validation = validateApiModelData(shipAnalysisResults);
      
      if (!validation.isValid) {
        showWarningNotification({
          title: "Cannot Save Estimate",
          description: validation.errors.join('. '),
          duration: 8000
        });
        console.log('❌ Returning early due to validation failure');
        return;
      }
      
      if (selectedVessel?.portCalls[0]?.eta === '' || selectedVessel?.portCalls[0]?.eta === null) {
        selectedVessel.portCalls[0].eta = selectedVessel.portCalls[0].etd;
      } 

      console.log('✅ Validation passed, proceeding with save');

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
        // Use aggregated gross freight if present
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

      //print shipAnalysisResults
      console.log('🔍 Ship Analysis Results:', shipsForSave); 

      // Convert to API model format
      const apiModel: ApiModel = convertToApiModel(
        shipsForSave,
        aggregatedCargoInput,
        selectedVessel?.portCalls
      );

      // Create summary for user confirmation
      const summary = createEstimateSummary(shipsForSave, aggregatedCargoInput);
      
      console.log('💾 Saving estimate with data:', {
        estimateNo: apiModel.estimateNo,
        ship: apiModel.ship,
        commodity: apiModel.commodity,
        profit: summary.profit,
        revenue: summary.revenue
      });

      // Call AddOrUpdateEstimate API
      const response = await addOrUpdateEstimate(apiModel);
      const savedEstimate = response.data;
      
      // Show success message with estimate details
      showSuccessNotification({
        title: "Estimate Saved Successfully",
        description: `Estimate No: ${savedEstimate.estimateNo} | Vessel: ${summary.vesselName} | Profit: ${summary.currency} ${summary.profit.toLocaleString()} | Margin: ${summary.margin.toFixed(2)}%`,
        duration: 6000
      });
      
      return savedEstimate;
      
    } catch (error: unknown) {
      console.error('❌ Error saving estimate:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      showErrorNotification({
        title: "Error Saving Estimate",
        description: errorMessage,
        duration: 5000
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateVoyage = async () => {
    if (isCreatingVoyage) return; // Prevent double-clicking
    
    setIsCreatingVoyage(true);
    try {
      // First save the estimate
      const savedEstimate = await handleSaveEstimate();
      
      if (!savedEstimate) {
        throw new Error('Failed to save estimate before creating voyage');
      }
      
      // Then create voyage from the saved estimate
      const voyageResponse = await generateEstimate(savedEstimate.id);
      const voyageResult = voyageResponse.data as any;
      const isSuccess = (voyageResult && (voyageResult.success === true || voyageResult.Success === true));
      const voyageNo = voyageResult?.voyageNo ?? voyageResult?.VoyageNo ?? voyageResult?.data?.voyageNo ?? voyageResult?.Data?.voyageNo;

      if (isSuccess) {
        showSuccessNotification({
          title: "Voyage Created Successfully",
          description: `Voyage No: ${voyageNo ?? 'N/A'} | Estimate No: ${savedEstimate.estimateNo}`,
          duration: 6000
        });
      } else {
        const message = voyageResult?.message || voyageResult?.Message || 'Voyage creation failed - no success response';
        throw new Error(message);
      }
      
    } catch (error: unknown) {
      console.error('❌ Error creating voyage:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      showErrorNotification({
        title: "Error Creating Voyage",
        description: errorMessage,
        duration: 5000
      });
    } finally {
      setIsCreatingVoyage(false);
    }
  };



  return (
    <div className="p-4 space-y-6">
      <div className={heading}>Cargo vs Ships Analysis</div>
      
      <CargoDetails 
        cargoInput={cargoInput}
        onCargoInputChange={setCargoInput}
        onSubmit={handleSubmit}
        onLoadPortsChange={handleLoadPortsChange}
      />

      {/* Toggle button to show/hide ShipAnalysisResult */}
      {shipAnalysisResults.length > 0 && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={handleToggleShipAnalysis}
            className="flex items-center gap-2 px-6 py-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            {showShipAnalysis ? 'Hide Ship Analysis' : 'Show Ship Analysis'}
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showShipAnalysis ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      )}

      {/* ShipAnalysisResult - show based on toggle state when there are results */}
      {shipAnalysisResults.length > 0 && showShipAnalysis && (
        <div ref={shipAnalysisRef}>
          <ShipAnalysisResult 
            showResults={showResults}
            shipAnalysisResults={shipAnalysisResults}
            selectedVessel={selectedVessel}
            bestSuitableVessel={bestSuitableVessel}
            cargoInput={cargoInput}
            onVesselSelection={handleVesselSelection}
            onBestSuitableToggle={handleBestSuitableToggle}
            onRemoveShip={handleRemoveShip}
          />
        </div>
      )}

      {/* Detailed Estimate Section */}
      <div ref={detailsRef}>
        {selectedVessel && (
          <>
            <EstDetailedEstimate
              shipAnalysis={selectedVessel}
              cargoInput={cargoInput}
              availableShips={shipAnalysisResults}
              estimateStatus={isExistingEstimate ? 'Draft' : 'Draft'}
              onSaveEstimate={handleSaveEstimate}
              onGenerateEstimate={handleCreateVoyage}
              onScheduleChange={handleScheduleChange}
              onAddPortCall={addPortCall}
              onRemovePortCall={removePortCall}
              onDragEnd={handleDragEnd}
              onBunkerRateChange={handleBunkerRateChange}
              onShipChange={handleShipChange}
              onCurrencyChange={handleCurrencyChange}
              onRunningCostChange={handleRunningCostChange}
              onBallastSpeedChange={handleBallastSpeedChange}
              onLadenSpeedChange={handleLadenSpeedChange}
              onScheduleUpdate={handleScheduleUpdate}
              onGetDistances={handleGetDistances}
              onLoadPortsChange={handleLoadPortsChange}
              onDischargePortsChange={handleDischargePortsChange}
              onCargoesChange={(newCargoes) => {
                // Update selected vessel cargoes so save sees latest list (only if changed)
                setSelectedVessel(prev => {
                  if (!prev) return prev;
                  const prevStr = JSON.stringify(prev.cargoes || []);
                  const nextStr = JSON.stringify(newCargoes || []);
                  if (prevStr === nextStr) return prev;
                  return { ...prev, cargoes: newCargoes };
                });
                // Also update in analysis results (only if changed)
                setShipAnalysisResults(prev => {
                  const selectedId = selectedVessel?.vessel.id;
                  if (!selectedId) return prev;
                  const current = prev.find(s => s.vessel.id === selectedId);
                  const prevStr = JSON.stringify((current && current.cargoes) || []);
                  const nextStr = JSON.stringify(newCargoes || []);
                  if (prevStr === nextStr) return prev;
                  return prev.map(s => s.vessel.id === selectedId ? { ...s, cargoes: newCargoes } : s);
                });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
} 
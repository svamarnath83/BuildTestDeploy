'use client';

import { DragEndEvent } from '@dnd-kit/core';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label,
  FormItem,
  labelText,
  valueText,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@commercialapp/ui';
import { 
  shipAnalysis,
  CargoInput,
  PortCall,
  BunkerRate,
  FinancialMetrics,
  EstimateCalculationParams,
  calculateFinancialMetrics,
  addRoutingPointFromAvailable,
  handleSwitchRoutingPoint,
  RoutingPoint
} from '../libs';
import EstPortRotation from './estPortRotation';
import EstMap from './estMap';
import EstBunkerRates from './estBunkerRates';
import EstFinancialSummary from './estFinancialSummary';
import EstHeader from './estHeader';
import EstCargoList from './estCargoList';
import { useState, useEffect, useMemo } from 'react';
import { getCurrency } from '@commercialapp/ui/libs/registers/currencies/service';
import { Currency } from '@commercialapp/ui/libs/registers/currencies/models';
import { getPort } from '@commercialapp/ui/libs/registers/ports/services';
import { Port } from '@commercialapp/ui/libs/registers/ports/models';
import { Clock } from 'lucide-react';
import { ActivityPanel } from '@commercialapp/ui';
import { MODULE_ID } from '@commercialapp/ui';


interface EstDetailedEstimateProps {
  shipAnalysis: shipAnalysis;
  cargoInput: CargoInput;
  availableShips?: shipAnalysis[];
  ports?: Port[];
  revenue?: number;
  voyageCosts?: number;
  totalOpEx?: number;
  estimateId?: number;
  estimateStatus: string;
  onSaveEstimate?: () => void;
  onGenerateEstimate?: () => void;
  onScheduleChange?: (index: number, field: keyof PortCall, value: string | number) => void;
  onAddPortCall?: (index: number) => void;
  onRemovePortCall?: (id: number) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onBunkerRateChange?: (index: number, field: keyof BunkerRate, value: string) => void;
  onShipChange?: (shipId: number) => void;
  onCurrencyChange?: (currency: string) => void;
  onRunningCostChange?: (field: string, value: number | string) => void;
  onScheduleUpdate?: (newSchedule: PortCall[]) => void;
  onGetDistances?: () => Promise<void>;
  onLoadPortsChange?: (loadPorts: string[], previousLoadPorts: string[], cargoTerms?: { loadTerms?: number; dischargeTerms?: number }) => void;
  onDischargePortsChange?: (dischargePorts: string[], previousDischargePorts: string[], cargoTerms?: { loadTerms?: number; dischargeTerms?: number }) => void;
  onBallastSpeedChange?: (speed: string) => void;
  onLadenSpeedChange?: (speed: string) => void;
  onAddRoutingPoint?: (portCallIndex: number, routingPoint: RoutingPoint) => void;
  onSwitchRoutingPoint?: (portCallIndex: number, routingPointIndex: number) => void;
  onCargoesChange?: (cargoes: CargoInput[]) => void;
  hideSaveButton?: boolean;
}

export default function EstDetailedEstimate({
  shipAnalysis,
  cargoInput,
  availableShips = [],
  onScheduleChange,
  onAddPortCall,
  onRemovePortCall,
  onDragEnd,
  onBunkerRateChange,
  onShipChange,
  onCurrencyChange,
  onRunningCostChange,
  onScheduleUpdate,
  onGetDistances,
  onBallastSpeedChange,
  onLadenSpeedChange,
  onLoadPortsChange,
  onDischargePortsChange,
  estimateId,
  estimateStatus,
  onSaveEstimate,
  onGenerateEstimate,
  onCargoesChange,
  hideSaveButton
}: EstDetailedEstimateProps) {
  
  // Debug: Log props on component render
  console.log('🔍 EstDetailedEstimate render with props:', { 
    hasOnLoadPortsChange: !!onLoadPortsChange, 
    hasOnDischargePortsChange: !!onDischargePortsChange,
    onLoadPortsChangeType: typeof onLoadPortsChange,
    onDischargePortsChangeType: typeof onDischargePortsChange,
    onLoadPortsChangeValue: onLoadPortsChange,
    onDischargePortsChangeValue: onDischargePortsChange
  });
  // Toggle state for map/schedule view
  const [showMap, setShowMap] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  
  // Handler for switching routing points
  const handleSwitchRoutingPointHandler = (selectedPortIndex: number, selectedRoutingPoint: RoutingPoint) => {
    console.log('🔄 EstDetailedEstimate: Switching routing point...', { selectedPortIndex, selectedRoutingPoint });
    
    const newSchedule = handleSwitchRoutingPoint(
      shipAnalysis.portCalls, 
      selectedPortIndex, 
      selectedRoutingPoint
    );
    
    console.log('📋 EstDetailedEstimate: New schedule after switching routing point:', newSchedule);
    
    // If we have an onScheduleUpdate callback, use it to update the entire schedule
    if (onScheduleUpdate) {
      onScheduleUpdate(newSchedule);
    } else {
      console.warn('⚠️ EstDetailedEstimate: No onScheduleUpdate handler provided - switching routing points will not work properly');
    }
  };

  // Handler for adding routing points from available options
  const handleAddRoutingPoint = (mainPortIndex: number, selectedRoutingPoint: RoutingPoint) => {
    console.log('➕ EstDetailedEstimate: Adding routing point...', { mainPortIndex, selectedRoutingPoint });
    
    const newSchedule = addRoutingPointFromAvailable(
      shipAnalysis.portCalls, 
      mainPortIndex, 
      selectedRoutingPoint
    );
    
    console.log('📋 EstDetailedEstimate: New schedule after adding routing point:', newSchedule.map(p => ({ port: p.portName, activity: p.activity })));
    
    // If we have an onScheduleUpdate callback, use it to update the entire schedule
    if (onScheduleUpdate) {
      onScheduleUpdate(newSchedule);
    } else {
      console.warn('⚠️ EstDetailedEstimate: No onScheduleUpdate handler provided - adding routing points will not work properly');
    }
  };

  // Currencies state
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  // Ports state
  const [ports, setPorts] = useState<Port[]>([]);

  // Cargoes state for the grid - memoized to prevent unnecessary re-renders
  const [cargoes, setCargoes] = useState<CargoInput[]>(() => {
    console.log('estDetailedEstimate: Initializing cargoes state');
    const initial = (shipAnalysis && Array.isArray(shipAnalysis.cargoes) && shipAnalysis.cargoes.length > 0)
      ? shipAnalysis.cargoes
      : [cargoInput];
    return initial;
  });

  // When opening an existing estimate, sync cargo list from shipAnalysis once, with equality guard
  useEffect(() => {
    const incoming = (shipAnalysis && Array.isArray(shipAnalysis.cargoes)) ? shipAnalysis.cargoes : [];
    if (incoming.length > 0) {
      const prevStr = JSON.stringify(cargoes);
      const nextStr = JSON.stringify(incoming);
      if (prevStr !== nextStr) {
        setCargoes(incoming);
      }
    }
  }, [shipAnalysis?.vessel?.id]);

  // Emit cargoes to parent whenever they change so save can include them
  useEffect(() => {
    if (onCargoesChange) {
      onCargoesChange(cargoes);
    }
  }, [cargoes]);

  // Calculate financial metrics using the imported service - memoized to prevent expensive recalculations
  const financialMetrics = useMemo(() => {
    console.log('estDetailedEstimate: Calculating financial metrics...');
    console.log('estDetailedEstimate: Current cargoes:', cargoes);
    
    // Calculate total revenue and gross freight from all cargoes
    const totalRevenue = cargoes.reduce((total, cargo) => {
      const cargoRevenue = (cargo.rate || 0) * (cargo.quantity || 0);
      return total + cargoRevenue;
    }, 0);
    
    // Calculate total gross freight from all cargoes (including additional freight components)
    const totalGrossFreight = cargoes.reduce((total, cargo) => {
      const baseFreight = (cargo.rate || 0) * (cargo.quantity || 0);
      const additionalFreight = (cargo.demurrageRate || 0) + 
                               (cargo.despatchRate || 0) + 
                               (cargo.bunkerCompensation || 0) + 
                               (cargo.otherIncome || 0) + 
                               (cargo.co2Income || 0) + 
                               (cargo.totalCommission || 0);
      console.log('🔍 Cargo gross freight calculation:', {
        cargo: cargo.commodity || `Cargo ${cargoes.indexOf(cargo)}`,
        baseFreight,
        additionalFreight,
        total: baseFreight + additionalFreight
      });
      return total + baseFreight + additionalFreight;
    }, 0);
    
    console.log('estDetailedEstimate: Total revenue from all cargoes:', totalRevenue);
    console.log('estDetailedEstimate: Total gross freight from all cargoes:', totalGrossFreight);
    
    // Use the first cargo for other calculations, but with aggregated values
    const updatedCargoInput = {
      ...cargoInput,
      rate: cargoes[0]?.rate || cargoInput.rate,
      quantity: cargoes[0]?.quantity || cargoInput.quantity,
      // Override the financial calculation with aggregated values from all cargoes
      totalGrossFreight: totalGrossFreight
    };
    
    console.log('estDetailedEstimate: Updated cargoInput for financial calculation:', updatedCargoInput);
    
    return calculateFinancialMetrics({
      shipAnalysis,
      cargoInput: updatedCargoInput
    });
  }, [shipAnalysis, cargoInput, cargoes]); // Recalculate when cargoes change

  const {
    revenue,
    voyageCosts,
    totalOpEx,
    finalProfit,
    tce,
    totalVoyageDuration
  } = financialMetrics;

  // Load currencies from API
  const loadCurrencies = async () => {
    try {
      const response = await getCurrency();
      setCurrencies(response.data);
    } catch (error) {
      console.error('Failed to load currencies:', error);
    }
  };

  // Load ports from API
  const loadPorts = async () => {
    try {
      const response = await getPort();
      setPorts(response.data);
    } catch (error) {
      console.error('Failed to load ports:', error);
    }
  };

  // Load currencies and ports on component mount
  useEffect(() => {
    loadCurrencies();
    loadPorts();
  }, []);

  // Handlers for cargo operations - memoized to prevent re-creation on every render
  const handleCargoChange = useMemo(() => (index: number, field: keyof CargoInput, value: string | number | string[] | boolean) => {
    console.log('🔍 handleCargoChange called:', { index, field, value, type: typeof value });
    
    // Get the previous cargo state for port change detection
    const previousCargo = cargoes[index];
    console.log('🔍 Previous cargo:', previousCargo);
    
    setCargoes(prev => prev.map((cargo, i) => 
      i === index ? { ...cargo, [field]: value } : cargo
    ));
    
    // Handle port changes to update ship analysis positions
    if (field === 'loadPorts' && onLoadPortsChange && previousCargo) {
      const newLoadPorts = value as string[];
      const previousLoadPorts = previousCargo.loadPorts;
      console.log('🔄 Load ports changed in estCargoList:', { previous: previousLoadPorts, new: newLoadPorts });
      console.log('🔄 Calling onLoadPortsChange with:', { newLoadPorts, previousLoadPorts });
      
      // Pass the cargo terms so the port handler can use them for defaults
      const cargoTerms = {
        loadTerms: previousCargo.loadTerms,
        dischargeTerms: previousCargo.dischargeTerms
      };
      console.log('🔍 Passing cargo terms to load ports handler:', cargoTerms);
      onLoadPortsChange(newLoadPorts, previousLoadPorts, cargoTerms);
    } else if (field === 'loadPorts') {
      console.log('⚠️ Load ports changed but handler not called:', { 
        hasOnLoadPortsChange: !!onLoadPortsChange, 
        hasPreviousCargo: !!previousCargo,
        field,
        value 
      });
    }
    
    if (field === 'dischargePorts' && onDischargePortsChange && previousCargo) {
      const newDischargePorts = value as string[];
      const previousDischargePorts = previousCargo.dischargePorts;
      console.log('🔄 Discharge ports changed in estCargoList:', { previous: previousDischargePorts, new: newDischargePorts });
      console.log('🔄 Calling onDischargePortsChange with:', { newDischargePorts, previousDischargePorts });
      
      // Pass the cargo terms so the port handler can use them for defaults
      const cargoTerms = {
        loadTerms: previousCargo.loadTerms,
        dischargeTerms: previousCargo.dischargeTerms
      };
      console.log('🔍 Passing cargo terms to discharge ports handler:', cargoTerms);
      onDischargePortsChange(newDischargePorts, previousDischargePorts, cargoTerms);
    } else if (field === 'dischargePorts') {
      console.log('⚠️ Discharge ports changed but handler not called:', { 
        hasOnDischargePortsChange: !!onDischargePortsChange, 
        hasPreviousCargo: !!previousCargo,
        field,
        value 
      });
    }
    
    // Trigger revenue recalculation when financial-relevant fields change
    if (field === 'rate' || field === 'quantity' || 
        field === 'demurrageRate' || field === 'despatchRate' || 
        field === 'bunkerCompensation' || field === 'otherIncome' || 
        field === 'co2Income' || field === 'commissionPercentage') {
      console.log('🔍 Financial field changed, triggering recalculation');
      // Force a re-render to trigger financial metrics recalculation
      setCargoes(prev => [...prev]); // This will trigger the useEffect in estCargoList
    }
  }, [cargoes, onLoadPortsChange, onDischargePortsChange]);

  // Debug: Log when props change
  useEffect(() => {
    console.log('🔍 EstDetailedEstimate props changed:', { 
      hasOnLoadPortsChange: !!onLoadPortsChange, 
      hasOnDischargePortsChange: !!onDischargePortsChange,
      onLoadPortsChangeType: typeof onLoadPortsChange,
      onDischargePortsChangeType: typeof onDischargePortsChange,
      onLoadPortsChangeValue: onLoadPortsChange,
      onDischargePortsChangeValue: onDischargePortsChange
    });
  }, [onLoadPortsChange, onDischargePortsChange]);

  const handleAddCargo = useMemo(() => () => {
    console.log('estDetailedEstimate: Adding cargo');
    
    // Get unit types from first cargo if available, otherwise use empty strings
    const firstCargo = cargoes[0];
    const defaultQuantityType = firstCargo?.quantityType || '';
    const defaultRateType = firstCargo?.rateType || '';
    
    // Create empty cargo template inheriting from first cargo
    const emptyCargo: CargoInput = {
      commodity: '',
      quantity: 0,
      quantityType: defaultQuantityType,
      loadPorts: [],
      dischargePorts: [],
      rate: 0,
      currency: 'USD',
      rateType: defaultRateType,
      laycanFrom: new Date().toISOString().split('T')[0],
      laycanTo: new Date().toISOString().split('T')[0],
      // Extended fields with default values
      loadTerms: 0,
      loadLayTermTypes: '',
      loadExcludedPeriod: '',
      dischargeTerms: 0,
      dischargeLayTermTypes: '',
      dischargeExcludedPeriod: '',
      commissionPercentage: 0,
      demurrageRate: 0,
      despatchRate: 0,
      bunkerCompensation: 0,
      otherIncome: 0,
      co2Income: 0,
      includeCommissionOnDemurrage: false,
      includeCommissionOnDespatch: false,
      includeCommissionOnBunkerCompensation: false,
      totalCommission: 0,
      totalDemurrage: 0,
      totalDespatch: 0,
      totalGrossFreight: 0
    };
    setCargoes(prev => [...prev, emptyCargo]);
    
    // Trigger revenue recalculation after adding cargo
    setTimeout(() => {
      setCargoes(prev => [...prev]); // Force re-render to trigger calculations
    }, 0);
  }, []);

  const handleRemoveCargo = useMemo(() => (index: number) => {
    console.log('estDetailedEstimate: Removing cargo', index);
    setCargoes(prev => prev.filter((_, i) => i !== index));
    
    // Trigger revenue recalculation after removing cargo
    setTimeout(() => {
      setCargoes(prev => [...prev]); // Force re-render to trigger calculations
    }, 0);
  }, []);

  return (
    <Card className="border-2 border-blue-600">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-sm font-medium flex-1">
            Detailed Estimate - {shipAnalysis.vessel.name}
          </CardTitle>
          
          {/* Centered Status */}
          <div className="flex-1 flex justify-center">
            {estimateId && estimateId > 0 && (
              <div className="flex items-center justify-center gap-2">
                <span className={`px-3 py-1.5 text-xs font-semibold rounded-md shadow-sm ${
                  estimateStatus === 'Draft' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                  estimateStatus === 'Approved' ? 'bg-green-100 text-green-800 border border-green-300' :
                  estimateStatus === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-300' :
                  estimateStatus === 'Generated' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                  'bg-gray-100 text-gray-800 border border-gray-300'
                }`}>
                  {estimateStatus || 'Draft'}
                </span>
              </div>
            )}
          </div>
          
          {/* Right-aligned Action Buttons and Activity Button */}
          <div className="flex-1 flex justify-end items-center gap-3">
            {/* Save and Generate Buttons - Only show when estimateId > 0 */}
            {!hideSaveButton && estimateStatus !== 'Generated' && (
              <Button
                onClick={() => onSaveEstimate && onSaveEstimate()}
                className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors h-7"
              >
                Save Estimate
              </Button>
            )}

            {estimateId && estimateId > 0 && estimateStatus !== 'Generated' && (
              <Button
                onClick={() => onGenerateEstimate && onGenerateEstimate()}
                className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors h-7"
              >
                Generate
              </Button>
            )}
            
            {/* Activity Button - Only show when estimateId > 0 */}
            {estimateId && estimateId > 0 && (
              <button
                aria-label="View Activity"
                onClick={() => setShowActivity(true)}
                className="h-9 w-9 grid place-items-center rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                <Clock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Header Section - Ship Details & Running Costs */}
        <EstHeader
          shipAnalysis={shipAnalysis}
          cargoInput={cargoInput}
          availableShips={availableShips}
          currencies={currencies}
          estimateId={estimateId}
          onShipChange={onShipChange}
          onCurrencyChange={onCurrencyChange}
          onRunningCostChange={onRunningCostChange}
          onBallastSpeedChange={onBallastSpeedChange}
          onLadenSpeedChange={onLadenSpeedChange}
        />

        {/* Cargo List Section */}
        <EstCargoList
          cargoes={cargoes}
          onCargoChange={handleCargoChange}
          onAddCargo={handleAddCargo}
          onRemoveCargo={handleRemoveCargo}
        />
        
        {/* L/D Schedule & Costs */}
        <div>
          {/* Title with Toggle Button */}
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Rotation Schedule</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {showMap ? 'Map View' : 'Table View'}
              </span>
              <Button
                onClick={() => setShowMap(!showMap)}
                className="text-xs px-3 py-1 h-7 bg-white hover:bg-gray-50 text-gray-700 border-2 border-blue-600 hover:border-blue-700"
              >
                {showMap ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M3 6h18"/>
                      <path d="M3 12h18"/>
                      <path d="M3 18h18"/>
                    </svg>
                    Table
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M7 12h10"/>
                      <path d="M3 18h18"/>
                    </svg>
                    Map
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Conditional Content */}
          {showMap ? (
            <EstMap 
              schedule={shipAnalysis.portCalls}
              vessel={shipAnalysis.vessel}
            />
          ) : (
            <div>
              <EstPortRotation
                schedule={shipAnalysis.portCalls}
                selectedVessel={shipAnalysis.vessel}
                ports={ports}
                bunkerRates={shipAnalysis.bunkerRates}
                onScheduleChange={onScheduleChange || (() => {})}
                onAddPortCall={onAddPortCall || (() => {})}
                onRemovePortCall={onRemovePortCall || (() => {})}
                onDragEnd={onDragEnd || (() => {})}
                onAddRoutingPoint={handleAddRoutingPoint}
                onSwitchRoutingPoint={handleSwitchRoutingPointHandler}
                onGetDistances={onGetDistances || (() => Promise.resolve())}
              />
            </div>
          )}
        </div>

        {/* Bunker Rates */}
        <EstBunkerRates
          bunkerRates={shipAnalysis.bunkerRates}
          schedule={shipAnalysis.portCalls}
          onBunkerRateChange={onBunkerRateChange || (() => {})}
        />

        {/* Financial Summary */}
        <EstFinancialSummary
          revenue={revenue}
          voyageCosts={voyageCosts}
          totalOpEx={totalOpEx}
          finalProfit={finalProfit}
          tce={tce}
          totalVoyageDuration={totalVoyageDuration}
        />

        {/* Action Buttons - Only show when estimateId > 0 */}
        {/* This block is now moved to the CardHeader */}
      </CardContent>

      {/* Activity Panel - Only show when estimateId > 0 */}
      {estimateId && estimateId > 0 && (
        <ActivityPanel 
          moduleId={MODULE_ID.ESTIMATE} 
          recordId={estimateId}
          placement="right"
          overlay
          open={showActivity}
          onOpenChange={setShowActivity}
          title="Estimate Activity"
          className="z-50"
        />
      )}
    </Card>
  );
} 
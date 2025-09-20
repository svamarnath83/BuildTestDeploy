'use client';

import React from 'react';
import { 
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  AsyncMultiSelect,
  AsyncSelectOption,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  DatePicker
} from '@commercialapp/ui';
import { CargoInput } from '../libs';
import { useCallback, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getCommodity } from '@commercialapp/ui';
import { getUnitOfMeasure } from '@commercialapp/ui';
import { getCurrency } from '@commercialapp/ui';
import { getPort } from '@commercialapp/ui';
import { UnitOfMeasure } from '@commercialapp/ui';
import { Currency } from '@commercialapp/ui';

interface EstCargoListProps {
  cargoes: CargoInput[];
  onCargoChange: (index: number, field: keyof CargoInput, value: string | number | string[] | boolean) => void;
  onAddCargo: () => void;
  onRemoveCargo: (index: number) => void;
}

export default function EstCargoList({
  cargoes,
  onCargoChange,
  onAddCargo,
  onRemoveCargo
}: EstCargoListProps) {

  // State for API-loaded data
  const [commodities, setCommodities] = useState<Array<{ Code: string; Name: string }>>([]);
  const [unitsOfMeasure, setUnitsOfMeasure] = useState<UnitOfMeasure[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [ports, setPorts] = useState<Array<{ Id: number; PortCode: string; Name: string }>>([]);
  
  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Toggle expansion for a row
  const toggleExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  // Options for select fields
  const layTermOptions = [
    { value: 'days', label: 'Days' },
    { value: 'hours', label: 'Hours' },
    { value: 'tons_per_hour', label: 'Tons per Hour' },
    { value: 'long_tons_per_hour', label: 'Long Tons per Hour' },
    { value: 'metric_tons_per_hour', label: 'Metric Tons per Hour' }
  ];

  const excludedPeriodOptions = [
    { value: 'shinc', label: 'SHINC' },
    { value: 'shex', label: 'SHEX' },
    { value: 'fhinc', label: 'FHINC' },
    { value: 'fhex', label: 'FHEX' },
    { value: 'wwhinc', label: 'WWHINC' },
    { value: 'wwhex', label: 'WWHEX' }
  ];

  // Load data from APIs
  const loadCommodities = async () => {
    try {
      const response = await getCommodity();
      setCommodities(response.data);
    } catch (error) {
      console.error('Failed to load commodities:', error);
    }
  };

  const loadUnitsOfMeasure = async () => {
    try {
      const response = await getUnitOfMeasure();
      setUnitsOfMeasure(response.data);
    } catch (error) {
      console.error('Failed to load units of measure:', error);
    }
  };

  const loadCurrencies = async () => {
    try {
      const response = await getCurrency();
      setCurrencies(response.data);
    } catch (error) {
      console.error('Failed to load currencies:', error);
    }
  };

  const loadPorts = async () => {
    try {
      const response = await getPort();
      setPorts(response.data);
    } catch (error) {
      console.error('Failed to load ports:', error);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    loadCommodities();
    loadUnitsOfMeasure();
    loadCurrencies();
    loadPorts();
  }, []);

  const mapPortToOption = useCallback((port: { Id: number; PortCode: string; Name: string }): AsyncSelectOption => ({
    value: port.Name,
    label: port.Name,
    displayValue: port.Name
  }), []);

  // Calculate totals for each cargo
  useEffect(() => {
    cargoes.forEach((cargo, index) => {
      // Calculate Total Commission
      let totalCommission = 0;
      const commissionRate = (cargo.commissionPercentage || 0) / 100;
      
      
      // Base freight calculation
      const fromType = (cargo.quantityType || '').toString().trim().toUpperCase();
      const toType = (cargo.rateType || '').toString().trim().toUpperCase();
      const LONGTON = 1.0160469088; // Metric tons per long ton
      const SHORTTON = 0.90718474;  // Metric tons per short ton
      let convertedQty = cargo.quantity || 0;
      if (fromType !== '' && toType !== '') {
        if (fromType === toType) {
          convertedQty = cargo.quantity || 0;
        } else if (fromType === 'L' && toType === 'M') {
          convertedQty = (cargo.quantity || 0) * LONGTON;
        } else if (fromType === 'M' && toType === 'L') {
          convertedQty = (cargo.quantity || 0) * (1 / LONGTON);
        } else if (fromType === 'S' && toType === 'M') {
          convertedQty = (cargo.quantity || 0) * SHORTTON;
        } else if (fromType === 'M' && toType === 'S') {
          convertedQty = (cargo.quantity || 0) * (1 / SHORTTON);
        } else if (fromType === 'L' && toType === 'S') {
          convertedQty = ((cargo.quantity || 0) * LONGTON) * (1 / SHORTTON);
        } else if (fromType === 'S' && toType === 'L') {
          convertedQty = ((cargo.quantity || 0) * SHORTTON) * (1 / LONGTON);
        } else {
          convertedQty = cargo.quantity || 0; // Fallback
        }
      }
      const baseFreight = (cargo.rate || 0) * convertedQty;
      totalCommission += baseFreight * commissionRate;
      
      // Commission on Demurrage
      if (cargo.includeCommissionOnDemurrage && cargo.demurrageRate) {
        totalCommission += (cargo.demurrageRate || 0) * commissionRate;
      }
      
      // Commission on Despatch
      if (cargo.includeCommissionOnDespatch && cargo.despatchRate) {
        totalCommission += (cargo.despatchRate || 0) * commissionRate;
      }
      
      // Commission on Bunker Compensation
      if (cargo.includeCommissionOnBunkerCompensation && cargo.bunkerCompensation) {
        totalCommission += (cargo.bunkerCompensation || 0) * commissionRate;
      }
      
      // Calculate Total Gross Freight
      const totalGrossFreight = baseFreight + 
        (cargo.demurrageRate || 0) + 
        (cargo.despatchRate || 0) + 
        (cargo.bunkerCompensation || 0) + 
        (cargo.otherIncome || 0) + 
        (cargo.co2Income || 0) + 
        totalCommission;
      
      // Update cargo with calculated values
      if (cargo.totalCommission !== totalCommission || 
          cargo.totalDemurrage !== (cargo.demurrageRate || 0) ||
          cargo.totalDespatch !== (cargo.despatchRate || 0) ||
          cargo.totalGrossFreight !== totalGrossFreight) {
        
        console.log('🔍 estCargoList: Updating cargo totals for index', index, {
          totalCommission,
          totalDemurrage: cargo.demurrageRate || 0,
          totalDespatch: cargo.despatchRate || 0,
          totalGrossFreight
        });
        
        onCargoChange(index, 'totalCommission', totalCommission);
        onCargoChange(index, 'totalDemurrage', cargo.demurrageRate || 0);
        onCargoChange(index, 'totalDespatch', cargo.despatchRate || 0);
        onCargoChange(index, 'totalGrossFreight', totalGrossFreight);
      }
    });
  }, [cargoes, onCargoChange]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Cargo Details</h3>
      </div>
      
      <div className="overflow-x-auto">
        <Table className="min-w-full max-w-[1300px] text-xs">
          <thead className="bg-[#f5f6fa]">
            <tr>
              <th className="text-left font-medium text-gray-500" style={{ height: '24px', padding: '4px 8px' }}>Commodity</th>
              <th className="text-left font-medium text-gray-500" style={{ height: '24px', padding: '4px 8px' }}>Quantity</th>
              <th className="text-left font-medium text-gray-500" style={{ height: '24px', padding: '4px 8px' }}>Load Ports</th>
              <th className="text-left font-medium text-gray-500" style={{ height: '24px', padding: '4px 8px' }}>Discharge Ports</th>
                                                         <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px', height: '24px', padding: '4px 8px' }}>Rate</th>
                              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '140px', height: '24px', padding: '4px 8px' }}>Laycan From</th>
                <th className="text-left font-medium text-gray-500" style={{ width: '140px', height: '24px', padding: '4px 8px' }}>Laycan To</th>
              <th className="text-left font-medium text-gray-500" style={{ height: '24px', padding: '4px 8px' }}>
                                 <button
                   type="button"
                   className="group relative transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 rounded-md p-1 animate-pulse hover:animate-none w-6 h-6 flex items-center justify-center"
                   onClick={() => onAddCargo()}
                   title="Add cargo"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M5 12h14"/>
                     <path d="M12 5v14"/>
                   </svg>
                 </button>
              </th>
            </tr>
          </thead>
          <TableBody>
            {cargoes.map((cargo, index) => (
              <React.Fragment key={index}>
                <TableRow className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ease-in-out border-l-4 border-l-transparent hover:border-l-blue-400">
                <TableCell className="group-hover:bg-blue-50 transition-colors" style={{ width: '120px' }}>
                  <Select
                    value={cargo.commodity}
                    onValueChange={(value) => onCargoChange(index, 'commodity', value)}
                  >
                    <SelectTrigger className="w-24 h-7 text-[10px] bg-transparent group-hover:bg-transparent">
                      <SelectValue placeholder="Select commodity" />
                    </SelectTrigger>
                    <SelectContent>
                      {commodities.map((commodity) => (
                        <SelectItem key={commodity.Code} value={commodity.Code}>
                          {commodity.Code} - {commodity.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                  <TableCell className="group-hover:bg-blue-50 transition-colors" style={{ width: '100px' }}>
                   <div className="flex items-center gap-1">
                     <div className="w-16 h-6 px-2 py-1 bg-white rounded border-b border-gray-300 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center">
                       <input
                         type="number"
                         className="w-full bg-transparent border-none outline-none text-xs text-gray-600 text-right"
                         value={cargo.quantity}
                         onChange={(e) => onCargoChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                         placeholder="0"
                       />
                     </div>
                     <Select
                       value={cargo.quantityType}
                       onValueChange={(value) => onCargoChange(index, 'quantityType', value)}
                     >
                       <SelectTrigger className="w-14 h-6 text-[8px] bg-transparent group-hover:bg-transparent">
                         <SelectValue placeholder="Unit" />
                       </SelectTrigger>
                       <SelectContent>
                         {unitsOfMeasure.map((unit) => (
                           <SelectItem key={unit.code || unit.id} value={unit.code || ''}>
                             {unit.name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                 </TableCell>

                                 <TableCell style={{ minWidth: '180px' }} className="group-hover:bg-blue-50 transition-colors">
                   <div className="text-[12px]">
                   <AsyncMultiSelect
                     value={cargo.loadPorts.map(portName => ({
                      value: portName,
                      label: portName,
                      displayValue: portName
                    }))}
                    onChange={(opts: AsyncSelectOption[]) => {
                      console.log('🔄 estCargoList loadPorts onChange called:', { index, opts, mappedValues: opts.map(o => o.value.toString()) });
                      onCargoChange(index, 'loadPorts', opts.map(o => o.value.toString()));
                    }}
                    data={ports}
                    mapToOption={mapPortToOption}
                    showCodeOnly={true}
                    placeholder="Load ports"
                      styles={{
                        valueContainer: (base: any) => ({
                          ...base,
                          fontSize: '12px'
                        }),
                        input: (base: any) => ({
                          ...base,
                          fontSize: '12px'
                        }),
                        placeholder: (base: any) => ({
                          ...base,
                          fontSize: '12px'
                        }),
                        option: (base: any) => ({
                          ...base,
                          fontSize: '12px'
                        })
                      }}
                    />
                   </div>
                </TableCell>
                                 <TableCell style={{ minWidth: '180px' }} className="group-hover:bg-blue-50 transition-colors">
                   <div className="text-[12px]">
                   <AsyncMultiSelect
                     value={cargo.dischargePorts.map(portName => ({
                      value: portName,
                      label: portName,
                      displayValue: portName
                    }))}
                    onChange={(opts: AsyncSelectOption[]) => {
                      console.log('🔄 estCargoList dischargePorts onChange called:', { index, opts, mappedValues: opts.map(o => o.value.toString()) });
                      onCargoChange(index, 'dischargePorts', opts.map(o => o.value.toString()));
                    }}
                    data={ports}
                    mapToOption={mapPortToOption}
                    showCodeOnly={true}
                    placeholder="Discharge ports"
                      styles={{
                        valueContainer: (base: any) => ({
                          ...base,
                          fontSize: '12px'
                        }),
                        input: (base: any) => ({
                          ...base,
                          fontSize: '12px'
                        }),
                        placeholder: (base: any) => ({
                          ...base,
                          fontSize: '12px'
                        }),
                        option: (base: any) => ({
                          ...base,
                          fontSize: '12px'
                        })
                      }}
                    />
                   </div>
                </TableCell>
                                 <TableCell className="group-hover:bg-blue-50 transition-colors">
                   <div className="flex items-center gap-1">
                     <div className="w-20 h-6 px-2 py-1 bg-white rounded border-b border-gray-300 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center">
                       <input
                         type="number"
                         step="0.01"
                         className="w-full bg-transparent border-none outline-none text-xs text-gray-600 text-right"
                         value={cargo.rate}
                         onChange={(e) => onCargoChange(index, 'rate', parseFloat(e.target.value) || 0)}
                         placeholder="0.00"
                       />
                     </div>
                     <Select
                       value={cargo.rateType || ''}
                       onValueChange={(value) => onCargoChange(index, 'rateType', value)}
                     >
                       <SelectTrigger className="w-14 h-6 text-[8px] bg-transparent group-hover:bg-transparent">
                         <SelectValue placeholder="Type" />
                       </SelectTrigger>
                       <SelectContent>
                         {unitsOfMeasure.map((unit) => (
                           <SelectItem key={unit.code || unit.id} value={unit.code || ''}>
                             {unit.name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                </TableCell>
                                 <TableCell className="group-hover:bg-blue-50 transition-colors">
                   <div className="w-14">
                   <DatePicker
                     value={cargo.laycanFrom ? new Date(cargo.laycanFrom) : undefined}
                    onChange={(value) => {
                      onCargoChange(index, 'laycanFrom', value ? format(value, 'yyyy-MM-dd') : '');
                    }}
                    minDate={new Date()}
                      className="!text-[12px] text-[#3d4150] justify-between text-sm w-48 h-7 font-['Segoe_UI','Arial',sans-serif] focus:outline-none focus:border-b-2 focus:border-b-blue-500"
                  />
                   </div>
                </TableCell>
                                 <TableCell className="group-hover:bg-blue-50 transition-colors">
                   <div className="w-14">
                   <DatePicker
                     value={cargo.laycanTo ? new Date(cargo.laycanTo) : undefined}
                    onChange={(value) => {
                      onCargoChange(index, 'laycanTo', value ? format(value, 'yyyy-MM-dd') : '');
                    }}
                    minDate={new Date()}
                      className="!text-[12px] text-[#3d4150] justify-between text-sm w-48 h-7 font-['Segoe_UI','Arial',sans-serif] focus:outline-none focus:border-b-2 focus:border-b-blue-500"
                  />
                   </div>
                </TableCell>
                                 <TableCell className="flex items-center gap-1 group-hover:bg-blue-50 transition-colors">
                  <button
                    type="button"
                    className="group relative transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 rounded-md p-1 w-6 h-6 flex items-center justify-center"
                    onClick={() => toggleExpansion(index)}
                    title={expandedRows.has(index) ? 'Collapse details' : 'Expand details'}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="10" 
                      height="10" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${expandedRows.has(index) ? 'rotate-180' : ''}`}
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                  <button
                   type="button"
                   className="group relative transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 rounded-md p-1 w-6 h-6 flex items-center justify-center"
                    onClick={() => onRemoveCargo(index)}
                    title={`Remove cargo ${index + 1}`}
                  >
                   <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
                    </svg>
                 </button>
                              </TableCell>
             </TableRow>
             
             {/* Expandable Panel */}
             {expandedRows.has(index) && (
               <TableRow className="bg-gray-50 border-l-4 border-l-blue-400">
                 <TableCell colSpan={7} className="p-0">
                   <div className="p-3 space-y-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                     {/* Load & Discharge Terms Section */}
                     <div className="grid grid-cols-2 gap-3">
                       {/* Load Terms */}
                       <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                         <h4 className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-2">
                           <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                           Load Terms
                         </h4>
                         <div className="grid grid-cols-3 gap-2">
                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">Terms</label>
                             <div className="w-full h-6 px-2 py-1 bg-white rounded border-b border-gray-300 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center">
                               <input
                                 type="number"
                                 className="w-full bg-transparent border-none outline-none text-xs text-gray-600 text-right"
                                 value={cargo.loadTerms || ''}
                                 onChange={(e) => onCargoChange(index, 'loadTerms', parseFloat(e.target.value) || 0)}
                                 placeholder="0"
                               />
                             </div>
                           </div>
                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">Lay Types</label>
                             <Select
                               value={cargo.loadLayTermTypes || ''}
                               onValueChange={(value) => onCargoChange(index, 'loadLayTermTypes', value)}
                             >
                               <SelectTrigger className="w-full h-7 text-xs">
                                 <SelectValue placeholder="Type" />
                               </SelectTrigger>
                               <SelectContent>
                                 {layTermOptions.map((option) => (
                                   <SelectItem key={option.value} value={option.value}>
                                     {option.label}
                                   </SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                           </div>
                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">Excluded</label>
                             <Select
                               value={cargo.loadExcludedPeriod || ''}
                               onValueChange={(value) => onCargoChange(index, 'loadExcludedPeriod', value)}
                             >
                               <SelectTrigger className="w-full h-7 text-xs">
                                 <SelectValue placeholder="Period" />
                               </SelectTrigger>
                               <SelectContent>
                                 {excludedPeriodOptions.map((option) => (
                                   <SelectItem key={option.value} value={option.value}>
                                     {option.label}
                                   </SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                           </div>
                         </div>
                       </div>

                       {/* Discharge Terms */}
                       <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                         <h4 className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-2">
                           <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                           Discharge Terms
                         </h4>
                         <div className="grid grid-cols-3 gap-2">
                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">Terms</label>
                             <div className="w-full h-6 px-2 py-1 bg-white rounded border-b border-gray-300 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center">
                               <input
                                 type="number"
                                 className="w-full bg-transparent border-none outline-none text-xs text-gray-600 text-right"
                                 value={cargo.dischargeTerms || ''}
                                 onChange={(e) => onCargoChange(index, 'dischargeTerms', parseFloat(e.target.value) || 0)}
                                 placeholder="0"
                               />
                             </div>
                           </div>
                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">Lay Types</label>
                             <Select
                               value={cargo.dischargeLayTermTypes || ''}
                               onValueChange={(value) => onCargoChange(index, 'dischargeLayTermTypes', value)}
                             >
                               <SelectTrigger className="w-full h-7 text-xs">
                                 <SelectValue placeholder="Type" />
                               </SelectTrigger>
                               <SelectContent>
                                 {layTermOptions.map((option) => (
                                   <SelectItem key={option.value} value={option.value}>
                                     {option.label}
                                   </SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                           </div>
                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">Excluded</label>
                             <Select
                               value={cargo.dischargeExcludedPeriod || ''}
                               onValueChange={(value) => onCargoChange(index, 'dischargeExcludedPeriod', value)}
                             >
                               <SelectTrigger className="w-full h-7 text-xs">
                                 <SelectValue placeholder="Period" />
                               </SelectTrigger>
                               <SelectContent>
                                 {excludedPeriodOptions.map((option) => (
                                   <SelectItem key={option.value} value={option.value}>
                                     {option.label}
                                   </SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Commission and Rates Section */}
                     <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                       <h4 className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-2">
                         <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                         Commission & Rates
                       </h4>
                       <div className="space-y-2">
                         {/* Commission Fields Row */}
                         <div className="grid grid-cols-6 gap-2">
                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">Commission %</label>
                             <div className="w-full h-6 px-2 py-1 bg-white rounded border-b border-gray-300 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center">
                               <input
                                 type="number"
                                 step="0.01"
                                 className="w-full bg-transparent border-none outline-none text-xs text-gray-600 text-right"
                                 value={cargo.commissionPercentage || ''}
                                 onChange={(e) => onCargoChange(index, 'commissionPercentage', parseFloat(e.target.value) || 0)}
                                 placeholder="0.00"
                               />
                             </div>
                           </div>
                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">Demurrage</label>
                             <div className="w-full h-6 px-2 py-1 bg-white rounded border-b border-gray-300 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center">
                               <input
                                 type="number"
                                 step="0.01"
                                 className="w-full bg-transparent border-none outline-none text-xs text-gray-600 text-right"
                                 value={cargo.demurrageRate || ''}
                                 onChange={(e) => onCargoChange(index, 'demurrageRate', parseFloat(e.target.value) || 0)}
                                 placeholder="0.00"
                               />
                             </div>
                           </div>
                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">Despatch</label>
                             <div className="w-full h-6 px-2 py-1 bg-white rounded border-b border-gray-300 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center">
                               <input
                                 type="number"
                                 step="0.01"
                                 className="w-full bg-transparent border-none outline-none text-xs text-gray-600 text-right"
                                 value={cargo.despatchRate || ''}
                                 onChange={(e) => onCargoChange(index, 'despatchRate', parseFloat(e.target.value) || 0)}
                                 placeholder="0.00"
                               />
                             </div>
                           </div>
                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">Bunker Comp</label>
                             <div className="w-full h-6 px-2 py-1 bg-white rounded border-b border-gray-300 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center">
                               <input
                                 type="number"
                                 step="0.01"
                                 className="w-full bg-transparent border-none outline-none text-xs text-gray-600 text-right"
                                 value={cargo.bunkerCompensation || ''}
                                 onChange={(e) => onCargoChange(index, 'bunkerCompensation', parseFloat(e.target.value) || 0)}
                                 placeholder="0.00"
                               />
                             </div>
                           </div>
                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">Other Income</label>
                             <div className="w-full h-6 px-2 py-1 bg-white rounded border-b border-gray-300 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center">
                               <input
                                 type="number"
                                 step="0.01"
                                 className="w-full bg-transparent border-none outline-none text-xs text-gray-600 text-right"
                                 value={cargo.otherIncome || ''}
                                 onChange={(e) => onCargoChange(index, 'otherIncome', parseFloat(e.target.value) || 0)}
                                 placeholder="0.00"
                               />
                             </div>
                           </div>
                           <div>
                             <label className="block text-xs font-medium text-gray-600 mb-1">CO2 Income</label>
                             <div className="w-full h-6 px-2 py-1 bg-white rounded border-b border-gray-300 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center">
                               <input
                                 type="number"
                                 step="0.01"
                                 className="w-full bg-transparent border-none outline-none text-xs text-gray-600 text-right"
                                 value={cargo.co2Income || ''}
                                 onChange={(e) => onCargoChange(index, 'co2Income', parseFloat(e.target.value) || 0)}
                                 placeholder="0.00"
                               />
                             </div>
                           </div>
                         </div>
                         
                         {/* Commission Options Row */}
                         <div className="grid grid-cols-3 gap-2 pt-1">
                           <div className="flex items-center space-x-1">
                             <input
                               type="checkbox"
                               id={`demurrage-commission-${index}`}
                               className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                               checked={cargo.includeCommissionOnDemurrage || false}
                               onChange={(e) => onCargoChange(index, 'includeCommissionOnDemurrage', e.target.checked)}
                             />
                             <label htmlFor={`demurrage-commission-${index}`} className="text-xs text-gray-700">
                               Commission on Demurrage
                             </label>
                           </div>
                           <div className="flex items-center space-x-1">
                             <input
                               type="checkbox"
                               id={`despatch-commission-${index}`}
                               className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                               checked={cargo.includeCommissionOnDespatch || false}
                               onChange={(e) => onCargoChange(index, 'includeCommissionOnDespatch', e.target.checked)}
                             />
                             <label htmlFor={`despatch-commission-${index}`} className="text-xs text-gray-700">
                               Commission on Despatch
                             </label>
                           </div>
                           <div className="flex items-center space-x-1">
                             <input
                               type="checkbox"
                               id={`bunker-commission-${index}`}
                               className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                               checked={cargo.includeCommissionOnBunkerCompensation || false}
                               onChange={(e) => onCargoChange(index, 'includeCommissionOnBunkerCompensation', e.target.checked)}
                             />
                             <label htmlFor={`bunker-commission-${index}`} className="text-xs text-gray-700">
                               Commission on Bunker Comp
                             </label>
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Calculated Totals Section */}
                     <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                       <h4 className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-2">
                         <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                         Summary
                       </h4>
                       <div className="grid grid-cols-4 gap-2">
                         <div>
                           <label className="block text-xs font-medium text-gray-600 mb-1">Total Commission</label>
                           <div className="w-full h-7 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700 flex items-center">
                             {((cargo.totalCommission || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </div>
                         </div>
                         <div>
                           <label className="block text-xs font-medium text-gray-600 mb-1">Total Demurrage</label>
                           <div className="w-full h-7 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700 flex items-center">
                             {((cargo.totalDemurrage || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </div>
                         </div>
                         <div>
                           <label className="block text-xs font-medium text-gray-600 mb-1">Total Despatch</label>
                           <div className="w-full h-7 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700 flex items-center">
                             {((cargo.totalDespatch || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </div>
                         </div>
                         <div>
                           <label className="block text-xs font-medium text-gray-600 mb-1">Total Gross Freight</label>
                           <div className="w-full h-7 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700 flex items-center font-semibold">
                             {((cargo.totalGrossFreight || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                </TableCell>
              </TableRow>
             )}
           </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 
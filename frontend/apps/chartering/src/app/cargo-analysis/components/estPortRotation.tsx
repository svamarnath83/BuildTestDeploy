'use client';

import { 
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownField,
  Option
} from '@commercialapp/ui';
import { showWarningNotification, showErrorNotification } from '@commercialapp/ui';
import { Vessel, PortCall, RoutingPoint, BunkerRate, addRoutingPointFromAvailable, getDistanceResultFromCache } from '../libs';
import { Port } from '@commercialapp/ui';
import { useState, useEffect } from 'react';
import { useRef } from 'react';

interface EstPortRotationProps {
  schedule: PortCall[];
  selectedVessel: Vessel;
  ports: Port[]; // Use full Port interface with europe property
  bunkerRates: BunkerRate[]; // Add bunker rates for dynamic columns
  onScheduleChange: (index: number, field: keyof PortCall, value: string | number) => void;
  onAddPortCall: (index: number) => void;
  onRemovePortCall: (id: number) => void;
  onDragEnd: (event: DragEndEvent) => void;

  onAddRoutingPoint?: (mainPortIndex: number, selectedRoutingPoint: RoutingPoint) => void;
  onSwitchRoutingPoint?: (selectedPortIndex: number, selectedRoutingPoint: RoutingPoint) => void;
  onGetDistances?: () => Promise<void>;
}

// Dual Input Component for stacked inputs
interface DualInputProps {
  topValue: number;
  bottomValue?: number;
  topPlaceholder: string;
  bottomPlaceholder: string;
  topLabel?: string;
  bottomLabel?: string;
  disabled?: boolean;
  onTopChange: (value: string) => void;
  onBottomChange: (value: string) => void;
  className?: string;
  isReadOnly?: boolean;
}

function DualInput({
  topValue,
  bottomValue = 0,
  topPlaceholder,
  bottomPlaceholder,
  topLabel,
  bottomLabel,
  disabled = false,
  onTopChange,
  onBottomChange,
  className = "",
  isReadOnly = false
}: DualInputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="relative">
        {topLabel && (
          <label className="text-[8px] text-gray-500 absolute -top-2 left-1 bg-white px-1 z-10">
            {topLabel}
          </label>
        )}
        <div className={`w-full h-6 px-2 py-1 ${isReadOnly ? 'bg-gray-50' : 'bg-white'} rounded border-b border-gray-300 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center`}>
          <input
            type="number"
            className="w-full bg-transparent border-none outline-none text-xs text-gray-600 text-right"
            value={topValue}
            placeholder={topPlaceholder}
            onChange={(e) => onTopChange(e.target.value)}
            disabled={disabled || isReadOnly}
            readOnly={isReadOnly}
          />
        </div>
      </div>
      <div className="relative">
        {bottomLabel && (
          <label className="text-[8px] text-gray-400 absolute -top-2 left-1 bg-white px-1 z-10">
            {bottomLabel}
          </label>
        )}
        <div className={`w-full h-6 px-2 py-1 ${isReadOnly ? 'bg-gray-50' : 'bg-white'} rounded border-b-2 border-gray-200 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center`}>
          <input
            type="number"
            className="w-full bg-transparent border-none outline-none text-xs text-gray-600 text-right"
            value={bottomValue}
            placeholder={bottomPlaceholder}
            onChange={(e) => onBottomChange(e.target.value)}
            disabled={disabled || isReadOnly}
            readOnly={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
}

function SortableRow({ 
  call, 
  index, 
  vessel, 
  isLast, 
  handleScheduleChange, 
  addPortCall, 
  removePortCall,
  ports,
  bunkerRates,
  onAddRoutingPoint,
  onSwitchRoutingPoint,
  schedule
}: { 
  call: PortCall, 
  index: number, 
  vessel: Vessel, 
  isLast: boolean, 
  handleScheduleChange: (index: number, field: keyof PortCall, value: string | number) => void, 
  addPortCall: (index: number) => void, 
  removePortCall: (id: number) => void,
  ports: Port[],
  bunkerRates: BunkerRate[],
  onAddRoutingPoint?: (mainPortIndex: number, selectedRoutingPoint: RoutingPoint) => void,
  onSwitchRoutingPoint?: (selectedPortIndex: number, selectedRoutingPoint: RoutingPoint) => void,
  schedule: PortCall[]
}) {


  // Map port to option for DropdownField
  const mapPortToOption = (port: Port): Option => ({
    value: port.Name,
    label: `${port.Name}`
  });

  // Helpers to recompute ETA/ETD for subsequent rows after a change
  const formatISO = (d: Date): string => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };
  const parseDate = (raw?: string): Date | null => {
    if (!raw) return null;
    const s = raw.trim();
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  };
  const addDays = (d: Date, days: number): Date => {
    const ms = d.getTime() + days * 24 * 60 * 60 * 1000;
    return new Date(ms);
  };
  const getLegSpeed = (row: PortCall): number => {
    const speed = row?.speedSetting === 'Ballast' ? (vessel.ballastSpeed || 12) : (vessel.ladenSpeed || 14);
    return Number(speed) || 0; // fallback handled above
  };
  const recomputeFromIndex = (startIdx: number, changed?: { field: 'distance' | 'portDays'; value: number }) => {
    if (!schedule || schedule.length === 0) return;
    let i = Math.max(0, startIdx);
    let prevETD: Date | null;
    if (i <= 0) {
      prevETD = parseDate(schedule[0]?.etd as any) || new Date();
      i = 1; // first leg starts from second row
    } else {
      const prev = schedule[i - 1];
      prevETD = parseDate(prev?.etd as any);
      if (!prevETD) {
        const prevETA = parseDate(prev?.eta as any);
        const prevPD = Number(prev?.portDays) || 0;
        prevETD = prevETA ? addDays(prevETA, prevPD) : new Date();
      }
    }
    for (; i < schedule.length; i++) {
      const row = schedule[i];
      const dist = (changed && changed.field === 'distance' && i === startIdx)
        ? (Number(changed.value) || 0)
        : (Number(row?.distance) || 0);
      const speed = getLegSpeed(row);
      const steamDays = speed > 0 ? dist / (speed * 24) : 0;
      const eta = addDays(prevETD!, steamDays);
      const pd = (changed && changed.field === 'portDays' && i === startIdx)
        ? (Number(changed.value) || 0)
        : (Number(row?.portDays) || 0);
      const etd = addDays(eta, pd);
      handleScheduleChange(i, 'eta', formatISO(eta));
      handleScheduleChange(i, 'etd', formatISO(etd));
      prevETD = etd;
    }
  };

  // Ensure date-only string for native date inputs (YYYY-MM-DD)
  const formatDateForInput = (rawDate?: string): string => {
    if (!rawDate) return '';
    const trimmed = rawDate.trim();
    if (trimmed.includes('T')) return trimmed.split('T')[0];
    if (trimmed.length > 10) return trimmed.slice(0, 10);
    return trimmed;
  };

  // Ensure datetime string for native datetime-local inputs (YYYY-MM-DDTHH:mm)
  const formatDateTimeForInput = (rawDate?: string): string => {
    if (!rawDate) return '';
    const trimmed = rawDate.trim();
    // Already contains a 'T'
    if (trimmed.includes('T')) {
      const base = trimmed.split('Z')[0].split('.')[0];
      // base like YYYY-MM-DDTHH:mm[:ss]
      return base.length >= 16 ? base.slice(0, 16) : base;
    }
    // If only date provided, append midnight time
    const datePart = trimmed.slice(0, 10);
    return `${datePart}T00:00`;
  };

  // Get current port option for DropdownField
  const getCurrentPortOption = (): Option | null => {
    if (!call.portName) return null;
    const port = ports.find(p => p.Name === call.portName);
    return port ? mapPortToOption(port) : null;
  };

  // Check if port is in Europe using the europe property from additionalData
  const isEuropeanPort = (portName: string): boolean => {
    if (!portName) return false;
    const port = ports.find(p => p.Name === portName);
    if (!port) return false;
    
    return port.IsEurope === true;
  };
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: call.id, disabled: call.activity === 'Ballast' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const speed: number = call.speedSetting === 'Ballast' ? (vessel.ballastSpeed || 12) : (vessel.ladenSpeed || 14);
  const steamingTime = speed > 0 ? call.distance / (speed * 24) : 0;

  // DD/MM/YYYY HH:mm formatting helpers
  const toDisplayDateTime = (raw?: string): string => {
    if (!raw) return '';
    const s = raw.trim();
    // Match YYYY-MM-DD[ T]HH:mm (seconds optional)
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::\d{2})?)?/);
    if (!m) return '';
    const [, yyyy, mm, dd, HH = '00', Min = '00'] = m;
    return `${dd}/${mm}/${yyyy} ${HH}:${Min}`;
  };
  const toModelDateTime = (display: string): string => {
    // Expect DD/MM/YYYY HH:mm
    if (!display || !display.includes('/')) return display || '';
    const [datePart, timePart = '00:00'] = display.split(' ');
    const [dd, mm, yyyy] = datePart.split('/');
    const [HH = '00', Min = '00'] = timePart.split(':');
    if (!dd || !mm || !yyyy) return '';
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T${HH.padStart(2, '0')}:${Min.padStart(2, '0')}`;
  };

  const [etaDisplay, setEtaDisplay] = useState<string>('');
  const [etdDisplay, setEtdDisplay] = useState<string>('');

  useEffect(() => {
    setEtaDisplay(toDisplayDateTime(call.eta));
    setEtdDisplay(toDisplayDateTime(call.etd));
  }, [call.eta, call.etd]);

  return (
    <tr ref={setNodeRef} style={style} {...attributes} className={`group transition-all duration-200 ease-in-out border-l-4 border-l-transparent hover:border-l-blue-400 ${
      index % 2 === 0 
        ? 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50' 
        : 'bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
    } ${index === 0 ? 'py-0' : 'py-1'}`}>
      <td className={`px-3 ${index === 0 ? 'py-0' : 'py-1'}`}>
        <button 
          {...listeners} 
          className={`p-1 ${
            call.activity === 'Ballast'
              ? 'cursor-not-allowed opacity-50' 
              : 'cursor-grab'
          }`}
          title={
            call.activity === 'Ballast'
              ? `${call.activity} ports cannot be reordered`
              : 'Drag to reorder'
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </button>
      </td>
      <td className={`px-3 ${index === 0 ? 'py-0' : 'py-1'} font-medium`}>
        <div className="flex items-center gap-2">
          {/* Port Name Field */}
          <div className="flex-1">
            {call.activity === 'Load' || call.activity === 'Discharge' ? (
              <div className="w-36">
                                  <div className="w-44 text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                  {call.portName}
                </div>
                <div className="flex items-center justify-between mt-1">
                  {index > 0 && (
                    <div className="text-[10px] text-gray-500 flex items-center gap-1">
                      <span className="bg-gray-200 px-1.5 py-0.5 rounded-full">
                        {call.speedSetting === 'Ballast' ? vessel.ballastSpeed : vessel.ladenSpeed} kts
                      </span>
                      {(() => {
                        const isEurope = isEuropeanPort(call.portName);
                        return isEurope ? (
                          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" title="European Port"></div>
                        ) : null;
                      })()}
                    </div>
                  )}
                  {/* Route Selection Icon */}
                  {!call.isRoutingPoint && call.availableRoutingPoints && call.availableRoutingPoints.length > 0 && (
                    <Select
                      value=""
                      onValueChange={(value) => {
                        const selectedRP = call.availableRoutingPoints?.find(rp => rp.Name === value);
                        if (selectedRP && onSwitchRoutingPoint) {
                          onSwitchRoutingPoint(index, selectedRP);
                        }
                      }}
                    >
                      <SelectTrigger 
                        className="w-7 h-7 p-0 border-0 bg-transparent hover:bg-blue-50 rounded relative cursor-pointer"
                        title={
                          call.currentRoutingPoint && call.currentRoutingPoint.length > 0
                            ? `Current route: ${call.currentRoutingPoint.map(rp => rp.Name).join(', ')} - Click to change route`
                            : `${call.availableRoutingPoints?.length || 0} routing options available - Click to select route`
                        }
                      >
                        <div className="flex items-center justify-center w-full h-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                          strokeLinejoin="round" className="text-blue-600 hover:text-blue-800">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            <polyline points="7.5,4.21 12,6.81 16.5,4.21"/>
                            <polyline points="7.5,19.79 7.5,14.6 3,12"/>
                            <polyline points="21,12 16.5,14.6 16.5,19.79"/>
                          </svg>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1 text-xs font-medium text-blue-600 border-b">🗂️ Add Route</div>
                        {(call.availableRoutingPoints || []).map((rp) => (
                          <SelectItem key={rp.Name} value={rp.Name}>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{rp.Name}</span>
                                {rp.AddToRotation === false && (
                                  <span className="text-xs px-1 py-0.5 bg-yellow-100 text-yellow-700 rounded"></span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">Available route</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            ) : !call.isRoutingPoint ? (
              <div className="w-36">
                <DropdownField
                  value={getCurrentPortOption()}
                  data={ports}
                  mapToOption={mapPortToOption}
                  onChange={(option) => {
                    const portName = option ? option.value as string : '';
                    handleScheduleChange(index, 'portName', portName);
                  }}
                  placeholder="Select port"
                />
                <div className="flex items-center justify-between mt-1">
                  {index > 0 && (
                    <div className="text-[10px] text-gray-500 flex items-center gap-1">
                      <span className="bg-blue-100 px-1.5 py-0.5 rounded-full text-blue-700">
                        {call.speedSetting === 'Ballast' ? vessel.ballastSpeed : vessel.ladenSpeed} kts
                      </span>
                      {(() => {
                        const isEurope = isEuropeanPort(call.portName);
                        return isEurope ? (
                          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" title="European Port"></div>
                        ) : null;
                      })()}
                    </div>
                  )}
                  {/* Route Selection Icon */}
                  {!call.isRoutingPoint && call.availableRoutingPoints && call.availableRoutingPoints.length > 0 && (
                    <Select
                      value=""
                      onValueChange={(value) => {
                        const selectedRP = call.availableRoutingPoints?.find(rp => rp.Name === value);
                        if (selectedRP && onSwitchRoutingPoint) {
                          onSwitchRoutingPoint(index, selectedRP);
                        }
                      }}
                    >
                      <SelectTrigger 
                        className="w-7 h-7 p-0 border-0 bg-transparent hover:bg-blue-50 rounded relative cursor-pointer"
                        title={
                          call.currentRoutingPoint && call.currentRoutingPoint.length > 0
                            ? `Current route: ${call.currentRoutingPoint.map(rp => rp.Name).join(', ')} - Click to change route`
                            : `${call.availableRoutingPoints?.length || 0} routing options available - Click to select route`
                        }
                      >
                        <div className="flex items-center justify-center w-full h-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 hover:text-blue-800">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            <polyline points="7.5,4.21 12,6.81 16.5,4.21"/>
                            <polyline points="7.5,19.79 7.5,14.6 3,12"/>
                            <polyline points="21,12 16.5,14.6 16.5,19.79"/>
                          </svg>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1 text-xs font-medium text-blue-600 border-b">🗂️ Add Route</div>
                        {(call.availableRoutingPoints || []).map((rp) => (
                          <SelectItem key={rp.Name} value={rp.Name}>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{rp.Name}</span>
                                {rp.AddToRotation === false && (
                                  <span className="text-xs px-1 py-0.5 bg-yellow-100 text-yellow-700 rounded"></span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">Available route</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-36">
                <div className="w-44 text-xs px-2 py-1 bg-teal-100 rounded text-teal-800 border border-teal-200">
                  {call.portName}
                </div>
                <div className="flex items-center justify-between mt-1">
                  {index > 0 && (
                    <div className="text-[10px] text-gray-500 flex items-center gap-1">
                      <span className="bg-teal-200 px-1.5 py-0.5 rounded-full text-teal-700">
                        {call.speedSetting === 'Ballast' ? vessel.ballastSpeed : vessel.ladenSpeed} kts
                      </span>
                      {(() => {
                        const isEurope = isEuropeanPort(call.portName);
                        return isEurope ? (
                          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" title="European Port"></div>
                        ) : null;
                      })()}
                    </div>
                  )}
                  {/* Route Selection Icon */}
                  {!call.isRoutingPoint && call.availableRoutingPoints && call.availableRoutingPoints.length > 0 && (
                    <Select
                      value=""
                      onValueChange={(value) => {
                        const selectedRP = call.availableRoutingPoints?.find(rp => rp.Name === value);
                        if (selectedRP && onSwitchRoutingPoint) {
                          onSwitchRoutingPoint(index, selectedRP);
                        }
                      }}
                    >
                      <SelectTrigger 
                        className="w-7 h-7 p-0 border-0 bg-transparent hover:bg-blue-50 rounded relative cursor-pointer"
                        title={
                          call.currentRoutingPoint && call.currentRoutingPoint.length > 0
                            ? `Current route: ${call.currentRoutingPoint.map(rp => rp.Name).join(', ')} - Click to change route`
                            : `${call.availableRoutingPoints?.length || 0} routing options available - Click to select route`
                        }
                      >
                        <div className="flex items-center justify-center w-full h-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 hover:text-blue-800">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            <polyline points="7.5,4.21 12,6.81 16.5,4.21"/>
                            <polyline points="7.5,19.79 7.5,14.6 3,12"/>
                            <polyline points="21,12 16.5,14.6 16.5,19.79"/>
                          </svg>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1 text-xs font-medium text-blue-600 border-b">🗂️ Add Route</div>
                        {(call.availableRoutingPoints || []).map((rp) => (
                          <SelectItem key={rp.Name} value={rp.Name}>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{rp.Name}</span>
                                {rp.AddToRotation === false && (
                                  <span className="text-xs px-1 py-0.5 bg-yellow-100 text-yellow-700 rounded"></span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">Available route</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>


                {/* Show invisible routing point indicator for main ports */}
                {!call.isRoutingPoint && call.availableRoutingPoints && call.availableRoutingPoints.length > 0 && (
                  (() => {
                    // Check if any routing point with AddToRotation=false is being used
                    const invisibleRP = call.availableRoutingPoints.find(rp => rp.AddToRotation === false);
                    if (invisibleRP) {
                      return (
                        <div className="w-28 mt-1 text-xs px-1 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200 text-center">
                          Using: {invisibleRP.Name}
                        </div>
                      );
                    }
                    return null;
                  })()
                )}
              </div>
            )}
          </div>
        </div>
      </td>
      
      <td className={`px-3 ${index === 0 ? 'py-0' : 'py-1'}`}>
        {call.isDeletable && call.activity !== 'Canal' ? (
          <Select
            value={call.activity}
            onValueChange={(value) => handleScheduleChange(index, 'activity', value)}
          >
            <SelectTrigger className="w-28 h-7 text-xs">
              <SelectValue placeholder="Select activity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bunker">Bunker</SelectItem>
              <SelectItem value="Owners Affairs">Owners Affairs</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <span className={`px-2 inline-flex text-xs leading-5 font-normal rounded-full ${
            call.activity === 'Ballast' ? 'bg-blue-100 text-blue-800' :
            call.activity === 'Load' ? 'bg-yellow-100 text-yellow-800' :
            call.activity === 'Discharge' ? 'bg-red-100 text-red-800' :
            call.activity === 'Canal' ? 'bg-teal-100 text-teal-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {call.activity}
          </span>
        )}
      </td>
              <td className={`px-2 ${index === 0 ? 'py-0' : 'py-1'}`}>
          {index === 0 ? (
            <div className="w-20 h-1"></div>
          ) : (
            <DualInput
              topValue={Number(call.portDays) || 0}
              bottomValue={Number(call.secPortDays) || 0}
              topPlaceholder="Port Days"
              bottomPlaceholder="SEC Days"
              onTopChange={(value) => { const v = parseFloat(value) || 0; handleScheduleChange(index, 'portDays', v); recomputeFromIndex(index, { field: 'portDays', value: v }); }}
              onBottomChange={(value) => handleScheduleChange(index, 'secPortDays', parseFloat(value) || 0)}
              disabled={call.isFixed}
              className="w-20 text-xs text-gray-600"
            />
          )}
        </td>
              <td className={`px-3 ${index === 0 ? 'py-0' : 'py-1'}`}>
          {index === 0 ? (
            <div className="w-20 h-1"></div>
          ) : (
            <div className="w-20 flex flex-col gap-1">
              <div className="h-6 px-2 py-1 bg-white rounded border-b-2 border-gray-200 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex">
                <input
                  type="number"
                  className="w-full bg-transparent border-none outline-none text-xs text-gray-600 text-right"
                  value={Number(call.additionalCosts) || 0}
                  onChange={(e) => handleScheduleChange(index, 'additionalCosts', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="h-6 px-2 py-1 flex items-center">
                <span className="w-full text-xs text-transparent text-right">--</span>
              </div>
            </div>
          )}
        </td>
              <td className={`px-2 ${index === 0 ? 'py-0' : 'py-1'}`}>
          {index === 0 ? (
            <div className="w-20 h-1"></div>
          ) : (
            <DualInput
              topValue={Number(call.distance) || 0}
              bottomValue={Number(call.secDistance) || 0}
              topPlaceholder="Distance"
              bottomPlaceholder="SECA Dist"
              onTopChange={(value) => { const v = parseFloat(value) || 0; handleScheduleChange(index, 'distance', v); recomputeFromIndex(index, { field: 'distance', value: v }); }}
              onBottomChange={(value) => handleScheduleChange(index, 'secDistance', parseFloat(value) || 0)}
              disabled={false}
              className="w-20"
            />
          )}
        </td>
      <td className={`px-2 ${index === 0 ? 'py-0' : 'py-1'}`}>
        {index === 0 ? (
          <div className="w-20 h-1"></div>
        ) : (
                      <DualInput
              topValue={Number(steamingTime.toFixed(2))}
              bottomValue={Number(call.secSteamDays) || 0}
              topPlaceholder="Steam Days"
              bottomPlaceholder="SEC Steam"
              onTopChange={(value) => {}} // Read-only, calculated field
              onBottomChange={(value) => {}} // Read-only, calculated field
              isReadOnly={true}
              className="w-20"
            />
        )}
      </td>
      <td className={`px-2 ${index === 0 ? 'py-0' : 'py-1'}`}>
        {index === 0 ? (
          <div className="flex flex-col gap-0 text-xs text-gray-600">
            <div className="w-32 h-1"></div>
            <div className="w-32 h-7 px-2 py-1 bg-transparent rounded border-b border-gray-200 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center">
              <input
                type="text"
                className="w-full bg-transparent border-none outline-none text-xs text-gray-600"
                value={etdDisplay}
                onChange={(e) => setEtdDisplay(e.target.value)}
                onBlur={() => {
                  const model = toModelDateTime(etdDisplay);
                  handleScheduleChange(index, 'etd', model);
                }}
                disabled={false}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1 text-xs text-gray-600">
            <div className="w-32 h-7 px-2 py-1 bg-gray-50 rounded border-b border-gray-200 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center">
              <input
                type="text"
                className="w-full bg-transparent border-none outline-none text-xs text-gray-600"
                value={etaDisplay}
                onChange={(e) => setEtaDisplay(e.target.value)}
                onBlur={() => {
                  const model = toModelDateTime(etaDisplay);
                  handleScheduleChange(index, 'eta', model);
                }}
                disabled
              />
            </div>
            <div className="w-32 h-7 px-2 py-1 bg-gray-50 rounded border-b border-gray-200 focus-within:border-b-2 focus-within:border-blue-500 transition-colors duration-200 flex items-center">
              <input
                type="text"
                className="w-full bg-transparent border-none outline-none text-xs text-gray-600"
                value={etdDisplay}
                onChange={(e) => setEtdDisplay(e.target.value)}
                onBlur={() => {
                  const model = toModelDateTime(etdDisplay);
                  handleScheduleChange(index, 'etd', model);
                }}
                disabled={index !== 0}
              />
            </div>
          </div>
        )}
      </td>
      <td className={`px-2 ${index === 0 ? 'py-0' : 'py-1'}`}>
        {index === 0 ? (
          <div className="flex flex-col gap-0 text-xs text-gray-600">
            <div className="w-32 h-1"></div>
            <div className="w-32 h-7 px-2 py-1 bg-transparent rounded border-b border-gray-200 flex items-center">
              {etdDisplay ? `${etdDisplay}` : '--'}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1 text-xs text-gray-600">
            <div className="w-32 h-7 px-2 py-1 bg-gray-50 rounded border-b border-gray-200 flex items-center">
              {etaDisplay ? `${etaDisplay}` : '--'}
            </div>
            <div className="w-32 h-7 px-2 py-1 bg-gray-50 rounded border-b border-gray-200 flex items-center">
              {etdDisplay ? `${etdDisplay}` : '--'}
            </div>
          </div>
        )}
      </td>
      {bunkerRates.map((bunker) => {
        // Get consumption data for this grade
        const consumption = call.bunkerConsumption?.find(c => c.grade === bunker.grade);
        const portConsumption = consumption?.portConsumption || 0;
        const steamConsumption = consumption?.steamConsumption || 0;
        const totalConsumption = portConsumption + steamConsumption;
        
        return (
          <td key={bunker.grade} className={`px-2 text-center border-l border-gray-100 ${index === 0 ? 'py-0' : 'py-1'}`} style={{ width: '80px' }}
              title={`${bunker.grade} Consumption Breakdown:
Port: ${Number(portConsumption).toFixed(2)} MT
Steam: ${Number(steamConsumption).toFixed(2)} MT
Total: ${Number(totalConsumption).toFixed(2)} MT`}>
            {index === 0 ? (
              <div className="h-1"></div>
            ) : totalConsumption > 0 ? (
              <div className="flex flex-col gap-0.5">
                {/* Port Consumption - Top */}
                <div className="bg-blue-50 border border-blue-200 rounded px-2 py-0.5">
                  <div className="text-xs font-normal text-blue-900 text-center">
                    {Math.round(portConsumption)}
                  </div>
                </div>
                {/* Steam Consumption - Bottom */}
                <div className="bg-orange-50 border border-orange-200 rounded px-2 py-0.5">
                  <div className="text-xs font-normal text-orange-900 text-center">
                    {Math.round(steamConsumption)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400 text-center">-</div>
            )}
          </td>
        );
      })}
              <td className={`px-3 ${index === 0 ? 'py-0' : 'py-1'} flex flex-col items-center justify-center gap-1`}>
        {index === 0 ? (
          <div className="h-6"></div>
        ) : (
          <>
            <div className="h-3"></div>
            <div className="flex items-center gap-1">
              <button 
                type="button" 
                onClick={() => addPortCall(index)}
                className="group relative transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 rounded-md p-1 w-6 h-6 flex items-center justify-center"
                title={`Add port after ${call.portName || call.activity} (${call.activity})`}
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
                  className="transition-transform duration-200 group-hover:scale-110"
                >
                  <path d="M5 12h14"/>
                  <path d="M12 5v14"/>
                </svg>
              </button>
              
                        {call.isDeletable && (
                  <button 
                    type="button" 
                    onClick={() => removePortCall(call.id)}
                    className="group relative transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 rounded-md p-1 w-6 h-6 flex items-center justify-center"
                    title={`Remove ${call.portName || call.activity} (${call.activity})`}
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
                      className="transition-transform duration-200 group-hover:scale-110"
                    >
                      <path d="M18 6 6 18"/>
                      <path d="M6 6 18 18"/>
                    </svg>
                  </button>
                )}
            </div>
          </>
        )}
      </td>
    </tr>
  );
}

export default function EstPortRotation({
  schedule,
  selectedVessel,
  ports, // Use the passed ports prop
  bunkerRates, // Use the passed bunker rates prop
  onScheduleChange,
  onAddPortCall,
  onRemovePortCall,
  onDragEnd,
  onAddRoutingPoint,
  onSwitchRoutingPoint,
  onGetDistances
}: EstPortRotationProps) {
  
  // Local optimistic rows to prevent input flicker/reset on parent re-renders
  const [rows, setRows] = useState<PortCall[]>(schedule || []);
  const lastLocalEditRef = useRef<number>(0);
  useEffect(() => {
    // Avoid clobbering in-flight local edits (e.g., user typing)
    const now = Date.now();
    if (now - (lastLocalEditRef.current || 0) < 300) return;
    // Only sync when incoming schedule meaningfully differs from current rows
    try {
      const a = JSON.stringify(schedule || []);
      const b = JSON.stringify(rows || []);
      if (a === b) return;
    } catch {}
    setRows(schedule || []);
  }, [schedule]);

  const localHandleScheduleChange = (index: number, field: keyof PortCall, value: string | number) => {
    lastLocalEditRef.current = Date.now();
    setRows(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value } as PortCall;
      return next;
    });
    onScheduleChange(index, field, value);
  };

  // Check if all ports need distance calculation
  const checkDistanceStatus = () => {
    // Skip the first port (it should have distance 0 as starting point)
    // For schedules with 2+ ports, check middle ports
    // For schedules with only 2 ports, check the second port
    
    // Debug logging
   
    const result = {
      allHaveDistances: true,
      missingCount: 0
    };
    
    return result;
  };

  const handleGetDistances = async () => {
    // Validate schedule exists and has content
    if (!schedule || schedule.length === 0) {
      showWarningNotification({
        title: "No Schedule Found",
        description: "Please add ports to the schedule before calculating distances.",
        duration: 5000
      });
      console.warn('🚫 Get Distance blocked - no schedule found');
      return;
    }

    console.log('🔍 Validating schedule with', schedule.length, 'ports');
    
    // Check for empty port names - including first port
    const emptyPorts = schedule.filter((call, index) => {
      // Check for various empty states and placeholder names
      const isEmpty = !call.portName || 
                     call.portName.trim() === '' || 
                     call.portName === undefined || 
                     call.portName === null ||
                     call.portName === "" ||
                     call.portName.toLowerCase().includes('unknown') ||
                     call.portName.toLowerCase().includes('placeholder') ||
                     call.portName === 'Unknown Port';
      
      console.log(`Port ${index + 1}: "${call.portName}" (type: ${typeof call.portName}) - Empty: ${isEmpty}`);
      
      // Additional check for first port specifically
      if (index === 0) {
        // For first port, if it's Ballast and has no port name, we need to check if this is valid
        if (call.activity === 'Ballast' && isEmpty) {
          console.log('🚨 First port is Ballast with no port name - this will cause distance calculation issues');
        }
      }
      
      return isEmpty;
    });
    
    if (emptyPorts.length > 0) {
      const emptyPortIndices = emptyPorts.map((_, index) => schedule.indexOf(emptyPorts[index]) + 1);
      
      // Special check for first port - if it's Ballast and has no port name, that might be expected
      const firstPortEmpty = emptyPorts.some((call, index) => index === 0 && call.activity === 'Ballast');
      
      if (firstPortEmpty) {
        console.log('⚠️ First port is Ballast with no port name - this might be expected behavior');
      }
      
      // Log which ports have placeholder names
      const placeholderPorts = emptyPorts.filter(call => 
        call.portName && 
        (call.portName.toLowerCase().includes('unknown') || 
         call.portName.toLowerCase().includes('placeholder') ||
         call.portName === 'Unknown Port')
      );
      
      if (placeholderPorts.length > 0) {
        console.log('🚫 Placeholder ports detected:', placeholderPorts.map(call => call.portName));
      }
      
      showWarningNotification({
        title: "Port Names Required",
        description: `${emptyPorts.length} port(s) at position(s) ${emptyPortIndices.join(', ')} have empty or placeholder names. Please select valid port names before calculating distances.`,
        duration: 8000
      });
      
      return;
    }

    // If validation passes, proceed with distance calculation
    if (onGetDistances) {
      try {
        await onGetDistances();
      } catch (error) {
        console.error('❌ Error calculating distances:', error);
        showErrorNotification({
          title: "Distance Calculation Failed",
          description: "An error occurred while calculating distances. Please try again.",
          duration: 5000
        });
      }
    }
  };
  
  const distanceStatus = checkDistanceStatus();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div>
      <div className="overflow-x-auto border border-gray-200">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <table className="w-full text-xs" style={{ tableLayout: 'fixed' }}>
            <thead className="bg-[#f5f6fa]">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-500" style={{ width: '10px' }}></th>
                <th className="px-3 py-2 text-left font-medium text-gray-500" style={{ width: '208px' }}>
                  <div className="text-xs">Port</div>
                  <div className="text-[10px] text-gray-400">Name, Speed & Route</div>
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500" style={{ width: '130px' }}>Activity</th>
                <th className="px-2 py-2 text-center font-medium text-gray-500" style={{ width: '90px' }}>
                  <div className="text-xs">Port Days</div>
                  <div className="text-[8px] text-gray-400">Actual / SEC</div>
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-500" style={{ width: '90px' }}>Port Cost</th>
                <th className="px-2 py-2 text-center font-medium text-gray-500" style={{ width: '90px' }}>
                  <button
                    onClick={handleGetDistances}
                    className={`flex flex-col items-center gap-1 text-xs font-medium px-2 py-1 rounded hover:opacity-80 transition-opacity ${
                      distanceStatus.allHaveDistances 
                        ? 'text-green-700 hover:bg-green-50' 
                        : 'text-red-700 hover:bg-red-50'
                    }`}
                    title={distanceStatus.allHaveDistances 
                      ? 'All distances calculated - click to refresh' 
                      : `${distanceStatus.missingCount} ports missing distances - click to calculate`}
                  >
                    <div className="flex items-center gap-1">
                      <span className={`text-sm ${distanceStatus.allHaveDistances ? 'text-green-500' : 'text-red-500'}`}>
                        {distanceStatus.allHaveDistances ? '🟢' : '🔴'}
                      </span>
                      Distance
                    </div>
                    <div className="text-[8px] text-gray-400">Total / SECA</div>
                  </button>
                </th>
                <th className="px-2 py-2 text-center font-medium text-gray-500" style={{ width: '90px' }}>
                  <div className="text-xs">Steaming Days</div>
                  <div className="text-[8px] text-gray-400">Total / SEC</div>
                </th>
                <th className="px-2 py-2 text-center font-medium text-gray-500" style={{ width: '150px' }}>
                  <div className="text-xs">ETA/ETD</div>
                </th>
                <th className="px-2 py-2 text-center font-medium text-gray-500" style={{ width: '150px' }}>
                  <div className="text-xs">Local Time</div>
                </th>
                {bunkerRates.map((bunker) => (
                  <th key={bunker.grade} className="px-2 py-2 text-center font-medium text-gray-500 border-l border-gray-200" style={{ width: '80px' }}>
                    <div className="text-xs">{bunker.grade}</div>
                    <div className="text-[8px] text-gray-400">Port/Steam</div>
                  </th>
                ))}
                <th className="px-3 py-2 text-left font-medium text-gray-500" style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <SortableContext
              items={rows}
              strategy={verticalListSortingStrategy}
            >
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((call, index) => (
                  <SortableRow 
                    key={call.id} 
                    call={call} 
                    index={index}
                    vessel={selectedVessel}
                    isLast={index === schedule.length - 1}
                    handleScheduleChange={localHandleScheduleChange}
                    addPortCall={onAddPortCall}
                    removePortCall={onRemovePortCall}
                    ports={ports}
                    bunkerRates={bunkerRates}

                    onAddRoutingPoint={onAddRoutingPoint}
                    onSwitchRoutingPoint={onSwitchRoutingPoint}
                    schedule={rows}
                  />
                ))}
              </tbody>
            </SortableContext>
          </table>
        </DndContext>
      </div>
    </div>
  );
} 

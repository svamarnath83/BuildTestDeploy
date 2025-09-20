'use client';

import { useState } from 'react';
import { X, Calendar, DollarSign, Clock, AlertTriangle, Package, Fuel, Anchor } from 'lucide-react';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVessel: any; // Replace with proper Vessel type
}

const eventTypes = [
  { 
    id: 'cost', 
    label: 'Cost Incurred', 
    icon: <DollarSign className="w-4 h-4" />,
    color: 'text-red-600',
    fields: ['amount', 'currency', 'description', 'category', 'supplier']
  },
  { 
    id: 'delay', 
    label: 'Delay/Incident', 
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-orange-600',
    fields: ['duration', 'reason', 'impact', 'description']
  },
  { 
    id: 'bunker', 
    label: 'Bunker Event', 
    icon: <Fuel className="w-4 h-4" />,
    color: 'text-blue-600',
    fields: ['quantity', 'grade', 'price', 'supplier', 'location']
  },
  { 
    id: 'port', 
    label: 'Port Operation', 
    icon: <Anchor className="w-4 h-4" />,
    color: 'text-green-600',
    fields: ['portName', 'operation', 'cargoQuantity', 'duration', 'berth']
  },
  { 
    id: 'cargo', 
    label: 'Cargo Event', 
    icon: <Package className="w-4 h-4" />,
    color: 'text-purple-600',
    fields: ['quantity', 'operation', 'damage', 'notes']
  },
  { 
    id: 'maintenance', 
    label: 'Maintenance', 
    icon: <Clock className="w-4 h-4" />,
    color: 'text-gray-600',
    fields: ['component', 'type', 'duration', 'cost', 'supplier']
  }
];

const fieldDefinitions = {
  // Cost fields
  amount: { label: 'Amount', type: 'number', placeholder: '0.00' },
  currency: { label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP'] },
  category: { label: 'Cost Category', type: 'select', options: ['Port Costs', 'Bunker', 'Maintenance', 'Other'] },
  supplier: { label: 'Supplier/Vendor', type: 'text', placeholder: 'Enter supplier name' },
  
  // Delay fields
  duration: { label: 'Duration (hours)', type: 'number', placeholder: '0' },
  reason: { label: 'Reason', type: 'select', options: ['Weather', 'Port Congestion', 'Mechanical', 'Cargo', 'Other'] },
  impact: { label: 'Impact', type: 'select', options: ['Schedule Delay', 'Cost Increase', 'Cargo Damage', 'None'] },
  
  // Bunker fields
  quantity: { label: 'Quantity (MT)', type: 'number', placeholder: '0.0' },
  grade: { label: 'Fuel Grade', type: 'select', options: ['MGO', 'VLSFO', 'HSFO', 'LSMGO'] },
  price: { label: 'Price per MT', type: 'number', placeholder: '0.00' },
  location: { label: 'Bunker Location', type: 'text', placeholder: 'Port/Anchorage' },
  
  // Port fields
  portName: { label: 'Port Name', type: 'text', placeholder: 'Enter port name' },
  operation: { label: 'Operation', type: 'select', options: ['Arrival', 'Departure', 'Loading', 'Discharge'] },
  cargoQuantity: { label: 'Cargo Quantity', type: 'number', placeholder: '0.0' },
  berth: { label: 'Berth Number', type: 'text', placeholder: 'Enter berth' },
  
  // Cargo fields
  damage: { label: 'Damage Assessment', type: 'select', options: ['None', 'Minor', 'Major', 'Total Loss'] },
  
  // Maintenance fields
  component: { label: 'Component', type: 'text', placeholder: 'Engine, Deck, etc.' },
  type: { label: 'Maintenance Type', type: 'select', options: ['Preventive', 'Corrective', 'Emergency'] },
  cost: { label: 'Cost', type: 'number', placeholder: '0.00' },
  
  // Common fields
  description: { label: 'Description', type: 'textarea', placeholder: 'Enter detailed description...' },
  notes: { label: 'Notes', type: 'textarea', placeholder: 'Additional notes...' }
};

export default function AddEventModal({ isOpen, onClose, selectedVessel }: AddEventModalProps) {
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 16));

  if (!isOpen) return null;

  const handleEventTypeChange = (eventTypeId: string) => {
    setSelectedEventType(eventTypeId);
    setFormData({}); // Reset form when event type changes
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      eventType: selectedEventType,
      vesselId: selectedVessel?.id,
      vesselName: selectedVessel?.name,
      eventDate,
      data: formData,
      timestamp: new Date().toISOString()
    };
    
    console.log('Adding event:', eventData);
    // TODO: Send to API
    
    onClose();
    setSelectedEventType('');
    setFormData({});
  };

  const selectedType = eventTypes.find(type => type.id === selectedEventType);

  const renderField = (fieldName: string) => {
    const fieldDef = fieldDefinitions[fieldName as keyof typeof fieldDefinitions];
    if (!fieldDef) return null;

    const value = formData[fieldName] || '';

    switch (fieldDef.type) {
      case 'select':
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldDef.label}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(fieldName, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select {fieldDef.label.toLowerCase()}</option>
              {fieldDef.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      
      case 'textarea':
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldDef.label}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(fieldName, e.target.value)}
              placeholder={fieldDef.placeholder}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        );
      
      default:
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldDef.label}
            </label>
            <input
              type={fieldDef.type}
              value={value}
              onChange={(e) => handleFieldChange(fieldName, e.target.value)}
              placeholder={fieldDef.placeholder}
              step={fieldDef.type === 'number' ? '0.01' : undefined}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-gray-500/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Add Voyage Event
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedVessel && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="text-sm text-gray-600">Selected Vessel</div>
                <div className="font-medium text-gray-900">{selectedVessel.name}</div>
                {selectedVessel.voyage && (
                  <div className="text-xs text-gray-500 mt-1">
                    Current Voyage: {selectedVessel.voyage.from} → {selectedVessel.voyage.to}
                  </div>
                )}
                {!selectedVessel.voyage && (
                  <div className="text-xs text-gray-500 mt-1">No active voyage</div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Event Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Event Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {eventTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleEventTypeChange(type.id)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedEventType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`flex items-center gap-2 ${type.color}`}>
                        {type.icon}
                        <span className="text-sm font-medium text-gray-900">
                          {type.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Fields */}
              {selectedType && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    {selectedType.label} Details
                  </h4>
                  {selectedType.fields.map(fieldName => renderField(fieldName))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-gray-50 px-4 py-3 flex gap-2 justify-end -mx-4 -mb-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedEventType}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
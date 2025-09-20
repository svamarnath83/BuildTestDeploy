'use client';

import { MapPin, CloudRain, DollarSign, TrendingUp, Anchor, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getOperationsSummary } from '../voyages/libs/vessel-service';
import { OperationsSummary } from '../voyages/libs/operations-models';

export default function ContextualDataPanel() {
  const [operationsSummary, setOperationsSummary] = useState<OperationsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const summary = await getOperationsSummary();
        setOperationsSummary(summary);
      } catch (error) {
        console.error('Error loading operations summary:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  return (
    <div className="p-6 space-y-6">
      {/* Port Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Anchor className="w-5 h-5 mr-2 text-blue-600" />
          Port Information
        </h3>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">
                {loading ? 'Loading...' : 'Port Information'}
              </h4>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {loading ? '...' : 'Active'}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Available Berths</span>
                <span className="font-medium text-gray-900">12/18</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Wait Time</span>
                <span className="font-medium text-gray-900">4.2 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Next Available</span>
                <span className="font-medium text-gray-900">2 hours</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">
                {loading ? 'Loading...' : 'Secondary Port'}
              </h4>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                {loading ? '...' : 'Busy'}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Available Berths</span>
                <span className="font-medium text-gray-900">3/15</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Wait Time</span>
                <span className="font-medium text-gray-900">
                  {loading ? '...' : `${operationsSummary?.averageSpeed || 0} hours`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Next Available</span>
                <span className="font-medium text-gray-900">12 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Conditions */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <CloudRain className="w-5 h-5 mr-2 text-blue-600" />
          Weather Conditions
        </h3>
        
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">North Sea</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Wind</span>
                <div className="font-medium text-gray-900">15 knots NW</div>
              </div>
              <div>
                <span className="text-gray-600">Wave Height</span>
                <div className="font-medium text-gray-900">2.1m</div>
              </div>
              <div>
                <span className="text-gray-600">Visibility</span>
                <div className="font-medium text-gray-900">8 nm</div>
              </div>
              <div>
                <span className="text-gray-600">Forecast</span>
                <div className="font-medium text-gray-900">Improving</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <div className="flex items-center mb-1">
              <Clock className="w-3 h-3 mr-1" />
              <span>
                {loading ? 'Loading...' : `Updated ${operationsSummary ? 'recently' : 'unknown'}`}
              </span>
            </div>
            <div>
              {loading ? 'Loading...' : 'Next update pending'}
            </div>
          </div>
        </div>
      </div>

      {/* Market Rates */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Market Rates
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 text-sm">
                {loading ? 'Loading...' : 'Route 1'}
              </div>
              <div className="text-xs text-gray-600">Container</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-700">$245/TEU</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2.4%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 text-sm">
                {loading ? 'Loading...' : 'Route 2'}
              </div>
              <div className="text-xs text-gray-600">Bulk Cargo</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-red-700">
                {loading ? '...' : `$${operationsSummary?.fuelConsumption || 0}/MT`}
              </div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                -1.8%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 text-sm">
                {loading ? 'Loading...' : 'Route 3'}
              </div>
              <div className="text-xs text-gray-600">General Cargo</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-700">$32/MT</div>
              <div className="flex items-center text-xs text-gray-600">
                <span>No change</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Regional Performance</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">On-time Arrivals</span>
            <div className="text-right">
              <span className="font-medium text-gray-900">87.3%</span>
              <div className="text-xs text-green-600">+2.1%</div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Avg Port Time</span>
            <div className="text-right">
              <span className="font-medium text-gray-900">18.4 hrs</span>
              <div className="text-xs text-red-600">+3.2%</div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Fuel Efficiency</span>
            <div className="text-right">
              <span className="font-medium text-gray-900">12.8 MT/day</span>
              <div className="text-xs text-green-600">-1.5%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
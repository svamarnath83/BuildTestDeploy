'use client';

import { useState } from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, PieChart, FileText } from 'lucide-react';

interface ViewReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVessel: any; // Replace with proper Vessel type
}

// Mock financial data - replace with real data
const mockFinancialData = {
  estimate: {
    totalRevenue: 245000,
    totalCosts: 180000,
    netResult: 65000,
    bunkerCost: 85000,
    portCosts: 35000,
    canalCosts: 12000,
    otherCosts: 48000,
    duration: 14 // days
  },
  actual: {
    totalRevenue: 245000, // Usually same as contracted
    totalCosts: 195000,
    netResult: 50000,
    bunkerCost: 92000,
    portCosts: 42000,
    canalCosts: 12000,
    otherCosts: 49000,
    duration: 16 // days
  }
};

const reportTabs = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'costs', label: 'Cost Analysis', icon: <PieChart className="w-4 h-4" /> },
  { id: 'timeline', label: 'Timeline', icon: <Calendar className="w-4 h-4" /> },
  { id: 'detailed', label: 'Detailed Report', icon: <FileText className="w-4 h-4" /> }
];

export default function ViewReportsModal({ isOpen, onClose, selectedVessel }: ViewReportsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  const { estimate, actual } = mockFinancialData;
  
  const variance = {
    totalCosts: actual.totalCosts - estimate.totalCosts,
    netResult: actual.netResult - estimate.netResult,
    bunkerCost: actual.bunkerCost - estimate.bunkerCost,
    portCosts: actual.portCosts - estimate.portCosts,
    otherCosts: actual.otherCosts - estimate.otherCosts,
    duration: actual.duration - estimate.duration
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatVariance = (amount: number, isGood: boolean = false) => {
    const isPositive = amount > 0;
    const colorClass = isGood 
      ? (isPositive ? 'text-green-600' : 'text-red-600')
      : (isPositive ? 'text-red-600' : 'text-green-600');
    
    return (
      <span className={`flex items-center gap-1 ${colorClass}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {formatCurrency(Math.abs(amount))}
      </span>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className="text-lg font-semibold text-gray-900">{formatCurrency(actual.totalRevenue)}</div>
          <div className="text-xs text-gray-500">As contracted</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Total Costs</div>
          <div className="text-lg font-semibold text-gray-900">{formatCurrency(actual.totalCosts)}</div>
          <div className="text-xs">{formatVariance(variance.totalCosts)}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Net Result</div>
          <div className="text-lg font-semibold text-gray-900">{formatCurrency(actual.netResult)}</div>
          <div className="text-xs">{formatVariance(variance.netResult, true)}</div>
        </div>
      </div>

      {/* Performance vs Estimate */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Performance vs Estimate</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Bunker Costs</span>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">Est: {formatCurrency(estimate.bunkerCost)}</span>
              <span className="text-gray-900 font-medium">Act: {formatCurrency(actual.bunkerCost)}</span>
              {formatVariance(variance.bunkerCost)}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Port Costs</span>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">Est: {formatCurrency(estimate.portCosts)}</span>
              <span className="text-gray-900 font-medium">Act: {formatCurrency(actual.portCosts)}</span>
              {formatVariance(variance.portCosts)}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Other Costs</span>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">Est: {formatCurrency(estimate.otherCosts)}</span>
              <span className="text-gray-900 font-medium">Act: {formatCurrency(actual.otherCosts)}</span>
              {formatVariance(variance.otherCosts)}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Duration (days)</span>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">Est: {estimate.duration}</span>
              <span className="text-gray-900 font-medium">Act: {actual.duration}</span>
              <span className={variance.duration > 0 ? 'text-red-600' : 'text-green-600'}>
                {variance.duration > 0 ? '+' : ''}{variance.duration} days
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCostAnalysis = () => (
    <div className="space-y-4">
      <div className="text-center text-gray-500 py-8">
        <PieChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">Cost Breakdown Analysis</h4>
        <p className="text-sm">Detailed cost analysis charts and breakdowns will be displayed here.</p>
        <p className="text-xs text-gray-400 mt-2">
          • Bunker consumption trends<br />
          • Port cost comparisons<br />
          • Operational efficiency metrics
        </p>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-4">
      <div className="text-center text-gray-500 py-8">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">Voyage Timeline Analysis</h4>
        <p className="text-sm">Timeline view showing estimate vs actual progress.</p>
        <p className="text-xs text-gray-400 mt-2">
          • Port call schedules<br />
          • Delay analysis<br />
          • Performance milestones
        </p>
      </div>
    </div>
  );

  const renderDetailedReport = () => (
    <div className="space-y-4">
      <div className="text-center text-gray-500 py-8">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">Detailed Financial Report</h4>
        <p className="text-sm">Comprehensive report with all financial details and supporting documentation.</p>
        <div className="mt-4 space-y-2">
          <button className="block w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-sm">
            📊 Export Excel Report
          </button>
          <button className="block w-full text-left px-3 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 text-sm">
            📄 Generate PDF Report
          </button>
          <button className="block w-full text-left px-3 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 text-sm">
            📈 Performance Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'costs': return renderCostAnalysis();
      case 'timeline': return renderTimeline();
      case 'detailed': return renderDetailedReport();
      default: return renderOverview();
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
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Financial Performance Report
                </h3>
                {selectedVessel && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedVessel.name} {selectedVessel.voyage ? `• ${selectedVessel.voyage.from} → ${selectedVessel.voyage.to}` : ''}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {reportTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white px-6 pb-6 overflow-y-auto">
            {renderTabContent()}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t">
            <div className="text-xs text-gray-500">
              Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
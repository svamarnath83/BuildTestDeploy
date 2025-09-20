'use client';

import React, { useState } from 'react';
import { Input, Card, CardContent, CardHeader, CardTitle } from '@commercialapp/ui';
import { BunkerRate, PortCall } from '../libs';

interface EstBunkerRatesProps {
  bunkerRates: BunkerRate[];
  schedule?: PortCall[];
  onBunkerRateChange: (index: number, field: keyof BunkerRate, value: string) => void;
}

const getCarbonData = (bunkerRates: BunkerRate[], carbonCreditPrice: number) => {
  const totalConsumption = bunkerRates.reduce((sum, bunker) => {
    return sum + (bunker.ballastPerDayConsumption + bunker.ladenPerDayConsumption + bunker.portConsumption);
  }, 0);
  
  // CO2 emission factors (kg CO2 per ton of fuel)
  const emissionFactors = {
    HFO: 3.114, // kg CO2 per kg HFO
    LSFO: 3.151, // kg CO2 per kg LSFO  
    MGO: 3.206, // kg CO2 per kg MGO
  };
  
  const totalCO2Emission = bunkerRates.reduce((sum, bunker) => {
    const factor = emissionFactors[bunker.grade as keyof typeof emissionFactors] || 0;
    const consumption = bunker.ballastPerDayConsumption + bunker.ladenPerDayConsumption + bunker.portConsumption;
    return sum + (consumption * factor);
  }, 0);
  
  // EU-ETS calculation (40% of emissions for voyages to/from EU ports)
  const euEtsEmission = totalCO2Emission * 0.4; // Assuming 40% of voyage is EU-related
  
  // Carbon credit calculations using the editable price
  const carbonCreditExpense = euEtsEmission * carbonCreditPrice;
  const carbonCreditIncome = 0; // Would be calculated based on actual carbon trading
  
  return {
    totalConsumption: Math.round(totalConsumption * 100) / 100,
    totalCO2Emission: Math.round(totalCO2Emission * 100) / 100,
    euEtsEmission: Math.round(euEtsEmission * 100) / 100,
    carbonCreditPrice,
    carbonCreditExpense: Math.round(carbonCreditExpense * 100) / 100,
    carbonCreditIncome: Math.round(carbonCreditIncome * 100) / 100,
  };
};

export default function EstBunkerRates({
  bunkerRates,
  schedule = [],
  onBunkerRateChange
}: EstBunkerRatesProps) {
  const [carbonCreditPrice, setCarbonCreditPrice] = useState(85); // Default 85 EUR per ton CO2

  // Calculate actual total consumption from schedule
  const getActualTotalConsumption = (grade: string) => {
    if (!schedule || schedule.length === 0) return 0;
    
    return schedule.reduce((total, portCall) => {
      if (portCall.bunkerConsumption) {
        const consumption = portCall.bunkerConsumption.find(c => c.grade === grade);
        if (consumption) {
          return total + consumption.portConsumption + consumption.steamConsumption;
        }
      }
      return total;
    }, 0);
  };
  const carbonData = getCarbonData(bunkerRates, carbonCreditPrice);

  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium mb-3">Bunker Consumption Rates & Prices</h4>
      
      <div className="flex gap-6">
        {/* Bunker Rates Grid - 60% width */}
        <div className="w-[60%]">
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-[#f5f6fa]">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Grade</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Price</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Ballast</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Laden</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Port</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Total Cons</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Total Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bunkerRates.map((bunker, index) => {
                  const actualTotalConsumption = getActualTotalConsumption(bunker.grade);
                  const totalConsumption = actualTotalConsumption > 0 ? actualTotalConsumption : (bunker.ballastPerDayConsumption + bunker.ladenPerDayConsumption + bunker.portConsumption);
                  const totalCost = totalConsumption * bunker.price;
                  
                  return (
                    <tr key={bunker.grade} className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ease-in-out border-l-4 border-l-transparent hover:border-l-blue-400">
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{bunker.grade}</span>
                          <span className={`text-[8px] px-0.5 py-0.5 rounded-full text-center ${
                            bunker.isPrimary 
                              ? 'bg-red-100 text-red-700 border border-red-200' 
                              : 'bg-green-100 text-green-700 border border-green-200'
                          }`}>
                            {bunker.isPrimary ? 'P' : 'S'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          className="w-20 h-7 text-xs text-right"
                          value={Number(bunker.price) || 0}
                          onChange={(e) => onBunkerRateChange(index, 'price', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          className="w-20 h-7 text-xs text-right"
                          value={Number(bunker.ballastPerDayConsumption) || 0}
                          onChange={(e) => onBunkerRateChange(index, 'ballastPerDayConsumption', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          className="w-20 h-7 text-xs text-right"
                          value={Number(bunker.ladenPerDayConsumption) || 0}
                          onChange={(e) => onBunkerRateChange(index, 'ladenPerDayConsumption', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          className="w-20 h-7 text-xs text-right"
                          value={Number(bunker.portConsumption) || 0}
                          onChange={(e) => onBunkerRateChange(index, 'portConsumption', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2 text-gray-600 text-right">
                        {Number(totalConsumption).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-gray-600 text-right">
                        {Number(totalCost).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Carbon Information Card - 40% width */}
        <div className="w-[40%]">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Carbon & Environmental Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Consumption:</span>
                    <span className="font-medium text-right">{carbonData.totalConsumption} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total CO₂ Emission:</span>
                    <span className="font-medium text-right">{carbonData.totalCO2Emission} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">EU-ETS Emission:</span>
                    <span className="font-medium text-right">{carbonData.euEtsEmission} MT</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Carbon Credit Price:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500"></span>
                      <Input
                        type="number"
                        className="w-16 h-6 text-xs text-right"
                        value={carbonCreditPrice}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCarbonCreditPrice(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carbon Credit Expense:</span>
                    <span className="font-medium text-red-600 text-right">{carbonData.carbonCreditExpense.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carbon Credit Income:</span>
                    <span className="font-medium text-green-600 text-right">{carbonData.carbonCreditIncome.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Net Carbon Cost */}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between text-sm font-medium">
                  <span>Net Carbon Cost:</span>
                  <span className={`text-right {carbonData.carbonCreditExpense - carbonData.carbonCreditIncome > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {(carbonData.carbonCreditExpense - carbonData.carbonCreditIncome).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
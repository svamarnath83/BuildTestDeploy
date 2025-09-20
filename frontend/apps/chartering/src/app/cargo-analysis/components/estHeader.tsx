import React from 'react';
import {
  FormItem,
  Label,
  labelText,
  valueText,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input
} from '@commercialapp/ui';
import { shipAnalysis, CargoInput } from '../libs';
import { Currency } from '@commercialapp/ui/libs/registers/currencies/models';
import { getBallastSpeedList, getLadenSpeedList } from '../libs/services';

interface EstHeaderProps {
  shipAnalysis: shipAnalysis;
  cargoInput: CargoInput;
  availableShips?: shipAnalysis[];
  currencies?: Currency[];
  estimateId?: number;
  onShipChange?: (shipId: number) => void;
  onCurrencyChange?: (currency: string) => void;
  onRunningCostChange?: (field: string, value: number | string) => void;
  onBallastSpeedChange?: (speed: string) => void;
  onLadenSpeedChange?: (speed: string) => void;
}

const EstHeader: React.FC<EstHeaderProps> = ({
  shipAnalysis,
  cargoInput,
  availableShips = [],
  currencies = [],
  estimateId,
  onShipChange,
  onCurrencyChange,
  onRunningCostChange,
  onBallastSpeedChange,
  onLadenSpeedChange
}) => {
  const ballastSpeedList = getBallastSpeedList(shipAnalysis.vessel);
  const ladenSpeedList = getLadenSpeedList(shipAnalysis.vessel);

  return (
    <div>
      <div className="border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Ship Dropdown */}
          <FormItem>
            <Label className={labelText}>Ship</Label>
            <Select
              value={shipAnalysis.vessel.id.toString()}
              onValueChange={(value) => onShipChange?.(parseInt(value))}
            >
              <SelectTrigger className="border-blue-600 text-blue-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableShips.length > 0 ? (
                  availableShips.map((ship) => (
                    <SelectItem key={ship.vessel.id} value={ship.vessel.id.toString()}>
                      {ship.vessel.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value={shipAnalysis.vessel.id.toString()}>
                    {shipAnalysis.vessel.name}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormItem>

          {/* Currency Dropdown */}
          <FormItem>
            <Label className={labelText}>Currency</Label>
            <Select
              value={cargoInput.currency}
              onValueChange={(value) => onCurrencyChange?.(value)}
            >
              <SelectTrigger className="border-blue-600 text-blue-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.Code} value={currency.Code || ''}>
                    {currency.Code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>

          {/* Ballast Speed Dropdown */}
          <FormItem>
            <Label className={labelText}>Ballast Speed</Label>
            <Select
              value={shipAnalysis.vessel.ballastSpeed?.toString() || ''}
              onValueChange={(value) => onBallastSpeedChange?.(value)}
            >
              <SelectTrigger className="border-blue-600 text-blue-600">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {ballastSpeedList.length > 0 ? (
                  ballastSpeedList.map((speed) => (
                    <SelectItem key={`ballast-${speed}`} value={speed}>
                      {speed}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-speeds" disabled>
                    No speeds
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormItem>

          {/* Laden Speed Dropdown */}
          <FormItem>
            <Label className={labelText}>Laden Speed</Label>
            <Select
              value={shipAnalysis.vessel.ladenSpeed?.toString() || ''}
              onValueChange={(value) => onLadenSpeedChange?.(value)}
            >
              <SelectTrigger className="border-blue-600 text-blue-600">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {ladenSpeedList.length > 0 ? (
                  ladenSpeedList.map((speed) => (
                    <SelectItem key={`laden-${speed}`} value={speed}>
                      {speed}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-speeds" disabled>
                    No speeds
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormItem>

          {/* Daily OpEx */}
          <FormItem>
            <Label className={labelText}>Daily OpEx ({cargoInput.currency})</Label>
            <Input
              type="number"
              value={Number(shipAnalysis.vessel.runningCost) || 0}
              onChange={(e) => onRunningCostChange?.('runningCost', parseFloat(e.target.value) || 0)}
              placeholder="8000"
              className={valueText}
            />
          </FormItem>
        </div>
      </div>
    </div>
  );
};

export default EstHeader; 
import { PortCallCalculationService } from '../port-call-calculations';
import { VoyagePortCall } from '../voyage-models';

// Simple mock data
const createMockPortCalls = (): VoyagePortCall[] => [
  {
    id: 1, voyageId: 1, portId: 101, portName: 'OSLO', sequenceOrder: 1, activity: 'B',
    arrival: '2025-10-01T10:00:00', departure: '2025-10-01T10:00:00',
    distance: 0, portDays: 0, speed: 12, steamDays: 0, portCost: 0, cargoCost: 0
  },
  {
    id: 2, voyageId: 1, portId: 102, portName: 'ROTTERDAM', sequenceOrder: 2, activity: 'L',
    arrival: '2025-10-03T04:23:00', departure: '2025-10-03T16:23:00',
    distance: 551, portDays: 0.5, speed: 13.0, steamDays: 1.77, portCost: 0, cargoCost: 0
  },
  {
    id: 3, voyageId: 1, portId: 103, portName: 'SINGAPORE', sequenceOrder: 3, activity: 'D',
    arrival: '2025-11-04T14:00:00', departure: '2025-11-06T02:00:00',
    distance: 8422, portDays: 1.5, speed: 11.0, steamDays: 31.9, portCost: 0, cargoCost: 0
  }
];

describe('Port Call Calculations', () => {
  describe('Speed Changes', () => {
    it('should recalculate arrival when speed changes', () => {
      const portCalls = createMockPortCalls();
      portCalls[1].speed = 15; // Change ROTTERDAM speed from 13 to 15
      
      const result = PortCallCalculationService.recalculateAfterSpeedChange(portCalls, 1);
      
      expect(result[1].speed).toBe(15);
      expect(result[1].arrival).toBe('2025-10-02T22:44:00'); // local time
      expect(result[1].steamDays).toBeCloseTo(1.53, 2); // 551 / (15 * 24)
    });
  });

  describe('Departure Changes', () => {
    it('should recalculate subsequent ports when departure changes', () => {
      const portCalls = createMockPortCalls();
      portCalls[0].departure = '2025-10-01T16:23:00'; // 6.5 hours later in local time
      
      const result = PortCallCalculationService.recalculateAfterDepartureChange(portCalls, 0);
      
      expect(result[0].departure).toBe('2025-10-01T16:23:00');
      expect(result[1].arrival).toBe('2025-10-03T04:23:00'); // local time recalculated
      expect(result[1].steamDays).toBeDefined();
    });
  });

  describe('Arrival Changes', () => {
    it('should recalculate subsequent ports when arrival changes', () => {
      const portCalls = createMockPortCalls();
      portCalls[1].arrival = '2025-10-02T04:23:00'; // 1 day earlier in local time
      
      const result = PortCallCalculationService.recalculateAfterArrivalChange(portCalls, 1);
      
      expect(result[1].arrival).toBe('2025-10-02T04:23:00');
      expect(result[2].arrival).not.toBe(portCalls[2].arrival); // Subsequent port shifted

      expect(result[2].departure).not.toBe(portCalls[2].departure); // Subsequent port shifted
      expect(result[1].departure).toBe('2025-10-02T16:23:00');

      expect(result[2].steamDays).toBeDefined();
    });
  });

  describe('Distance Changes', () => {
    it('should recalculate arrival when distance changes', () => {
      const portCalls = createMockPortCalls();
      portCalls[1].distance = 1000; // Change ROTTERDAM distance
      
      const result = PortCallCalculationService.recalculateAfterDistanceChange(portCalls, 1);
      
      expect(result[1].distance).toBe(1000);
      expect(result[1].arrival).not.toBe(portCalls[1].arrival);
      expect(result[1].steamDays).toBeDefined();
      expect(result[2].arrival).not.toBe(portCalls[2].arrival);
    });
  });

  describe('Port Days Changes', () => {
    it('should recalculate departure when port days change', () => {
      const portCalls = createMockPortCalls();
      portCalls[0].portDays = 2;
      
      const result = PortCallCalculationService.recalculateAfterPortDaysChange(portCalls, 0);
      
      expect(result[0].portDays).toBe(2);
      expect(result[0].departure).not.toBe(portCalls[0].departure);
      expect(result[1].arrival).not.toBe(portCalls[1].arrival);
    });
  });

  describe('Create Default Port Call', () => {
    it('should create port call with default values', () => {
      const result = PortCallCalculationService.createDefaultPortCall(1);
      
      expect(result.voyageId).toBe(1);
      expect(result.sequenceOrder).toBe(1);
      expect(result.activity).toBe('Load');
      expect(result.portDays).toBe(1);
      expect(result.speed).toBe(12);
      expect(result.distance).toBe(100);
      expect(result.steamDays).toBe(0);
    });
  });

  describe('Integration Tests', () => {
    it('should handle multiple changes correctly', () => {
      let portCalls = createMockPortCalls();
      
      // Change speed
      portCalls[0].speed = 15;
      portCalls = PortCallCalculationService.recalculateAfterSpeedChange(portCalls, 0);
      
      // Change departure
      portCalls[0].departure = '2025-10-01T16:23:00';
      portCalls = PortCallCalculationService.recalculateAfterDepartureChange(portCalls, 0);
      
      expect(portCalls[0].speed).toBe(15);
      expect(portCalls[0].departure).toBe('2025-10-01T16:23:00');
      expect(portCalls[1].arrival).toBe('2025-10-03T04:23:04');
    });
  });
});

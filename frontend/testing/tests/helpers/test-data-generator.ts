import { faker } from '@faker-js/faker';
import baseConfig from '../e2e/test-data.json' with { type: 'json' };

// Base generator with faker - keeps login stable, generates dynamic vessel data
export function generateTestData(overrides = {}) {
  const timestamp = Date.now();
  
  const generated = {
    login: baseConfig.login, // Keep stable login credentials from JSON
    company: baseConfig.company, // Keep stable company data from JSON
    vessel: {
      code: faker.string.alphanumeric(6).toUpperCase(),
      name: `Ship-${faker.string.alphanumeric(4).toUpperCase()}-${timestamp}`,
      type: faker.helpers.arrayElement(['Container Ship', 'Bulk Carrier', 'Tanker']),
      deadWeightTonnage: faker.number.int({ min: 50000, max: 100000 }).toString(),
      runningCost: faker.number.int({ min: 20000, max: 50000 }).toString(),
      imo: faker.string.numeric(7)
    },
    grades: {
      primary: {
        grade: baseConfig.grades.primary.grade, // Use constant LSFO from JSON
        type: baseConfig.grades.primary.type
      },
      secondary: {
        grade: baseConfig.grades.secondary.grade, // Use constant HSFO from JSON
        type: baseConfig.grades.secondary.type
      }
    },
    consumption: {
      port: {
        value1: faker.number.float({ min: 3, max: 8, fractionDigits: 2 }).toString(),
        value2: faker.number.float({ min: 1, max: 4, fractionDigits: 2 }).toString()
      },
      ballast: {
        speed: faker.number.float({ min: 10, max: 15, fractionDigits: 1 }).toString(),
        value1: faker.number.float({ min: 10, max: 20, fractionDigits: 2 }).toString(),
        value2: faker.number.float({ min: 5, max: 12, fractionDigits: 2 }).toString()
      },
      laden: {
        speed: faker.number.float({ min: 12, max: 18, fractionDigits: 1 }).toString(),
        value1: faker.number.float({ min: 15, max: 30, fractionDigits: 2 }).toString(),
        value2: faker.number.float({ min: 8, max: 18, fractionDigits: 2 }).toString()
      }
    }
  };

  // Deep merge overrides
  return mergeDeep(generated, overrides);
}

// Simple generator without faker (fallback option)
export function generateSimpleTestData() {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 1000);
  
  return {
    login: {
      url: 'http://10.87.5.235:3000/login',
      username: 'amarnath',
      password: 'amarnath',
      accountCode: 'qa'
    },
    company: {
      name: 'amarnath' //keep this constant always
    },
    vessel: {
      name: `Test-Vessel-${timestamp}`,
      code: `TV${randomId}`,
      type: 'Bulk Carrier',
      deadWeightTonnage: '50000',
      runningCost: '10000',
      imo: `${1000000 + randomId}`
    },
    grades: {
      primary: {
        grade: 'VLSFO'
      },
      secondary: {
        grade: 'MGO',
        type: 'Secondary'
      }
    },
    consumption: {
      port: {
        value1: '5.00',
        value2: '2.50'
      },
      ballast: {
        speed: '12.0',
        value1: '15.00',
        value2: '7.50'
      },
      laden: {
        speed: '14.0',
        value1: '20.00',
        value2: '10.00'
      }
    }
  };
}

// Specific generators for different vessel types
export function generateBulkCarrierData() {
  return generateTestData({
    vessel: { 
      type: 'Bulk Carrier',
      name: `Bulk-${Date.now()}`,
      deadWeightTonnage: faker.number.int({ min: 80000, max: 200000 }).toString()
    }
  });
}

export function generateContainerShipData() {
  return generateTestData({
    vessel: { 
      type: 'Container Ship',
      name: `Container-${Date.now()}`,
      deadWeightTonnage: faker.number.int({ min: 50000, max: 150000 }).toString()
    }
  });
}

export function generateTankerData() {
  return generateTestData({
    vessel: { 
      type: 'Tanker',
      name: `Tanker-${Date.now()}`,
      deadWeightTonnage: faker.number.int({ min: 100000, max: 300000 }).toString()
    }
  });
}

// For regression tests that need predictable data
export function getBaseTestData() {
  return baseConfig;
}

// Utility function for deep merging objects
function mergeDeep(target: any, source: any): any {
  if (typeof target !== 'object' || target === null) return source;
  if (typeof source !== 'object' || source === null) return target;

  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = mergeDeep(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

// Set faker seed for reproducible data when needed (useful for debugging)
export function setSeed(seed: number) {
  faker.seed(seed);
}
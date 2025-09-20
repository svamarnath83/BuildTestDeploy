# Jest Testing Guide - Voyage Manager

## Overview
This document provides comprehensive guidance for running and managing Jest tests in the Voyage Manager application.

## Test Structure

### Test Files Location
```
apps/voyagemanager/
├── app/voyages/libs/__tests__/
│   └── port-call-calculations.test.ts
└── jest.config.js (if exists)
```

### Current Test Files
- **`port-call-calculations.test.ts`** - Tests for port call calculation logic including:
  - Speed change calculations
  - Port days change calculations
  - Arrival/departure date changes
  - Distance change calculations
  - Sequence change calculations
  - Default port call creation

## Running Tests

### From Root Directory
```bash
# Run all tests
npm test

# Run voyagemanager tests specifically
npm run test:voyagemanager

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### From Voyage Manager Directory
```bash
cd apps/voyagemanager
npm test
```

## Test Configuration

### Jest Configuration
The project uses Jest with the following configuration:
- **Test Environment**: jsdom (for React component testing)
- **TypeScript Support**: ts-jest
- **Setup Files**: jest.setup.ts
- **Test Match Pattern**: `**/__tests__/**/*.test.ts`

### Key Dependencies
- `jest` - Testing framework
- `@testing-library/jest-dom` - Custom matchers for DOM testing
- `@testing-library/react` - React component testing utilities
- `ts-jest` - TypeScript preprocessor for Jest

## Test Categories

### 1. Port Call Calculations
Tests the core business logic for port call calculations:

#### Speed Change Tests
- Verifies arrival time updates when speed changes
- Tests steam days calculation
- Validates departure time adjustments

#### Port Days Change Tests
- Tests departure time updates when port days change
- Verifies steam days recalculation
- Validates subsequent port adjustments

#### Date Change Tests
- Tests arrival date change impacts
- Verifies departure date change effects
- Validates time difference calculations

#### Distance Change Tests
- Tests arrival time updates when distance changes
- Verifies steam days calculation
- Validates port call sequence integrity

#### Sequence Change Tests
- Tests port call reordering
- Verifies calculation updates after reordering
- Validates data integrity

### 2. Mock Data
Tests use factory functions to create consistent mock data:
- `createMockVoyagePortCalls()` - Creates fresh port call data
- Mock voyage schedule: OSLO → ROTTERDAM → SINGAPORE
- Realistic port data with coordinates and distances

## Writing New Tests

### Test File Structure
```typescript
import { describe, it, expect, beforeEach } from '@jest/globals';
import { functionToTest } from '../path-to-module';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should do something specific', () => {
    // Arrange
    const input = 'test data';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Best Practices
1. **Use descriptive test names** - Clearly state what the test verifies
2. **Follow AAA pattern** - Arrange, Act, Assert
3. **Use factory functions** - Create consistent test data
4. **Test edge cases** - Include boundary conditions
5. **Mock external dependencies** - Isolate units under test

## Debugging Tests

### Running Specific Tests
```bash
# Run a specific test file
npm test port-call-calculations.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="speed change"

# Run tests in verbose mode
npm test -- --verbose
```

### Debug Mode
```bash
# Run tests in debug mode
npm test -- --detectOpenHandles --forceExit
```

## Common Issues and Solutions

### 1. Port Already in Use
**Error**: `Port 3004 is in use`
**Solution**: Kill the process using the port or use a different port

### 2. TypeScript Errors
**Error**: Type errors in test files
**Solution**: Ensure proper type imports and mock data structure

### 3. Mock Data Corruption
**Error**: Tests affecting each other
**Solution**: Use factory functions to create fresh data for each test

### 4. Async Test Issues
**Error**: Tests timing out or not waiting for async operations
**Solution**: Use proper async/await or Promise handling

## Test Data Management

### Mock Data Factory
```typescript
const createMockVoyagePortCalls = () => [
  {
    id: 1,
    voyageId: 1,
    portId: 1,
    portName: "OSLO",
    sequenceOrder: 1,
    activity: "load",
    arrival: "2025-09-30T10:00:00.000Z",
    departure: "2025-09-30T18:00:00.000Z",
    // ... other properties
  },
  // ... more port calls
];
```

### Test Isolation
- Each test creates fresh data using factory functions
- No shared state between tests
- Clean setup and teardown

## Coverage Reports

### Generating Coverage
```bash
npm run test:coverage
```

### Coverage Targets
- **Statements**: > 80%
- **Branches**: > 80%
- **Functions**: > 80%
- **Lines**: > 80%

## Continuous Integration

### GitHub Actions (if configured)
Tests should run automatically on:
- Pull request creation
- Push to main branch
- Manual trigger

### Pre-commit Hooks
Consider adding pre-commit hooks to run tests before commits.

## Troubleshooting

### Common Commands
```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests with detailed output
npm test -- --verbose --no-cache

# Run specific test with debug info
npm test -- --testNamePattern="specific test" --verbose
```

### Logging and Debugging
```typescript
// Add console.log for debugging
console.log('Debug info:', variable);

// Use Jest's expect.any() for flexible matching
expect(result).toEqual(expect.any(Object));
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [TypeScript Jest Guide](https://jestjs.io/docs/getting-started#using-typescript)

## Support

For test-related issues:
1. Check this documentation first
2. Review existing test files for patterns
3. Consult the Jest and Testing Library documentation
4. Ask the development team for assistance

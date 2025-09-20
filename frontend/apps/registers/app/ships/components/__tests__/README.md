# ShipGrades Component Tests

This directory contains comprehensive Jest tests for the ShipGrades React component, focusing on testing the grid functionality with mocked API calls and in-memory CRUD operations.

## Test Structure

### Files

- **`ShipGrades.test.tsx`** - Main comprehensive test suite covering all component functionality
- **`ShipGrades.CRUD.test.tsx`** - Focused tests for Create, Read, Update, Delete operations
- **`test-utils.tsx`** - Shared test utilities, mock data, and helper functions

### Test Categories

1. **Initial Rendering** - Component mounting and initial display
2. **API Data Loading** - Mocked API calls and error handling
3. **Grade Management** - Adding and removing grades
4. **Grade Selection** - Dropdown interactions and updates
5. **Validation** - Form validation and error notifications
6. **Drag and Drop** - Reordering functionality
7. **Callback Functions** - Parent component communication
8. **Mode Handling** - Add/edit mode differences
9. **State Persistence** - State management across prop changes

## CRUD Operations Testing

The CRUD tests specifically focus on:

- **CREATE**: Adding new grades with validation
- **READ**: Displaying existing data and loading from APIs
- **UPDATE**: Modifying grade selections and types
- **DELETE**: Removing grades with business rule enforcement

## Mock Strategy

### API Mocking
- `getGrade()` - Returns predefined mock grade data
- `getUnitOfMeasure()` - Returns predefined mock UOM data
- `showErrorNotification()` - Mocked to verify error handling

### Component Mocking
- UI components are mocked to simplify testing
- DnD Kit components are mocked to test drag-and-drop logic
- All external dependencies are controlled for predictable testing

### Data Mocking
- Mock ship data with realistic vessel information
- Mock grade items with proper relationships
- Mock API responses with success/error scenarios

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- ShipGrades.CRUD.test.tsx
```

## Test Utilities

### Mock Data
- `mockGrades` - Array of grade objects
- `mockUnitsOfMeasure` - Array of UOM objects
- `mockShipData` - Ship information
- `mockInitialGradeItems` - Initial grade configuration

### Helper Functions
- `createMockGradeItem()` - Generate grade items with overrides
- `createMockShipData()` - Generate ship data with overrides
- `resetMocks()` - Clear all mock state between tests
- `customRender()` - Enhanced render function with test wrapper

### Test Scenarios
- `testScenarios.emptyGrades` - Testing with no grades
- `testScenarios.singleGrade` - Testing with one grade
- `testScenarios.multipleGrades` - Testing with multiple grades
- `testScenarios.incompleteGrades` - Testing validation scenarios

## Key Testing Patterns

### Async Testing
- Use `waitFor()` to wait for API calls to complete
- Use `findBy` queries for asynchronous element discovery
- Mock API responses to control test flow

### User Interaction Testing
- Use `userEvent.setup()` for realistic user interactions
- Test dropdown selections, button clicks, and form submissions
- Verify state changes after user actions

### State Verification
- Check component state through rendered output
- Verify callback functions are called with correct data
- Test state persistence across prop changes

### Error Handling
- Mock API failures to test error scenarios
- Verify error notifications are displayed
- Test validation rules and business logic

## Best Practices

1. **Isolation**: Each test is independent with fresh mocks
2. **Realistic Data**: Mock data represents real-world scenarios
3. **Comprehensive Coverage**: Tests cover all major functionality
4. **Maintainable**: Shared utilities reduce code duplication
5. **Fast Execution**: No network calls ensure quick test runs

## Troubleshooting

### Common Issues

1. **Mock Not Working**: Ensure mocks are properly imported and configured
2. **Async Tests Failing**: Use `waitFor()` for asynchronous operations
3. **Component Not Rendering**: Check if all required props are provided
4. **Type Errors**: Verify TypeScript types match between mocks and actual code

### Debug Tips

- Use `screen.debug()` to inspect rendered output
- Check mock call counts with `expect(mockFn).toHaveBeenCalledTimes(n)`
- Verify mock data structure matches expected interfaces
- Use `console.log()` in tests to debug complex scenarios

## Future Enhancements

- Add integration tests with real API endpoints
- Implement visual regression testing
- Add performance testing for large datasets
- Create test data factories for complex scenarios

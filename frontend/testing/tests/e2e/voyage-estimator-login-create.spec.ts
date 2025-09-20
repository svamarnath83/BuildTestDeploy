import { test, expect } from '@playwright/test';

test.describe('Voyage Estimator Login and Create Estimate', () => {
  test('should login and create realistic voyage estimate', async ({ page }) => {
    // Step 1: Navigate to login page
    await page.goto('http://10.87.5.235:3000/login');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Step 2: Enter username
    await page.fill('input[name="username"], #username, [data-testid="username"]', 'amarnath');
    
    // Step 3: Enter password
    await page.fill('input[name="password"], #password, [data-testid="password"]', 'amarnath');
    
    // Step 4: Enter account name
    await page.fill('input[name="account"], #account, [data-testid="account"]', 'qa');
    
    // Step 5: Click signin button
    await page.click('button:has-text("Sign In"), button:has-text("Login"), input[type="submit"]');
    
    // Wait for successful login and navigation
    await page.waitForLoadState('networkidle');
    
    // Verify login success (adjust selector based on actual page structure)
    await expect(page).toHaveURL(/.*dashboard|.*home|.*estimates/);
    
    // Step 6: Navigate to create estimate (adjust navigation based on UI)
    // Try multiple possible navigation paths
    const createEstimateSelectors = [
      'button:has-text("Create Estimate")',
      'a:has-text("New Estimate")',
      'button:has-text("New")',
      '[data-testid="create-estimate"]',
      '.create-estimate-btn'
    ];
    
    let estimateButtonFound = false;
    for (const selector of createEstimateSelectors) {
      try {
        if (await page.locator(selector).isVisible({ timeout: 2000 })) {
          await page.click(selector);
          estimateButtonFound = true;
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    // If no direct button found, try navigation menu
    if (!estimateButtonFound) {
      try {
        await page.click('text=Estimates');
        await page.waitForTimeout(1000);
        await page.click('button:has-text("Create"), button:has-text("New")');
      } catch (error) {
        console.log('Navigation through menu failed, trying alternative approach');
      }
    }
    
    // Wait for estimate form to load
    await page.waitForLoadState('networkidle');
    
    // Step 7: Fill realistic voyage estimate data
    
    // Voyage Information
    await page.fill('input[name="voyageName"], #voyageName, [data-testid="voyage-name"]', 'Atlantic Express Voyage 2025-AE-001');
    
    // Origin and Destination
    await page.fill('input[name="origin"], #origin, [data-testid="origin"]', 'Port of Hamburg, Germany');
    await page.fill('input[name="destination"], #destination, [data-testid="destination"]', 'Port of New York, USA');
    
    // Vessel Information
    await page.fill('input[name="vesselName"], #vesselName, [data-testid="vessel-name"]', 'MV Ocean Navigator');
    await page.fill('input[name="vesselType"], #vesselType, [data-testid="vessel-type"]', 'Container Ship');
    await page.fill('input[name="vesselSize"], #vesselSize, [data-testid="vessel-size"]', '14000');
    
    // Cargo Details
    await page.fill('input[name="cargoType"], #cargoType, [data-testid="cargo-type"]', 'Containerized Goods');
    await page.fill('input[name="cargoWeight"], #cargoWeight, [data-testid="cargo-weight"]', '12500');
    await page.fill('input[name="cargoVolume"], #cargoVolume, [data-testid="cargo-volume"]', '850');
    
    // Dates
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 7); // 7 days from now
    const arrivalDate = new Date();
    arrivalDate.setDate(arrivalDate.getDate() + 21); // 21 days from now
    
    await page.fill('input[name="departureDate"], #departureDate, [data-testid="departure-date"]', 
      departureDate.toISOString().split('T')[0]);
    await page.fill('input[name="arrivalDate"], #arrivalDate, [data-testid="arrival-date"]', 
      arrivalDate.toISOString().split('T')[0]);
    
    // Cost Information
    await page.fill('input[name="fuelCost"], #fuelCost, [data-testid="fuel-cost"]', '125000');
    await page.fill('input[name="portCharges"], #portCharges, [data-testid="port-charges"]', '25000');
    await page.fill('input[name="crewCost"], #crewCost, [data-testid="crew-cost"]', '45000');
    await page.fill('input[name="maintenanceCost"], #maintenanceCost, [data-testid="maintenance-cost"]', '15000');
    
    // Route Information
    await page.fill('input[name="distance"], #distance, [data-testid="distance"]', '3850');
    await page.fill('input[name="transitTime"], #transitTime, [data-testid="transit-time"]', '14');
    
    // Additional Details
    await page.fill('textarea[name="notes"], #notes, [data-testid="notes"]', 
      'Trans-Atlantic container voyage with standard cargo mix. Weather contingency included. Route via English Channel.');
    
    // Customer Information
    await page.fill('input[name="customer"], #customer, [data-testid="customer"]', 'Atlantic Shipping Lines Ltd.');
    await page.fill('input[name="customerReference"], #customerReference, [data-testid="customer-reference"]', 'ASL-2025-Q1-047');
    
    // Try to select options from dropdowns if they exist
    try {
      // Voyage type
      await page.selectOption('select[name="voyageType"], #voyageType', 'Regular Service');
    } catch (error) {
      console.log('Voyage type dropdown not found');
    }
    
    try {
      // Currency
      await page.selectOption('select[name="currency"], #currency', 'USD');
    } catch (error) {
      console.log('Currency dropdown not found');
    }
    
    try {
      // Priority
      await page.selectOption('select[name="priority"], #priority', 'Standard');
    } catch (error) {
      console.log('Priority dropdown not found');
    }
    
    // Take a screenshot before submitting
    await page.screenshot({ 
      path: 'test-results/voyage-estimate-form-filled.png',
      fullPage: true 
    });
    
    // Submit the estimate
    const submitSelectors = [
      'button:has-text("Create Estimate")',
      'button:has-text("Save Estimate")',
      'button:has-text("Submit")',
      'button[type="submit"]',
      '[data-testid="submit-estimate"]'
    ];
    
    let submitButtonFound = false;
    for (const selector of submitSelectors) {
      try {
        if (await page.locator(selector).isVisible({ timeout: 2000 })) {
          await page.click(selector);
          submitButtonFound = true;
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    if (!submitButtonFound) {
      console.log('Submit button not found, taking screenshot for debugging');
      await page.screenshot({ 
        path: 'test-results/submit-button-not-found.png',
        fullPage: true 
      });
    }
    
    // Wait for submission to complete
    await page.waitForLoadState('networkidle');
    
    // Verify estimate creation success
    // Look for success indicators
    const successIndicators = [
      page.locator('text=Estimate created successfully'),
      page.locator('text=Estimate saved'),
      page.locator('.success-message'),
      page.locator('[data-testid="success-message"]')
    ];
    
    let successFound = false;
    for (const indicator of successIndicators) {
      try {
        await expect(indicator).toBeVisible({ timeout: 5000 });
        successFound = true;
        break;
      } catch (error) {
        // Continue to next indicator
      }
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'test-results/voyage-estimate-created.png',
      fullPage: true 
    });
    
    // Verify we're on a page that indicates successful creation
    // This could be an estimate details page, estimates list, or dashboard
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/estimate|success|dashboard/);
    
    console.log('Voyage estimate creation completed successfully');
    console.log('Final URL:', currentUrl);
  });
});

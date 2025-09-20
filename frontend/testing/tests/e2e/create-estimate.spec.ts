import { test, expect } from '@playwright/test';
import { generateTestData } from '../helpers/test-data-generator';

test('Create estimate with dynamic test data', async ({ page }) => {
  // Generate fresh test data for each run
  const testData = generateTestData();
  
  // Define estimate-specific test data
  const estimateData = {
    commodity: 'Crude Oil',
    quantity: '10000',
    unit: 'METRIC TON',
    loadPort: 'ROTTERDAM',
    dischargePort: 'ANTWERP',
    currency: 'USD',
    rate: '200',
    rateUnit: 'METRIC TON',
    laycanStart: 'Monday, September 1st,',
    laycanEnd: 'Friday, September 5th,'
  };
  
  console.log(`Testing estimate creation with commodity: ${estimateData.commodity} from ${estimateData.loadPort} to ${estimateData.dischargePort}`);

  // Login process
  await page.goto(testData.login.url);
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill(testData.login.username);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(testData.login.password);
  await page.getByRole('textbox', { name: 'Account Code' }).click();
  await page.getByRole('textbox', { name: 'Account Code' }).fill(testData.login.accountCode);
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Verify successful login
  await test.step('Verify successful login', async () => {
    await expect(page.getByText(testData.company.name)).toBeVisible({ timeout: 10000 });
  });
  
  await page.getByText(testData.company.name).click();
  
  // Navigate to Estimates
  await test.step('Navigate to Estimates section', async () => {
    await page.getByRole('link', { name: 'Estimates' }).click();
    await expect(page).toHaveURL(/.*estimates.*/);
  });

  // Start estimate creation
  await test.step('Start new estimate creation', async () => {
    await page.getByRole('button', { name: 'Add' }).click();
    // Verify the estimate creation form is loaded
    await expect(page.getByRole('combobox').filter({ hasText: 'Select commodity' })).toBeVisible();
  });

  // Fill estimate details
  await test.step('Fill estimate details', async () => {
    // Select commodity
    await page.getByRole('combobox').filter({ hasText: 'Select commodity' }).click();
    await page.getByRole('option', { name: estimateData.commodity }).click();
    
    // Verify commodity selection
    await expect(page.getByRole('combobox').filter({ hasText: estimateData.commodity })).toBeVisible();
    
    // Enter quantity
    await page.getByRole('spinbutton', { name: 'Quantity' }).click();
    await page.getByRole('spinbutton', { name: 'Quantity' }).fill(estimateData.quantity);
    
    // Verify quantity is entered
    await expect(page.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(estimateData.quantity);
    
    // Select quantity unit
    await page.locator('div').filter({ hasText: /^METRIC TONCUBICLONG TONLUMPSUMMETRIC TONSHORT TON$/ }).getByRole('combobox').click();
    await page.getByLabel(estimateData.unit).getByText(estimateData.unit).click();
    
    // Select load port
    await page.locator('.css-1t9uda7').first().click();
    await page.getByRole('option', { name: estimateData.loadPort }).click();
    
    // Verify load port selection
    await expect(page.locator('.css-1t9uda7').first()).toContainText(estimateData.loadPort);
    
    // Select discharge port
    await page.locator('.css-11vjxm8 > .css-1t9uda7').click();
    await page.getByRole('option', { name: estimateData.dischargePort }).click();
    
    // Verify discharge port selection
    await expect(page.locator('.css-11vjxm8 > .css-1t9uda7')).toContainText(estimateData.dischargePort);
    
    // Select currency
    await page.getByRole('combobox').filter({ hasText: estimateData.currency }).click();
    await page.getByLabel(estimateData.currency).getByText(estimateData.currency).click();
    
    // Enter rate
    await page.getByRole('spinbutton', { name: 'Rate' }).click();
    await page.getByRole('spinbutton', { name: 'Rate' }).fill(estimateData.rate);
    
    // Verify rate is entered
    await expect(page.getByRole('spinbutton', { name: 'Rate' })).toHaveValue(estimateData.rate);
    
    await page.getByRole('spinbutton', { name: 'Rate' }).press('Tab');
    
    // Select rate unit
    await page.getByRole('combobox').filter({ hasText: estimateData.rateUnit }).nth(1).click();
    await page.getByLabel(estimateData.rateUnit).getByText(estimateData.rateUnit).click();
  });

  // Set laycan dates
  await test.step('Set laycan dates', async () => {
    // Set start date
    await page.getByRole('textbox', { name: 'Pick a date' }).first().click();
    await page.getByRole('button', { name: estimateData.laycanStart }).click();
    
    // Set end date
    await page.getByRole('textbox', { name: 'Pick a date' }).nth(1).click();
    await page.getByRole('button', { name: estimateData.laycanEnd }).click();
    
    // Verify dates are set
    await expect(page.getByRole('textbox', { name: 'Pick a date' }).first()).not.toBeEmpty();
    await expect(page.getByRole('textbox', { name: 'Pick a date' }).nth(1)).not.toBeEmpty();
  });

  // Analyze ships
  await test.step('Analyze ships and verify vessel options', async () => {
    await page.getByRole('button', { name: 'Analyze Ships' }).click();
    
    // Wait for ship analysis to complete and vessels to be displayed
    await expect(page.getByText('Automation playwright')).toBeVisible({ timeout: 15000 });
    
    // Verify multiple vessel options are available
    await expect(page.getByText('Automation test vessel')).toBeVisible();
    await expect(page.getByText('Test vessel', { exact: true })).toBeVisible();
  });

  // Select vessel and create detailed estimate
  await test.step('Select vessel and create detailed estimate', async () => {
    // Select first vessel option
    await page.getByText('Automation playwright').click();
    
    // Verify vessel selection leads to detailed estimate
    await expect(page.getByText('Detailed Estimate - Test')).toBeVisible({ timeout: 10000 });
    
    // Click to view detailed estimate
    await page.getByText('Detailed Estimate - Test').click();
  });

  // Final verification of estimate creation
  await test.step('Verify estimate creation completion', async () => {
    // Verify we're on the estimate details page
    await expect(page).toHaveURL(/.*estimate.*/, { timeout: 10000 });
    
    // Verify key estimate information is displayed
    await expect(page.locator('body')).toContainText(estimateData.commodity);
    await expect(page.locator('body')).toContainText(estimateData.loadPort);
    await expect(page.locator('body')).toContainText(estimateData.dischargePort);
    await expect(page.locator('body')).toContainText(estimateData.quantity);
  });

  console.log(`✅ Estimate created successfully: ${estimateData.commodity} cargo from ${estimateData.loadPort} to ${estimateData.dischargePort}`);
});

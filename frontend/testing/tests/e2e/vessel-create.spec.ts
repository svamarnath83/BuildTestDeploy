import { test, expect } from '@playwright/test';
import { generateTestData } from '../helpers/test-data-generator';

test('Create vessel with dynamic test data', async ({ page }) => {
  // Generate fresh test data for each run
  const testData = generateTestData();
  
  console.log(`Testing with vessel: ${testData.vessel.name} (${testData.vessel.code})`);

  // Login process
  await page.goto(testData.login.url);
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill(testData.login.username);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(testData.login.password);
  await page.getByRole('textbox', { name: 'Account Code' }).click();
  await page.getByRole('textbox', { name: 'Account Code' }).fill(testData.login.accountCode);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByText(testData.company.name).click();
  
  // Vessel creation
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Register' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('link', { name: 'Vessel', exact: true }).click();
  await page1.getByRole('button', { name: 'Add' }).click();
  
  // Fill vessel details with generated data
  await page1.getByRole('textbox', { name: 'Vessel Code' }).click();
  await page1.getByRole('textbox', { name: 'Vessel Code' }).press('CapsLock');
  await page1.getByRole('textbox', { name: 'Vessel Code' }).fill(testData.vessel.code);
  await page1.getByRole('textbox', { name: 'Vessel Code' }).press('Tab');
  await page1.getByRole('textbox', { name: 'Vessel Name' }).fill('');
  await page1.getByRole('textbox', { name: 'Vessel Name' }).press('CapsLock');
  await page1.getByRole('textbox', { name: 'Vessel Name' }).fill(testData.vessel.name);
  await page1.getByRole('textbox', { name: 'Vessel Name' }).press('Tab');
  await page1.getByRole('combobox').filter({ hasText: /^$/ }).click();
  await page1.getByLabel(testData.vessel.type).getByText(testData.vessel.type).click();
  await page1.getByRole('spinbutton', { name: 'Dead Weight Tonnage' }).click();
  await page1.getByRole('spinbutton', { name: 'Dead Weight Tonnage' }).fill(testData.vessel.deadWeightTonnage);
  await page1.getByRole('spinbutton', { name: 'Running Cost' }).click();
  await page1.getByRole('spinbutton', { name: 'Running Cost' }).fill(testData.vessel.runningCost);
  await page1.locator('div').filter({ hasText: /^IMO$/ }).first().click();
  await page1.getByRole('spinbutton', { name: 'IMO' }).fill(testData.vessel.imo);
  
  // Grade configuration with generated data
  await page1.getByRole('combobox').filter({ hasText: 'Select grade' }).click();
  await page1.getByRole('option', { name: testData.grades.primary.grade }).click();
  await page1.getByRole('row', { name: 'Grade Type' }).getByRole('button').click();
  await page1.getByRole('combobox').filter({ hasText: 'Select grade' }).click();
  await page1.getByRole('option', { name: testData.grades.secondary.grade }).click();
  await page1.getByRole('combobox').filter({ hasText: 'Primary' }).nth(1).click();
  await page1.getByLabel(testData.grades.secondary.type).getByText(testData.grades.secondary.type).click();
  
  // Consumption configuration with generated values
  await page1.getByRole('row', { name: 'Port' }).getByPlaceholder('0.00').first().click();
  await page1.getByRole('row', { name: 'Port' }).getByPlaceholder('0.00').first().fill(testData.consumption.port.value1);
  await page1.getByRole('row', { name: 'Port' }).getByPlaceholder('0.00').nth(1).click();
  await page1.getByRole('row', { name: 'Port' }).getByPlaceholder('0.00').nth(1).fill(testData.consumption.port.value2);
  await page1.getByRole('row').filter({ hasText: 'BallastBallastLaden' }).getByPlaceholder('0.0', { exact: true }).click();
  await page1.getByRole('row').filter({ hasText: 'BallastBallastLaden' }).getByPlaceholder('0.0', { exact: true }).fill(testData.consumption.ballast.speed);
  await page1.getByRole('row').filter({ hasText: 'BallastBallastLaden' }).getByPlaceholder('0.00').first().click();
  await page1.getByRole('row', { name: testData.consumption.ballast.speed }).getByPlaceholder('0.00').first().fill(testData.consumption.ballast.value1);
  await page1.getByRole('row', { name: testData.consumption.ballast.speed }).getByPlaceholder('0.00').nth(1).click();
  await page1.getByRole('row', { name: testData.consumption.ballast.speed }).getByPlaceholder('0.00').nth(1).fill(testData.consumption.ballast.value2);
  await page1.getByRole('row').filter({ hasText: 'LadenBallastLaden' }).getByPlaceholder('0.0', { exact: true }).click();
  await page1.getByRole('row').filter({ hasText: 'LadenBallastLaden' }).getByPlaceholder('0.0', { exact: true }).fill(testData.consumption.laden.speed);
  await page1.getByRole('row').filter({ hasText: 'LadenBallastLaden' }).getByPlaceholder('0.00').first().click();
  await page1.getByRole('row', { name: testData.consumption.laden.speed, exact: true }).getByPlaceholder('0.00').first().fill(testData.consumption.laden.value1);
  await page1.getByRole('row', { name: testData.consumption.laden.speed, exact: true }).getByPlaceholder('0.00').nth(1).click();
  await page1.getByRole('row', { name: testData.consumption.laden.value1 }).getByPlaceholder('0.00').nth(1).fill(testData.consumption.laden.value2);
  
  // Save and validation
  await page1.getByRole('button', { name: 'Save' }).click();
  
  // Assert vessel creation success message with dynamic vessel name
  await test.step('Verify vessel creation success message', async () => {
    await expect(page1.getByRole('status')).toHaveText(
      `Vessel Created: Vessel "${testData.vessel.name}" has been created successfully.`,
      { timeout: 20000 }
    );
  });

  // Verify vessel appears in the list with generated data
  await page1.getByRole('link', { name: 'Vessel', exact: true }).click();
  await page1.locator('td:nth-child(2) > .file\\:text-foreground').click();
  await page1.locator('td:nth-child(2) > .file\\:text-foreground').fill(testData.vessel.code);
  
  // Assert all vessel details are displayed correctly
  await test.step('Verify vessel details in list', async () => {
    await expect(page1.locator('tbody')).toContainText(testData.vessel.name);
    await expect(page1.locator('tbody')).toContainText(testData.vessel.type);
    await expect(page1.locator('tbody')).toContainText(testData.vessel.deadWeightTonnage);
    await expect(page1.locator('tbody')).toContainText(testData.vessel.imo);
    await expect(page1.locator('tbody')).toContainText(testData.vessel.runningCost);
  });
});
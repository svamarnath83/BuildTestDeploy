import { test, expect } from '@playwright/test';

test.describe('Playwright MCP Setup Verification', () => {
  test('should verify basic page functionality', async ({ page }) => {
    // Navigate to a basic page (can be updated once your app is running)
    await page.goto('/');
    
    // Basic checks to verify Playwright is working
    expect(page).toBeTruthy();
    await expect(page).toHaveURL(/.*localhost.*/);
  });

  test('should capture screenshot for visual verification', async ({ page }) => {
    await page.goto('/');
    
    // Take a screenshot for manual verification
    await page.screenshot({ 
      path: 'test-results/setup-verification.png',
      fullPage: true 
    });
    
    // Basic page load verification
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('localhost');
  });
});

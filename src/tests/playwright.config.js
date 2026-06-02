const path = require('path');
const { defineConfig, devices } = require('@playwright/test');

const projectRoot = path.resolve(__dirname, '../..');
const artifactRoot = path.join(projectRoot, 'output', 'playwright');
const testUrl = 'http://127.0.0.1:4173';

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: '**/*.spec.js',
  outputDir: path.join(artifactRoot, 'test-results'),
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(artifactRoot, 'report'), open: 'never' }],
  ],
  use: {
    baseURL: testUrl,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm start',
    cwd: projectRoot,
    env: {
      BROWSER: 'none',
      CI: 'true',
      PORT: '4173',
    },
    reuseExistingServer: true,
    timeout: 120000,
    url: testUrl,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

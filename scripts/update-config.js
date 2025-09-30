#!/usr/bin/env node

// Script to update the configuration file for deployment
// Usage: node scripts/update-config.js <API_URL>

const fs = require('fs');
const path = require('path');

const API_URL = process.argv[2] || 'https://your-backend-url.com';

const configContent = `// Runtime configuration for the application
// This file can be updated during deployment to set the correct API URL

window.__API_URL__ = '${API_URL}';

// You can also set other configuration values here
window.__APP_CONFIG__ = {
  apiUrl: '${API_URL}',
  environment: 'production',
  version: '1.0.0'
};`;

const configPath = path.join(__dirname, '..', 'public', 'config.js');

try {
    fs.writeFileSync(configPath, configContent);
    console.log(`✅ Configuration updated successfully!`);
    console.log(`📡 API URL set to: ${API_URL}`);
    console.log(`📁 Config file: ${configPath}`);
} catch (error) {
    console.error('❌ Error updating configuration:', error.message);
    process.exit(1);
}

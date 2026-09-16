// admin/lib/generateJson.js
const fs = require('fs');
const path = require('path');

// Resolve path to CC-Hosting-Public/public/data/products.json
const jsonFilePath = path.resolve(__dirname, '../../CC-Hosting-Public/public/data/products.json');

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function getProductsData() {
  try {
    if (!fs.existsSync(jsonFilePath)) {
      throw new Error(`Data file not found at ${jsonFilePath}`);
    }
    const rawData = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading products.json:', error.message);
    throw error;
  }
}

function saveProductsData(fullData) {
  try {
    ensureDirectoryExistence(jsonFilePath);
    const serialized = JSON.stringify(fullData, null, 2);
    fs.writeFileSync(jsonFilePath, serialized, 'utf8');
    return { success: true, timestamp: new Date().toISOString() };
  } catch (error) {
    console.error('Error writing products.json:', error.message);
    throw error;
  }
}

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

module.exports = {
  jsonFilePath,
  getProductsData,
  saveProductsData,
  createSlug
};

// admin/lib/generateJson.js
const fs = require('fs');
const path = require('path');

function findRepoRoot() {
  // 1. Try climbing up from process.cwd()
  let current = process.cwd();
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(current, 'CC-Hosting-Public', 'public', 'data', 'products.json'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  // 2. Try climbing up from __dirname
  current = __dirname;
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(current, 'CC-Hosting-Public', 'public', 'data', 'products.json'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return null;
}

// Dynamically resolve path to CC-Hosting-Public/public/data/products.json
function getJsonFilePath() {
  const root = findRepoRoot();
  if (root) {
    return path.join(root, 'CC-Hosting-Public', 'public', 'data', 'products.json');
  }

  // Fallback candidates if not found
  const candidatePaths = [
    path.resolve(process.cwd(), '../CC-Hosting-Public/public/data/products.json'),
    path.resolve(process.cwd(), 'CC-Hosting-Public/public/data/products.json'),
    path.resolve(__dirname, '../../CC-Hosting-Public/public/data/products.json'),
    path.resolve(__dirname, '../../../CC-Hosting-Public/public/data/products.json'),
    path.resolve(__dirname, '../../../../CC-Hosting-Public/public/data/products.json')
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  if (process.cwd().endsWith('admin')) {
    return path.resolve(process.cwd(), '../CC-Hosting-Public/public/data/products.json');
  }
  return path.resolve(process.cwd(), 'CC-Hosting-Public/public/data/products.json');
}

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname, { recursive: true });
}

function getProductsData() {
  const filePath = getJsonFilePath();
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Data file not found at ${filePath}`);
    }
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading products.json at', filePath, ':', error.message);
    throw error;
  }
}

function saveProductsData(fullData) {
  const filePath = getJsonFilePath();
  try {
    ensureDirectoryExistence(filePath);
    const serialized = JSON.stringify(fullData, null, 2);
    fs.writeFileSync(filePath, serialized, 'utf8');
    return { success: true, timestamp: new Date().toISOString() };
  } catch (error) {
    console.error('Error writing products.json at', filePath, ':', error.message);
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
  getJsonFilePath,
  get jsonFilePath() {
    return getJsonFilePath();
  },
  getProductsData,
  saveProductsData,
  createSlug
};

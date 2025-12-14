
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, 'dist');
const noJekyllPath = path.join(distPath, '.nojekyll');

// Ensure dist exists
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
}

// Create empty .nojekyll file
fs.writeFileSync(noJekyllPath, '');
console.log('.nojekyll created successfully in dist folder');


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distPath)) {
    console.error('Error: dist directory does not exist. Run "npm run build" first.');
    process.exit(1);
}

// 1. Create .nojekyll to prevent GitHub Pages from ignoring files starting with _
const noJekyllPath = path.join(distPath, '.nojekyll');
fs.writeFileSync(noJekyllPath, '');
console.log('Created .nojekyll file');

// 2. Copy index.html to 404.html for SPA routing support
const indexHtmlPath = path.join(distPath, 'index.html');
const notFoundHtmlPath = path.join(distPath, '404.html');

if (fs.existsSync(indexHtmlPath)) {
    fs.copyFileSync(indexHtmlPath, notFoundHtmlPath);
    console.log('Copied index.html to 404.html for SPA routing');
} else {
    console.error('Error: index.html not found in dist directory.');
    process.exit(1);
}

console.log('Deployment preparation complete.');

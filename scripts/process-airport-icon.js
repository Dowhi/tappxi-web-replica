import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

const processAirportIcon = async () => {
    const sourcePath = path.join(publicDir, 'airport-icon.png');
    const outputPath = path.join(publicDir, 'airport-icon.png');

    if (!fs.existsSync(sourcePath)) {
        console.error('❌ Source image not found:', sourcePath);
        process.exit(1);
    }

    // Load the original image
    const image = await loadImage(sourcePath);

    // Scale: 10% more width, 20% more height
    const scaleWidth = 1.10;
    const scaleHeight = 1.20;
    const newWidth = Math.floor(image.width * scaleWidth);
    const newHeight = Math.floor(image.height * scaleHeight);

    const canvas = createCanvas(newWidth, newHeight);
    const ctx = canvas.getContext('2d');

    // Draw the scaled image
    ctx.drawImage(image, 0, 0, newWidth, newHeight);

    // Get image data to modify colors
    const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
    const data = imageData.data;

    // Convert black/dark colors to white
    // Keep yellow and purple colors as they are
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        // Skip transparent pixels
        if (alpha < 10) continue;

        // Check if it's a dark color (black or very dark gray)
        // Dark colors have low RGB values
        const isDark = r < 100 && g < 100 && b < 100;

        if (isDark) {
            // Change to white
            data[i] = 255;     // R
            data[i + 1] = 255; // G
            data[i + 2] = 255; // B
            // Keep alpha as is
        }
    }

    // Put the modified image data back
    ctx.putImageData(imageData, 0, 0);

    // Save the processed image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Processed airport icon: ${newWidth}x${newHeight}`);
    console.log(`   Width: ${Math.round(scaleWidth * 100)}% | Height: ${Math.round(scaleHeight * 100)}%`);
    console.log(`✅ Changed black lines to white`);
};

processAirportIcon().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});

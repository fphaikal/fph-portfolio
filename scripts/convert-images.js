const sharp = require('sharp');
const path = require('path');

async function convertImages() {
  const images = [
    { input: 'public/smscp.png', output: 'public/smscp.webp' },
    { input: 'public/web-developer.png', output: 'public/web-developer.webp' },
  ];

  for (const img of images) {
    try {
      await sharp(img.input)
        .webp({ quality: 80 })
        .toFile(img.output);
      console.log(`Converted: ${img.input} -> ${img.output}`);
    } catch (err) {
      console.error(`Error converting ${img.input}:`, err);
    }
  }
}

convertImages();

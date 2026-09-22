import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

// 1. Standard icon SVG buffer
const iconSvg = fs.readFileSync(path.join(publicDir, 'icon.svg'));

// 2. Maskable icon SVG (full bleed background, no rounded corners, compass centered in safe zone)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="voyager-bg-full" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d9488" />
      <stop offset="50%" stop-color="#0f766e" />
      <stop offset="100%" stop-color="#042f2e" />
    </linearGradient>
    <linearGradient id="needle-north" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#ccfbf1" />
    </linearGradient>
    <linearGradient id="needle-south" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14b8a6" />
      <stop offset="100%" stop-color="#2dd4bf" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Full-bleed background for maskable adaptive icons -->
  <rect width="512" height="512" fill="url(#voyager-bg-full)" />

  <!-- Compass graphics placed inside the central 70% safe zone -->
  <g transform="translate(64, 64) scale(0.75)">
    <!-- Outer subtle circular bezel -->
    <circle cx="256" cy="256" r="184" fill="none" stroke="#2dd4bf" stroke-width="4" stroke-opacity="0.3" stroke-dasharray="8 12" />
    <circle cx="256" cy="256" r="160" fill="#0d9488" fill-opacity="0.25" stroke="#5eead4" stroke-width="2" stroke-opacity="0.5" />

    <!-- Compass markings -->
    <line x1="256" y1="104" x2="256" y2="124" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
    <line x1="256" y1="388" x2="256" y2="408" stroke="#5eead4" stroke-width="4" stroke-linecap="round" stroke-opacity="0.6" />
    <line x1="388" y1="256" x2="408" y2="256" stroke="#5eead4" stroke-width="4" stroke-linecap="round" stroke-opacity="0.6" />
    <line x1="104" y1="256" x2="124" y2="256" stroke="#5eead4" stroke-width="4" stroke-linecap="round" stroke-opacity="0.6" />

    <!-- Cardinal points -->
    <g filter="url(#glow)">
      <!-- North Pointer -->
      <polygon points="256,128 286,256 256,236" fill="url(#needle-north)" />
      <polygon points="256,128 226,256 256,236" fill="#e2e8f0" />

      <!-- South Pointer -->
      <polygon points="256,384 286,256 256,276" fill="#0f766e" />
      <polygon points="256,384 226,256 256,276" fill="url(#needle-south)" />

      <!-- East Pointer -->
      <polygon points="384,256 256,226 276,256" fill="#14b8a6" fill-opacity="0.8" />
      <polygon points="384,256 256,286 276,256" fill="#0d9488" fill-opacity="0.9" />

      <!-- West Pointer -->
      <polygon points="128,256 256,226 236,256" fill="#5eead4" fill-opacity="0.8" />
      <polygon points="128,256 256,286 236,256" fill="#2dd4bf" fill-opacity="0.9" />
    </g>

    <!-- Center Pivot Pin -->
    <circle cx="256" cy="256" r="16" fill="#ffffff" filter="url(#glow)" />
    <circle cx="256" cy="256" r="8" fill="#0f766e" />
  </g>
</svg>`;

async function generate() {
  console.log('Generating PWA icons...');

  // 1. 192x192 PNG
  await sharp(iconSvg)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('✓ Created pwa-192x192.png');

  // 2. 512x512 PNG
  await sharp(iconSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('✓ Created pwa-512x512.png');

  // 3. 512x512 Maskable PNG
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('✓ Created pwa-maskable-512x512.png');

  // 4. Apple Touch Icon (180x180)
  await sharp(iconSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Created apple-touch-icon.png');

  // 5. Favicon PNG fallback (64x64)
  await sharp(iconSvg)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('✓ Created favicon.png');

  console.log('All PWA icons generated successfully!');
}

generate().catch(console.error);

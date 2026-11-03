import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

function createIcon(size, isMaskable = false) {
  const png = new PNG({ width: size, height: size });
  const center = size / 2;
  const radius = isMaskable ? size * 0.42 : size * 0.45;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      
      // Background gradient from dark slate to indigo
      const tY = y / size;
      const tX = x / size;

      // Rounded squircle distance
      const dx = Math.abs(x - center);
      const dy = Math.abs(y - center);
      const r = size * 0.44;
      const cornerR = size * 0.18;

      let inSquircle = false;
      if (dx <= r && dy <= r) {
        if (dx <= r - cornerR || dy <= r - cornerR) {
          inSquircle = true;
        } else {
          const cornerDist = Math.hypot(dx - (r - cornerR), dy - (r - cornerR));
          if (cornerDist <= cornerR) {
            inSquircle = true;
          }
        }
      }

      if (inSquircle || isMaskable) {
        // Gradient color: indigo to purple
        const rColor = Math.floor(99 + (139 - 99) * tX);
        const gColor = Math.floor(102 + (92 - 102) * tY);
        const bColor = Math.floor(241 + (246 - 241) * tX);

        // Draw central bookmark & link motif
        const innerDx = Math.abs(x - center);
        const innerDy = y - center;

        // Bookmark outline/shape in center
        const bmWidth = size * 0.32;
        const bmHeight = size * 0.44;
        const bmTop = center - bmHeight * 0.5;
        const bmBottom = center + bmHeight * 0.5;

        let inBookmark = false;
        if (x >= center - bmWidth / 2 && x <= center + bmWidth / 2 && y >= bmTop && y <= bmBottom) {
          // Notch at the bottom
          const notchDepth = bmHeight * 0.22;
          const fromBottom = bmBottom - y;
          const notchHalf = (bmWidth / 2) * (1 - fromBottom / notchDepth);
          if (y > bmBottom - notchDepth && Math.abs(x - center) < notchHalf) {
            inBookmark = false;
          } else {
            inBookmark = true;
          }
        }

        if (inBookmark) {
          // White bookmark with subtle shadow / inner glow
          // Chain link accent in center of bookmark
          const distFromCore = Math.hypot(x - center, y - (center - size * 0.04));
          if (distFromCore < size * 0.08 && distFromCore > size * 0.04) {
            // Cyan accent ring
            png.data[idx] = 6;      // R
            png.data[idx + 1] = 182; // G
            png.data[idx + 2] = 212; // B
            png.data[idx + 3] = 255; // A
          } else {
            png.data[idx] = 255;
            png.data[idx + 1] = 255;
            png.data[idx + 2] = 255;
            png.data[idx + 3] = 255;
          }
        } else {
          // Background squircle gradient
          png.data[idx] = rColor;
          png.data[idx + 1] = gColor;
          png.data[idx + 2] = bColor;
          png.data[idx + 3] = 255;
        }
      } else {
        // Transparent outside squircle
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
      }
    }
  }

  return PNG.sync.write(png);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createIcon(192));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createIcon(512));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createIcon(512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createIcon(180));
console.log('Icons generated successfully in public/');

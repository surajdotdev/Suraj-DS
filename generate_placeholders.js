const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const base = path.join(__dirname, 'assets', 'images');
const dirs = ['branding', 'projects', 'profile', 'backgrounds', 'social'];

dirs.forEach(d => fs.mkdirSync(path.join(base, d), { recursive: true }));

async function createPlaceholder(filename, width, height, text, color) {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="grad" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="${color.light}" />
        <stop offset="100%" stop-color="${color.dark}" />
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#grad)" />
    <text x="50%" y="50%" font-family="sans-serif" font-size="${width/15}" font-weight="bold" fill="rgba(255,255,255,0.7)" dominant-baseline="middle" text-anchor="middle">${text}</text>
  </svg>`;

  await sharp(Buffer.from(svg))
    .webp({ quality: 80 })
    .toFile(filename);
}

async function generateAll() {
  const pDir = path.join(base, 'projects');
  await createPlaceholder(path.join(pDir, 'project-clinic.webp'), 1200, 900, 'Project: Clinic', {light: '#1e293b', dark: '#0f172a'});
  await createPlaceholder(path.join(pDir, 'project-cleaning.webp'), 1200, 900, 'Project: Cleaning', {light: '#312e81', dark: '#1e1b4b'});
  await createPlaceholder(path.join(pDir, 'project-restaurant.webp'), 1200, 900, 'Project: Restaurant', {light: '#78350f', dark: '#451a03'});
  await createPlaceholder(path.join(pDir, 'project-agency.webp'), 1200, 900, 'Project: Agency', {light: '#3f3f46', dark: '#18181b'});
  
  // Hero Showcase (layered browsers needs distinct hero images)
  await createPlaceholder(path.join(base, 'hero-showcase-back.webp'), 1000, 800, 'Hero: E-commerce', {light: '#064e3b', dark: '#022c22'});
  await createPlaceholder(path.join(base, 'hero-showcase-main.webp'), 1200, 900, 'Hero: Dashboard', {light: '#4c1d95', dark: '#2e1065'});
  await createPlaceholder(path.join(base, 'hero-showcase-front.webp'), 800, 600, 'Hero: Creative', {light: '#9f1239', dark: '#4c0519'});
  
  const prDir = path.join(base, 'profile');
  await createPlaceholder(path.join(prDir, 'profile-portrait.webp'), 800, 800, 'Profile Portrait', {light: '#171717', dark: '#0a0a0a'});
  
  const sDir = path.join(base, 'social');
  await createPlaceholder(path.join(sDir, 'og-image.webp'), 1200, 630, 'Suraj OS', {light: '#5b21b6', dark: '#2e1065'});

  const bDir = path.join(base, 'branding');
  fs.writeFileSync(path.join(bDir, 'logo.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" fill="white">
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" letter-spacing="2">SURAJ</text>
  </svg>`);
  
  fs.writeFileSync(path.join(bDir, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="white">
    <rect width="32" height="32" rx="8" fill="#1e1e1e"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold">S</text>
  </svg>`);
  
  console.log('Images generated successfully!');
}

generateAll().catch(console.error);

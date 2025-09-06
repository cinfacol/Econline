#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Crear un SVG de perfil de usuario profesional
const svgContent = `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo circular con gradiente -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.2"/>
    </filter>
  </defs>
  
  <!-- Fondo circular -->
  <circle cx="100" cy="100" r="100" fill="url(#bgGradient)" filter="url(#shadow)"/>
  
  <!-- Silueta de persona -->
  <g fill="white" opacity="0.9">
    <!-- Cabeza -->
    <circle cx="100" cy="70" r="25"/>
    
    <!-- Cuerpo/hombros -->
    <path d="M 100 95 
             C 85 95, 70 100, 60 120
             C 55 130, 55 140, 60 145
             L 140 145
             C 145 140, 145 130, 140 120
             C 130 100, 115 95, 100 95 Z"/>
  </g>
  
  <!-- Detalles adicionales (opcional) -->
  <g fill="white" opacity="0.6">
    <!-- Collar/cuello de camisa -->
    <path d="M 85 135 L 100 125 L 115 135 L 115 145 L 85 145 Z"/>
  </g>
</svg>
`;

const outputPath = path.join(__dirname, "../public/images/default_avatar.svg");

// Crear directorio si no existe
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Escribir el archivo SVG
fs.writeFileSync(outputPath, svgContent.trim());

console.log("Avatar por defecto creado en:", outputPath);

// También crear una versión PNG si está disponible sharp
try {
  const sharp = require("sharp");

  const pngPath = path.join(__dirname, "../public/images/default_avatar.svg");

  sharp(Buffer.from(svgContent))
    .png()
    .toFile(pngPath, (err, info) => {
      if (err) {
        console.log("Sharp no disponible, usando solo SVG");
      } else {
        console.log("Avatar PNG creado en:", pngPath);
      }
    });
} catch (e) {
  console.log("Sharp no instalado, usando solo SVG");
}

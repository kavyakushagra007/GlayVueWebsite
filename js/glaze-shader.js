/* ==========================================================================
   GLAYVUE — Interactive 3D Ceramic Glaze Simulator (Canvas Engine)
   Renders real-time specular highlights, material gloss, firing temperature melt,
   and glaze chemistry reactions on interactive 3D pottery geometry.
   ========================================================================== */

(function () {
  'use strict';

  // Canvas & Context Setup
  const canvas = document.getElementById('glazeCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // State Variables
  let width = canvas.width = canvas.parentElement.clientWidth;
  let height = canvas.height = canvas.parentElement.clientHeight;
  
  let rotationY = 0.5;
  let rotationX = 0.2;
  let isDragging = false;
  let previousMouseX = 0;
  let previousMouseY = 0;
  
  // Glaze Material Presets
  const glazePresets = {
    celadon: {
      name: 'Glossy Celadon',
      baseColor: { r: 64, g: 156, b: 140 },
      specularColor: { r: 240, g: 255, b: 250 },
      shininess: 90,
      translucency: 0.8,
      roughness: 0.05,
      speckles: false
    },
    shino: {
      name: 'Satin Shino',
      baseColor: { r: 228, g: 184, b: 146 },
      specularColor: { r: 255, g: 242, b: 220 },
      shininess: 25,
      translucency: 0.3,
      roughness: 0.25,
      speckles: false
    },
    tenmoku: {
      name: 'Metallic Tenmoku',
      baseColor: { r: 68, g: 42, b: 32 },
      specularColor: { r: 245, g: 190, b: 90 },
      shininess: 120,
      translucency: 0.1,
      roughness: 0.1,
      speckles: true,
      speckleColor: { r: 180, g: 120, b: 40 }
    },
    raku: {
      name: 'Speckled Raku',
      baseColor: { r: 180, g: 85, b: 50 },
      specularColor: { r: 255, g: 255, b: 255 },
      shininess: 45,
      translucency: 0.4,
      roughness: 0.4,
      speckles: true,
      speckleColor: { r: 20, g: 20, b: 20 }
    }
  };
  
  let currentGlaze = glazePresets.celadon;
  let firingCone = 6; // Default Cone 6
  let atmosphere = 'reduction'; // oxidation vs reduction

  // Handle Resize
  function resizeCanvas() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
    render();
  }
  
  window.addEventListener('resize', resizeCanvas);

  // Mouse & Touch Interactivity for 3D Model Rotation
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMouseX;
    const deltaY = e.clientY - previousMouseY;
    
    rotationY += deltaX * 0.01;
    rotationX = Math.max(-0.8, Math.min(0.8, rotationX + deltaY * 0.01));
    
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
    render();
  });

  window.addEventListener('mouseup', () => { isDragging = false; });
  
  // Touch Support
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    }
  });
  
  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - previousMouseX;
    const deltaY = e.touches[0].clientY - previousMouseY;
    
    rotationY += deltaX * 0.01;
    rotationX = Math.max(-0.8, Math.min(0.8, rotationX + deltaY * 0.01));
    
    previousMouseX = e.touches[0].clientX;
    previousMouseY = e.touches[0].clientY;
    render();
  });

  window.addEventListener('touchend', () => { isDragging = false; });

  // Control UI Listeners
  document.querySelectorAll('.glaze-preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.glaze-preset-btn').forEach(b => b.classList.remove('active'));
      const targetBtn = e.currentTarget;
      targetBtn.classList.add('active');
      const presetKey = targetBtn.getAttribute('data-glaze');
      if (glazePresets[presetKey]) {
        currentGlaze = glazePresets[presetKey];
        const infoBadge = document.getElementById('glazeNameBadge');
        if (infoBadge) infoBadge.textContent = currentGlaze.name;
        render();
      }
    });
  });

  const coneSlider = document.getElementById('coneSlider');
  if (coneSlider) {
    coneSlider.addEventListener('input', (e) => {
      firingCone = parseFloat(e.target.value);
      const valDisplay = document.getElementById('coneValueDisplay');
      if (valDisplay) valDisplay.textContent = `Cone ${firingCone < 1 ? '0' + Math.round(firingCone * 10) : Math.round(firingCone)}`;
      render();
    });
  }

  document.querySelectorAll('.atmo-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.atmo-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      atmosphere = e.currentTarget.getAttribute('data-atmo');
      render();
    });
  });

  // 3D Pottery Generator Math (Vase 3D Mesh Lathe / Surface Shader)
  function render() {
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const radiusScale = Math.min(width, height) * 0.28;
    
    // Light direction (Vector)
    const lightDir = { x: 0.5, y: -0.7, z: 0.6 };
    const len = Math.hypot(lightDir.x, lightDir.y, lightDir.z);
    lightDir.x /= len; lightDir.y /= len; lightDir.z /= len;

    // Heat Melt Adjustment factor from Firing Cone
    const meltFactor = (firingCone - 4) / 6.0; // 0.0 to 1.0
    const atmoShift = atmosphere === 'reduction' ? 0.85 : 1.15;

    // Render Pottery Vase Rings (Lathe Mesh Rendering)
    const segmentsV = 45;
    const segmentsH = 45;
    
    for (let i = 0; i < segmentsV; i++) {
      const v1 = i / segmentsV;
      const v2 = (i + 1) / segmentsV;
      
      // Vase silhouette profile curve (R base -> waist -> neck -> lip)
      const r1 = getVaseRadius(v1) * radiusScale;
      const r2 = getVaseRadius(v2) * radiusScale;
      
      const y1 = centerY + (0.5 - v1) * radiusScale * 2.2;
      const y2 = centerY + (0.5 - v2) * radiusScale * 2.2;
      
      for (let j = 0; j < segmentsH; j++) {
        const u1 = (j / segmentsH) * Math.PI * 2 + rotationY;
        const u2 = ((j + 1) / segmentsH) * Math.PI * 2 + rotationY;
        
        // Quad 3D vertices
        const x11 = Math.cos(u1) * r1;
        const z11 = Math.sin(u1) * r1;
        const x12 = Math.cos(u2) * r1;
        const z12 = Math.sin(u2) * r1;
        
        const x21 = Math.cos(u1) * r2;
        const z21 = Math.sin(u1) * r2;
        const x22 = Math.cos(u2) * r2;
        const z22 = Math.sin(u2) * r2;
        
        // Apply rotation X tilt
        const rotY11 = y1 * Math.cos(rotationX) - z11 * Math.sin(rotationX);
        const rotZ11 = y1 * Math.sin(rotationX) + z11 * Math.cos(rotationX);
        
        const rotY12 = y1 * Math.cos(rotationX) - z12 * Math.sin(rotationX);
        const rotZ12 = y1 * Math.sin(rotationX) + z12 * Math.cos(rotationX);
        
        const rotY21 = y2 * Math.cos(rotationX) - z21 * Math.sin(rotationX);
        const rotZ21 = y2 * Math.sin(rotationX) + z21 * Math.cos(rotationX);

        // Backface culling
        const avgZ = (rotZ11 + rotZ12 + rotZ21) / 3;
        if (avgZ < -20) continue;

        // Normal calculation for Phong Lighting
        const normX = (Math.cos(u1) + Math.cos(u2)) / 2;
        const normY = (getVaseNormalY(v1) + getVaseNormalY(v2)) / 2;
        const normZ = (Math.sin(u1) + Math.sin(u2)) / 2;

        // Diffuse Lambert intensity
        let dot = normX * lightDir.x + normY * lightDir.y + normZ * lightDir.z;
        dot = Math.max(0.15, dot);

        // Specular Reflection (Phong)
        const viewDir = { x: 0, y: 0, z: 1 };
        const halfX = lightDir.x + viewDir.x;
        const halfY = lightDir.y + viewDir.y;
        const halfZ = lightDir.z + viewDir.z;
        const halfLen = Math.hypot(halfX, halfY, halfZ);
        const specDot = Math.max(0, (normX * (halfX/halfLen) + normY * (halfY/halfLen) + normZ * (halfZ/halfLen)));
        const specular = Math.pow(specDot, currentGlaze.shininess);

        // Shading Calculations
        let r = Math.min(255, (currentGlaze.baseColor.r * dot * atmoShift) + (currentGlaze.specularColor.r * specular));
        let g = Math.min(255, (currentGlaze.baseColor.g * dot * atmoShift) + (currentGlaze.specularColor.g * specular));
        let b = Math.min(255, (currentGlaze.baseColor.b * dot) + (currentGlaze.specularColor.b * specular));
        
        // Heat melt glow integration
        r = Math.min(255, r + meltFactor * 25);
        g = Math.min(255, g + meltFactor * 10);

        ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
        
        ctx.beginPath();
        ctx.moveTo(centerX + x11, rotY11);
        ctx.lineTo(centerX + x12, rotY12);
        ctx.lineTo(centerX + x22, rotY21);
        ctx.lineTo(centerX + x21, rotY21);
        ctx.closePath();
        ctx.fill();

        // Optional Ceramic Glaze Speckle overlay
        if (currentGlaze.speckles && (i % 3 === 0) && (j % 4 === 0)) {
          ctx.fillStyle = `rgba(${currentGlaze.speckleColor.r}, ${currentGlaze.speckleColor.g}, ${currentGlaze.speckleColor.b}, 0.6)`;
          ctx.beginPath();
          ctx.arc(centerX + x11, rotY11, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // Radius function for ceramic vase shape
  function getVaseRadius(v) {
    // Elegant ceramic vase profile
    return 0.35 + 0.35 * Math.sin(v * Math.PI) + 0.15 * Math.sin(v * Math.PI * 3.5);
  }

  function getVaseNormalY(v) {
    return 0.35 * Math.cos(v * Math.PI) * Math.PI;
  }

  // Initial Auto-Rotation Loop
  let autoRotateTimer = setInterval(() => {
    if (!isDragging) {
      rotationY += 0.005;
      render();
    }
  }, 30);

  // Initial render call
  setTimeout(resizeCanvas, 100);

})();

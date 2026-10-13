/**
 * Minimal Ambient Background Particles Engine for The Exit
 * Elegant, subtle, non-intrusive ambient background drift.
 */

(function () {
  'use strict';

  const SUBTLE_GOLD_COLORS = [
    '#CEA159', // Brand Gold
    '#c8aa6e', // Soft Antique Gold
    '#dfba73', // Light Champagne
    '#b89047'  // Deep Amber
  ];

  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex.slice(0, 6), 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function initParticles(container, options) {
    if (!container) return null;
    options = options || {};

    const isMobile = (window.innerWidth || 800) < 768;
    const particleCount = options.particleCount || (isMobile ? 18 : 32);
    const speedMultiplier = options.speed || 0.12;
    const palette = (options.particleColors && options.particleColors.length > 0)
      ? options.particleColors
      : SUBTLE_GOLD_COLORS;
    const rgbPalette = palette.map(hexToRgb);

    let canvas = container.querySelector('canvas.particles-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'particles-canvas';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      container.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    resize();

    // Create Minimal Particles - Tiny gold dust specks only, no giant bokeh orbs
    const particles = [];

    function createParticle(initialY) {
      const color = rgbPalette[Math.floor(Math.random() * rgbPalette.length)];
      // Subtle micro dust: radius 0.6px to 1.4px
      const radius = 0.6 + Math.random() * 0.8;
      // Gentle, low opacity: 0.12 to 0.28
      const baseAlpha = 0.12 + Math.random() * 0.16;

      const x = Math.random() * width;
      const y = (initialY !== undefined) ? initialY : Math.random() * height;

      return {
        x: x,
        y: y,
        radius: radius,
        color: color,
        baseAlpha: baseAlpha,
        // Extremely gentle upward drift
        vy: -(0.08 + Math.random() * 0.14) * speedMultiplier,
        vx: (Math.random() - 0.5) * 0.05 * speedMultiplier,
        // Very subtle natural sway
        swaySpeed: 0.0005 + Math.random() * 0.0008,
        swayAmp: 0.15 + Math.random() * 0.25,
        swayPhase: Math.random() * Math.PI * 2,
        // Soft ambient breathing
        twinkleSpeed: 0.0008 + Math.random() * 0.0012,
        twinklePhase: Math.random() * Math.PI * 2
      };
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    let animationFrameId;
    let lastTime = performance.now();

    function render(currentTime) {
      animationFrameId = requestAnimationFrame(render);

      const delta = Math.min(currentTime - lastTime, 64);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      const time = currentTime;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle ambient sway
        const sway = Math.sin(time * p.swaySpeed + p.swayPhase) * p.swayAmp;
        p.x += (p.vx + sway) * (delta / 16);
        p.y += p.vy * (delta / 16);

        // Screen boundary wrap
        if (p.y < -15) {
          p.y = height + 10 + Math.random() * 15;
          p.x = Math.random() * width;
        } else if (p.y > height + 20) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        if (p.x < -15) {
          p.x = width + 10;
        } else if (p.x > width + 15) {
          p.x = -10;
        }

        // Soft subtle twinkling
        const twinkle = 0.78 + 0.22 * Math.sin(time * p.twinkleSpeed + p.twinklePhase);
        const currentAlpha = Math.max(0.05, Math.min(0.35, p.baseAlpha * twinkle));

        const r = p.color.r;
        const g = p.color.g;
        const b = p.color.b;

        // Draw delicate micro gold dust
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    animationFrameId = requestAnimationFrame(render);

    window.addEventListener('resize', resize, { passive: true });

    return function destroy() {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }

  // Expose globally
  window.initParticles = initParticles;

  // Auto-initialize when DOM is ready
  function autoStart() {
    const bgContainer = document.getElementById('particles-bg');
    if (bgContainer && !bgContainer.hasAttribute('data-particles-loaded')) {
      bgContainer.setAttribute('data-particles-loaded', 'true');
      initParticles(bgContainer, {
        speed: 0.12,
        moveParticlesOnHover: false
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoStart);
  } else {
    autoStart();
  }
})();

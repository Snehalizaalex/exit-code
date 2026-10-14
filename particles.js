/**
 * Elegant Golden Particles Engine for The Exit
 * Small, clearly visible, delicate ambient gold sparkles in the background.
 */

(function () {
  'use strict';

  const GOLD_COLORS = [
    '#CEA159', // Brand Gold
    '#f6cf7d', // Radiant Champagne Gold
    '#ffd700', // Sparkling Gold
    '#f3b74e', // Warm Amber Gold
    '#dfba73'  // Antique Gold
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
    // A clean "few" particles: visible, but not an overwhelming 220 swarm
    const particleCount = options.particleCount || (isMobile ? 42 : 78);
    const speedMultiplier = options.speed || 0.35;
    const palette = (options.particleColors && options.particleColors.length > 0)
      ? options.particleColors
      : GOLD_COLORS;
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

    // Mouse Tracking for gentle ambient parallax
    let mouse = { x: -9999, y: -9999, active: false };

    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }

    function onMouseLeave() {
      mouse.active = false;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    // Create Small, Visible Gold Particles
    const particles = [];

    function createParticle(initialY) {
      const color = rgbPalette[Math.floor(Math.random() * rgbPalette.length)];
      // Small, clearly visible gold motes (radius 1.5px to 3.2px)
      const radius = 1.5 + Math.random() * 1.7;
      // High, crisp visibility opacity (0.50 to 0.88)
      const baseAlpha = 0.50 + Math.random() * 0.38;

      const x = Math.random() * width;
      const y = (initialY !== undefined) ? initialY : Math.random() * height;

      return {
        x: x,
        y: y,
        radius: radius,
        color: color,
        baseAlpha: baseAlpha,
        // Steady upward floating drift
        vy: -(0.22 + Math.random() * 0.32) * speedMultiplier,
        vx: (Math.random() - 0.5) * 0.12 * speedMultiplier,
        // Subtle organic sway
        swaySpeed: 0.001 + Math.random() * 0.0015,
        swayAmp: 0.3 + Math.random() * 0.45,
        swayPhase: Math.random() * Math.PI * 2,
        // Gentle sparkling twinkle
        twinkleSpeed: 0.0015 + Math.random() * 0.0025,
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

        // Sway motion
        const sway = Math.sin(time * p.swaySpeed + p.swayPhase) * p.swayAmp;
        p.x += (p.vx + sway) * (delta / 16);
        p.y += p.vy * (delta / 16);

        // Screen boundary wrap
        if (p.y < -20) {
          p.y = height + 15 + Math.random() * 20;
          p.x = Math.random() * width;
        } else if (p.y > height + 25) {
          p.y = -15;
          p.x = Math.random() * width;
        }

        if (p.x < -20) {
          p.x = width + 15;
        } else if (p.x > width + 20) {
          p.x = -15;
        }

        // Sparkling twinkle alpha
        const twinkle = 0.70 + 0.30 * Math.sin(time * p.twinkleSpeed + p.twinklePhase);
        const currentAlpha = Math.max(0.25, Math.min(1.0, p.baseAlpha * twinkle));

        const r = p.color.r;
        const g = p.color.g;
        const b = p.color.b;

        // Draw small glowing gold mote
        ctx.save();
        ctx.shadowBlur = 7;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.85})`;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Delicate bright inner spark
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.75})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, p.radius * 0.45), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    animationFrameId = requestAnimationFrame(render);

    window.addEventListener('resize', resize, { passive: true });

    return function destroy() {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
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
        speed: 0.35
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoStart);
  } else {
    autoStart();
  }
})();

/**
 * Luxury Golden Particles Engine for The Exit
 * Self-contained, zero-dependency, works flawlessly with file://, http://, and https://
 */

(function () {
  'use strict';

  const DEFAULT_COLORS = [
    '#CEA159', // Brand Gold
    '#e5be7a', // Light Champagne Gold
    '#ffd700', // Radiant Yellow Gold
    '#f5c26b', // Warm Amber Gold
    '#dfba73', // Antique Gold
    '#fff6e5', // Warm White
    '#ffffff'  // Pure Sparkling White
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

    const particleCount = options.particleCount || 230;
    const speedMultiplier = options.speed || 0.35;
    const palette = (options.particleColors && options.particleColors.length > 0)
      ? options.particleColors
      : DEFAULT_COLORS;
    const rgbPalette = palette.map(hexToRgb);
    const moveParticlesOnHover = options.moveParticlesOnHover !== false;

    // Check if canvas already exists
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

    // Mouse Tracking
    let mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, active: false };
    let mouseParallax = { x: 0, y: 0 };

    function onMouseMove(e) {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;

      // Subtle parallax offset
      const centerX = width / 2;
      const centerY = height / 2;
      mouseParallax.x = (e.clientX - centerX) * 0.03;
      mouseParallax.y = (e.clientY - centerY) * 0.03;
    }

    function onMouseLeave() {
      mouse.active = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    }

    if (moveParticlesOnHover) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      document.addEventListener('mouseleave', onMouseLeave);
    }

    // Create Particles
    const particles = [];

    function createParticle(initialY) {
      const z = Math.random(); // 0 = distant background, 1 = close foreground
      const color = rgbPalette[Math.floor(Math.random() * rgbPalette.length)];

      // Size distribution: mostly fine luxury dust, with selective glowing bokeh orbs
      let radius;
      let isBokehOrb = false;

      const sizeRoll = Math.random();
      if (sizeRoll > 0.94) {
        // Large glowing bokeh orb (like in screenshots)
        radius = 5.5 + Math.random() * 4.5;
        isBokehOrb = true;
      } else if (sizeRoll > 0.70) {
        // Medium glowing mote
        radius = 2.4 + Math.random() * 2.5;
        isBokehOrb = true;
      } else {
        // Delicate twinkling gold dust
        radius = 0.8 + Math.random() * 1.5;
      }

      // Parallax-adjusted size
      radius = radius * (0.65 + z * 0.65);

      const baseAlpha = isBokehOrb
        ? (0.55 + Math.random() * 0.4)
        : (0.35 + Math.random() * 0.55);

      const x = Math.random() * width;
      const y = (initialY !== undefined) ? initialY : Math.random() * height;

      return {
        x: x,
        y: y,
        z: z,
        radius: radius,
        color: color,
        baseAlpha: baseAlpha,
        alpha: baseAlpha,
        isBokehOrb: isBokehOrb,
        // Upward floating drift with depth scaling
        vy: -(0.18 + Math.random() * 0.38 + z * 0.25) * speedMultiplier,
        vx: (Math.random() - 0.5) * 0.15 * speedMultiplier,
        // Organic sinusoidal sway
        swaySpeed: 0.0008 + Math.random() * 0.0016,
        swayAmp: 0.25 + Math.random() * 0.65,
        swayPhase: Math.random() * Math.PI * 2,
        // Twinkling & breathing
        twinkleSpeed: 0.0015 + Math.random() * 0.003,
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

      // Mouse smooth interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      }

      ctx.clearRect(0, 0, width, height);

      const time = currentTime;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Sway motion
        const sway = Math.sin(time * p.swaySpeed + p.swayPhase) * p.swayAmp;
        p.x += (p.vx + sway) * (delta / 16);
        p.y += p.vy * (delta / 16);

        // Interactive mouse deflection (gentle, elegant organic repulsion)
        if (moveParticlesOnHover && mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 130;
          if (distSq < maxDist * maxDist && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / maxDist) * 1.8;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Screen boundary wrap
        if (p.y < -30) {
          p.y = height + 15 + Math.random() * 20;
          p.x = Math.random() * width;
        } else if (p.y > height + 35) {
          p.y = -15;
          p.x = Math.random() * width;
        }

        if (p.x < -30) {
          p.x = width + 15;
        } else if (p.x > width + 30) {
          p.x = -15;
        }

        // Twinkle pulsating alpha
        const twinkle = 0.72 + 0.28 * Math.sin(time * p.twinkleSpeed + p.twinklePhase);
        const currentAlpha = Math.max(0.05, Math.min(1.0, p.baseAlpha * twinkle));

        const r = p.color.r;
        const g = p.color.g;
        const b = p.color.b;

        // Draw particle
        if (p.isBokehOrb) {
          // Soft radiant glowing bokeh halo
          const glowRadius = p.radius * 3.2;
          const gradient = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, glowRadius
          );
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.95})`);
          gradient.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.4})`);
          gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.12})`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();

          // Bright inner core
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.85})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.8, p.radius * 0.45), 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Crisp luxury sparkling gold dust
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    animationFrameId = requestAnimationFrame(render);

    window.addEventListener('resize', resize, { passive: true });

    return function destroy() {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (moveParticlesOnHover) {
        window.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseleave', onMouseLeave);
      }
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
        particleCount: 220,
        speed: 0.35,
        moveParticlesOnHover: true
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoStart);
  } else {
    autoStart();
  }
})();

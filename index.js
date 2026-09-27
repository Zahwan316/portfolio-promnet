// Konfigurasi Efek
    const config = {
      maxParticles: 12,    // Jumlah maksimal jejak bulan sabit
      fadeSpeed: 0.02,     // Kecepatan memudar 
      shrinkSpeed: 0.02,   // Kecepatan mengecil
      spawnDistance: 15,    // Jarak minimal kursor bergerak sebelum memunculkan partikel baru
    };

    let lastX = 0;
    let lastY = 0;

    const moonSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-tersier drop-shadow-[0_0_8px_rgba(224,242,254,0.8)]">
        <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
      </svg>
    `;

    document.addEventListener('mousemove', (e) => {
      const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);

      if (distance > config.spawnDistance) {
        createMoonParticle(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    });

    function createMoonParticle(x, y) {
      const particle = document.createElement('div');
      const size = Math.random() * 12 + 16;
      const rotation = Math.random() * 360;

      particle.className = 'fixed pointer-events-none z-50 transition-transform ease-out duration-75';
      particle.style.left = `${x - size / 2}px`;
      particle.style.top = `${y - size / 2}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.transform = `rotate(${rotation}deg) scale(1)`;
      particle.style.opacity = '0.9';

      particle.innerHTML = moonSvg;
      document.body.appendChild(particle);

      let opacity = 0.9;
      let scale = 1;

      const animate = () => {
        opacity -= config.fadeSpeed;
        scale -= config.shrinkSpeed;

        if (opacity <= 0 || scale <= 0) {
          particle.remove();
        } else {
          particle.style.opacity = opacity;
          particle.style.transform = `rotate(${rotation}deg) scale(${scale})`;
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
import React, { useEffect, useRef, useCallback } from 'react';
import Modal from './Modal';

interface Star {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
}

interface Nebula {
    x: number;
    y: number;
    radius: number;
    color: string;
    vx: number;
    vy: number;
}

interface LayoutProps {
  children: React.ReactNode;
  openModal: (type: string) => void;
  closeModal: () => void;
  modalContent: { title: string; content: React.ReactNode } | null;
}

const Layout: React.FC<LayoutProps> = ({ children, openModal, closeModal, modalContent }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((ctx: CanvasRenderingContext2D, stars: Star[], nebulas: Nebula[]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    nebulas.forEach(nebula => {
        const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
        gradient.addColorStop(0, `rgba(${nebula.color}, 0.15)`);
        gradient.addColorStop(0.5, `rgba(${nebula.color}, 0.05)`);
        gradient.addColorStop(1, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fill();

        nebula.x += nebula.vx;
        nebula.y += nebula.vy;

        if (nebula.x - nebula.radius > ctx.canvas.width) nebula.x = -nebula.radius;
        if (nebula.y - nebula.radius > ctx.canvas.height) nebula.y = -nebula.radius;
    });

    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color}, ${star.opacity})`;
      ctx.fill();

      star.x += star.vx;
      star.y += star.vy;
      
      star.opacity += (Math.random() - 0.5) * 0.02;
      if (star.opacity < 0.2) star.opacity = 0.2;
      if (star.opacity > 1) star.opacity = 1;

      if (star.x < 0 || star.x > ctx.canvas.width) star.vx *= -1;
      if (star.y < 0 || star.y > ctx.canvas.height) star.vy *= -1;
    });

    requestAnimationFrame(() => draw(ctx, stars, nebulas));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const starColors = ['255, 215, 0', '251, 191, 36', '248, 113, 113', '167, 139, 250', '96, 165, 250'];
    const stars: Star[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      opacity: Math.random() * 0.5 + 0.5,
    }));
    
    const nebulaColors = ['8, 47, 73', '74, 20, 140', '19, 78, 74'];
    const nebulas: Nebula[] = Array.from({ length: 5 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 300 + 200,
        color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
    }));
    
    let animationFrameId = requestAnimationFrame(() => draw(ctx, stars, nebulas));

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  const navLinks = ['About', 'Contact', 'Guide', 'Privacy', 'TOS', 'DMCA'];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 opacity-70" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 sticky top-0">
          <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="text-2xl font-bold text-white">Minutes<span className="text-yellow-400">Gen</span></div>
            <ul className="hidden md:flex items-center space-x-6 text-sm">
              {navLinks.map(link => (
                <li key={link}>
                  <button onClick={() => openModal(link)} className="hover:text-yellow-400 transition-colors duration-300">
                    {link === 'Privacy' ? 'Privacy Policy' : link === 'TOS' ? 'Terms of Service' : link}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800 py-6">
          <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
            <p className="mb-2">
              <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="font-bold text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
                Powered by HSINI MOHAMED
              </a>
            </p>
            <p>
              <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors duration-300">doodax.com</a>
              <span className="mx-2">|</span>
              <a href="mailto:hsini.web@gmail.com" className="hover:text-yellow-400 transition-colors duration-300">hsini.web@gmail.com</a>
            </p>
          </div>
        </footer>
      </div>
      {modalContent && <Modal title={modalContent.title} onClose={closeModal}>{modalContent.content}</Modal>}
    </div>
  );
};

export default Layout;
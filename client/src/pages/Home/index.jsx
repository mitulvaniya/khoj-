import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from 'antd';
import { SearchOutlined, ArrowRightOutlined, CheckCircleOutlined, SafetyCertificateOutlined, ThunderboltOutlined, StarOutlined } from '@ant-design/icons';
import axios from 'axios';
import API from '../../api';
import { GlobalContext } from '../../Context/GlobalContext';
import { setUrlString } from '../../utils/paramsConvert';
import Spinner from '../Spinner';
import ServiceabilityChecker from '../../components/ServiceabilityChecker';
import HomeDiagnostics from '../../components/HomeDiagnostics';



/* ═══════════════════════════════════════════════════════════
   UTILITY: Animated Counter
   ═══════════════════════════════════════════════════════════ */
function AnimatedNumber({ target, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.max(1, Math.ceil(target / 80));
        const id = setInterval(() => {
          start += step;
          if (start >= target) { setVal(target); clearInterval(id); }
          else setVal(start);
        }, 20);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════
   PRELOADER — Cinematic 0→100% Counter
   ═══════════════════════════════════════════════════════════ */
function Preloader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 60; // ~1 second at 60fps
    const id = setInterval(() => {
      frame++;
      const progress = Math.min(100, Math.round((frame / totalFrames) * 100));
      setCount(progress);
      if (frame >= totalFrames) {
        clearInterval(id);
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => onComplete(), 800);
        }, 300);
      }
    }, 16);
    return () => clearInterval(id);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center ${exiting ? 'preloader-wipe' : ''}`}
      style={{ background: '#0a0a0a' }}
    >
      {/* Giant counter number */}
      <div 
        className="font-black tracking-tighter text-[#f2efe8] select-none"
        style={{ 
          fontSize: 'clamp(100px, 18vw, 260px)',
          lineHeight: 0.9,
          fontFamily: "'Outfit', sans-serif",
          opacity: exiting ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        {count}
      </div>

      {/* Brand label */}
      <div 
        className="mt-8 text-xs tracking-[0.4em] uppercase select-none"
        style={{
          color: '#c75b3a',
          fontFamily: "'Inter', monospace",
          opacity: exiting ? 0 : 0.8,
          transition: 'opacity 0.3s ease',
        }}
      >
        KHOJ — DISCOVER EXPERTS
      </div>

      {/* Subtle progress bar */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-100"
          style={{ 
            width: `${count}%`,
            background: 'linear-gradient(90deg, #c75b3a, #b08d57)',
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MOUSE-REACTIVE RADIAL SPOTLIGHT
   ═══════════════════════════════════════════════════════════ */
function RadialSpotlight() {
  const ref = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => { target.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', move);
    let raf;
    const lerp = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.06;
      pos.current.y += (target.current.y - pos.current.y) * 0.06;
      if (ref.current) {
        ref.current.style.background = `radial-gradient(600px circle at ${pos.current.x}px ${pos.current.y}px, rgba(199,91,58,0.04) 0%, transparent 60%)`;
      }
      raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  return <div ref={ref} className="fixed inset-0 pointer-events-none z-[1]" />;
}

/* ═══════════════════════════════════════════════════════════
   AMBIENT PARTICLE FIELD
   ═══════════════════════════════════════════════════════════ */
function ParticleField({ count = 25, dark = false }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${2 + Math.random() * 3}px`,
      duration: `${6 + Math.random() * 8}s`,
      delay: `${Math.random() * 5}s`,
      dx: `${(Math.random() - 0.5) * 200}px`,
      dy: `${(Math.random() - 0.5) * 200}px`,
      color: dark 
        ? `rgba(199, 91, 58, ${0.15 + Math.random() * 0.2})` 
        : `rgba(176, 141, 87, ${0.15 + Math.random() * 0.2})`,
    }));
  }, [count, dark]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            '--size': p.size,
            '--duration': p.duration,
            '--delay': p.delay,
            '--dx': p.dx,
            '--dy': p.dy,
            '--color': p.color,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ═══════════════════════════════════════════════════════════ */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setProgress((window.scrollY / total) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="scroll-progress" style={{ width: `${progress}%` }} />;
}

/* ═══════════════════════════════════════════════════════════
   INTERACTIVE SERVICE CONSTELLATION CANVAS
   ═══════════════════════════════════════════════════════════ */
function ServiceConstellation({ onSelectCategory }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const services = [
      { label: 'Electrician', icon: '🔌', category: 'Electrician' },
      { label: 'Plumber', icon: '🚿', category: 'Plumber' },
      { label: 'Painter', icon: '🎨', category: 'Painter' },
      { label: 'Cleaning', icon: '🧹', category: 'Cleaning' },
      { label: 'Carpenter', icon: '🔨', category: 'Carpenter' },
      { label: 'Gardener', icon: '🌿', category: 'Gardener' },
      { label: 'AC Repair', icon: '❄️', category: 'AC Repair' },
      { label: 'Locksmith', icon: '🔑', category: 'Locksmith' },
      { label: 'Pest Control', icon: '🐜', category: 'Pest Control' },
      { label: 'Appliance', icon: '🔌', category: 'Appliance' }
    ];

    const nodes = services.map((s, idx) => {
      const angle = (idx / services.length) * Math.PI * 2;
      const radius = 220 + Math.random() * 80;
      return {
        ...s,
        x: 0,
        y: 0,
        angle,
        radius,
        speed: 0.002 + Math.random() * 0.003,
        size: 32,
        targetSize: 32,
        currentSize: 32,
        hovered: false,
        pulseAngle: Math.random() * Math.PI * 2
      };
    });

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const onClick = () => {
      if (!mouseRef.current.active) return;
      const mouse = mouseRef.current;
      nodes.forEach(node => {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 28) {
          if (onSelectCategory) onSelectCategory(node.category);
          ripplesRef.current.push({
            x: node.x,
            y: node.y,
            radius: 5,
            maxRadius: 120,
            opacity: 1
          });
        }
      });
    };

    canvas.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
      
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      
      // Responsive center positioning: on desktop, offset to the right. On mobile, center it.
      const isMobile = width < 768;
      const centerX = isMobile ? width * 0.5 : width * 0.72;
      const centerY = isMobile ? height * 0.65 : height * 0.5;

      const mouse = mouseRef.current;

      nodes.forEach(node => {
        node.angle += node.speed;
        const baseTargetX = centerX + Math.cos(node.angle) * node.radius;
        const baseTargetY = centerY + Math.sin(node.angle) * node.radius;

        let targetX = baseTargetX;
        let targetY = baseTargetY;

        if (mouse.active) {
          const dx = mouse.x - baseTargetX;
          const dy = mouse.y - baseTargetY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 240) {
            const force = (240 - dist) / 240;
            targetX += (mouse.x - baseTargetX) * force * 0.4;
            targetY += (mouse.y - baseTargetY) * force * 0.4;
          }
        }

        node.x += (targetX - node.x) * 0.1;
        node.y += (targetY - node.y) * 0.1;

        if (mouse.active) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 24) {
            node.hovered = true;
            node.targetSize = 46;
          } else {
            node.hovered = false;
            node.targetSize = 32;
          }
        } else {
          node.hovered = false;
          node.targetSize = 32;
        }

        node.currentSize += (node.targetSize - node.currentSize) * 0.15;
        node.pulseAngle += 0.04;
      });

      // Draw connective lines between nodes
      ctx.lineWidth = 0.65;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const alpha = (1 - dist / 200) * 0.35;
            ctx.strokeStyle = `rgba(140, 120, 102, ${alpha})`; // Stone dark color
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw magnetic strings to mouse pointer
      if (mouse.active) {
        nodes.forEach(node => {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const alpha = (1 - dist / 220) * 0.45;
            ctx.strokeStyle = `rgba(199, 91, 58, ${alpha})`; // Vibrant Terracotta
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        });
      }

      // Draw ripples
      ripplesRef.current.forEach((r, idx) => {
        r.radius += 3.5;
        r.opacity = 1 - r.radius / r.maxRadius;
        ctx.strokeStyle = `rgba(199, 91, 58, ${r.opacity * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (r.radius >= r.maxRadius) {
          ripplesRef.current.splice(idx, 1);
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        const glowRadius = node.currentSize * (1.1 + Math.sin(node.pulseAngle) * 0.05);
        const grad = ctx.createRadialGradient(node.x, node.y, 2, node.x, node.y, glowRadius);
        grad.addColorStop(0, node.hovered ? 'rgba(199, 91, 58, 0.35)' : 'rgba(176, 141, 87, 0.2)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = node.hovered ? 'rgba(199, 91, 58, 0.8)' : 'rgba(176, 141, 87, 0.3)';
        ctx.lineWidth = node.hovered ? 2 : 1;
        ctx.fillStyle = node.hovered ? '#ffffff' : '#f8f5f0';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.currentSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = `${node.currentSize * 0.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.icon, node.x, node.y);

        if (node.hovered || node.currentSize > 35) {
          const textOpacity = Math.max(0.4, (node.currentSize - 32) / 14);
          ctx.fillStyle = `rgba(26, 26, 26, ${textOpacity})`;
          ctx.font = `bold 10px 'Inter', monospace`;
          ctx.fillText(node.label.toUpperCase(), node.x, node.y - node.currentSize * 0.7);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onSelectCategory]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-[2]"
      style={{ display: 'block' }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   CORNER ATMOSPHERE TEXT
   ═══════════════════════════════════════════════════════════ */
function CornerAtmosphere() {
  return (
    <>
      <div className="corner-text hidden md:block top-4 left-6">VERIFIED EXPERTS</div>
      <div className="corner-text hidden md:block top-4 right-6 text-right">TRUSTED BY THOUSANDS</div>
      <div className="corner-text hidden md:block bottom-4 left-6">ZERO HIDDEN COSTS</div>
      <div className="corner-text hidden md:block bottom-4 right-6 text-right">© 2026 KHOJ</div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN HOME COMPONENT — ELITE IMMERSIVE EXPERIENCE
   ═══════════════════════════════════════════════════════════ */
const DEFAULT_CATEGORIES = [
  { id: 'Electrician', name: 'Electrician', count: 12 },
  { id: 'Plumber', name: 'Plumber', count: 8 },
  { id: 'Painter', name: 'Painter', count: 5 },
  { id: 'Cleaning', name: 'Cleaning', count: 15 },
  { id: 'Carpenter', name: 'Carpenter', count: 9 },
  { id: 'Gardener', name: 'Gardener', count: 6 },
  { id: 'AC Repair', name: 'AC Repair', count: 11 },
  { id: 'Locksmith', name: 'Locksmith', count: 4 }
];

const CATEGORY_IMAGES = {
  electrician: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop',
  plumber: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop',
  painter: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=600&auto=format&fit=crop',
  cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop',
  carpenter: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&auto=format&fit=crop',
  gardener: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop',
  'ac repair': 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=600&auto=format&fit=crop',
  locksmith: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?q=80&w=600&auto=format&fit=crop',
  'pest control': 'https://images.unsplash.com/photo-1587334206502-7b76d54c16a8?q=80&w=600&auto=format&fit=crop',
  appliance: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop',
  'home tutor': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
  beautician: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop',
};

const getCategoryImage = (name) => {
  const key = name.toLowerCase().trim();
  return CATEGORY_IMAGES[key] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
};

export default function Home() {
  const navigate = useNavigate();
  const { dispatch } = useContext(GlobalContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: '', city: '', state: 'all', category: 'all' });
  const [preloaderDone, setPreloaderDone] = useState(false);

  useEffect(() => {
    axios.get(API.categoryDashboard)
      .then(res => {
        if (res.data.success) {
          const apiData = res.data.data;
          const merged = [...apiData];
          DEFAULT_CATEGORIES.forEach(def => {
            if (!merged.some(c => c.name.toLowerCase() === def.name.toLowerCase())) {
              merged.push(def);
            }
          });
          setCategories(merged);
        }
      })
      .catch((e) => {
        console.error(e);
        setCategories(DEFAULT_CATEGORIES);
      })
      .finally(() => setLoading(false));
  }, []);

  const doSelectConstellationCategory = (catName) => {
    setSearch(prev => ({ ...prev, name: catName }));
    navigate(`/khoj-services/allServices?category=all&state=all&city=&name=${catName}`);
  };

  const doSearch = () => {
    navigate(`/khoj-services/allServices${setUrlString(search)}`);
    dispatch({ type: 'SET_SEARCH_PARAMS', payload: search });
  };

  const howSteps = [
    { num: '01', title: 'Search', desc: 'Tell us what you need and where. Our engine surfaces the best-matched professionals instantly.', icon: <SearchOutlined /> },
    { num: '02', title: 'Compare', desc: 'Review detailed profiles, ratings, and customer testimonials to pick with confidence.', icon: <SafetyCertificateOutlined /> },
    { num: '03', title: 'Book', desc: 'Connect directly, schedule at your convenience, and relax while the expert handles the rest.', icon: <CheckCircleOutlined /> },
  ];

  const features = [
    { icon: <SafetyCertificateOutlined />, title: 'Verified Professionals', desc: 'Every provider undergoes background verification and skill assessment before listing.' },
    { icon: <ThunderboltOutlined />, title: 'Instant Matching', desc: 'Our algorithm instantly matches your requirements with the best available professionals.' },
    { icon: <StarOutlined />, title: 'Transparent Reviews', desc: 'Real reviews from real customers. Make informed decisions based on honest feedback.' },
    { icon: <CheckCircleOutlined />, title: 'Zero Hidden Costs', desc: 'Upfront pricing with no surprises. Know exactly what you pay before you book.' },
  ];

  const testimonials = [
    { name: 'Priya S.', role: 'Homeowner, Mumbai', text: '"Found an amazing electrician within minutes. Seamless experience."' },
    { name: 'Rajesh G.', role: 'Business Owner, Delhi', text: '"Our go-to platform for all office maintenance. Reliable and fast."' },
    { name: 'Ananya R.', role: 'Designer, Bangalore', text: '"I recommend Khoj to all my clients. Genuinely skilled craftsmen."' },
    { name: 'Vikram M.', role: 'Startup Founder, Pune', text: '"The transparency in pricing sets Khoj apart from everything else."' },
    { name: 'Sneha K.', role: 'Homeowner, Hyderabad', text: '"Booked a plumber in 2 minutes. Best service experience ever."' },
    { name: 'Arjun D.', role: 'Architect, Chennai', text: '"Quality professionals, every single time. Khoj never disappoints."' },
  ];

  /* ─── PRELOADER ─── */
  if (!preloaderDone) {
    return <Preloader onComplete={() => setPreloaderDone(true)} />;
  }

  return (
    <div className="w-full relative animate-fadeIn" style={{ background: 'var(--parchment)' }}>
      <ScrollProgress />
      <RadialSpotlight />
      <CornerAtmosphere />

      {/* ═══════════════════════════════════════════════════
          HERO — 100vh Full Viewport
          ═══════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden py-12 sm:py-20" style={{ background: 'var(--parchment)' }}>
        <ParticleField count={20} />
        <ServiceConstellation onSelectCategory={doSelectConstellationCategory} />
        
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-4 sm:px-12 lg:px-20 pointer-events-none">
          {/* Kicker */}
          <div 
            className="mb-4 sm:mb-8"
            style={{
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
            }}
          >
            <span className="text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase" style={{ color: 'var(--terracotta)', fontFamily: "'Inter', monospace" }}>
              ● Local Service Discovery Platform
            </span>
          </div>

          {/* Massive Headline */}
          <h1 
            className="font-black tracking-[-0.04em] leading-[0.95] sm:leading-[0.9] mb-6 sm:mb-10 text-left"
            style={{
              fontSize: 'clamp(38px, 8.5vw, 120px)',
              color: 'var(--ink)',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {['Find', 'Your', 'Expert.'].map((word, wi) => (
              <span 
                key={wi} 
                className="inline-block mr-[0.25em]"
                style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + wi * 0.12}s`,
                }}
              >
                {wi === 2 ? (
                  <span style={{ 
                    background: 'linear-gradient(135deg, var(--terracotta), var(--gold))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {word}
                  </span>
                ) : word}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p 
            className="text-sm sm:text-lg lg:text-xl max-w-xl leading-relaxed font-light mb-8 sm:mb-12 text-left"
            style={{
              color: 'var(--stone)',
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s',
            }}
          >
            Khoj connects you with verified local professionals. Transparent pricing, real reviews, and instant booking — all in one place.
          </p>

          {/* Search Bar */}
          <div 
            className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-2xl p-2.5 sm:p-4 rounded-2xl border pointer-events-auto shadow-sm"
            style={{
              background: 'rgba(242, 239, 232, 0.95)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(176, 141, 87, 0.25)',
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s',
            }}
          >
            <Input
              size="large"
              placeholder="What service do you need?"
              value={search.name}
              onChange={e => setSearch({ ...search, name: e.target.value })}
              className="flex-1 !rounded-xl !border-transparent !bg-transparent !text-[#1a1a1a] placeholder:!text-[#8c7866] focus:!border-transparent hover:!border-transparent"
              style={{ outline: 'none', boxShadow: 'none' }}
              onPressEnter={doSearch}
            />
            <Input
              size="large"
              placeholder="City, Locality or Pincode (e.g. 393002, Jaipur, Kochi)..."
              value={search.city}
              onChange={e => setSearch({ ...search, city: e.target.value })}
              className="flex-1 !rounded-xl !border-transparent !bg-transparent !text-[#1a1a1a] placeholder:!text-[#8c7866] focus:!border-transparent hover:!border-transparent"
              style={{ outline: 'none', boxShadow: 'none' }}
              onPressEnter={doSearch}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={doSearch}
              className="!rounded-xl !border-none !font-bold !px-8 !shadow-md hover:!shadow-lg !transition-all"
              style={{ background: 'linear-gradient(135deg, #c75b3a, #b08d57)', color: '#fff' }}
            >
              Search
            </Button>
          </div>

          {/* Quick City suggestions */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs pointer-events-auto max-w-3xl text-left">
            <span className="font-semibold text-[#8c7866]">Popular Hubs:</span>
            {[
              { label: '📍 Ankleshwar (393002)', city: 'Ankleshwar' },
              { label: 'Bharuch', city: 'Bharuch' },
              { label: 'Surat', city: 'Surat' },
              { label: 'Mumbai', city: 'Mumbai' },
              { label: 'Delhi NCR', city: 'Delhi' },
              { label: 'Bengaluru', city: 'Bengaluru' },
              { label: 'Jaipur', city: 'Jaipur' },
              { label: 'Kolkata', city: 'Kolkata' },
              { label: 'Hyderabad', city: 'Hyderabad' }
            ].map(c => (
              <button
                key={c.label}
                onClick={() => {
                  setSearch(prev => ({ ...prev, city: c.city }));
                  navigate(`/khoj-services/allServices?category=all&state=all&city=${encodeURIComponent(c.city)}&name=${search.name || ''}`);
                }}
                className="px-3 py-1 rounded-full bg-white/80 hover:bg-[#c75b3a] hover:text-white text-[#5c5650] border border-[#e2dacb] font-medium transition-all shadow-xs"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
          style={{ opacity: 0.5 }}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'var(--stone)' }}>Scroll</span>
          <div className="w-[1px] h-10" style={{ background: 'linear-gradient(to bottom, var(--stone), transparent)' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SERVICEABILITY & PINCODE COVERAGE CHECKER
          ═══════════════════════════════════════════════════ */}
      <section className="relative w-full py-10 sm:py-16 px-3 sm:px-12 lg:px-20 border-y border-[#e8e4d9]/60" style={{ background: '#f5f2eb' }}>
        <div className="max-w-[1400px] mx-auto">
          <ServiceabilityChecker />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOME PROBLEM DIAGNOSTIC & FAIR RATE BENCHMARK
          ═══════════════════════════════════════════════════ */}
      <section id="home-diagnostics" className="relative w-full py-12 sm:py-20 px-3 sm:px-12 lg:px-20 border-b border-[#e8e4d9]/60" style={{ background: '#fbf9f6' }}>
        <div className="max-w-[1400px] mx-auto">
          <HomeDiagnostics />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PHILOSOPHY — Dark Full Viewport Panel
          ═══════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[60vh] sm:min-h-screen flex items-center section-dark overflow-hidden py-14 sm:py-24">
        <ParticleField count={15} dark />
        
        {/* Watermark */}
        <div className="watermark-number hidden sm:block right-8 top-1/2 -translate-y-1/2" style={{ color: '#fff' }}>01</div>

        <div className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-12 lg:px-20">
          <span 
            className="text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase block mb-6 sm:mb-12"
            style={{
              color: 'var(--terracotta)',
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            ● Our Philosophy
          </span>

          <h2 
            className="font-bold tracking-tight leading-[1.15] mb-6 sm:mb-10 text-left"
            style={{
              fontSize: 'clamp(24px, 4vw, 56px)',
              color: 'var(--cream)',
              fontFamily: "'Outfit', sans-serif",
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
            }}
          >
            Finding a trusted professional shouldn't feel like a gamble. We built Khoj to eliminate{' '}
            <span style={{ color: 'var(--terracotta)' }}>uncertainty</span> from every hire.
          </h2>

          <p 
            className="text-sm sm:text-lg font-light leading-relaxed max-w-2xl text-left"
            style={{
              color: 'rgba(242, 239, 232, 0.65)',
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
            }}
          >
            Every professional on our platform is verified. Every review is real. Every price is upfront. No intermediaries, no hidden fees — just direct connections between you and the experts who get things done.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS — Light, Oversized Numbering
          ═══════════════════════════════════════════════════ */}
      <section className="relative w-full py-16 sm:py-32 px-4 sm:px-12 lg:px-20 section-light overflow-hidden">
        <div className="watermark-number left-8 top-8" style={{ color: 'var(--ink)' }}>02</div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="mb-20 transition-all duration-1000">
            <span className="text-[10px] tracking-[0.4em] uppercase block mb-4" style={{ color: 'var(--terracotta)' }}>● Process</span>
            <h2 className="font-bold tracking-tight text-left" style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontFamily: "'Outfit', sans-serif", color: 'var(--ink)' }}>
              Three Steps.<br />
              <span style={{ color: 'var(--stone)' }}>That's It.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howSteps.map((s, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-8 relative transition-all duration-700"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Huge step number */}
                <span 
                  className="block font-black mb-6"
                  style={{ 
                    fontSize: '72px', 
                    lineHeight: 1,
                    fontFamily: "'Outfit', sans-serif",
                    background: 'linear-gradient(135deg, var(--terracotta), var(--gold))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {s.num}
                </span>
                <h3 className="text-2xl font-bold mb-3 text-left" style={{ color: 'var(--ink)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed text-left" style={{ color: 'var(--stone)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CATEGORIES — Dynamic Grid
          ═══════════════════════════════════════════════════ */}
      <section className="relative w-full py-32 px-8 sm:px-12 lg:px-20 overflow-hidden" style={{ background: 'var(--cream)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4 transition-all duration-700">
            <div className="text-left">
              <span className="text-[10px] tracking-[0.4em] uppercase block mb-4" style={{ color: 'var(--terracotta)' }}>● Explore</span>
              <h2 className="font-bold tracking-tight text-left" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontFamily: "'Outfit', sans-serif", color: 'var(--ink)' }}>
                Service Categories
              </h2>
            </div>
            <button
              onClick={() => navigate('/khoj-services/allCategories?category=all&state=all&city=&name=')}
              className="flex items-center gap-2 text-sm font-semibold group transition-colors flex-shrink-0 self-start sm:self-auto"
              style={{ color: 'var(--terracotta)' }}
            >
              View All <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {loading ? <Spinner /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.slice(0, 8).map((card, i) => (
                <div
                  key={card.id}
                  onClick={() => navigate(`/khoj-services/allServices?category=${card.id}`)}
                  className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-700"
                  style={{ 
                    transitionDelay: `${i * 50}ms`,
                    background: 'var(--parchment)',
                    border: '1px solid rgba(176, 141, 87, 0.12)',
                  }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={getCategoryImage(card.name)}
                      alt={card.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <h3 className="text-white text-base font-bold text-left">{card.name}</h3>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(176, 141, 87, 0.08)' }}>
                    <span className="text-xs" style={{ color: 'var(--stone)' }}>Available</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--terracotta)' }}>{card.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Centered Browse More Button */}
          <div className="mt-12 flex justify-center">
            <Button
              size="large"
              onClick={() => navigate('/khoj-services/allCategories')}
              className="!rounded-xl !font-bold !px-10 !py-6 !text-sm !shadow-md hover:!shadow-lg !transition-all !flex !items-center !gap-2 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #c75b3a, #b08d57)', color: '#fff', border: 'none' }}
            >
              Browse More Categories <ArrowRightOutlined />
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS BAND — Dark Full Width
          ═══════════════════════════════════════════════════ */}
      <section className="relative section-dark py-24 px-8 overflow-hidden">
        <ParticleField count={10} dark />
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10 transition-all duration-700">
          {[
            { n: 500, s: '+', label: 'Verified Providers' },
            { n: 25, s: '+', label: 'Service Categories' },
            { n: 120, s: '+', label: 'Cities Covered' },
            { n: 10000, s: '+', label: 'Happy Customers' },
          ].map((st, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <span 
                className="font-black"
                style={{ 
                  fontSize: 'clamp(36px, 5vw, 72px)',
                  fontFamily: "'Outfit', sans-serif",
                  background: 'linear-gradient(135deg, var(--terracotta), var(--gold))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <AnimatedNumber target={st.n} suffix={st.s} />
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(242, 239, 232, 0.4)' }}>{st.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES — Glassmorphism Cards
          ═══════════════════════════════════════════════════ */}
      <section className="relative w-full py-32 px-8 sm:px-12 lg:px-20 section-light overflow-hidden">
        <div className="watermark-number right-8 bottom-12" style={{ color: 'var(--ink)' }}>03</div>

        <div className="max-w-[1100px] mx-auto relative z-10">
          <div className="mb-20 transition-all duration-700">
            <span className="text-[10px] tracking-[0.4em] uppercase block mb-4" style={{ color: 'var(--terracotta)' }}>● Why Khoj</span>
            <h2 className="font-bold tracking-tight text-left" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontFamily: "'Outfit', sans-serif", color: 'var(--ink)' }}>
              Built Different.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-8 flex gap-6 items-start transition-all duration-700"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div 
                  className="w-14 h-14 flex-shrink-0 rounded-xl flex items-center justify-center text-2xl"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(199,91,58,0.1), rgba(176,141,87,0.1))',
                    color: 'var(--terracotta)',
                    border: '1px solid rgba(199,91,58,0.15)',
                  }}
                >
                  {f.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold mb-2 text-left" style={{ color: 'var(--ink)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed text-left" style={{ color: 'var(--stone)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS — Horizontal Marquee
          ═══════════════════════════════════════════════════ */}
      <section className="relative w-full py-24 overflow-hidden" style={{ background: 'var(--cream)' }}>
        <div className="max-w-[1200px] mx-auto px-8 sm:px-12 lg:px-20 mb-16">
          <div className="transition-all duration-700">
            <span className="text-[10px] tracking-[0.4em] uppercase block mb-4" style={{ color: 'var(--terracotta)' }}>● Reviews</span>
            <h2 className="font-bold tracking-tight text-left" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontFamily: "'Outfit', sans-serif", color: 'var(--ink)' }}>
              Loved by<br /><span style={{ color: 'var(--stone)' }}>Thousands.</span>
            </h2>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="w-full overflow-hidden">
          <div className="marquee-track">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[340px] mx-3 rounded-2xl p-7"
                style={{
                  background: 'var(--parchment)',
                  border: '1px solid rgba(176, 141, 87, 0.12)',
                }}
              >
                <div className="flex gap-1 mb-4 justify-start">
                  {[...Array(5)].map((_, j) => (
                    <StarOutlined key={j} className="text-xs" style={{ color: 'var(--gold)' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5 italic text-left" style={{ color: 'var(--stone)' }}>{t.text}</p>
                <div className="flex items-center gap-3 pt-4 justify-start" style={{ borderTop: '1px solid rgba(176, 141, 87, 0.1)' }}>
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))' }}
                  >
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-left" style={{ color: 'var(--ink)' }}>{t.name}</p>
                    <p className="text-[11px] text-left" style={{ color: 'var(--stone)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA — Dark Cinematic Closer
          ═══════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[70vh] flex items-center justify-center section-dark overflow-hidden py-24">
        <ParticleField count={20} dark />

        <div className="relative z-10 max-w-[900px] mx-auto text-center px-8 transition-all duration-1000">
          <h2 
            className="font-bold tracking-tight mb-6"
            style={{ 
              fontSize: 'clamp(32px, 6vw, 72px)',
              fontFamily: "'Outfit', sans-serif",
              color: 'var(--cream)',
            }}
          >
            Ready to Find Your{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, var(--terracotta), var(--gold))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Perfect Pro?
            </span>
          </h2>
          
          <p className="text-base sm:text-lg font-light mb-10 max-w-lg mx-auto" style={{ color: 'rgba(242, 239, 232, 0.65)' }}>
            Join thousands of homeowners who trust Khoj every day. Start your search now — completely free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="large"
              onClick={() => navigate('/khoj-services/allCategories?category=all&state=all&city=&name=')}
              className="!rounded-xl !border-none !font-bold !px-10 !py-6 !text-base !shadow-lg hover:!shadow-xl !transition-all !flex !items-center !gap-2"
              style={{ background: 'linear-gradient(135deg, #c75b3a, #b08d57)', color: '#fff' }}
            >
              Explore Categories <ArrowRightOutlined />
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/khoj-services/addService')}
              className="!rounded-xl !bg-transparent !font-bold !px-10 !py-6 !text-base hover:!border-[#c75b3a]/50 !transition-all"
              style={{ borderColor: 'rgba(242, 239, 232, 0.15)', color: 'var(--cream)' }}
            >
              List Your Service
            </Button>
          </div>
        </div>
      </section>

      {/* Footer gradient line */}
      <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, var(--terracotta), var(--gold), var(--terracotta))' }} />
    </div>
  );
}


import { useState, useEffect, useCallback } from 'react';

const GREETINGS = [
  { text: 'Hello', lang: 'English' },
  { text: 'Hola', lang: 'Spanish' },
  { text: 'Bonjour', lang: 'French' },
  { text: 'Ciao', lang: 'Italian' },
  { text: 'Hallo', lang: 'German' },
  { text: 'Olá', lang: 'Portuguese' },
  { text: 'Привет', lang: 'Russian' },
  { text: '你好', lang: 'Chinese' },
  { text: 'こんにちは', lang: 'Japanese' },
  { text: '안녕하세요', lang: 'Korean' },
  { text: 'مرحبا', lang: 'Arabic' },
  { text: 'नमस्ते', lang: 'Hindi' },
  { text: 'Sawubona', lang: 'Zulu' },
  { text: 'Γειά σου', lang: 'Greek' },
  { text: 'שלום', lang: 'Hebrew' },
  { text: 'Xin chào', lang: 'Vietnamese' },
  { text: 'Hej', lang: 'Swedish' },
  { text: 'Aloha', lang: 'Hawaiian' },
  { text: 'Jambo', lang: 'Swahili' },
  { text: 'Salam', lang: 'Persian' },
];

interface FloatingGreeting {
  id: number;
  text: string;
  lang: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  scale: number;
  opacity: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

function App() {
  const [greetings, setGreetings] = useState<FloatingGreeting[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [earthRotation, setEarthRotation] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  // Initialize stars
  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < 150; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 3 + 2,
      });
    }
    setStars(newStars);
  }, []);

  // Rotate Earth
  useEffect(() => {
    const interval = setInterval(() => {
      setEarthRotation((prev) => (prev + 0.2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Animate floating greetings
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetings((prev) =>
        prev
          .map((g) => ({
            ...g,
            x: g.x + Math.cos(g.angle) * g.speed,
            y: g.y + Math.sin(g.angle) * g.speed,
            opacity: g.opacity - 0.003,
            scale: g.scale + 0.002,
          }))
          .filter((g) => g.opacity > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const launchGreeting = useCallback((clientX: number, clientY: number) => {
    const rect = document.body.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    const angle = Math.random() * Math.PI * 2;

    const newGreeting: FloatingGreeting = {
      id: Date.now() + Math.random(),
      text: randomGreeting.text,
      lang: randomGreeting.lang,
      x,
      y,
      angle,
      speed: 0.3 + Math.random() * 0.3,
      scale: 1,
      opacity: 1,
    };

    setGreetings((prev) => [...prev.slice(-30), newGreeting]);
    setMessageCount((prev) => prev + 1);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    launchGreeting(e.clientX, e.clientY);
  };

  const handleTouch = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      launchGreeting(touch.clientX, touch.clientY);
    }
  };

  return (
    <div
      className="min-h-dvh w-full overflow-hidden relative cursor-crosshair select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #0a1628 0%, #030712 50%, #000000 100%)',
      }}
      onClick={handleClick}
      onTouchStart={handleTouch}
    >
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: `rgba(255, 255, 255, ${star.opacity})`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity * 0.5})`,
            animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Nebula glow effects */}
      <div
        className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
          left: '10%',
          top: '20%',
        }}
      />
      <div
        className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
          right: '5%',
          bottom: '10%',
        }}
      />

      {/* Earth Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 30%, #34d399 50%, #1e3a5f 70%, #0c4a6e 100%)',
            boxShadow: `
              inset -20px -20px 40px rgba(0, 0, 0, 0.5),
              inset 10px 10px 30px rgba(255, 255, 255, 0.1),
              0 0 60px rgba(14, 165, 233, 0.3),
              0 0 120px rgba(14, 165, 233, 0.15)
            `,
            transform: `rotate(${earthRotation}deg)`,
          }}
        >
          {/* Land masses */}
          <div
            className="absolute w-[30%] h-[25%] rounded-[40%] opacity-60"
            style={{
              background: '#22c55e',
              left: '20%',
              top: '25%',
              transform: 'rotate(-15deg)',
            }}
          />
          <div
            className="absolute w-[35%] h-[20%] rounded-[50%] opacity-50"
            style={{
              background: '#16a34a',
              left: '50%',
              top: '40%',
              transform: 'rotate(20deg)',
            }}
          />
          <div
            className="absolute w-[20%] h-[15%] rounded-[40%] opacity-55"
            style={{
              background: '#15803d',
              left: '15%',
              top: '60%',
              transform: 'rotate(-30deg)',
            }}
          />
          {/* Atmospheric glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
            }}
          />
        </div>
      </div>

      {/* Floating Greetings */}
      {greetings.map((greeting) => (
        <div
          key={greeting.id}
          className="absolute pointer-events-none font-display"
          style={{
            left: `${greeting.x}%`,
            top: `${greeting.y}%`,
            transform: `translate(-50%, -50%) scale(${greeting.scale})`,
            opacity: greeting.opacity,
          }}
        >
          <div
            className="text-xl sm:text-2xl md:text-3xl font-bold whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #f0abfc 0%, #c4b5fd 50%, #7dd3fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(196, 181, 253, 0.5)',
              filter: 'drop-shadow(0 0 10px rgba(196, 181, 253, 0.3))',
            }}
          >
            {greeting.text}
          </div>
          <div
            className="text-[10px] sm:text-xs text-center mt-1"
            style={{
              color: 'rgba(148, 163, 184, 0.7)',
            }}
          >
            {greeting.lang}
          </div>
        </div>
      ))}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-center pointer-events-none">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(199, 210, 254, 0.3)',
          }}
        >
          Hello, World
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 md:mt-3 font-body">
          Click anywhere to send greetings into the cosmos
        </p>
      </div>

      {/* Message Counter */}
      <div className="absolute bottom-20 sm:bottom-24 left-0 right-0 text-center pointer-events-none">
        <div className="inline-block px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
          <span className="text-cyan-300 font-display text-xl sm:text-2xl md:text-3xl font-bold">
            {messageCount}
          </span>
          <span className="text-slate-400 text-xs sm:text-sm ml-2 font-body">
            messages sent to the cosmos
          </span>
        </div>
      </div>

      {/* Orbital ring decoration */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] rounded-full border border-white/5 pointer-events-none"
        style={{
          transform: `translate(-50%, -50%) rotate(${earthRotation * 0.5}deg) rotateX(60deg)`,
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[520px] md:h-[520px] lg:w-[650px] lg:h-[650px] rounded-full border border-cyan-500/10 pointer-events-none"
        style={{
          transform: `translate(-50%, -50%) rotate(${-earthRotation * 0.3}deg) rotateX(70deg)`,
        }}
      />

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 text-center pointer-events-none">
        <p className="text-slate-600 text-[10px] sm:text-xs font-body">
          Requested by @PauliusX · Built by @clonkbot
        </p>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .font-display {
          font-family: 'Syne', sans-serif;
        }

        .font-body {
          font-family: 'Outfit', sans-serif;
        }
      `}</style>
    </div>
  );
}

export default App;

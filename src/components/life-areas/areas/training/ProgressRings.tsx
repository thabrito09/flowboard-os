import { useState, useEffect } from 'react';

interface Ring {
  id: string;
  label: string;
  progress: number;
  color: string;
}

export default function ProgressRings() {
  const [rings, setRings] = useState<Ring[]>([
    { id: 'exercise', label: 'Treino', progress: 0, color: 'stroke-blue-500' },
    { id: 'movement', label: 'Movimento', progress: 0, color: 'stroke-green-500' },
    { id: 'hydration', label: 'Hidratação', progress: 0, color: 'stroke-amber-500' },
  ]);
  
  // Simulate progress updates
  useEffect(() => {
    const timer = setInterval(() => {
      setRings(prev => prev.map(ring => ({
        ...ring,
        progress: Math.min(ring.progress + 1, 100)
      })));
    }, 50);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="flex justify-around items-center">
      {rings.map(ring => (
        <div key={ring.id} className="flex flex-col items-center">
          <div className="relative w-24 h-24">
            {/* Background circle */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="44"
                className="stroke-muted fill-none"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="48"
                cy="48"
                r="44"
                className={`${ring.color} fill-none transition-all duration-300`}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - ring.progress / 100)}`}
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold">{ring.progress}%</span>
            </div>
          </div>
          <span className="mt-2 text-sm font-medium">{ring.label}</span>
        </div>
      ))}
    </div>
  );
}
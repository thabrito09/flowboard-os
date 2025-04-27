import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

interface XPRewardProps {
  show: boolean;
  amount: number;
  onComplete: () => void;
}

export default function XPReward({ show, amount, onComplete }: XPRewardProps) {
  const { userData } = useUser();
  
  useEffect(() => {
    if (show) {
      // Play sound effect
      const audio = new Audio('/sounds/reward.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors if audio fails to play
      
      // Auto-hide after animation
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  // Get level-based gradient
  const getGradient = () => {
    if (!userData) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 3) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 6) return 'from-purple-500 to-indigo-500';
    return 'from-amber-400 to-yellow-300';
  };
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="fixed top-4 right-4 z-50 pointer-events-none"
        >
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg",
            "bg-gradient-to-r text-white font-medium",
            getGradient()
          )}>
            <Star className="h-4 w-4" />
            <span>+{amount}XP conquistados!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
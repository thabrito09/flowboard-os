import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface SparkleProps {
  className?: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}

export function Sparkle({ className, color = 'currentColor', size = 20, style }: SparkleProps) {
  const { effects } = useTheme();
  
  if (!effects.sparkle) return null;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "absolute animate-sparkle-float",
        "pointer-events-none select-none",
        className
      )}
      style={style}
    >
      <path
        d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
        fill={color}
      />
    </svg>
  );
}

export function SparkleGroup() {
  const { effects } = useTheme();
  
  if (!effects.sparkle) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Sparkle 
        className="top-1/4 left-1/4" 
        color="hsl(var(--theme-accent))"
        size={15}
      />
      <Sparkle 
        className="top-1/3 right-1/4" 
        color="hsl(var(--theme-accent))"
        size={10}
      />
      <Sparkle 
        className="bottom-1/4 right-1/3" 
        color="hsl(var(--theme-accent))"
        size={12}
      />
    </div>
  );
}
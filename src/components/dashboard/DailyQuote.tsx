import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { getRandomQuote } from '@/lib/quotes';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

export default function DailyQuote() {
  const [quote, setQuote] = useState(() => getRandomQuote());
  const { userData } = useUser();
  
  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);
  
  // Get level-based gradient
  const getGradient = () => {
    if (!userData) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 3) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 6) return 'from-purple-500 to-indigo-500';
    return 'from-amber-400 to-yellow-300';
  };
  
  return (
    <Card className="border-none bg-gradient-to-br from-background to-muted/50 shadow-lg overflow-hidden animate-in fade-in-50 duration-500">
      <CardContent className="p-6 relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b" style={{ 
          backgroundImage: `linear-gradient(to bottom, var(--${getGradient()}))`
        }} />
        
        <div className="flex items-start gap-3">
          <Sparkles className={cn(
            "h-6 w-6 shrink-0 bg-gradient-to-r bg-clip-text text-transparent animate-pulse",
            getGradient()
          )} />
          <div>
            <p className="text-lg font-medium italic">"{quote.text}"</p>
            <p className="text-sm text-muted-foreground mt-2">— {quote.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
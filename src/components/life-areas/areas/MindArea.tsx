import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer, Volume2, Pause, Play, SkipBack } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export default function MindArea() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  
  // Calculate the timer progress percentage
  const totalSeconds = timerMinutes * 60 + timerSeconds;
  const maxSeconds = 25 * 60; // 25 minutes
  const timerProgress = (totalSeconds / maxSeconds) * 100;
  
  // Format time as MM:SS
  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Toggle timer start/pause
  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };
  
  // Reset timer to 25:00
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(25);
    setTimerSeconds(0);
  };
  
  // Ambient sound options
  const soundOptions = [
    { id: 'rain', label: 'Chuva' },
    { id: 'forest', label: 'Floresta' },
    { id: 'waves', label: 'Ondas' },
    { id: 'cafe', label: 'Café' },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Focus Timer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Timer className="h-5 w-5 mr-2 text-primary" />
            Timer de Foco
          </CardTitle>
          <CardDescription>Técnica Pomodoro para foco intenso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-5xl font-semibold mb-2">
              {formatTime(timerMinutes, timerSeconds)}
            </div>
            <Progress value={timerProgress} className="h-2" />
          </div>
          
          {/* Timer Controls */}
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="icon" onClick={resetTimer}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button onClick={toggleTimer} className="px-8">
              {isTimerRunning ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isTimerRunning ? 'Pausar' : 'Iniciar'}
            </Button>
          </div>
          
          {/* Timer Presets */}
          <div className="flex justify-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setTimerMinutes(15);
                setTimerSeconds(0);
              }}
            >
              15min
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setTimerMinutes(25);
                setTimerSeconds(0);
              }}
            >
              25min
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setTimerMinutes(50);
                setTimerSeconds(0);
              }}
            >
              50min
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Ambient Sounds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Volume2 className="h-5 w-5 mr-2 text-primary" />
            Sons Ambientais
          </CardTitle>
          <CardDescription>Escolha sons para concentração</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sound Options */}
          <div className="grid grid-cols-2 gap-2">
            {soundOptions.map((sound) => (
              <Button
                key={sound.id}
                variant="outline"
                className={cn(
                  "h-16 flex flex-col",
                  activeSound === sound.id ? "border-primary bg-primary/10" : ""
                )}
                onClick={() => setActiveSound(activeSound === sound.id ? null : sound.id)}
              >
                <span>{sound.label}</span>
              </Button>
            ))}
          </div>
          
          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Volume</span>
              <span className="text-sm font-medium">70%</span>
            </div>
            <Slider defaultValue={[70]} max={100} step={1} />
          </div>
        </CardContent>
      </Card>
      
      {/* Meditation Guide */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Ritual de Silêncio</CardTitle>
          <CardDescription>Meditação guiada diária</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-6 text-center">
            <p className="text-xl font-medium mb-4">
              "A mente é como a água. Quando está agitada, fica difícil ver. Mas se você permitir que ela se acalme, a resposta se torna clara."
            </p>
            <Button className="px-8">Começar Meditação</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
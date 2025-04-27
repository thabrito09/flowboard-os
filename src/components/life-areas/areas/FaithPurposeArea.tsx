import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Save, Heart, Gauge } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function FaithPurposeArea() {
  const [gratitudeText, setGratitudeText] = useState('');
  const [purposeText, setPurposeText] = useState('');
  
  // Mock data for spiritual practices
  const practices = [
    { id: '1', name: 'Meditação', duration: '15 min', frequency: 'Diário' },
    { id: '2', name: 'Leitura Reflexiva', duration: '20 min', frequency: 'Segunda, Quarta, Sexta' },
    { id: '3', name: 'Visualização Criativa', duration: '10 min', frequency: 'Terça, Quinta' },
    { id: '4', name: 'Yoga', duration: '45 min', frequency: 'Sábado' }
  ];
  
  // Purpose meter sections
  const purposeSections = [
    { id: 'clarity', label: 'Clareza', score: 85 },
    { id: 'alignment', label: 'Alinhamento', score: 70 },
    { id: 'impact', label: 'Impacto', score: 90 },
    { id: 'fulfillment', label: 'Satisfação', score: 75 },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Gratitude Journal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-primary" />
            Diário de Gratidão
          </CardTitle>
          <CardDescription>
            Registre aquilo pelo que você é grato hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Hoje sou grato por..."
            className="min-h-[150px]"
            value={gratitudeText}
            onChange={(e) => setGratitudeText(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </CardFooter>
      </Card>
      
      {/* Weekly Purpose */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            Propósito Semanal
          </CardTitle>
          <CardDescription>
            Defina seu foco e intenção para esta semana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Nesta semana, minha intenção é..."
            className="min-h-[150px]"
            value={purposeText}
            onChange={(e) => setPurposeText(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </CardFooter>
      </Card>
      
      {/* Spiritual Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Práticas Espirituais</CardTitle>
          <CardDescription>Rituais para conexão e consciência</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {practices.map((practice) => (
              <div 
                key={practice.id}
                className="p-4 border rounded-md hover:bg-muted/10 transition-colors"
              >
                <div className="flex justify-between">
                  <h4 className="font-semibold">{practice.name}</h4>
                  <span className="text-sm">{practice.duration}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {practice.frequency}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Adicionar Nova Prática
          </Button>
        </CardFooter>
      </Card>
      
      {/* Purpose Meter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gauge className="h-5 w-5 mr-2 text-primary" />
            Medidor de Propósito
          </CardTitle>
          <CardDescription>Avalie seu alinhamento com seu propósito</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {purposeSections.map((section) => (
              <div key={section.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{section.label}</span>
                  <span className="text-sm">{section.score}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      section.score >= 80 ? "bg-green-500" : 
                      section.score >= 60 ? "bg-amber-500" : "bg-red-500"
                    )}
                    style={{ width: `${section.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground italic">
            Seu propósito está bem alinhado. Continue praticando suas intenções diárias.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
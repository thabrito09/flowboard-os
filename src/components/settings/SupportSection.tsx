import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export default function SupportSection() {
  const handleWhatsAppSupport = () => {
    const message = encodeURIComponent("Olá! Preciso de ajuda com meu Flowboard OS.");
    window.open(`https://wa.me/5517997626078?text=${message}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suporte</CardTitle>
        <CardDescription>
          Precisa de ajuda? Entre em contato conosco
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleWhatsAppSupport}
          className="w-full sm:w-auto"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Suporte via WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
}
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useCreateMission } from '@/lib/queries';
import Spinner from '@/components/ui/spinner';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'mentor';
  timestamp: Date;
  suggestedMission?: {
    title: string;
    xpReward: number;
  };
};

export default function MentorChat() {
  const { userId } = useParams<{ userId: string }>();
  const { userData } = useUser();
  const { toast } = useToast();
  const createMissionMutation = useCreateMission();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou seu Mentor Interno. Como posso ajudar você hoje? Pode me contar qualquer coisa que esteja sentindo ou pensando.',
      sender: 'mentor',
      timestamp: new Date(Date.now() - 60000),
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Early return if userId doesn't match current user
  if (!userId || !userData?.id || userId !== userData.id) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Acesso não autorizado.</p>
      </div>
    );
  }

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || newMessage;
    if (!messageContent.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      // Simulate mentor typing delay (1-2 seconds)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Send message to webhook
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mentor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          userId,
          message: messageContent,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get mentor response');
      }
      
      const data = await response.json();
      
      // Add mentor response
      const mentorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'mentor',
        timestamp: new Date(),
        suggestedMission: data.suggestedMission,
      };
      
      setMessages(prev => [...prev, mentorMessage]);
    } catch (error) {
      console.error('Error getting mentor response:', error);
      toast({
        title: "Erro ao processar mensagem",
        description: "Não foi possível obter a resposta do mentor. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };
  
  const handleAddSuggestedMission = async (mission: Message['suggestedMission']) => {
    if (!mission || !userData?.id) return;
    
    try {
      await createMissionMutation.mutateAsync({
        userId: userData.id,
        title: mission.title,
      });
      
      toast({
        title: "Missão adicionada!",
        description: "A missão sugerida foi adicionada à sua lista.",
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar missão",
        description: "Não foi possível adicionar a missão. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)]">
      <Card className="flex flex-col flex-1 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle>Mentor Interno</CardTitle>
          <CardDescription>Converse e receba apoio emocional</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0">
          {/* Chat Messages */}
          <ScrollArea className="h-[calc(100%-4rem)] pb-4 px-6">
            <div className="space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3",
                    message.sender === 'user' ? "justify-end" : ""
                  )}
                >
                  {message.sender === 'mentor' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar-mentor.png" />
                      <AvatarFallback className="bg-primary text-primary-foreground">M</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="space-y-2">
                    <div 
                      className={cn(
                        "p-3 rounded-lg max-w-[80%]",
                        message.sender === 'user' 
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted rounded-tl-none"
                      )}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    
                    {message.suggestedMission && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleAddSuggestedMission(message.suggestedMission)}
                      >
                        Aceitar Missão Sugerida
                      </Button>
                    )}
                  </div>
                  
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData.avatar_url || ''} />
                      <AvatarFallback className="bg-muted">{userData.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar-mentor.png" />
                    <AvatarFallback className="bg-primary text-primary-foreground">M</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <div className="p-4 border-t mt-auto">
            <form 
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <SendIcon className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
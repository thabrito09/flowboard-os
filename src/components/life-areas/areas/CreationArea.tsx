import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Palette, Calendar, CheckSquare, PlusCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type Idea = {
  id: string;
  content: string;
  date: string;
  category: string;
};

type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

export default function CreationArea() {
  const [newIdea, setNewIdea] = useState('');
  const [ideas, setIdeas] = useState<Idea[]>([
    { id: '1', content: 'Criar uma série de vídeos sobre produtividade', date: '2025-07-15', category: 'Conteúdo' },
    { id: '2', content: 'Escrever um e-book sobre hábitos de sucesso', date: '2025-08-20', category: 'Produto' },
  ]);
  
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: '1', text: 'Definir tema do próximo conteúdo', completed: true },
    { id: '2', text: 'Pesquisar referências visuais', completed: false },
    { id: '3', text: 'Criar roteiro do vídeo', completed: false },
  ]);
  
  const [newChecklistItem, setNewChecklistItem] = useState('');
  
  // Handle adding a new idea
  const handleAddIdea = () => {
    if (!newIdea.trim()) return;
    
    const newIdeaObject: Idea = {
      id: Date.now().toString(),
      content: newIdea,
      date: new Date().toISOString().split('T')[0],
      category: 'Nova',
    };
    
    setIdeas([...ideas, newIdeaObject]);
    setNewIdea('');
  };
  
  // Handle adding a new checklist item
  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newChecklistItem,
      completed: false,
    };
    
    setChecklistItems([...checklistItems, newItem]);
    setNewChecklistItem('');
  };
  
  // Handle toggling a checklist item
  const toggleChecklistItem = (id: string) => {
    setChecklistItems(
      checklistItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  // Handle removing a checklist item
  const removeChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter(item => item.id !== id));
  };
  
  // Calendar events
  const calendarEvents = [
    { date: '2025-07-05', title: 'Lançamento de conteúdo sobre produtividade' },
    { date: '2025-07-12', title: 'Live sobre gestão de tempo' },
    { date: '2025-07-19', title: 'Tutorial de organização' },
    { date: '2025-07-26', title: 'Entrevista com especialista' },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Idea Registration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2 text-primary" />
            Registro de Ideias
          </CardTitle>
          <CardDescription>Capture suas inspirações e ideias</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Digite sua ideia aqui..."
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleAddIdea} className="w-full">
              Salvar Ideia
            </Button>
          </div>
          
          <div className="space-y-2 mt-4">
            {ideas.map(idea => (
              <div 
                key={idea.id} 
                className="p-3 border rounded-md hover:bg-muted/30 transition-colors"
              >
                <p className="font-medium">{idea.content}</p>
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <span>{idea.date}</span>
                  <span className="bg-muted px-2 py-0.5 rounded-full">{idea.category}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Content Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Calendário de Conteúdo
          </CardTitle>
          <CardDescription>Planeje sua produção de conteúdo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-2 border rounded-md bg-muted/30">
            <h3 className="font-medium">Julho 2025</h3>
          </div>
          
          <div className="space-y-2">
            {calendarEvents.map((event, index) => (
              <div 
                key={index}
                className="flex gap-3 p-3 border rounded-md hover:bg-muted/30 transition-colors"
              >
                <div className="text-right min-w-[80px] font-mono text-muted-foreground">
                  {event.date.split('-')[2]}/{event.date.split('-')[1]}
                </div>
                <div>
                  <p className="font-medium">{event.title}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Evento
          </Button>
        </CardFooter>
      </Card>
      
      {/* Creative Checklists */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckSquare className="h-5 w-5 mr-2 text-primary" />
            Checklists Criativos
          </CardTitle>
          <CardDescription>Organize suas tarefas criativas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Adicione um novo item..."
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddChecklistItem();
                }
              }}
            />
            <Button onClick={handleAddChecklistItem}>
              Adicionar
            </Button>
          </div>
          
          <div className="space-y-2">
            {checklistItems.map(item => (
              <div 
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-3 border rounded-md transition-colors",
                  item.completed ? "bg-muted/30" : "hover:bg-muted/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={item.completed}
                    onCheckedChange={() => toggleChecklistItem(item.id)}
                  />
                  <span className={cn(
                    "font-medium",
                    item.completed ? "line-through text-muted-foreground" : ""
                  )}>
                    {item.text}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => removeChecklistItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
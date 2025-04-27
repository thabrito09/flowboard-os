import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, X, Settings2 } from 'lucide-react';
import { type RoutePhase } from '@/lib/queries/routes';
import { generateRandomId } from '@/lib/utils';

interface RoutePhaseEditorProps {
  phase: RoutePhase;
  onSave: (updatedPhase: RoutePhase) => void;
}

export default function RoutePhaseEditor({ phase, onSave }: RoutePhaseEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedPhase, setEditedPhase] = useState<RoutePhase>(phase);
  const [newTaskText, setNewTaskText] = useState('');
  
  const handleSave = () => {
    onSave(editedPhase);
    setIsOpen(false);
  };
  
  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    
    setEditedPhase(prev => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        {
          id: generateRandomId(),
          text: newTaskText,
          completed: false,
        }
      ]
    }));
    
    setNewTaskText('');
  };
  
  const handleRemoveTask = (taskId: string) => {
    setEditedPhase(prev => ({
      ...prev,
      checklist: prev.checklist.filter(task => task.id !== taskId)
    }));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Fase</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome da Fase</label>
            <Input
              value={editedPhase.name}
              onChange={(e) => setEditedPhase(prev => ({
                ...prev,
                name: e.target.value
              }))}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={editedPhase.description || ''}
              onChange={(e) => setEditedPhase(prev => ({
                ...prev,
                description: e.target.value
              }))}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tarefas</label>
            <div className="space-y-2">
              {editedPhase.checklist.map(task => (
                <div key={task.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => {
                      setEditedPhase(prev => ({
                        ...prev,
                        checklist: prev.checklist.map(t =>
                          t.id === task.id ? { ...t, completed: !!checked } : t
                        )
                      }));
                    }}
                  />
                  <Input
                    value={task.text}
                    onChange={(e) => {
                      setEditedPhase(prev => ({
                        ...prev,
                        checklist: prev.checklist.map(t =>
                          t.id === task.id ? { ...t, text: e.target.value } : t
                        )
                      }));
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTask(task.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Nova tarefa..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTask();
                  }
                }}
              />
              <Button onClick={handleAddTask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
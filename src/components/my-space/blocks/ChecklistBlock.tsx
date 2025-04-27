import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useUpdateBlock } from '@/lib/queries/space';
import { generateRandomId } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext'; // <-- importar contexto do usuário

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ChecklistBlockProps {
  id: string;
  items: ChecklistItem[];
  order: number; // <-- adicione isto
}

export default function ChecklistBlock({ id, items: initialItems, order }: ChecklistBlockProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [newItemText, setNewItemText] = useState('');
  const updateBlock = useUpdateBlock();
  const { userData } = useUser(); // <-- obter userId do contexto

  const handleAddItem = () => {
    if (!newItemText.trim()) return;

    const newItems = [
      ...items,
      {
        id: generateRandomId(),
        text: newItemText,
        checked: false
      }
    ];

    setItems(newItems);
    setNewItemText('');
    updateBlock.mutate({
      id: id, // <-- Correção aqui: trocar blockId por id
      userId: userData?.id as string, // <-- adicionar userId
      content: { items: newItems },
      order // <-- adicionar order
    });
  };

  const handleToggleItem = (itemId: string) => {
    const newItems = items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    setItems(newItems);
    updateBlock.mutate({
      id: id, // <-- Correção aqui também
      userId: userData?.id as string,
      content: { items: newItems },
      order
    });
  };

  const handleRemoveItem = (itemId: string) => {
    const newItems = items.filter(item => item.id !== itemId);
    setItems(newItems);
    updateBlock.mutate({
      id: id, // <-- Correção aqui também
      userId: userData?.id as string,
      content: { items: newItems },
      order
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Novo item..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddItem();
            }
          }}
        />
        <Button onClick={handleAddItem}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <Checkbox
              checked={item.checked}
              onCheckedChange={() => handleToggleItem(item.id)}
            />
            <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
              {item.text}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-8 w-8 p-0"
              onClick={() => handleRemoveItem(item.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

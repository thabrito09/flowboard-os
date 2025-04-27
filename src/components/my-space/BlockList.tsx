import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical } from 'lucide-react';
import { useSpaceBlocks, useCreateBlock, useUpdateBlock, type SpaceBlock } from '@/lib/queries/space';
import TextBlock from './blocks/TextBlock';
import ChecklistBlock from './blocks/ChecklistBlock';
import { cn } from '@/lib/utils';

interface BlockListProps {
  userId: string;
}

export default function BlockList({ userId }: BlockListProps) {
  const { data: blocks = [], isLoading } = useSpaceBlocks(userId);
  const createBlock = useCreateBlock();
  const updateBlock = useUpdateBlock();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleAddBlock = async (type: SpaceBlock['type']) => {
    const newOrder = blocks.length > 0 
      ? Math.max(...blocks.map(b => b.order)) + 1 
      : 0;
      
    await createBlock.mutateAsync({
      userId,
      type,
      content: type === 'text' ? { text: '' } : { items: [] },
      order: newOrder,
    });
  };
  
  const handleDragEnd = (result: any) => {
    setIsDragging(false);
    
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    
    if (sourceIndex === destIndex) return;
    
    const reorderedBlocks = Array.from(blocks);
    const [movedBlock] = reorderedBlocks.splice(sourceIndex, 1);
    reorderedBlocks.splice(destIndex, 0, movedBlock);
    
    // Update orders in database for affected blocks only
    const startIdx = Math.min(sourceIndex, destIndex);
    const endIdx = Math.max(sourceIndex, destIndex);
    
    reorderedBlocks.slice(startIdx, endIdx + 1).forEach((block, offset) => {
      const newOrder = startIdx + offset;
      if (block.order !== newOrder) {
        updateBlock.mutate({
          blockId: block.id,
          order: newOrder,
        });
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button onClick={() => handleAddBlock('text')}>
          <Plus className="h-4 w-4 mr-2" />
          Texto
        </Button>
        <Button onClick={() => handleAddBlock('checklist')}>
          <Plus className="h-4 w-4 mr-2" />
          Checklist
        </Button>
      </div>
      
      <DragDropContext 
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        <Droppable droppableId="blocks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {blocks.map((block, index) => (
                <Draggable
                  key={block.id}
                  draggableId={block.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "p-4 bg-card rounded-lg border shadow-sm transition-all duration-200",
                        snapshot.isDragging ? "shadow-lg ring-2 ring-primary" : "hover:shadow-md",
                        isDragging && !snapshot.isDragging ? "opacity-50" : ""
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          {...provided.dragHandleProps}
                          className="mt-2 cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          {block.type === 'text' ? (
                            <TextBlock
                              id={block.id}
                              initialContent={block.content.text || ''}
                            />
                          ) : (
                            <ChecklistBlock
                              id={block.id}
                              items={block.content.items || []}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

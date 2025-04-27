import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateBlock } from '@/lib/queries/space';
import { useDebounce } from '@/lib/hooks';

interface TextBlockProps {
  id: string;
  initialContent: string;
}

export default function TextBlock({ id, initialContent }: TextBlockProps) {
  const [content, setContent] = useState(initialContent);
  const debouncedContent = useDebounce(content, 500);
  const updateBlock = useUpdateBlock();
  
  useEffect(() => {
    if (debouncedContent !== initialContent) {
      updateBlock.mutate({
        blockId: id,
        content: { text: debouncedContent }
      });
    }
  }, [debouncedContent, id, initialContent]);
  
  return (
    <Textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Digite algo..."
      className="min-h-[100px] resize-none focus:ring-1 focus:ring-primary"
    />
  );
}
'use client';

import { useState } from 'react';
import { colonyLink } from '@/lib/colony-link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export function CreatePost() {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error('Please write something before posting');
      return;
    }

    setIsPosting(true);
    try {
      // Send the post via Colony Core
      colonyLink.sendMessage(content);
      toast.success('Post sent to the Colony!');
      setContent('');
    } catch (error) {
      toast.error('Failed to send post');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="p-4">
      <Textarea
        placeholder="Share something with the Colony..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] mb-4"
      />
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {content.length}/500
        </p>
        <Button
          onClick={handlePost}
          disabled={isPosting || !content.trim()}
        >
          {isPosting ? 'Posting...' : '🐝 Post'}
        </Button>
      </div>
    </Card>
  );
}

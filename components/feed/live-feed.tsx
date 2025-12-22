'use client';

import { useEffect, useState } from 'react';
import { useColony } from '@/components/providers/colony-provider';
import { colonyLink } from '@/lib/colony-link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    handle: string;
  };
  content: string;
  timestamp: string;
  isLive?: boolean;
}

export function LiveFeed() {
  const { isConnected } = useColony();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Listen for new posts from the Colony Core
    const handleNewPost = (post: Post) => {
      setPosts((prev) => [post, ...prev]);
    };

    colonyLink.socket?.on('new_post', handleNewPost);

    return () => {
      colonyLink.socket?.off('new_post', handleNewPost);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Feed</h2>
        {isConnected && (
          <Badge variant="default" className="bg-green-500">
            🐝 Live
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[600px] rounded-md border p-4">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="text-lg">No posts yet.</p>
            <p className="text-sm">Be the first to post!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{post.author.name}</p>
                      <p className="text-sm text-muted-foreground">@{post.author.handle}</p>
                    </div>
                    {post.isLive && (
                      <Badge variant="secondary" className="ml-auto">
                        Live
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(post.timestamp).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

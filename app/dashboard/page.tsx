import CreatePost from '@/components/feed/create-post';
import LiveFeed from '@/components/feed/live-feed';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Colony Dashboard</h1>
      
      <div className="space-y-6">
        <CreatePost />
        <LiveFeed />
      </div>
    </div>
  );
}

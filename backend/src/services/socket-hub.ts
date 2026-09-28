import { Server, Socket } from 'socket.io';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazily created — only needed when ENABLE_DB_LOGGING=true. Never throws
// at startup when SUPABASE_URL / SUPABASE_SERVICE_KEY are unset.
let _supabase: SupabaseClient | null | undefined;
function getSupabase(): SupabaseClient | null {
  if (_supabase === undefined) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    _supabase = url && key ? createClient(url, key) : null;
  }
  return _supabase;
}

export function initializeSocketHub(io: Server) {
  console.log('🐝 Socket Hub initializing...');

  io.on('connection', (socket: Socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Send welcome message
    socket.emit('colony:connected', {
      message: 'Connected to Colony Core',
      timestamp: new Date().toISOString(),
      socketId: socket.id
    });

    // Handle entity updates
    socket.on('entity:update', async (data) => {
      try {
        console.log('📡 Entity update received:', data);
        
        // Broadcast to all other clients
        socket.broadcast.emit('entity:updated', data);

        // Log to Supabase (optional)
        if (process.env.ENABLE_DB_LOGGING === 'true') {
          await getSupabase()?.from('entity_updates').insert({
            entity_type: data.entityType,
            entity_id: data.entityId,
            update_data: data.updateData,
            socket_id: socket.id,
            created_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error handling entity update:', error);
        socket.emit('error', { message: 'Failed to process update' });
      }
    });

    // Handle notifications
    socket.on('notification:send', (notification) => {
      console.log('🔔 Broadcasting notification:', notification);
      io.emit('notification:received', notification);
    });

    // Handle feed posts from dashboard clients (CreatePost component)
    socket.on('send_message', (data) => {
      const content = typeof data === 'string' ? data : data?.content;
      if (!content) return;
      console.log('📝 Feed post received, broadcasting');
      io.emit('new_post', {
        id: `hive-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
        author: { name: 'Bee', handle: 'beekeeper' },
        content,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  console.log('✨ Socket Hub ready');
}

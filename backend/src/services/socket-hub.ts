import { Server, Socket } from 'socket.io';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

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
          await supabase.from('entity_updates').insert({
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

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  console.log('✨ Socket Hub ready');
}

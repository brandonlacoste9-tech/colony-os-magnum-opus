import { io, Socket } from 'socket.io-client';
import { createBrowserClient } from '@supabase/ssr';

const createClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const COLONY_API_URL = process.env.NEXT_PUBLIC_COLONY_API_URL || 'http://localhost:10000';

class ColonyLink {
  public socket: Socket | null = null;
  private supabase = createClient();

  constructor() {
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  private async connect() {
    const { data: { session } } = await this.supabase.auth.getSession();
    const token = session?.access_token;

    // Guest users don't get a socket connection
    if (!token) {
      console.log("🌱 Magnum Opus: Guest mode (No Socket)");
      return;
    }

    this.socket = io(COLONY_API_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('🧠 Magnum Opus: Connected to Core.');
              this.socket?.emit('join_channel', 'global_feed');
    });
  }

  public emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  public on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  
  
    public subscribeToNotifications(callback: (notification: any) => void) {
    this.socket?.on('notification', callback);
  }

  public sendMessage(content: string) {
    this.socket?.emit('send_message', { content });
  }}
}

export const colonyLink = new ColonyLink();

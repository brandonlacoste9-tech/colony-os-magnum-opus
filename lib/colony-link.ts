import { io, Socket } from 'socket.io-client';
import { createBrowserClient } from '@supabase/ssr';

const createClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const COLONY_API_URL = process.env.NEXT_PUBLIC_COLONY_API_URL || 'http://localhost:10000';

class ColonyLink {
  public socket: Socket | null = null;
  private _supabase: ReturnType<typeof createBrowserClient> | null | undefined;

  private get supabase() {
    if (this._supabase === undefined) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      this._supabase = url && key ? createClient() : null;
    }
    return this._supabase;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  private async connect() {
    const session = (await this.supabase?.auth.getSession())?.data.session;
    const token = session?.access_token;

    // Guests connect without a token (read-only mission control view) —
    // the hub doesn't require auth. Signed-in users send their token.
    if (!token) {
      console.log("🌱 Magnum Opus: Guest mode (read-only feed)");
    }

    this.socket = io(COLONY_API_URL, {
      ...(token ? { auth: { token } } : {}),
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
  }

  public subscribeToNotifications(callback: (notification: any) => void) {
    this.socket?.on('notification', callback);
  }

  public sendMessage(content: string) {
    this.socket?.emit('send_message', { content });
  }
}

export const colonyLink = new ColonyLink();

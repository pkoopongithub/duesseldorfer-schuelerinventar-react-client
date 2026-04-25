import AsyncStorage from '@react-native-async-storage/async-storage';

export class SessionManager {
  private static instance: SessionManager;
  private userId: string | null = null;
  private session: string | null = null;

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  setSession(userId: string, session: string) {
    this.userId = userId;
    this.session = session;
  }

  getUserId(): string | null {
    return this.userId;
  }

  getSession(): string | null {
    return this.session;
  }

  isLoggedIn(): boolean {
    return this.userId !== null && this.session !== null;
  }

  clear() {
    this.userId = null;
    this.session = null;
    AsyncStorage.multiRemove(['userId', 'session']);
  }

  getAuthHeaders(): Record<string, string> {
    return {
      'X-User-ID': this.userId || '',
      'X-Session': this.session || '',
    };
  }
}
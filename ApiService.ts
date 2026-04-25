import axios, { AxiosInstance } from 'axios';
import { SessionManager } from './SessionManager';
import { LoginResponse, Profile, Group, ProfileCreate } from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL = 'https://paul-koop.org/api/';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(async (config) => {
      const sessionManager = SessionManager.getInstance();
      if (sessionManager.isLoggedIn()) {
        config.headers['X-User-ID'] = sessionManager.getUserId();
        config.headers['X-Session'] = sessionManager.getSession();
      }
      return config;
    });
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.api.post('api_login.php', { username, password });
    return response.data;
  }

  async getProfiles(): Promise<Profile[]> {
    const response = await this.api.get('api_profiles.php');
    return response.data;
  }

  async getProfile(id: string): Promise<Profile> {
    const response = await this.api.get(`api_profiles.php?id=${id}`);
    return response.data;
  }

  async createProfile(profile: ProfileCreate): Promise<boolean> {
    const response = await this.api.post('api_profiles.php', profile);
    return response.status === 200;
  }

  async updateProfile(profile: ProfileCreate, id: string): Promise<boolean> {
    const response = await this.api.put('api_profiles.php', profile, {
      headers: { 'X-Profile-ID': id },
    });
    return response.status === 200;
  }

  async deleteProfile(id: string): Promise<boolean> {
    const response = await this.api.delete(`api_profiles.php?id=${id}`);
    return response.status === 200;
  }

  async getGroups(): Promise<Group[]> {
    const response = await this.api.get('api_groups.php');
    return response.data;
  }

  async createGroup(name: string): Promise<boolean> {
    const response = await this.api.post('api_groups.php', { name });
    return response.status === 200;
  }

  async deleteGroup(id: number): Promise<boolean> {
    const response = await this.api.delete(`api_groups.php?id=${id}`);
    return response.status === 200;
  }
}

export const apiService = new ApiService();
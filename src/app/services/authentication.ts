import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  constructor(
    private supabase: SupabaseService
  ) {}

  async login(email: string, password: string) {
    return await this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });
  }

  async logout() {
    return await this.supabase.client.auth.signOut();
  }

  async forgotPassword(email: string) {
    return await this.supabase.client.auth.resetPasswordForEmail(email);
  }

  async changePassword(password: string) {
    return await this.supabase.client.auth.updateUser({
      password,
    });
  }

  async getCurrentUser() {
    return await this.supabase.client.auth.getUser();
  }

}
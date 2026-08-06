import { Injectable } from '@angular/core';
import {SupabaseService} from './supabase';
@Injectable({
  providedIn: 'root',
})
export class Appointments {
  constructor(private supabase: SupabaseService) {}
  async getAllAppointments() {
  const { data, error } = await this.supabase.client
    .from('appointments')
    .select(`
      *,
      departments (
        id,
        name
      )
    `)
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });

  if (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }

  return data;
}

async getTodayAppointments() {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await this.supabase.client
    .from('appointments')
    .select(`
      *,
      departments (
        id,
        name
      )
    `)
    .eq('appointment_date', today)
    .order('appointment_time', { ascending: true });

  if (error) {
    console.error('Error fetching today appointments:', error);
    throw error;
  }

  return data;
}

async getTodayVisitsCount() {
  const today = new Date().toISOString().split('T')[0];

  const { count, error } = await this.supabase.client
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('appointment_date', today);

  if (error) {
    console.error('Error counting today visits:', error);
    throw error;
  }

  return count ?? 0;
}
async searchAppointments(search: string) {
  if (!search.trim()){
    return this.getAllAppointments();
  }
  const { data, error } = await this.supabase.client
    .from('appointments')
    .select(`
      *,
      departments (
        id,
        name
      )
    `)
    .or(
      `visitor_name.ilike.%${search}%,national_id.ilike.%${search}%,booking_number.ilike.%${search}%`
    )
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });

  if (error) {
    console.error('Error searching appointments:', error);
    throw error;
  }

  return data;
}
async getAppointmentsByStatus(status: string) {
  const { data, error } = await this.supabase.client
    .from('appointments')
    .select(`
      *,
      departments (
        id,
        name
      )
    `)
    .eq('status', status)
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });

  if (error) {
    console.error('Error fetching appointments by status:', error);
    throw error;
  }

  return data;
}
async getCompletedAppointments() {
  return this.getAppointmentsByStatus('checked_in');
}

async getPendingAppointments() {
  return this.getAppointmentsByStatus('scheduled');
}

async getAll() {
  return this.getAllAppointments();
}
async getCheckedInCount() {
  const { count, error } = await this.supabase.client
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'checked_in');

  if (error) {
    console.error('Error counting checked in visits:', error);
    throw error;
  }

  return count ?? 0;
}
async getScheduledCount() {
  const { count, error } = await this.supabase.client
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'scheduled');

  if (error) {
    console.error('Error counting scheduled visits:', error);
    throw error;
  }

  return count ?? 0;
}
}

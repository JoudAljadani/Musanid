import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase';

export interface NotificationRecord {
  id: string;
  employee_id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class Notifications {
  constructor(
    private readonly supabase: SupabaseService
  ) {}

  async getCurrentEmployeeNotifications(): Promise<NotificationRecord[]> {
    const employeeId = await this.getCurrentEmployeeId();

    const { data, error } = await this.supabase.client
      .from('notifications')
      .select(`
        id,
        employee_id,
        title,
        body,
        is_read,
        created_at
      `)
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('تعذر تحميل الإشعارات.');
    }

    return (data ?? []) as NotificationRecord[];
  }

  async getUnreadCount(): Promise<number> {
    const employeeId = await this.getCurrentEmployeeId();

    const { count, error } = await this.supabase.client
      .from('notifications')
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('employee_id', employeeId)
      .eq('is_read', false);

    if (error) {
      console.error('Error counting unread notifications:', error);
      throw new Error('تعذر حساب الإشعارات غير المقروءة.');
    }

    return count ?? 0;
  }

  async markAsRead(notificationId: string): Promise<void> {
    const employeeId = await this.getCurrentEmployeeId();

    const { error } = await this.supabase.client
      .from('notifications')
      .update({
        is_read: true
      })
      .eq('id', notificationId)
      .eq('employee_id', employeeId);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('تعذر تحديث الإشعار.');
    }
  }

  async markAllAsRead(): Promise<void> {
    const employeeId = await this.getCurrentEmployeeId();

    const { error } = await this.supabase.client
      .from('notifications')
      .update({
        is_read: true
      })
      .eq('employee_id', employeeId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('تعذر تحديث الإشعارات.');
    }
  }

  async createNotification(
    title: string,
    body: string
  ): Promise<void> {
    const employeeId = await this.getCurrentEmployeeId();

    const { error } = await this.supabase.client
      .from('notifications')
      .insert({
        employee_id: employeeId,
        title,
        body,
        is_read: false
      });

    if (error) {
      console.error('Error creating notification:', error);
      throw new Error('تعذر إنشاء الإشعار.');
    }
  }

  private async getCurrentEmployeeId(): Promise<string> {
    const {
      data: { user },
      error
    } = await this.supabase.client.auth.getUser();

    if (error || !user) {
      console.error('Error getting current employee:', error);
      throw new Error('لم يتم العثور على الموظف الحالي.');
    }

    return user.id;
  }
}
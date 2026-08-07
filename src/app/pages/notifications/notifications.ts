import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  checkmarkCircleOutline,
  checkmarkDoneOutline,
  informationCircleOutline,
  notificationsOutline
} from 'ionicons/icons';

import {
  Notifications,
  NotificationRecord
} from '../../services/notifications';

interface NotificationItem {
  id: string;
  title: string;
  text: string;
  time: string;
  icon: string;
  isRead: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon
  ],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss']
})
export class NotificationsPage implements OnInit {
  items: NotificationItem[] = [];
  isLoading = false;

  constructor(
    private readonly nav: NavController,
    private readonly notificationsService: Notifications
  ) {
    addIcons({
      arrowBackOutline,
      checkmarkCircleOutline,
      checkmarkDoneOutline,
      notificationsOutline,
      informationCircleOutline
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadNotifications();
  }

  get unreadCount(): number {
    return this.items.filter(
      (item) => !item.isRead
    ).length;
  }

  async loadNotifications(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    try {
      const notifications =
        await this.notificationsService
          .getCurrentEmployeeNotifications();

      this.items = notifications.map(
        (notification: NotificationRecord): NotificationItem => ({
          id: notification.id,
          title: notification.title,
          text: notification.body,
          time: this.formatTime(notification.created_at),
          icon: this.getNotificationIcon(notification.title),
          isRead: notification.is_read
        })
      );
    } catch (error) {
      console.error(
        'Notifications loading error:',
        error
      );

      this.items = [];
    } finally {
      this.isLoading = false;
    }
  }

  async markAllAsRead(): Promise<void> {
    if (this.unreadCount === 0) {
      return;
    }

    try {
      await this.notificationsService.markAllAsRead();

      this.items = this.items.map(
        (item) => ({
          ...item,
          isRead: true
        })
      );
    } catch (error) {
      console.error(
        'Mark all notifications error:',
        error
      );
    }
  }

  async markAsRead(
    item: NotificationItem
  ): Promise<void> {
    if (item.isRead) {
      return;
    }

    try {
      await this.notificationsService
        .markAsRead(item.id);

      item.isRead = true;
    } catch (error) {
      console.error(
        'Mark notification error:',
        error
      );
    }
  }

  goBack(): void {
    void this.nav.navigateBack(
      '/tabs/home',
      {
        animated: true,
        animationDirection: 'forward'
      }
    );
  }

  private getNotificationIcon(
    title: string
  ): string {
    const normalizedTitle =
      title.toLowerCase();

    if (
      normalizedTitle.includes('تسجيل') ||
      normalizedTitle.includes('دخول')
    ) {
      return 'checkmark-circle-outline';
    }

    if (
      normalizedTitle.includes('تحديث') ||
      normalizedTitle.includes('نظام')
    ) {
      return 'information-circle-outline';
    }

    return 'notifications-outline';
  }

  private formatTime(
    createdAt: string
  ): string {
    const createdDate =
      new Date(createdAt);

    const now = new Date();

    const differenceInSeconds =
      Math.floor(
        (
          now.getTime() -
          createdDate.getTime()
        ) / 1000
      );

    if (differenceInSeconds < 60) {
      return 'الآن';
    }

    const differenceInMinutes =
      Math.floor(
        differenceInSeconds / 60
      );

    if (differenceInMinutes < 60) {
      return `منذ ${differenceInMinutes} دقيقة`;
    }

    const differenceInHours =
      Math.floor(
        differenceInMinutes / 60
      );

    if (differenceInHours < 24) {
      return `منذ ${differenceInHours} ساعة`;
    }

    const differenceInDays =
      Math.floor(
        differenceInHours / 24
      );

    if (differenceInDays === 1) {
      return 'منذ يوم';
    }

    if (differenceInDays < 7) {
      return `منذ ${differenceInDays} أيام`;
    }

    return createdDate.toLocaleDateString(
      'ar-SA'
    );
  }
}
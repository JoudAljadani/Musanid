import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  checkmarkCircleOutline,
  checkmarkDoneOutline,
  informationCircleOutline,
  notificationsOutline,
} from 'ionicons/icons';

interface NotificationItem {
  title: string;
  text: string;
  time: string;
  icon: string;
  isRead: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss'],
})
export class NotificationsPage {
  items: NotificationItem[] = [
    {
      title: 'تم تسجيل دخول زائر',
      text: 'تم تسجيل دخول الزائر سارة أحمد بنجاح.',
      time: 'منذ 5 دقائق',
      icon: 'checkmark-circle-outline',
      isRead: false,
    },
    {
      title: 'تذكير بموعد زيارة',
      text: 'يوجد موعد زيارة غير مكتمل الساعة 10:30 ص.',
      time: 'منذ 20 دقيقة',
      icon: 'notifications-outline',
      isRead: false,
    },
    {
      title: 'تحديث النظام',
      text: 'تم تحديث بيانات الزيارات لهذا اليوم.',
      time: 'منذ ساعة',
      icon: 'information-circle-outline',
      isRead: true,
    },
  ];

  constructor(private nav: NavController) {
    addIcons({
      arrowBackOutline,
      checkmarkCircleOutline,
      checkmarkDoneOutline,
      notificationsOutline,
      informationCircleOutline,
    });
  }

  get unreadCount(): number {
    return this.items.filter((item) => !item.isRead).length;
  }

  markAllAsRead(): void {
    this.items = this.items.map((item) => ({ ...item, isRead: true }));
  }

  markAsRead(item: NotificationItem): void {
    item.isRead = true;
  }

  goBack(): void {
    void this.nav.navigateBack('/tabs/home', {
      animated: true,
      animationDirection: 'forward',
    });
  }
}

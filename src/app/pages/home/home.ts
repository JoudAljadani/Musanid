import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  appsOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  createOutline,
  notificationsOutline,
  peopleOutline,
  personCircleOutline,
  qrCodeOutline,
  shieldCheckmarkOutline,
  storefrontOutline,
} from 'ionicons/icons';

interface SliderItem {
  title: string;
  description: string;
  icon: string;
  background: string;
}

interface SummaryItem {
  title: string;
  value: number;
  icon: string;
  className: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon,
    IonBadge,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class Home implements OnInit, OnDestroy {
  employeeName = 'محمد';
  employeeRole = 'موظف أمن';
  currentSlide = 0;
  hasUnreadNotifications = true;
  isLive = true;

  private sliderTimer?: ReturnType<typeof setInterval>;

  sliderItems: SliderItem[] = [
    {
      title: 'مساند',
      description: 'إدارة زيارات الأمانة بسهولة وكفاءة',
      icon: 'shield-checkmark-outline',
      background:
        'linear-gradient(125deg, #402F82 0%, #402F82 18%, #3C3886 35%, #305090 54%, #1D78A1 72%, #06A9B6 88%, #06A9B6 100%)',
    },
    {
      title: 'بلدي',
      description: 'الخدمات البلدية الإلكترونية للأفراد والمنشآت',
      icon: 'storefront-outline',
      background:
        'linear-gradient(125deg, #402F82 0%, #402F82 18%, #3C3886 35%, #305090 54%, #1D78A1 72%, #06A9B6 88%, #06A9B6 100%)',
    },
    {
      title: 'الخدمات الرقمية',
      description: 'الوصول إلى خدمات الأمانة الرقمية من مكان واحد',
      icon: 'apps-outline',
      background:
        'linear-gradient(125deg, #402F82 0%, #402F82 18%, #3C3886 35%, #305090 54%, #1D78A1 72%, #06A9B6 88%, #06A9B6 100%)',
    },
  ];

  summaryItems: SummaryItem[] = [
    {
      title: 'زوار اليوم',
      value: 48,
      icon: 'people-outline',
      className: 'total',
    },
    {
      title: 'تم تسجيل الدخول',
      value: 36,
      icon: 'checkmark-circle-outline',
      className: 'completed',
    },
    {
      title: 'لم يتم تسجيل الدخول',
      value: 12,
      icon: 'close-circle-outline',
      className: 'pending',
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly navController: NavController,
  ) {
    addIcons({
      notificationsOutline,
      personCircleOutline,
      qrCodeOutline,
      createOutline,
      peopleOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
          shieldCheckmarkOutline,
      appsOutline,
      storefrontOutline,
    });
  }

  ngOnInit(): void {
    this.startSlider();
  }

  ngOnDestroy(): void {
    this.stopSlider();
  }

  startSlider(): void {
    this.stopSlider();
    this.sliderTimer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.sliderItems.length;
    }, 4500);
  }

  stopSlider(): void {
    if (this.sliderTimer) {
      clearInterval(this.sliderTimer);
    }
  }

  selectSlide(index: number): void {
    this.currentSlide = index;
    this.startSlider();
  }

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  openNotifications(): void {
    void this.navController.navigateForward('/notifications', { animated: true });
  }

  openQrScanner(): void {
    this.navController.navigateForward('/qr-scanner', { animated: false });
  }

  openManualRegistration(): void {
    this.navController.navigateForward('/add-visitor', { animated: true });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonIcon,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.html',
  styleUrls: ['./qr-scanner.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon],
})
export class QrScanner implements OnInit, OnDestroy {
  private scanTimer?: ReturnType<typeof setTimeout>;
  constructor(private readonly navController: NavController) {
    addIcons({ closeOutline });
  }

  ngOnInit(): void {
    // يجعل خلفية واجهة Ionic شفافة حتى يظهر بث الكاميرا خلف حدود المسح.
    document.body.classList.add('qr-scanner-active');
    // محاكاة قراءة QR في النسخة التجريبية؛ يستبدل لاحقًا بنتيجة الماسح الحقيقية.
    this.scanTimer = setTimeout(() => this.handleScannedVisitor(), 1800);
  }

  ngOnDestroy(): void {
    document.body.classList.remove('qr-scanner-active');
    if (this.scanTimer) clearTimeout(this.scanTimer);
  }

  closeScanner(): void {
    if (this.scanTimer) clearTimeout(this.scanTimer);
    this.navController.navigateRoot('/tabs/home', { animated: false });
  }

  private handleScannedVisitor(): void {
    this.navController.navigateForward('/confirm-visit', {
      animated: true,
      state: {
        visitor: {
          fullName: 'سارة أحمد',
          idNumber: '1045782342',
          mobile: '05XXXXXXXX',
          department: 'إدارة خدمة العملاء',
          visitReason: 'مراجعة معاملة'
        }
      }
    });
  }
}

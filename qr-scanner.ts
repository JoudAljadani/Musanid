import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppointmentsService } from '../../services/appointments';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.html',
  styleUrls: ['./qr-scanner.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QrScanner {
  qrInputToken: string = '';

  constructor(
    private appointmentsService: AppointmentsService,
    private router: Router
  ) {}

  // دالة المسح التلقائي أو عند قراءة الـ QR
  onScanSuccess(qrToken: string) {
    try {
      const appointment = this.appointmentsService.getAppointmentByQrToken(qrToken);
      this.router.navigate(['/confirm-visit'], { queryParams: { id: appointment.id } });
    } catch (error: any) {
      alert('خطأ في الـ QR: ' + error.message);
    }
  }

  // الدالة المُستدعات من زر الإغلاق في كود HTML الخص بك
  closeScanner() {
    this.router.navigate(['/home']);
  }
}
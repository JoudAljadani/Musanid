import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentsService, Appointment } from '../../services/appointments';

@Component({
  selector: 'app-confirm-visit',
  templateUrl: './confirm-visit.html',
  styleUrls: ['./confirm-visit.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfirmVisitPage implements OnInit {
  appointment?: Appointment;
  employeeUuid: string = 'EMP-12345-UUID'; // UUID الموظف الذي نفذ العملية

  // الكائن المطابق لكود الـ HTML الخاص بكِ
  visitor = {
    fullName: 'أحمد علي',
    idNumber: '1098765432',
    reference: 'REF-9921',
    department: 'إدارة التحول الرقمي',
    visitReason: 'مراجعة طلب مساند',
    visitDate: '2026-08-08',
    visitTime: '10:00 AM'
  };

  initials: string = 'أع';

  constructor(
    private route: ActivatedRoute,
    private appointmentsService: AppointmentsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const appId = params['id'];
      if (appId) {
        try {
          // جلب الموعد وتحديث بيانات العرض
          this.appointment = this.appointmentsService.getAppointmentByQrToken(appId);
          if (this.appointment) {
            this.visitor.fullName = this.appointment.visitorName;
            this.visitor.idNumber = this.appointment.visitorId;
            this.visitor.reference = this.appointment.id;
            this.visitor.visitDate = this.appointment.date;
            this.visitor.visitTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // حساب الأحرف الأولى للاسم (Initials)
            const names = this.visitor.fullName.trim().split(' ');
            if (names.length >= 2) {
              this.initials = names[0][0] + names[1][0];
            } else if (names.length === 1) {
              this.initials = names[0].substring(0, 2);
            }
          }
        } catch (e) {
          // في حال كان الزائر مضافاً يدوياً بدون QR
          this.visitor.reference = appId;
        }
      }
    });
  }

  // الدالة المُستدعاة عند الضغط على "تأكيد تسجيل الدخول"
  goToSuccess() {
    if (this.appointment) {
      try {
        // تحديث حالة الموعد إلى checked_in وحفظ UUID الموظف
        this.appointmentsService.checkInAppointment(this.appointment.id, this.employeeUuid);
      } catch (e) {
        console.log(e);
      }
    }
    // التوجيه لصفحة النجاح
    this.router.navigate(['/visit-success']);
  }

  // الدالة المُستدعاة عند الضغط على "إلغاء" أو أزرار العودة
  goBack() {
    this.router.navigate(['/qr-scanner']);
  }
}
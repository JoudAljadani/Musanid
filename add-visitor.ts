import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppointmentsService } from '../../services/appointments';

@Component({
  selector: 'app-add-visitor',
  templateUrl: './add-visitor.html',
  styleUrls: ['./add-visitor.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddVisitorPage {
  // كائن النموذج المطابق لـ [(ngModel)]="form..."
  form = {
    fullName: '',
    idNumber: '',
    mobile: '',
    department: '',
    visitReason: ''
  };

  // مرافق الزائر
  companion = {
    name: '',
    idNumber: ''
  };

  // العلم الخاص بإظهار نموذج المرافق
  showCompanionFormFlag: boolean = false;

  constructor(
    private appointmentsService: AppointmentsService,
    private router: Router
  ) {}

  // التحقق من اكتمال البيانات الأساسية لفك تعطيل الزر [disabled]="!isValid"
  get isValid(): boolean {
    return !!(
      this.form.fullName.trim() &&
      this.form.idNumber.trim() &&
      this.form.mobile.trim() &&
      this.form.department &&
      this.form.visitReason
    );
  }

  // الدالة المُستدعاة عند الضغط على "متابعة تسجيل الزيارة"
  goToConfirm() {
    if (!this.isValid) return;

    try {
      const companionData = (this.showCompanionFormFlag && this.companion.name)
        ? { name: this.companion.name, nationalId: this.companion.idNumber }
        : undefined;

      const newApp = this.appointmentsService.addManualAppointment({
        visitorName: this.form.fullName,
        visitorId: this.form.idNumber,
        date: new Date().toISOString().substring(0, 10),
        companion: companionData
      });

      this.router.navigate(['/confirm-visit'], { queryParams: { id: newApp.id } });
    } catch (error: any) {
      alert('حدث خطأ أثناء حفظ الزيارة: ' + error.message);
    }
  }

  // الدالة المُستدعاة عند الضغط على زر العودة
  goBack() {
    this.router.navigate(['/home']);
  }
}
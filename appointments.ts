import { Injectable } from '@angular/core';

export interface Companion {
  name: string;
  nationalId?: string;
}

export interface Appointment {
  id: string;
  qrToken: string;
  visitorName: string;
  visitorId: string;
  date: string;
  status: 'pending' | 'checked_in' | 'cancelled';
  checkInTime?: string;
  processedByUuid?: string; // UUID الموظف الذي نفذ العملية
  companion?: Companion;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  // ==========================================
  // ===== READ, SEARCH AND DASHBOARD =====
  // ==========================================
  // (هذا القسم مخصص للشخص الآخر - لا يتم تعديله)


  // ==========================================
  // ===== MANUAL ENTRY, COMPANIONS AND QR =====
  // ==========================================

  // قائمة مؤقتة لتخزين وتجربة البيانات
  private appointments: Appointment[] = [
    {
      id: '1',
      qrToken: 'valid-qr-123',
      visitorName: 'أحمد علي',
      visitorId: '1098765432',
      date: '2026-08-08',
      status: 'pending'
    }
  ];

  constructor() {}

  /**
   * 1. إضافة زيارة يدوياً (مع إضافة مرافق واحد عند وجوده)
   */
  addManualAppointment(visitorData: {
    visitorName: string;
    visitorId: string;
    date: string;
    companion?: Companion;
  }): Appointment {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      qrToken: 'QR-' + Math.random().toString(36).substring(2, 9),
      visitorName: visitorData.visitorName,
      visitorId: visitorData.visitorId,
      date: visitorData.date,
      status: 'pending',
      companion: visitorData.companion ? { ...visitorData.companion } : undefined
    };

    this.appointments.push(newAppointment);
    return newAppointment;
  }

  /**
   * 2. جلب بيانات الموعد بعد مسح الـ QR وقراءة qr_token
   * والتحقق من وجود الموعد وأنه لم يسجل سابقاً
   */
  getAppointmentByQrToken(qrToken: string): Appointment {
    const appointment = this.appointments.find(app => app.qrToken === qrToken);

    if (!appointment) {
      throw new Error('رمز QR غير صالح أو الموعد غير موجود');
    }

    if (appointment.status === 'checked_in') {
      throw new Error('تم تسجيل الدخول لهذا الموعد سابقاً');
    }

    return appointment;
  }

  /**
   * 3. تحديث حالة الموعد إلى checked_in
   * وحفظ وقت تسجيل الدخول وحفظ UUID الموظف
   */
  checkInAppointment(appointmentId: string, employeeUuid: string): Appointment {
    const appointment = this.appointments.find(app => app.id === appointmentId);

    if (!appointment) {
      throw new Error('الموعد غير موجود');
    }

    if (appointment.status === 'checked_in') {
      throw new Error('الموعد تم تسجيله سابقاً');
    }

    // تسجيل البيانات والتحديث
    appointment.status = 'checked_in';
    appointment.checkInTime = new Date().toISOString();
    appointment.processedByUuid = employeeUuid;

    return appointment;
  }
}
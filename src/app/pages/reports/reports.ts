import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Notifications } from '../../services/notifications';
import {
  AlertController,
  ToastController
} from '@ionic/angular';

import {
  IonButton,
  IonContent,
  IonIcon,
  IonModal
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  peopleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  shareSocialOutline,
  closeOutline,
  sendOutline,
  documentTextOutline,
  gridOutline,
  chevronBackOutline,
  chevronDownOutline
} from 'ionicons/icons';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

import {
  Reports as ReportsService,
  ReportDepartment,
  ReportRecipient,
  ReportResult,
  ReportVisitor
} from '../../services/reports';

type Period = 'today' | 'week' | 'month' | 'custom';

interface Supervisor {
  id: string;
  name: string;
  title: string;
  email: string;
}

interface VisitorRow {
  name: string;
  idNumber: string;
  reason: string;
  appointmentDate: string;
  appointmentTime: string;
  departmentName: string;
  checkedIn: boolean;
}

interface Department {
  name: string;
  visits: number;
  percentage: number;
  className: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonIcon,
    IonContent,
    IonModal
  ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class ReportsPage implements OnInit {

  selectedPeriod: Period = 'today';

  readonly todayDate = this.formatDate(new Date());

  startDate = this.todayDate;
  endDate = this.todayDate;

  isCustomDateModalOpen = false;
  isShareModalOpen = false;
  isSupervisorConfirmationOpen = false;
  isSendingReport = false;
  isSupervisorMenuOpen = false;
  isLoadingReport = false;

  selectedSupervisorId = '';

  supervisors: Supervisor[] = [];
  visitors: VisitorRow[] = [];

  totalVisits = 0;
  completedVisits = 0;
  incompleteVisits = 0;

  departments: Department[] = [];

  constructor(
    private readonly reportsService: ReportsService,
    private readonly alertController: AlertController,
    private readonly toastController: ToastController,
      private readonly notificationsService: Notifications

  ) {
    addIcons({
      peopleOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      shareSocialOutline,
      closeOutline,
      sendOutline,
      documentTextOutline,
      gridOutline,
      chevronBackOutline,
      chevronDownOutline
    });
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.loadTodayReport(),
      this.loadReportRecipients()
    ]);
  }

  get selectedSupervisor(): Supervisor | undefined {
    return this.supervisors.find(
      (supervisor) =>
        supervisor.id === this.selectedSupervisorId
    );
  }

  async selectPeriod(period: Period): Promise<void> {
    if (period === 'custom') {
      this.openCustomDateModal();
      return;
    }

    this.selectedPeriod = period;

    if (period === 'today') {
      await this.loadTodayReport();
      return;
    }

    if (period === 'week') {
      await this.loadWeekReport();
      return;
    }

    await this.loadMonthReport();
  }

  async loadTodayReport(): Promise<void> {
    await this.loadReport(
      () => this.reportsService.getTodayReport()
    );
  }

  async loadWeekReport(): Promise<void> {
    await this.loadReport(
      () => this.reportsService.getWeekReport()
    );
  }

  async loadMonthReport(): Promise<void> {
    await this.loadReport(
      () => this.reportsService.getMonthReport()
    );
  }

  async loadCustomReport(): Promise<void> {
    await this.loadReport(
      () =>
        this.reportsService.getCustomReport(
          this.startDate,
          this.endDate
        )
    );
  }

  private async loadReport(
    request: () => Promise<ReportResult>
  ): Promise<void> {
    if (this.isLoadingReport) {
      return;
    }

    this.isLoadingReport = true;

    try {
      const report = await request();
      this.applyReportResult(report);
    } catch (error) {
      console.error('Report loading error:', error);

      await this.showAlert(
        'خطأ',
        this.getErrorMessage(
          error,
          'تعذر تحميل بيانات التقرير.'
        )
      );
    } finally {
      this.isLoadingReport = false;
    }
  }

  private applyReportResult(
    report: ReportResult
  ): void {
    this.startDate = report.startDate;
    this.endDate = report.endDate;

    this.totalVisits = report.totalVisits;
    this.completedVisits = report.completedVisits;
    this.incompleteVisits = report.incompleteVisits;

    this.departments = report.departments.map(
      (department: ReportDepartment): Department => ({
        name: department.name,
        visits: department.visits,
        percentage: department.percentage,
        className: department.className
      })
    );

    this.visitors = report.visitors.map(
      (visitor: ReportVisitor): VisitorRow => ({
        name: visitor.name,
        idNumber: this.maskNationalId(
          visitor.idNumber
        ),
        reason: visitor.reason,
        appointmentDate: visitor.appointmentDate,
        appointmentTime: visitor.appointmentTime,
        departmentName: visitor.departmentName,
        checkedIn: visitor.checkedIn
      })
    );
  }
private async loadReportRecipients(): Promise<void> {
  try {
    const recipients =
      await this.reportsService.getReportRecipients();

    this.supervisors = recipients.map(
      (recipient: ReportRecipient): Supervisor => ({
        id: recipient.id,
        name: recipient.fullName,
        title: recipient.email,
        email: recipient.email
      })
    );

    if (this.supervisors.length > 0) {
      this.selectedSupervisorId =
        this.supervisors[0].id;
    }
  } catch (error) {
    console.error(
      'Report recipients loading error:',
      error
    );

    this.supervisors = [];
  }
}

  async resetToToday(): Promise<void> {
    this.selectedPeriod = 'today';
    this.startDate = this.todayDate;
    this.endDate = this.todayDate;

    await this.loadTodayReport();
  }

  toggleSupervisorMenu(): void {
    this.isSupervisorMenuOpen =
      !this.isSupervisorMenuOpen;
  }

  chooseSupervisor(id: string): void {
    this.selectedSupervisorId = id;
    this.isSupervisorMenuOpen = false;
  }

  formatDisplayDate(value: string): string {
    if (!value) {
      return '';
    }

    const [year, month, day] = value.split('-');

    return `${day}-${month}-${year}`;
  }

  openCustomDateModal(): void {
    this.isCustomDateModalOpen = true;
  }

  closeCustomDateModal(): void {
    this.isCustomDateModalOpen = false;
  }

  async applyCustomDate(): Promise<void> {
    if (!this.startDate || !this.endDate) {
      await this.showAlert(
        'تنبيه',
        'اختر تاريخ البداية وتاريخ النهاية.'
      );

      return;
    }

    if (
      this.startDate > this.todayDate ||
      this.endDate > this.todayDate
    ) {
      await this.showAlert(
        'تنبيه',
        'لا يمكن اختيار تاريخ مستقبلي في التقارير.'
      );

      return;
    }

    if (this.startDate > this.endDate) {
      await this.showAlert(
        'تنبيه',
        'تاريخ البداية يجب أن يكون قبل تاريخ النهاية.'
      );

      return;
    }

    this.selectedPeriod = 'custom';
    this.closeCustomDateModal();

    await this.loadCustomReport();
  }

  openShareModal(): void {
    this.isShareModalOpen = true;
  }

  closeShareModal(): void {
    this.isShareModalOpen = false;
  }

  openSupervisorConfirmation(): void {
    this.closeShareModal();

    window.setTimeout(() => {
      this.isSupervisorConfirmationOpen = true;
    }, 200);
  }

  closeSupervisorConfirmation(): void {
    this.isSupervisorConfirmationOpen = false;
    this.isSupervisorMenuOpen = false;
  }

async confirmSupervisorSend(): Promise<void> {
  if (this.isSendingReport) {
    return;
  }

  const supervisor = this.selectedSupervisor;

  if (!supervisor) {
    await this.showAlert(
      'تنبيه',
      'يرجى اختيار مستلم التقرير.'
    );

    return;
  }

  this.isSendingReport = true;

  try {
    await this.wait(700);

    await this.notificationsService.createNotification(
      'تم تجهيز التقرير',
      `تم تجهيز تقرير الزيارات للإرسال إلى ${supervisor.name}.`
    );

    this.closeSupervisorConfirmation();

    const toast =
      await this.toastController.create({
        message:
          `تم تجهيز التقرير للإرسال إلى ${supervisor.name}`,
        duration: 2800,
        position: 'top',
        icon: 'checkmark-circle-outline',
        cssClass: 'success-toast-soft'
      });

    await toast.present();
  } catch (error) {
    console.error(
      'Report notification error:',
      error
    );

    await this.showAlert(
      'خطأ',
      'تعذر إنشاء إشعار التقرير.'
    );
  } finally {
    this.isSendingReport = false;
  }
}
  async downloadPdf(): Promise<void> {
    try {
      this.closeShareModal();

      await this.wait(350);

      const reportElement =
        document.querySelector(
          '.page-container'
        ) as HTMLElement | null;

      if (!reportElement) {
        await this.showAlert(
          'خطأ',
          'تعذر العثور على محتوى التقرير.'
        );

        return;
      }

      const canvas = await html2canvas(
        reportElement,
        {
          scale: 2,
          useCORS: true,
          backgroundColor: '#f5f7fa',
          logging: false
        }
      );

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 10;
      const printableWidth =
        pageWidth - margin * 2;

      const printableHeight =
        pageHeight - margin * 2;

      const pixelsPerMillimeter =
        canvas.width / printableWidth;

      const pageHeightInPixels =
        Math.floor(
          printableHeight *
          pixelsPerMillimeter
        );

      let currentPosition = 0;
      let pageNumber = 0;

      while (
        currentPosition < canvas.height
      ) {
        const sliceHeight = Math.min(
          pageHeightInPixels,
          canvas.height - currentPosition
        );

        const pageCanvas =
          document.createElement('canvas');

        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;

        const context =
          pageCanvas.getContext('2d');

        if (!context) {
          throw new Error(
            'تعذر إنشاء صفحة PDF.'
          );
        }

        context.fillStyle = '#f5f7fa';

        context.fillRect(
          0,
          0,
          pageCanvas.width,
          pageCanvas.height
        );

        context.drawImage(
          canvas,
          0,
          currentPosition,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight
        );

        const pageImage =
          pageCanvas.toDataURL(
            'image/png',
            1
          );

        const imageHeight =
          sliceHeight /
          pixelsPerMillimeter;

        if (pageNumber > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          pageImage,
          'PNG',
          margin,
          margin,
          printableWidth,
          imageHeight
        );

        currentPosition += sliceHeight;
        pageNumber++;
      }

      pdf.save(
        this.createFileName('pdf')
      );
    } catch (error) {
      console.error('PDF error:', error);

      await this.showAlert(
        'خطأ',
        'تعذر إنشاء ملف PDF، حاول مرة أخرى.'
      );
    }
  }

  async downloadExcel(): Promise<void> {
    try {
      const summaryData = [
        ['تقرير أداء الزيارات', ''],
        ['من تاريخ', this.startDate],
        ['إلى تاريخ', this.endDate],
        ['إجمالي الزيارات', this.totalVisits],
        [
          'تم تسجيل الدخول',
          this.completedVisits
        ],
        [
          'لم يتم تسجيل الدخول',
          this.incompleteVisits
        ]
      ];

      const departmentsData = [
        ['الإدارة', 'عدد الزيارات'],
        ...this.departments.map(
          (department) => [
            department.name,
            department.visits
          ]
        )
      ];

      const visitorsData = [
        [
          'اسم الزائر',
          'رقم الهوية',
          'سبب الزيارة',
          'الإدارة',
          'تاريخ الموعد',
          'وقت الموعد',
          'حالة تسجيل الدخول'
        ],
        ...this.visitors.map(
          (visitor) => [
            visitor.name,
            visitor.idNumber,
            visitor.reason,
            visitor.departmentName,
            visitor.appointmentDate,
            visitor.appointmentTime,
            visitor.checkedIn
              ? 'تم تسجيل الدخول'
              : 'لم يتم تسجيل الدخول'
          ]
        )
      ];

      const summarySheet =
        XLSX.utils.aoa_to_sheet(
          summaryData
        );

      const departmentsSheet =
        XLSX.utils.aoa_to_sheet(
          departmentsData
        );

      const visitorsSheet =
        XLSX.utils.aoa_to_sheet(
          visitorsData
        );

      summarySheet['!cols'] = [
        { wch: 28 },
        { wch: 20 }
      ];

      departmentsSheet['!cols'] = [
        { wch: 32 },
        { wch: 18 }
      ];

      visitorsSheet['!cols'] = [
        { wch: 24 },
        { wch: 20 },
        { wch: 30 },
        { wch: 28 },
        { wch: 18 },
        { wch: 16 },
        { wch: 24 }
      ];

      summarySheet['!dir'] = 'rtl';
      departmentsSheet['!dir'] = 'rtl';
      visitorsSheet['!dir'] = 'rtl';

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        summarySheet,
        'ملخص التقرير'
      );

      XLSX.utils.book_append_sheet(
        workbook,
        departmentsSheet,
        'الإدارات'
      );

      XLSX.utils.book_append_sheet(
        workbook,
        visitorsSheet,
        'تفاصيل الزوار'
      );

      XLSX.writeFile(
        workbook,
        this.createFileName('xlsx')
      );

      this.closeShareModal();
    } catch (error) {
      console.error(
        'Excel error:',
        error
      );

      await this.showAlert(
        'خطأ',
        'تعذر إنشاء ملف Excel، حاولي مرة أخرى.'
      );
    }
  }

  private maskNationalId(
    nationalId: string
  ): string {
    if (!nationalId || nationalId === '—') {
      return '—';
    }

    if (nationalId.length <= 4) {
      return nationalId;
    }

    const firstTwo =
      nationalId.slice(0, 2);

    const lastTwo =
      nationalId.slice(-2);

    const hiddenLength =
      nationalId.length - 4;

    return (
      firstTwo +
      '*'.repeat(hiddenLength) +
      lastTwo
    );
  }

  private async showAlert(
    header: string,
    message: string
  ): Promise<void> {
    const alert =
      await this.alertController.create({
        header,
        message,
        buttons: ['إغلاق'],
        cssClass: 'reports-alert'
      });

    await alert.present();
  }

  private getErrorMessage(
    error: unknown,
    fallbackMessage: string
  ): string {
    if (
      error instanceof Error &&
      error.message
    ) {
      return error.message;
    }

    return fallbackMessage;
  }

  private createFileName(
    extension: 'pdf' | 'xlsx'
  ): string {
    return (
      `تقرير-الزيارات-` +
      `${this.startDate}-إلى-` +
      `${this.endDate}.${extension}`
    );
  }

  private formatDate(
    date: Date
  ): string {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private wait(
    milliseconds: number
  ): Promise<void> {
    return new Promise(
      (resolve) => {
        window.setTimeout(
          resolve,
          milliseconds
        );
      }
    );
  }
}
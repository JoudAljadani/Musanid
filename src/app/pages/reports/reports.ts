import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  ToastController
} from '@ionic/angular';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonModal
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  notificationsOutline,
  peopleOutline,
  checkmarkCircleOutline,
  timeOutline,
  closeCircleOutline,
  shareSocialOutline,
  closeOutline,
  home,
  notifications,
  pieChart,
  headset,
  sendOutline,
  documentTextOutline,
  gridOutline,
  chevronBackOutline,
  chevronDownOutline
} from 'ionicons/icons';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

type Period = 'today' | 'week' | 'month' | 'custom';

interface Supervisor { id: string; name: string; title: string; }

interface VisitorRow { name: string; idNumber: string; reason: string; }

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
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonModal
  ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class ReportsPage {

  selectedPeriod: Period = 'today';

  readonly todayDate = this.formatDate(new Date());

  startDate = this.todayDate;
  endDate = this.todayDate;

  isCustomDateModalOpen = false;
  isShareModalOpen = false;
  isSupervisorConfirmationOpen = false;
  isSendingReport = false;
  isSupervisorMenuOpen = false;
  selectedSupervisorId = '';
  readonly supervisors: Supervisor[] = [
    { id: 'security-supervisor', name: 'أحمد محمد', title: 'مشرف الأمن' },
    { id: 'security-manager', name: 'خالد عبدالله', title: 'مدير الأمن' }
  ];

  get selectedSupervisor(): Supervisor | undefined { return this.supervisors.find((item) => item.id === this.selectedSupervisorId); }

  readonly visitors: VisitorRow[] = [
    { name: 'سارة أحمد', idNumber: '10******42', reason: 'مراجعة معاملة' },
    { name: 'محمد علي', idNumber: '10******18', reason: 'موعد مع الإدارة' },
    { name: 'نورة خالد', idNumber: '10******73', reason: 'تسليم مستندات' }
  ];

  totalVisits = 48;
  completedVisits = 30;
  incompleteVisits = 18;

  departments: Department[] = [
    {
      name: 'إدارة خدمة العملاء',
      visits: 84,
      percentage: 100,
      className: 'purple'
    },
    {
      name: 'إدارة التراخيص',
      visits: 52,
      percentage: 62,
      className: 'turquoise'
    },
    {
      name: 'إدارة المشاريع',
      visits: 38,
      percentage: 45,
      className: 'blue'
    }
  ];

  constructor(
  private router: Router,
  private alertController: AlertController,
  private toastController: ToastController
) {
    addIcons({
      notificationsOutline,
      peopleOutline,
      checkmarkCircleOutline,
      timeOutline,
  closeCircleOutline,
      shareSocialOutline,
      closeOutline,
      home,
      notifications,
      pieChart,
      headset,
      sendOutline,
      documentTextOutline,
      gridOutline,
      chevronBackOutline,
      chevronDownOutline
    });
  }

  selectPeriod(period: Period): void {
    if (period === 'custom') {
      this.openCustomDateModal();
      return;
    }

    this.selectedPeriod = period;

    const today = new Date();
    const start = new Date(today);

    if (period === 'today') {
      this.startDate = this.todayDate;
      this.endDate = this.todayDate;
    }

    if (period === 'week') {
      start.setDate(today.getDate() - 6);
      this.startDate = this.formatDate(start);
      this.endDate = this.todayDate;
    }

    if (period === 'month') {
      start.setDate(1);
      this.startDate = this.formatDate(start);
      this.endDate = this.todayDate;
    }
  }


  resetToToday(): void {
    this.selectedPeriod = 'today';
    this.startDate = this.todayDate;
    this.endDate = this.todayDate;
  }

  toggleSupervisorMenu(): void {
    this.isSupervisorMenuOpen = !this.isSupervisorMenuOpen;
  }

  chooseSupervisor(id: string): void {
    this.selectedSupervisorId = id;
    this.isSupervisorMenuOpen = false;
  }

  formatDisplayDate(value: string): string {
    if (!value) return '';
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
    if (this.isSendingReport) return;

    if (!this.selectedSupervisorId) {
      await this.showAlert('تنبيه', 'يرجى اختيار المشرف قبل إرسال التقرير.');
      return;
    }

    this.isSendingReport = true;
    await this.wait(900);
    const supervisor = this.supervisors.find((item) => item.id === this.selectedSupervisorId);
    this.isSendingReport = false;
    this.closeSupervisorConfirmation();
    const toast = await this.toastController.create({
      message: `تم إرسال التقرير إلى ${supervisor?.name ?? 'المشرف'} بنجاح`,
      duration: 2800,
      position: 'top', icon: 'checkmark-circle-outline', cssClass: 'success-toast-soft'
    });
    await toast.present();
  }

  async downloadPdf(): Promise<void> {
    try {
      this.closeShareModal();

      await this.wait(350);

      const reportElement =
        document.querySelector('.page-container') as HTMLElement | null;

      if (!reportElement) {
        await this.showAlert(
          'خطأ',
          'تعذر العثور على محتوى التقرير.'
        );
        return;
      }

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f5f7fa',
        logging: false
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const printableWidth = pageWidth - (margin * 2);
      const printableHeight = pageHeight - (margin * 2);

      const pixelsPerMillimeter = canvas.width / printableWidth;
      const pageHeightInPixels =
        Math.floor(printableHeight * pixelsPerMillimeter);

      let currentPosition = 0;
      let pageNumber = 0;

      while (currentPosition < canvas.height) {
        const sliceHeight = Math.min(
          pageHeightInPixels,
          canvas.height - currentPosition
        );

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;

        const context = pageCanvas.getContext('2d');

        if (!context) {
          throw new Error('تعذر إنشاء صفحة PDF');
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

        const pageImage = pageCanvas.toDataURL(
          'image/png',
          1
        );

        const imageHeight =
          sliceHeight / pixelsPerMillimeter;

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

      pdf.save(this.createFileName('pdf'));
    } catch (error) {
      console.error('PDF error:', error);

      await this.showAlert(
        'خطأ',
        'تعذر إنشاء ملف PDF، حاولي مرة أخرى.'
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
        ['الزيارات المكتملة', this.completedVisits],
        ['الزيارات غير المكتملة', this.incompleteVisits]
      ];

      const departmentsData = [
        ['الإدارة', 'عدد الزيارات'],
        ...this.departments.map((department) => [
          department.name,
          department.visits
        ])
      ];

      const summarySheet =
        XLSX.utils.aoa_to_sheet(summaryData);

      const departmentsSheet =
        XLSX.utils.aoa_to_sheet(departmentsData);

      summarySheet['!cols'] = [
        { wch: 26 },
        { wch: 18 }
      ];

      departmentsSheet['!cols'] = [
        { wch: 30 },
        { wch: 18 }
      ];

      summarySheet['!dir'] = 'rtl';
      departmentsSheet['!dir'] = 'rtl';

      const workbook = XLSX.utils.book_new();

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

      XLSX.writeFile(
        workbook,
        this.createFileName('xlsx')
      );

      this.closeShareModal();
    } catch (error) {
      console.error('Excel error:', error);

      await this.showAlert(
        'خطأ',
        'تعذر إنشاء ملف Excel، حاولي مرة أخرى.'
      );
    }
  }

  openNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  private async showAlert(
    header: string,
    message: string
  ): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['إغلاق'],
      cssClass: 'reports-alert'
    });

    await alert.present();
  }

  private createFileName(
    extension: 'pdf' | 'xlsx'
  ): string {
    return `تقرير-الزيارات-${this.startDate}-إلى-${this.endDate}.${extension}`;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(resolve, milliseconds);
    });
  }
}
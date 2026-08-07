import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase';

export interface ReportVisitor {
  id: string;
  name: string;
  idNumber: string;
  reason: string;
  appointmentDate: string;
  appointmentTime: string;
  departmentName: string;
  checkedIn: boolean;
  checkedInAt: string | null;
}

export interface ReportDepartment {
  name: string;
  visits: number;
  percentage: number;
  className: string;
}

export interface ReportRecipient {
  id: string;
  fullName: string;
  email: string;
}

export interface ReportResult {
  startDate: string;
  endDate: string;
  totalVisits: number;
  completedVisits: number;
  incompleteVisits: number;
  departments: ReportDepartment[];
  visitors: ReportVisitor[];
}

interface DepartmentRelation {
  name: string;
}

interface AppointmentRecord {
  id: string;
  visitor_name: string;
  national_id: string;
  visit_reason: string;
  appointment_date: string;
  appointment_time: string;
  status: string | null;
  checked_in_at: string | null;
  department_id: string;
  departments:
    | DepartmentRelation
    | DepartmentRelation[]
    | null;
}

interface RecipientRecord {
  id: string;
  full_name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class Reports {
  private readonly departmentColors = [
    'purple',
    'turquoise',
    'blue',
  ];

  constructor(
    private readonly supabaseService: SupabaseService
  ) {}

  async getTodayReport(): Promise<ReportResult> {
    const today = this.formatDate(new Date());

    return this.getReportByDateRange(today, today);
  }

  async getWeekReport(): Promise<ReportResult> {
    const today = new Date();
    const startDate = new Date(today);

    startDate.setDate(today.getDate() - 6);

    return this.getReportByDateRange(
      this.formatDate(startDate),
      this.formatDate(today)
    );
  }

  async getMonthReport(): Promise<ReportResult> {
    const today = new Date();

    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    return this.getReportByDateRange(
      this.formatDate(firstDayOfMonth),
      this.formatDate(today)
    );
  }

  async getCustomReport(
    startDate: string,
    endDate: string
  ): Promise<ReportResult> {
    if (!startDate || !endDate) {
      throw new Error(
        'يجب تحديد تاريخ البداية وتاريخ النهاية.'
      );
    }

    if (startDate > endDate) {
      throw new Error(
        'تاريخ البداية يجب أن يكون قبل تاريخ النهاية.'
      );
    }

    const today = this.formatDate(new Date());

    if (startDate > today || endDate > today) {
      throw new Error(
        'لا يمكن اختيار تاريخ مستقبلي في التقارير.'
      );
    }

    return this.getReportByDateRange(
      startDate,
      endDate
    );
  }

  async getReportByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ReportResult> {
    const { data, error } =
      await this.supabaseService.client
        .from('appointments')
        .select(`
          id,
          visitor_name,
          national_id,
          visit_reason,
          appointment_date,
          appointment_time,
          status,
          checked_in_at,
          department_id,
          departments (
            name
          )
        `)
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate)
        .order('appointment_date', {
          ascending: false,
        })
        .order('appointment_time', {
          ascending: false,
        });

    if (error) {
      console.error(
        'Error loading report appointments:',
        error
      );

      throw new Error(
        'تعذر تحميل بيانات التقرير.'
      );
    }

    const appointments =
      (data ?? []) as unknown as AppointmentRecord[];

    const visitors = appointments.map(
      (appointment): ReportVisitor => {
        const departmentName =
          this.getDepartmentName(
            appointment.departments
          );

        return {
          id: appointment.id,
          name:
            appointment.visitor_name ||
            'زائر غير معروف',
          idNumber:
            appointment.national_id || '—',
          reason:
            appointment.visit_reason || '—',
          appointmentDate:
            appointment.appointment_date,
          appointmentTime:
            appointment.appointment_time,
          departmentName,
          checkedIn:
            appointment.checked_in_at !== null,
          checkedInAt:
            appointment.checked_in_at,
        };
      }
    );

    const completedVisits = visitors.filter(
      (visitor) => visitor.checkedIn
    ).length;

    const totalVisits = visitors.length;

    const incompleteVisits =
      totalVisits - completedVisits;

    const departments =
      this.buildDepartmentStatistics(visitors);

    return {
      startDate,
      endDate,
      totalVisits,
      completedVisits,
      incompleteVisits,
      departments,
      visitors,
    };
  }

  async getReportRecipients(): Promise<
    ReportRecipient[]
  > {
    const { data, error } =
      await this.supabaseService.client
        .from('report_recipients')
        .select(`
          id,
          full_name,
          email
        `)
        .order('full_name', {
          ascending: true,
        });

    if (error) {
      console.error(
        'Error loading report recipients:',
        error
      );

      throw new Error(
        'تعذر تحميل مستلمي التقرير.'
      );
    }

    const recipients =
      (data ?? []) as RecipientRecord[];

    return recipients.map(
      (recipient): ReportRecipient => ({
        id: recipient.id,
        fullName: recipient.full_name,
        email: recipient.email,
      })
    );
  }

  private buildDepartmentStatistics(
    visitors: ReportVisitor[]
  ): ReportDepartment[] {
    const visitCounts = new Map<string, number>();

    for (const visitor of visitors) {
      const currentCount =
        visitCounts.get(visitor.departmentName) ?? 0;

      visitCounts.set(
        visitor.departmentName,
        currentCount + 1
      );
    }

    const sortedDepartments = Array.from(
      visitCounts.entries()
    ).sort((first, second) => second[1] - first[1]);

    const highestVisitCount =
      sortedDepartments[0]?.[1] ?? 0;

    return sortedDepartments.map(
      ([name, visits], index): ReportDepartment => ({
        name,
        visits,
        percentage:
          highestVisitCount === 0
            ? 0
            : Math.round(
                (visits / highestVisitCount) * 100
              ),
        className:
          this.departmentColors[
            index % this.departmentColors.length
          ],
      })
    );
  }

  private getDepartmentName(
    department:
      | DepartmentRelation
      | DepartmentRelation[]
      | null
  ): string {
    if (!department) {
      return 'إدارة غير محددة';
    }

    if (Array.isArray(department)) {
      return (
        department[0]?.name ??
        'إدارة غير محددة'
      );
    }

    return department.name || 'إدارة غير محددة';
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
}
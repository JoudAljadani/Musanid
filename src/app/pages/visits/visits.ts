import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, checkmarkCircleOutline, searchOutline, timeOutline } from 'ionicons/icons';

type VisitStatus = 'completed' | 'incomplete';
interface VisitRecord { reservation: string; idNumber: string; name: string; reason: string; date: string; time: string; status: VisitStatus; }

@Component({
  selector: 'app-visits', templateUrl: './visits.html', styleUrls: ['./visits.scss'], standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonInput],
})
export class Visits {
  searchTerm = '';
  selectedFilter: 'all' | VisitStatus = 'all';
  visits: VisitRecord[] = [
    { reservation: 'BK-2026-1048', idNumber: '10******42', name: 'سارة أحمد', reason: 'مراجعة معاملة', date: '04/08/2026', time: '09:15 ص', status: 'completed' },
    { reservation: 'BK-2026-1052', idNumber: '10******18', name: 'محمد علي', reason: 'موعد مع الإدارة', date: '04/08/2026', time: '10:30 ص', status: 'incomplete' },
    { reservation: 'BK-2026-1061', idNumber: '10******73', name: 'نورة خالد', reason: 'تسليم مستندات', date: '04/08/2026', time: '11:45 ص', status: 'completed' },
    { reservation: 'BK-2026-1067', idNumber: '10******29', name: 'عبدالله سالم', reason: 'استفسار عن خدمة', date: '04/08/2026', time: '01:00 م', status: 'incomplete' },
  ];
  constructor(){ addIcons({searchOutline, calendarOutline, checkmarkCircleOutline, timeOutline}); }
  setFilter(filter: 'all' | VisitStatus): void { this.selectedFilter = filter; }
  get filteredVisits(): VisitRecord[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.visits.filter(v => (this.selectedFilter === 'all' || v.status === this.selectedFilter) && (!term || v.idNumber.toLowerCase().includes(term)));
  }
}

import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  IonFooter
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-confirm-visit',
  templateUrl: './confirm-visit.html',
  styleUrls: ['./confirm-visit.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonIcon,
    IonFooter
  ]
})
export class ConfirmVisitPage implements OnInit {

  visitor = {
    fullName: 'فيصل عبدالعزيز الغامدي',
    idNumber: '1045782310',
    reference: 'JV-2026-38142',
    department: 'إدارة التحول الرقمي',
    visitReason: 'اجتماع',
    visitDate: '30 / 07 / 2026',
    visitTime: '10:30 صباحًا'
  };

  initials = '';

  constructor(private router: Router) { }

  ngOnInit() {
    const data = this.router.getCurrentNavigation()?.extras.state as any;

if (data?.visitor) {

  this.visitor = {
    ...this.visitor,
    ...data.visitor,
    reference: 'JV-' + Math.floor(100000 + Math.random() * 900000),
    visitDate: new Date().toLocaleDateString('ar-SA'),
    visitTime: new Date().toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };

}

this.generateInitials();
  }

  generateInitials() {
    const names = this.visitor.fullName.trim().split(' ');

    if (names.length >= 2) {
      this.initials = names[0][0] + ' ' + names[1][0];
    } else {
      this.initials = names[0][0];
    }
  }
goBack(){ void this.router.navigateByUrl('/add-visitor'); }
goToSuccess(){
  this.router.navigate(['/visit-success'],{
    state:{
      visitor:{
        fullName: this.visitor.fullName,
        department: this.visitor.department,
        visitTime: this.visitor.visitTime
      }
    }
  }
    
  );
}
}
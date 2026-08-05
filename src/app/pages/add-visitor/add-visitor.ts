import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonFooter
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-visitor',
  templateUrl: './add-visitor.html',
  styleUrls: ['./add-visitor.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonButton,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
          IonFooter
  ]
})
export class AddVisitorPage implements OnInit {

  showCompanionFormFlag = false;

  constructor(private router: Router) { }

  ngOnInit(): void {}

  goBack(): void { void this.router.navigateByUrl('/tabs/home'); }

  modeValue = 'manual';

  form = {
    fullName: '',
    idNumber: '',
    mobile: '',
    department: '',
    visitReason: '',
    hostEmployee: ''
  };

  departments = [
    'الإدارة العامة',
    'إدارة تقنية المعلومات',
    'إدارة الموارد البشرية',
    'إدارة خدمة العملاء'
  ];

  reasons = [
    'اجتماع',
    'تسليم مستندات',
    'مقابلة',
    'زيارة رسمية'
  ];

  companions: any[] = [];

  companionName = '';
  companionId = '';

  companionForm = false;

  scanningValue = false;

  mode() {
    return this.modeValue;
  }

  scanning() {
    return this.scanningValue;
  }

  showCompanionForm() {
    return this.companionForm;
  }

  setMode(value: any) {
    this.modeValue = value;
  }

  toggleCompanionForm() {
    this.companionForm = !this.companionForm;
  }

  addCompanion() {

    if (!this.companionName || !this.companionId) {
      return;
    }

    this.companions.push({
      fullName: this.companionName,
      idNumber: this.companionId
    });

    this.companionName = '';
    this.companionId = '';
    this.companionForm = false;
  }

  removeCompanion(index: number) {
    this.companions.splice(index, 1);
  }

  get isValid() {
    return (
      this.form.fullName &&
      this.form.idNumber &&
      this.form.mobile &&
      this.form.department &&
      this.form.visitReason
    );
  }

  goToConfirm() {

    this.router.navigate(['/confirm-visit'], {
      state: {
        visitor: {
          fullName: this.form.fullName,
          idNumber: this.form.idNumber,
          mobile: this.form.mobile,
          department: this.form.department,
          visitReason: this.form.visitReason,
          companions: this.companions
        }
      }
    });

  }

  submit() {
    console.log(this.form);
    console.log(this.companions);
  }

}
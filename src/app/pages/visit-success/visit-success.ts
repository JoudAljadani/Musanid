import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonFooter,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-visit-success',
  templateUrl: './visit-success.html',
  styleUrls: ['./visit-success.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonFooter,
    IonIcon
  ]
})
export class VisitSuccessPage implements OnInit {

  visitor = {
    fullName: '',
    department: '',
    visitTime: ''
  };

  permitNumber = '';

  constructor(private router: Router) { }

  ngOnInit() {

    const data = this.router.getCurrentNavigation()?.extras.state as any;

    if (data?.visitor) {

      this.visitor = data.visitor;

    }

    this.permitNumber = 'VP-' + Math.floor(10000 + Math.random() * 90000);

  }

  goHome() {

    this.router.navigate(['/add-visitor']);

  }

}
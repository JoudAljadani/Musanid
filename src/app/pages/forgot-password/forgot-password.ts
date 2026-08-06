import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  mailOutline,
} from 'ionicons/icons';

import { Auth } from '../../services/authentication';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonInput,
    IonButton,
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPasswordPage {

  email = '';
  sent = false;

  constructor(
    private router: Router,
    private auth: Auth
  ) {
    addIcons({
      arrowForwardOutline,
      mailOutline,
    });
  }

  goBack() {
    void this.router.navigateByUrl('/login');
  }

  async submit() {

    if (!this.email.trim()) {
      return;
    }

    const { error } = await this.auth.forgotPassword(this.email);

    if (!error) {
      this.sent = true;
    }

  }

}
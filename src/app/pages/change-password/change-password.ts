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
  lockClosedOutline,
} from 'ionicons/icons';

import { Auth } from '../../services/authentication';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonInput,
    IonButton,
  ],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.scss'],
})
export class ChangePasswordPage {

  current = '';
  next = '';
  confirm = '';
  saved = false;

  constructor(
    private router: Router,
    private auth: Auth
  ) {
    addIcons({
      arrowForwardOutline,
      lockClosedOutline,
    });
  }

  goBack() {
    void this.router.navigateByUrl('/profile');
  }

  async save() {

    if (
      !this.current ||
      this.next.length < 8 ||
      this.next !== this.confirm
    ) {
      return;
    }

    const { error } = await this.auth.changePassword(
      this.next
    );

    if (!error) {
      this.saved = true;
    }

  }

}
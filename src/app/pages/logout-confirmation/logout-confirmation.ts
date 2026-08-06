import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

import { Auth } from '../../services/authentication';

@Component({
  selector: 'app-logout-confirmation',
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
  ],
  templateUrl: './logout-confirmation.html',
  styleUrls: ['./logout-confirmation.scss'],
})
export class LogoutConfirmationPage {

  constructor(
    private router: Router,
    private auth: Auth
  ) {
    addIcons({
      logOutOutline,
    });
  }

  cancel(): void {
    void this.router.navigateByUrl('/profile');
  }

  async confirm(): Promise<void> {

  await this.auth.logout();

  console.log('Logout done');

  await this.router.navigateByUrl('/login', {
    replaceUrl: true,
  });

  }

}
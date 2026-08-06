import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Auth } from './services/authentication';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    this.checkSession();
  }

  async checkSession() {

    const { data } = await this.auth.getCurrentUser();

    if (data.user) {
      await this.router.navigateByUrl('/tabs/home');
    } else {
      await this.router.navigateByUrl('/login');
    }

  }

}
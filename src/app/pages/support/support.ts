import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  callOutline,
  chevronForwardOutline,
  chatbubbleEllipsesOutline,
  headsetOutline,
  informationCircleOutline,
  mailOutline,
  timeOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [IonContent, IonIcon],
  templateUrl: './support.html',
  styleUrls: ['./support.scss'],
})
export class SupportComponent {
  constructor(private router: Router) {
    addIcons({
      callOutline,
      chevronForwardOutline,
      chatbubbleEllipsesOutline,
      headsetOutline,
      informationCircleOutline,
      mailOutline,
      timeOutline,
    });
  }

  openChat(): void { void this.router.navigateByUrl('/support-chat'); }
}

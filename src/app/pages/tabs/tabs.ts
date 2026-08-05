import { Component } from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  barChartOutline,
  headsetOutline,
  homeOutline,
  peopleOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.html',
  styleUrls: ['./tabs.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class Tabs {
  constructor() {
    addIcons({
      homeOutline,
      peopleOutline,
      barChartOutline,
      headsetOutline,
    });
  }
}

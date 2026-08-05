import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, globeOutline, informationCircleOutline } from 'ionicons/icons';
@Component({selector:'app-language',standalone:true,imports:[IonContent,IonIcon],templateUrl:'./language.html',styleUrls:['./language.scss']})
export class LanguagePage{constructor(private nav:NavController){addIcons({arrowBackOutline,globeOutline,informationCircleOutline});} goBack(){void this.nav.navigateBack('/profile',{animated:true});}}

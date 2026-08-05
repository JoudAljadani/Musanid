import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
@Component({selector:'app-logout-confirmation',standalone:true,imports:[IonContent,IonIcon],templateUrl:'./logout-confirmation.html',styleUrls:['./logout-confirmation.scss']})
export class LogoutConfirmationPage {
 constructor(private router:Router){addIcons({logOutOutline});}
 cancel():void{void this.router.navigateByUrl('/profile');}
 confirm():void{void this.router.navigateByUrl('/login',{replaceUrl:true});}
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonModal } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, cameraOutline, chevronForwardOutline, informationCircleOutline, languageOutline, lockClosedOutline, logOutOutline, personCircleOutline, shieldCheckmarkOutline } from 'ionicons/icons';

@Component({ selector: 'app-profile', standalone: true, imports: [IonContent, IonIcon, IonModal], templateUrl: './profile.html', styleUrls: ['./profile.scss'] })
export class ProfileComponent {
  @ViewChild('cancelButton') cancelButton?: ElementRef<HTMLButtonElement>;
  @ViewChild(IonModal) logoutModal?: IonModal;
  avatarPreview: string | null = localStorage.getItem('musanedEmployeeAvatar');
  isLogoutModalOpen = false;

  constructor(private readonly router: Router, private readonly navController: NavController) {
    addIcons({ arrowForwardOutline, cameraOutline, chevronForwardOutline, informationCircleOutline, languageOutline, lockClosedOutline, logOutOutline, personCircleOutline, shieldCheckmarkOutline });
  }

  goBack(): void { void this.navController.navigateBack('/tabs/home', { animated: true, animationDirection: 'back' }); }
  openChangePassword(): void { void this.navController.navigateForward('/change-password', { animated: true }); }
  openLanguage(): void { void this.navController.navigateForward('/language', { animated: true }); }
  openPrivacy(): void { void this.navController.navigateForward('/privacy', { animated: true }); }
  openAboutApp(): void { void this.navController.navigateForward('/about-app', { animated: true }); }
  openLogoutModal(): void { this.isLogoutModalOpen = true; window.setTimeout(() => this.cancelButton?.nativeElement.focus(), 180); }
  closeLogoutModal(): void { this.isLogoutModalOpen = false; }
  async confirmLogout(): Promise<void> {
    this.isLogoutModalOpen = false;
    await this.logoutModal?.dismiss();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement; const file = input.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => { const result = typeof reader.result === 'string' ? reader.result : null; this.avatarPreview = result; if (result) { try { localStorage.setItem('musanedEmployeeAvatar', result); } catch {} } };
    reader.readAsDataURL(file); input.value = '';
  }
}

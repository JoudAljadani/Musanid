import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  NgForm,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonSpinner,
} from '@ionic/angular/standalone';
import { Auth } from '../../services/authentication';

import { addIcons } from 'ionicons';

import {
  alertCircleOutline,
  checkboxOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  logInOutline,
  mailOutline,
  shieldCheckmarkOutline,
  squareOutline,
} from 'ionicons/icons';


@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonInput,
    IonLabel,
    IonIcon,
    IonButton,
    IonCheckbox,
    IonSpinner,
  ],
})
export class Login {
  email = '';
  password = '';

  rememberMe = false;
  showPassword = false;
  isLoading = false;
  submitted = false;

  emailFocused = false;
  passwordFocused = false;

  generalErrorMessage = '';

constructor(
  private readonly router: Router,
  private readonly auth: Auth
) {
    addIcons({
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      logInOutline,
      shieldCheckmarkOutline,
      alertCircleOutline,
      checkboxOutline,
      squareOutline,
    });
  }

  get passwordHasMinLength(): boolean {
    return this.password.length >= 8;
  }

  get passwordHasUppercase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  get passwordHasLowercase(): boolean {
    return /[a-z]/.test(this.password);
  }

  get passwordHasNumber(): boolean {
    return /\d/.test(this.password);
  }

  get passwordHasSpecialCharacter(): boolean {
    return /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];']/u.test(
      this.password
    );
  }

  get passwordMeetsAllRequirements(): boolean {
    return (
      this.passwordHasMinLength &&
      this.passwordHasUppercase &&
      this.passwordHasLowercase &&
      this.passwordHasNumber &&
      this.passwordHasSpecialCharacter
    );
  }

  sanitizeEmail(event: Event): void {
    const inputEvent = event as CustomEvent<{
      value?: string | null;
    }>;

    const originalValue = inputEvent.detail.value ?? '';

    const cleanValue = originalValue
      .replace(/[^a-zA-Z0-9@._%+-]/g, '')
      .toLowerCase();

    this.email = cleanValue;
    this.generalErrorMessage = '';
  }

  sanitizePassword(event: Event): void {
    const inputEvent = event as CustomEvent<{
      value?: string | null;
    }>;

    const originalValue = inputEvent.detail.value ?? '';

    const cleanValue = originalValue.replace(
      /[^\x21-\x7E]/g,
      ''
    );

    this.password = cleanValue;
    this.generalErrorMessage = '';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  forgotPassword(): void {
    void this.router.navigate(['/forgot-password']);
  }

 async login(loginForm: NgForm): Promise<void> {
    this.submitted = true;
    this.generalErrorMessage = '';

    this.email = this.email.trim();

    if (loginForm.invalid) {
      this.generalErrorMessage =
        'يرجى التأكد من تعبئة البريد وكلمة المرور';

      return;
    }

    if (!this.passwordMeetsAllRequirements) {
      this.generalErrorMessage =
        'كلمة المرور لا تحقق جميع الشروط المطلوبة';

      return;
    }
this.isLoading = true;

const { error } = await this.auth.login(
  this.email,
  this.password
);

this.isLoading = false;

if (error) {
  this.generalErrorMessage =
    'البريد الإلكتروني أو كلمة المرور غير صحيحة';
  return;
}

await this.router.navigateByUrl('/tabs/home', {
  replaceUrl: true,
});
  }
}
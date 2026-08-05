import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./pages/splash/splash').then((m) => m.Splash),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.Login),
  },

  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password').then((m) => m.ForgotPasswordPage),
  },
  {
    path: 'change-password',
    loadComponent: () => import('./pages/change-password/change-password').then((m) => m.ChangePasswordPage),
  },

  {
    path: 'language',
    loadComponent: () => import('./pages/language/language').then((m) => m.LanguagePage),
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy').then((m) => m.PrivacyPage),
  },
  {
    path: 'about-app',
    loadComponent: () => import('./pages/about-app/about-app').then((m) => m.AboutAppPage),
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications').then((m) => m.NotificationsPage),
  },
  {
    path: 'add-visitor',
    loadComponent: () => import('./pages/add-visitor/add-visitor').then((m) => m.AddVisitorPage),
  },
  {
    path: 'confirm-visit',
    loadComponent: () => import('./pages/confirm-visit/confirm-visit').then((m) => m.ConfirmVisitPage),
  },
  {
    path: 'visit-success',
    loadComponent: () => import('./pages/visit-success/visit-success').then((m) => m.VisitSuccessPage),
  },
  {
    path: 'qr-scanner',
    loadComponent: () =>
      import('./pages/qr-scanner/qr-scanner').then((m) => m.QrScanner),
  },
  {
    path: 'support-chat',
    loadComponent: () => import('./pages/support-chat/support-chat').then((m) => m.SupportChatPage),
  },
  {
    path: 'logout-confirmation',
    loadComponent: () => import('./pages/logout-confirmation/logout-confirmation').then((m) => m.LogoutConfirmationPage),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile').then((m) => m.ProfileComponent),
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./pages/tabs/tabs').then((m) => m.Tabs),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'visits',
        loadComponent: () =>
          import('./pages/visits/visits').then((m) => m.Visits),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports').then((m) => m.ReportsPage),
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./pages/support/support').then((m) => m.SupportComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'splash',
  },
];

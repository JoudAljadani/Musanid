import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './splash.html',
  styleUrls: ['./splash.scss'],
})
export class Splash implements OnInit, OnDestroy {
  /** Controls tagline fade-up visibility. Set true only once, after the logo animation completes. */
  showTagline = false;

  /** Controls progress bar visibility. Set true only once, after the tagline fade-up completes. */
  showProgress = false;

  /** Current progress value, 0 to 1, driven by requestAnimationFrame for smooth fill. */
  progressValue = 0;

  // Timing constants (ms) — must stay in sync with the CSS animation durations in splash.scss
  private readonly LOGO_DURATION = 1200;
  private readonly TAGLINE_DURATION = 400;
  private readonly PROGRESS_DURATION = 1400;

  private pendingTimers: ReturnType<typeof setTimeout>[] = [];
  private rafId: number | null = null;

  constructor(private readonly router: Router, private readonly zone: NgZone) {}

  ngOnInit(): void {
    const taglineTimer = setTimeout(() => {
      this.zone.run(() => { this.showTagline = true; });
    }, this.LOGO_DURATION);
    this.pendingTimers.push(taglineTimer);

    const progressTimer = setTimeout(() => {
      this.zone.run(() => {
        this.showProgress = true;
        this.runProgressAnimation();
      });
    }, this.LOGO_DURATION + this.TAGLINE_DURATION);
    this.pendingTimers.push(progressTimer);

    // Fallback guarantees that the login page opens even if animation frames pause.
    const navigationFallback = setTimeout(() => {
      this.zone.run(() => void this.navigateToLogin());
    }, this.LOGO_DURATION + this.TAGLINE_DURATION + this.PROGRESS_DURATION + 80);
    this.pendingTimers.push(navigationFallback);
  }

  ngOnDestroy(): void {
    this.pendingTimers.forEach((timer) => clearTimeout(timer));
    this.pendingTimers = [];

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /** Animates progressValue from 0 to 1 over PROGRESS_DURATION, then navigates to /login. */
  private runProgressAnimation(): void {
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const ratio = Math.min(elapsed / this.PROGRESS_DURATION, 1);
      this.progressValue = ratio;

      if (ratio < 1) {
        this.rafId = requestAnimationFrame(step);
      } else {
        this.rafId = null;
        this.navigateToLogin();
      }
    };

    this.rafId = requestAnimationFrame(step);
  }

  private async navigateToLogin(): Promise<void> {
    if (this.router.url === '/login') return;
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
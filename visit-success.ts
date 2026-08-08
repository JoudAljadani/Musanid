import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-visit-success',
  templateUrl: './visit-success.html',
  styleUrls: ['./visit-success.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VisitSuccessPage implements OnInit {
  permitNumber: string = '88421';

  visitor = {
    fullName: 'أحمد علي',
    department: 'إدارة التحول الرقمي',
    visitTime: '10:00 AM'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['permit']) {
        this.permitNumber = params['permit'];
      }
      if (params['name']) {
        this.visitor.fullName = params['name'];
      }
      this.visitor.visitTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
  }

  // الدالة المُستدعات عند الضغط على "العودة للصفحة الرئيسية"
  goHome() {
    this.router.navigate(['/home']);
  }
}
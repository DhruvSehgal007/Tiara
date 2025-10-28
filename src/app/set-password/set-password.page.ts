import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, AlertController } from '@ionic/angular/standalone';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.page.html',
  styleUrls: ['./set-password.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton]
})
export class SetPasswordPage implements OnInit {
  password: string = '';
  confirmPassword: string = '';
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  email: string = '';
  otp: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthserviceService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Get email and OTP from query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.otp = params['otp'] || '';
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onOkClick() {
    if (!this.password || !this.confirmPassword) {
      this.showAlert('Error', 'Both password fields are required.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showAlert('Error', 'Passwords do not match.');
      return;
    }

    this.authService.setPasswordAfterVerification(this.email, this.otp, this.password).subscribe({
      next: (res) => {
        this.showAlert('Success', 'Password set successfully. Redirecting to Home...');
        this.router.navigate(['/login']); // Replace with your real Home route
      },
      error: (err) => {
        this.showAlert('Error', err.error?.message || 'Failed to verify and set password.');
      }
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}

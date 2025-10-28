import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, AlertController } from '@ionic/angular/standalone';
import { HttpClientModule } from '@angular/common/http'; // ✅ Important!
import { AuthserviceService } from '../services/authservice.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    HttpClientModule, // ✅ Add this to resolve HttpClient DI error
  ]
})
export class RegisterPage {
  fullName: string = '';
  email: string = '';
  otp: string = '';

  step: number = 1; // 1 = name+email, 2 = OTP

  constructor(
    private authService: AuthserviceService,
    private alertController: AlertController,
    private router: Router // 👈 for redirecting after OTP
  ) {}

  onNextClick() {
    if (this.step === 1) {
      if (!this.fullName || !this.email) {
        this.showAlert('Error', 'Name and email are required.');
        return;
      }

      this.authService.signupStepOne(this.fullName, this.email).subscribe({
        next: (res) => {
          this.step = 2;
          this.showAlert('Success', res.message || 'OTP sent to your email.');
        },
        error: (err) => {
          this.showAlert('Error', err.error?.message || 'Signup failed.');
        }
      });
    } else if (this.step === 2) {
      if (!this.otp) {
        this.showAlert('Error', 'Please enter the OTP.');
        return;
      }

      // Proceed to Set Password Page
      this.router.navigate(['/set-password'], {
        queryParams: {
          email: this.email,
          otp: this.otp
        }
      });
    }
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


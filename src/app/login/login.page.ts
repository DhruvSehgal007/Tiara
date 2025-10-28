import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton
} from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonButton, RouterModule],
})
export class LoginPage implements OnInit {

  name: string = '';  // <-- FIXED: previously was fullName
  password: string = '';
  errorMessage: string = '';
  passwordVisible: boolean = false;

  constructor(private authService: AuthserviceService, private router: Router) {}

  ngOnInit() {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onLoginClick() {
    if (!this.name || !this.password) {
      this.errorMessage = 'Please enter both name and password.';
      return;
    }

    this.authService.login(this.name, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid name or password.';
      }
    });
  }


    onhome() {
this.router.navigate(['home'])
}
}


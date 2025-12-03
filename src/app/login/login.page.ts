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

  email: string = '';  // <-- FIXED: previously was fullName
  password: string = '';
  errorMessage: string = '';
  passwordVisible: boolean = false;

  constructor(private authService: AuthserviceService, private router: Router) {}

  ngOnInit() {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

onLoginClick() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('Login successful:', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user_email', res.email);
        this.router.navigate(['/home']);
        const data = this.authService.decodeJWT(res.token);
        // const tokenconsole = JSON.parse(res.token)
        console.log('toekn console',data)
        localStorage.setItem('user_id', data.id);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid email or password.';
      },
    });
  }


onloginoption() {
this.router.navigate(['login-option'])
}

onregister() {
this.router.navigate(['register'])
}



}


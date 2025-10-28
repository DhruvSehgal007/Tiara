import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonAlert,
  IonButton,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
// import { IonAlert, IonButton } from '@ionic/angular/standalone';
@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.page.html',
  styleUrls: ['./confirm-account.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonContent, CommonModule],
})
export class ConfirmAccountPage implements OnInit {
  constructor(private router: Router) { }
  ngOnInit() {}
  showPopup = false;

  testClick() {
    console.log('Button clicked!');
    this.showPopup = true;
  }

  deleteAccount() {
    console.log('Delete action confirmed.');
    this.showPopup = false;
  }

          onProfile() {
this.router.navigate(['profile'])
}
}

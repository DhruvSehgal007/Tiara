import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

@Component({
  selector: 'app-login-option',
  templateUrl: './login-option.page.html',
  styleUrls: ['./login-option.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, RouterModule],
  providers: [Diagnostic, Geolocation],

})
export class LoginOptionPage implements OnInit {
  showPopup = false;

  constructor( private diagnostic: Diagnostic,
    private geolocation: Geolocation,
    private router: Router) {}

  ngOnInit() {}

  // testClick() {
  //   console.log('Button clicked!');
  //   this.showPopup = true;
  // }
  testClick() {
    this.showPopup = true;
  }

 getLocation(permissionType: 'always' | 'onlyWhileUsing') {
    this.diagnostic.isLocationEnabled().then((enabled) => {
      if (enabled) {
        // ✅ Location is ON – proceed
        this.geolocation
          .getCurrentPosition()
          .then((position) => {
            console.log('Latitude:', position.coords.latitude);
            console.log('Longitude:', position.coords.longitude);
            console.log('Permission selected:', permissionType);
            this.router.navigate(['/home']); // Navigate to home page
          })
          .catch((error) => {
            console.error('Geolocation error:', error.message);
          });
      } else {
        // ❌ Location is OFF
        alert('Please enable device location to continue.');
        this.diagnostic.switchToLocationSettings();
      }
    });
  }

  denyLocation() {
    alert('Location access denied.');
    this.showPopup = false;
  }

  onProfile() {
this.router.navigate(['register'])
}
}

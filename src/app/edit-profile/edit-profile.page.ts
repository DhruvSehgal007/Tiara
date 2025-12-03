import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';



@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, CommonModule, FormsModule]
})
export class EditProfilePage implements OnInit {
  user_id = Number(localStorage.getItem('user_id')); // Fetch the logged-in user's ID
  first_name = '';
  last_name = '';
  phone = '';
  email = '';
  constructor(private router: Router, private authService: AuthserviceService) { }

  ngOnInit() {
  }
onprofile() {
this.router.navigate(['profile'])
}


  // Method to save the updated user details
  saveUserDetails() {
    this.authService.saveUserProfile(this.user_id, this.first_name, this.last_name, this.phone, this.email).subscribe((response) => {
      if (response) {
        alert(response.message);
      } else {
        alert("Error saving data.");
      }
    });
  }
}

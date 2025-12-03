import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  userEmail: string = "";   // ✅ declare property
  user_email: any;

  constructor(private router: Router, private authService: AuthserviceService) { }

  ngOnInit() {
        this.getUserAllDetails();
  }

      onEditProfile() {
this.router.navigate(['edit-profile'])
}

        onChangePassword() {
this.router.navigate(['change-password'])
}

        onDeleteAcoount() {
this.router.navigate(['confirm-account'])
}

onbluetoothlists() {
this.router.navigate(['bluetooth-lists'])
}

getUserAllDetails(){
        const user_id = Number(localStorage.getItem('user_id'));
        this.authService.getuserdetail(user_id).subscribe((response)=>{
        if(response)
            {
                this.user_email = response.data[0].email
                console.log('user details', response.data[0].email)
        }
        }
             
        )
}



}

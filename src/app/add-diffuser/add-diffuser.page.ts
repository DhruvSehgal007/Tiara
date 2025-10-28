import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FooterTabsComponent } from '../Components/footer/footer.component';


@Component({
  selector: 'app-add-diffuser',
  templateUrl: './add-diffuser.page.html',
  styleUrls: ['./add-diffuser.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FooterTabsComponent]
})
export class AddDiffuserPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
ondevice() {
this.router.navigate(['home'])
}
}







import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';


@Component({
  selector: 'app-device-name',
  templateUrl: './device-name.page.html',
  styleUrls: ['./device-name.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule]
})
export class DeviceNamePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-select-bluetooth',
  templateUrl: './select-bluetooth.page.html',
  styleUrls: ['./select-bluetooth.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SelectBluetoothPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

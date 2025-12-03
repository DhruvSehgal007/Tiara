import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-inner-mode',
  templateUrl: './inner-mode.page.html',
  styleUrls: ['./inner-mode.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class InnerModePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

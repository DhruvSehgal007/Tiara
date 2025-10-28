import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonLabel,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FooterTabsComponent } from '../Components/footer/footer.component';

@Component({
  selector: 'app-room-selector',
  templateUrl: './room-selector.page.html',
  styleUrls: ['./room-selector.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule,
    FooterTabsComponent,
  ],
})

export class RoomSelectorPage implements OnInit {
  selectedRoom: string = '';

  rooms = [
    { id: 'room1', name: 'Conference Room' },
    { id: 'room2', name: 'Meeting Room' },
    { id: 'room3', name: 'Server Room' },
  ];

  selectedRoomName = '';
  isOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectRoom(room: any) {
    this.selectedRoomName = room.name;
    this.isOpen = false;
  }

  ondevice() {
    this.router.navigate(['home']);
  }
}

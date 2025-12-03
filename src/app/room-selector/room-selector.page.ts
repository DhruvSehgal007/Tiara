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
  IonButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FooterTabsComponent } from '../Components/footer/footer.component';
import { AuthserviceService } from '../services/authservice.service';
import { environment } from 'src/environments/environment.prod';

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
    IonButton,
    CommonModule,
    FormsModule,
    FooterTabsComponent,
  ],
})
export class RoomSelectorPage implements OnInit {
  selectedRoomName = '';
  isOpen = false;

  rooms = [
    { id: 'room1', name: 'Bathroom' },
    { id: 'room2', name: 'Bedroom' },
    { id: 'room3', name: 'Entrance' },
    { id: 'room4', name: 'Guest room' },
    { id: 'room5', name: 'kitchen' },
    { id: 'room6', name: 'Living room' },
  ];

  constructor(
    private router: Router,
    private authService: AuthserviceService,
  ) {}

  ngOnInit() {}

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectRoom(room: any) {
    this.selectedRoomName = room.name;
    this.isOpen = false;
  }

  // async saveMapping() {
  //   if (!this.selectedRoomName) {
  //     alert('Please select a room before finishing.');
  //     return;
  //   }

  //   try {
  //     const data = await this.authService.saveMapping(this.selectedRoomName);
  //     alert(data.message || 'Room mapping saved successfully!');
  //     this.router.navigate(['/home']);
  //   } catch (error: any) {
  //     alert(error.message || 'Failed to save mapping.');
  //   }
  // }
  async saveMapping() {
  if (!this.selectedRoomName) {
    alert('Please select a room before finishing.');
    return;
  }

  this.authService.saveMapping(this.selectedRoomName).subscribe({
    next: (res: any) => {
      alert(res.message || 'Room mapping saved successfully!');
      this.router.navigate(['/bluetooth-lists']);
    },
    error: (err) => {
      alert(err.error?.message || 'Failed to save mapping.');
    }
  });
 }

}

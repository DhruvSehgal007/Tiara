
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthserviceService } from '../services/authservice.service';
import { Router } from '@angular/router';
import { ControlService } from '../control-service';
import { FrequencyModeService } from '../frequency-mode.service';



@Component({
  selector: 'app-bluetooth-lists',
  templateUrl: './bluetooth-lists.page.html',
  styleUrls: ['./bluetooth-lists.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class BluetoothListsPage implements OnInit {

  mappedDevices: any[] = [];

  constructor(
    private authService: AuthserviceService,
    private router: Router,
    private control: ControlService,
    private frequencyService: FrequencyModeService
  ) {}

  ngOnInit() {
    this.loadUserDevices();
  }

  loadUserDevices() {
    this.authService.getUserMappings().subscribe({
      next: (res) => {
        this.mappedDevices = res.data.map((d: any) => ({
          ...d,
          isRunning: false       // UI toggle state
        }));
      },
      error: (err) => console.log('Error:', err),
    });
  }

  getRoomIcon(roomName: string): string {
    if (!roomName) return '../assets/icon/default.png';
    const formatted = roomName.toLowerCase().trim().replace(/\s+/g, '');
    return `../assets/icon/${formatted}.png`;
  }

  openDevice(device: any) {
    this.router.navigate(['/inner-mode-setting'], {
      state: { device }
    });
  }

 
async togglePump(event: Event, device: any) {
  event.stopPropagation();

  if (!localStorage.getItem('connectedDeviceId')) {
    alert("⚠ Connect the device first.");
    return;
  }

  device.isRunning = !device.isRunning;

  if (!device.isRunning) {
    this.frequencyService.stopLoop();
    return;
  }

  const activeModeId = this.frequencyService.getActiveModeId();

  if (!activeModeId) {
    alert("⚠ Enable a mode first.");
    device.isRunning = false;
    return;
  }

  // console.log("🔥 Pump running using:", activeModeId);

  this.frequencyService.startLoopForMode(activeModeId);
}





onprofile() {
this.router.navigate(['profile'])
}
}

import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { FrequencyModeService } from '../frequency-mode.service';

@Component({
  selector: 'app-inner-mode-setting',
  templateUrl: './inner-mode-setting.page.html',
  styleUrls: ['./inner-mode-setting.page.scss'],
  standalone: true,
  providers: [AuthserviceService],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    NgIf,
    NgFor,
    NgClass
  ]
})
export class InnerModeSettingPage implements OnInit {

  serverModes: any[] = [];
  clickedDevice: any;

  isScheduleVisible = false;
  isEditMode = false;
  editModeId: number | null = null;

  weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  selectedDays: string[] = [];

  // 24h format internally (0–23)
  startHour = 0;
  endHour = 6;

  // Frequency seconds
  runTime = 10;
  stopTime = 60;

  constructor(
    private router: Router,
    private auth: AuthserviceService,
    private frequencyService: FrequencyModeService
  ) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.clickedDevice = nav?.extras?.state?.['device'];

    if (this.clickedDevice) {
      this.loadModes();
    }
  }

// loadModes() {
//   this.auth.getModes(
//     this.clickedDevice.user_id,
//     this.clickedDevice.bluetooth_device_name
//   ).subscribe((res: any) => {

//     this.serverModes = (res.modes || []).map((m: any) => ({
//       ...m,
//       selected_days: m.selected_days ? m.selected_days.toUpperCase() : ''
//     }));

//     const count = this.serverModes.length;
//     this.frequencyService.initializeDefaultModes(count);

//     // ⭐ PUSH SERVER VALUES into LOCAL STORAGE
//     this.serverModes.forEach((m, i) => {
//       const key = `mode${i + 1}`;

//       this.frequencyService.updateMode(
//         key,
//         Number(m.run_time),
//         Number(m.stop_time),
//         m.selected_days.split(','),
//         Number(m.start_time.split(':')[0]),
//         Number(m.start_time.split(':')[1] || 0),
//         Number(m.end_time.split(':')[0]),
//         Number(m.end_time.split(':')[1] || 0),
//       );
//     });
//   });
// }
loadModes() {
  this.auth.getModes(
    this.clickedDevice.user_id,
    this.clickedDevice.bluetooth_device_name
  ).subscribe((res: any) => {

    this.serverModes = (res.modes || []).map((m: any) => ({
      ...m,
      selected_days: m.selected_days ? m.selected_days.toUpperCase() : ''
    }));

    const count = this.serverModes.length;
    this.frequencyService.initializeDefaultModes(count);

    // ⭐ PUSH ALL SERVER DATA INTO LOCAL STORAGE
    this.serverModes.forEach((m, i) => {
      const key = `mode${i + 1}`;

      this.frequencyService.updateMode(
        key,
        Number(m.run_time),
        Number(m.stop_time),
        m.selected_days.split(','),
        Number(m.start_time.split(':')[0]),
        Number(m.start_time.split(':')[1] || 0),
        Number(m.end_time.split(':')[0]),
        Number(m.end_time.split(':')[1] || 0),
      );
    });
  });
}




  // ✅ Open New Schedule form
  showScheduleForm() {
    this.isScheduleVisible = true;
    this.isEditMode = false;
    this.editModeId = null;

    this.selectedDays = [];
    this.startHour = 0;
    this.endHour = 6;
    this.runTime = 10;
    this.stopTime = 60;
  }

  // ✅ Edit existing mode
  editMode(mode: any) {
    this.isScheduleVisible = true;
    this.isEditMode = true;
    this.editModeId = mode.id;

    this.selectedDays = mode.selected_days ? mode.selected_days.split(',') : [];

    // DB times are TIME: "03:00:00"
    this.startHour = Number(mode.start_time.split(':')[0] || 0);
    this.endHour = Number(mode.end_time.split(':')[0] || 0);

    this.runTime = Number(mode.run_time);
    this.stopTime = Number(mode.stop_time);
  }

  cancel() {
    this.isScheduleVisible = false;
  }

  // ✅ Day toggle (same style as mode.ts)
  toggleDay(day: string) {
    const i = this.selectedDays.indexOf(day);
    if (i >= 0) {
      this.selectedDays.splice(i, 1);
    } else {
      this.selectedDays.push(day);
    }
  }

  // ✅ 24h → 12h AM/PM for display
  format12(hour: number): string {
    const h = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}:00 ${ampm}`;
  }

  // ✅ Start time +/-
  incStart() {
    this.startHour = (this.startHour + 1) % 24;
  }

  decStart() {
    this.startHour = (this.startHour - 1 + 24) % 24;
  }

  // ✅ End time +/-
  incEnd() {
    this.endHour = (this.endHour + 1) % 24;
  }

  decEnd() {
    this.endHour = (this.endHour - 1 + 24) % 24;
  }

  // ✅ Frequency run/stop +/-
  increaseRun() {
    if (this.runTime < 300) this.runTime += 5;
  }

  decreaseRun() {
    if (this.runTime > 5) this.runTime -= 5;
  }

  increaseStop() {
    if (this.stopTime < 600) this.stopTime += 5;
  }

  decreaseStop() {
    if (this.stopTime > 5) this.stopTime -= 5;
  }

  // ✅ Calculate total hours (for storing)
  calculateHours(): number {
    let s = this.startHour;
    let e = this.endHour;
    if (e <= s) e += 24;
    return e - s;
  }

  // ✅ Display Hrs in list
  calculateDisplayHours(start: string, end: string): number {
    const s = Number(start.split(':')[0] || 0);
    const e = Number(end.split(':')[0] || 0);
    return e >= s ? e - s : e + 24 - s;
  }


  saveMode() {
  const payload = {
    mode_id: this.editModeId,
    user_id: this.clickedDevice.user_id,
    bluetooth_name: this.clickedDevice.bluetooth_device_name,
    room_name: this.clickedDevice.room_name,
    start_time: this.startHour,
    end_time: this.endHour,
    run_time: this.runTime,
    stop_time: this.stopTime,

    // ⭐ FIX: ALWAYS SAVE DAYS IN UPPERCASE
    days: this.selectedDays.map(d => d.toUpperCase()).join(','),

    total_hours: this.calculateHours()
  };

  this.auth.saveMode(payload).subscribe(() => {
    this.isScheduleVisible = false;
    this.loadModes();
  });
}



toggleMode(mode: any) {
  this.auth.toggleMode({
    id: mode.id,
    user_id: this.clickedDevice.user_id,
    bluetooth_name: this.clickedDevice.bluetooth_device_name
  }).subscribe(() => {

    // LOCAL UPDATE → dynamic
    this.updateLocalModeState(mode.id);

    this.loadModes();
  });
}



updateLocalModeState(activeDbId: number) {

  // Find index from server list
  const index = this.serverModes.findIndex(m => m.id == activeDbId);

  if (index === -1) return; // safe check

  const total = this.serverModes.length;

  for (let i = 1; i <= total; i++) {
    const key = `mode${i}`;

    const data = this.frequencyService.getMode(key);

    // enable only correct one
    data.enabled = (i === index + 1);

    this.frequencyService.saveMode(key, data);
  }
}

onbluetoothlist() {
this.router.navigate(['bluetooth-lists'])
}


}

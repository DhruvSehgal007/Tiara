import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { FrequencyModeService } from '../frequency-mode.service';
import { ControlService } from '../control-service';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    RouterModule,
  ],
  providers: [AndroidPermissions],
})
export class DevicePage implements OnInit {
  isLightOn = false;
  isRunning = false;
  selectedChannel: string = '';
  currentTime: string = '';
  currentDay: string = '';

  enabledModeId: string = '';
  enabledModeLabel: string = '';
  runTime: number = 0;
  stopTime: number = 0;
  totalHours: string = '';
  startTimeFormatted: string = '';
endTimeFormatted: string = '';


  constructor(
    private control: ControlService,
    private frequencyService: FrequencyModeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEnabledMode();
    this.updateTimeAndDay();
    setInterval(() => this.updateTimeAndDay(), 1000); // update every second
  }

  // loadEnabledMode() {
  //   const modeId = this.frequencyService.getActiveModeId();
  //   if (modeId) {
  //     const mode = this.frequencyService.getMode(modeId);
  //     if (mode) {
  //       this.enabledModeId = modeId;
  //       this.enabledModeLabel = this.getModeLabel(modeId);
  //       this.runTime = mode.runTime;
  //       this.stopTime = mode.stopTime;
  //       this.totalHours = this.calculateDuration(
  //         mode.startHour,
  //         mode.startMinute,
  //         mode.endHour,
  //         mode.endMinute
  //       );
  //     }
  //   }
  // }
  loadEnabledMode() {
  const modeId = this.frequencyService.getActiveModeId();
  if (modeId) {
    const mode = this.frequencyService.getMode(modeId);
    if (mode) {
      this.enabledModeId = modeId;
      this.enabledModeLabel = this.getModeLabel(modeId);
      this.runTime = mode.runTime;
      this.stopTime = mode.stopTime;

      this.startTimeFormatted = this.formatTime(mode.startHour, mode.startMinute);
      this.endTimeFormatted = this.formatTime(mode.endHour, mode.endMinute);

      this.totalHours = this.calculateDuration(
        mode.startHour,
        mode.startMinute,
        mode.endHour,
        mode.endMinute
      );
    }
  }
}
formatTime(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, '0')}h ${minute.toString().padStart(2, '0')}m`;
}


  getModeLabel(modeId: string): string {
    const labels: any = {
      mode1: 'Mode I',
      mode2: 'Mode II',
      mode3: 'Mode III',
      mode4: 'Mode IV',
      mode5: 'Mode V',
    };
    return labels[modeId] || '';
  }

  calculateDuration(
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number
  ): string {
    let start = startHour * 60 + startMinute;
    let end = endHour * 60 + endMinute;

    if (end < start) end += 1440; // handle crossing midnight

    const durationMinutes = end - start;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours.toString().padStart(2, '0')}h ${minutes
      .toString()
      .padStart(2, '0')}m`;
  }

  toggleRunningtwo() {
    this.isLightOn = !this.isLightOn;
    this.control.setLight(this.isLightOn);
  }

  togglePumpLoop() {
    this.isRunning = !this.isRunning;

    if (this.isRunning) {
      const activeModeId = this.frequencyService.getActiveModeId();
      if (activeModeId) {
        this.frequencyService.startLoopForMode(activeModeId);
        this.loadEnabledMode(); // update UI
      } else {
        alert('⚠️ No mode is enabled.');
        this.isRunning = false;
      }
    } else {
      this.frequencyService.stopLoop();
    }
  }

  selectChannel(left: boolean) {
    this.control
      .selectChannel(left)
      .then(() => {
        console.log(`✅ Channel selected: ${left ? 'Left' : 'Right'}`);
      })
      .catch((err) => {
        console.error('❌ Channel select failed:', err);
      });
  }

  disconnect() {
    this.control.disconnectAndNavigateHome();
  }

  updateTimeAndDay() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}`;

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    this.currentDay = days[now.getDay()];
  }

  onhome() {
    this.router.navigate(['home']);
  }
  ionViewWillEnter() {
  this.loadEnabledMode();
}

}


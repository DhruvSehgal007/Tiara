import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  BleClient,
  ScanResult,
  numbersToDataView,
} from '@capacitor-community/bluetooth-le';
import { buildFrame, DeviceFamily } from '../ble-packets';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FrequencyModeService } from '../frequency-mode.service';





@Component({
  selector: 'app-bluetooth',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
  providers: [AndroidPermissions],
})
export class BluetoothPage implements OnInit {
  devices: ScanResult[] = [];
  connected = false;
  connectedDeviceId: string = '';

  svcUuid = '';
  chrUuid = '';

  readonly TARGET_NAME = 'Scent-B05P204012962D5';

  // Static UUIDs for your diffuser
  readonly SERVICE_UUIDS = [
    '0000ffe0-0000-1000-8000-00805f9b34fb',
    '0000fff0-0000-1000-8000-00805f9b34fb',
    '000018aa-0000-1000-8000-00805f9b34fb',
  ];
  readonly CHARACTERISTIC_UUIDS = [
    '0000ffe1-0000-1000-8000-00805f9b34fb',
    '0000fff2-0000-1000-8000-00805f9b34fb',
    '00002aaa-0000-1000-8000-00805f9b34fb',
  ];

constructor(
  private androidPermissions: AndroidPermissions,
  private toastController: ToastController,
  private router: Router,
  private frequencyService: FrequencyModeService
) {}
// async presentToast(message: string) {
//   const toast = await this.toastController.create({
//     message,
//     duration: 2000,
//     color: 'primary',
//     position: 'bottom',
//   });
//   toast.present();
// }

  async ngOnInit() {
    await this.androidPermissions.requestPermissions([
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
      this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
      this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
    ]);

    await BleClient.initialize();
  }

  async scanDevices() {
    this.devices = [];

    await BleClient.requestLEScan({ allowDuplicates: false }, (result) => {
      const name = result.device.name ?? result.localName ?? 'Unnamed';

      if (name === this.TARGET_NAME) {
        const exists = this.devices.find((d) => d.device.deviceId === result.device.deviceId);
        if (!exists) {
          this.devices.push(result);
          console.log('✅ Found target device:', name);
        }
      }
    });

    // Stop scan after 10 seconds
    setTimeout(() => BleClient.stopLEScan(), 10000);
  }

  // async connectToDevice(device: ScanResult) {
  //   try {
  //     await BleClient.connect(device.device.deviceId, () => {
  //       this.connected = false;
  //       this.connectedDeviceId = '';
  //       console.warn('⚠️ Disconnected');
  //     });

  //     this.connectedDeviceId = device.device.deviceId;
  //     this.connected = true;

  //     this.svcUuid = '0000ffe0-0000-1000-8000-00805f9b34fb';
  //     this.chrUuid = '0000ffe1-0000-1000-8000-00805f9b34fb';

  //     alert('✅ Connected to: ' + device.device.name);
  //   } catch (err) {
  //     console.error('❌ Connection failed:', err);
  //     alert('❌ Connection failed');
  //   }
  // }

  async connectToDevice(device: ScanResult) {
  try {
    await BleClient.connect(device.device.deviceId, () => {
      this.connected = false;
      this.connectedDeviceId = '';
      localStorage.removeItem('connectedDeviceId'); // clear on disconnect
      console.warn('⚠️ Disconnected');
    });

    this.connectedDeviceId = device.device.deviceId;
    this.connected = true;

    // ✅ Save device ID to localStorage
    localStorage.setItem('connectedDeviceId', this.connectedDeviceId);

    this.svcUuid = '0000ffe0-0000-1000-8000-00805f9b34fb';
    this.chrUuid = '0000ffe1-0000-1000-8000-00805f9b34fb';

    alert('✅ Connected to: ' + device.device.name);
  } catch (err) {
    console.error('❌ Connection failed:', err);
    alert('❌ Connection failed');
  }
}


  private async sendCommand(body: number[]) {
    const frame = buildFrame(DeviceFamily.Sanso, body);
    const data = numbersToDataView(Array.from(frame));

    try {
      await BleClient.write(this.connectedDeviceId, this.svcUuid, this.chrUuid, data);
      console.log('✅ Write successful:', frame);
    } catch (err) {
      console.error('❌ Write failed:', err);
    }
  }

  // ✅ LIGHT ON/OFF
  setLight(on: boolean) {
    const command = [0x15, on ? 1 : 0, 0x00];
    this.sendCommand(command);
  }

  // ✅ LOCK ON/OFF
  setLock(on: boolean) {
    const command = [0x11, on ? 1 : 0, 0x00];
    this.sendCommand(command);
  }

  // ✅ FAN ON/OFF
  setFan(on: boolean) {
    const command = [0x10, on ? 1 : 0, 0x00];
    this.sendCommand(command);
  }

  // ✅ PUMP ON/OFF
  setPump(on: boolean) {
    const command = [0x12, on ? 1 : 0, 0x00];
    this.sendCommand(command);
  }

  // ✅ CHANNEL SELECT
  selectChannel(left: boolean) {
    const command = [0x17, left ? 0 : 1, 0x00];
    this.sendCommand(command);
  }


  setDevicePower(on: boolean) {
  const command = [0x18, on ? 1 : 0, 0x00];  
  this.sendCommand(command);
}


setFanSpeed(level: number) {
  const command = [0x10, level, 0x00]; 
  this.sendCommand(command);
}

  onLightToggle(event: Event) {
    alert('hello');
  const checked = (event.target as HTMLInputElement).checked;
  this.setLight(checked);
}


onLockToggle(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  this.setLock(checked);
}

onFanToggle(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  this.setFan(checked);
}


// onPumpToggle(event: Event) {
//   const checked = (event.target as HTMLInputElement).checked;
//   if (checked) {
//     this.frequencyService.manualPumpTrigger();
//   } else {
//     this.frequencyService.stopLoop();
//   }
// }

onPumpToggle(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
this.frequencyService.startFrequencyLoop('mode1');
  } else {
    this.frequencyService.stopLoop();
  }
}




onFanSpeedChange(event: Event) {
  const level = parseInt((event.target as HTMLSelectElement).value, 10);
  this.setFanSpeed(level);
}

onDevicePowerToggle(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;

  if (checked) {
    alert('✅ Turning Device ON');
  } else {
    alert('⚠️ Turning Device OFF');
  }

  this.setDevicePower(checked);
}
goToWorkingMode() {
  this.router.navigate(['/working-mode']);
}

}

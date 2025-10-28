import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
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
import { IonContent, IonHeader, IonTitle, IonToolbar, } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { FooterTabsComponent } from '../Components/footer/footer.component';




@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonicModule, FooterTabsComponent],
  providers: [AndroidPermissions],
})
export class HomePage implements OnInit{
  devices: ScanResult[] = [];
  connected = false;
  connectedDeviceId: string = '';
  showBluetoothModal = false;
  isScanning: boolean = false;
// 
searchMessages = ['Searching', 'Searching.', 'Searching..', 'Searching...'];
searchInterval: any;
searchIndex = 0;
showAddMessage = true;




  svcUuid = '';
  chrUuid = '';

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


async ngOnInit() {
  await this.androidPermissions.requestPermissions([
    this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
    this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
    this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
  ]);

  await BleClient.initialize();

  const isEnabled = await BleClient.isEnabled();
  if (!isEnabled) {
    this.showBluetoothModal = true;
  }
}



async scanDevices() {
  this.isScanning = true;
  this.devices = [];
  this.searchIndex = 0;
    this.showAddMessage = false; // ⬅️ Hide the ADD section on click


  this.searchInterval = setInterval(() => {
    this.updateSearchMessage();
  }, 400);

  console.log('🔍 Scanning for BLE devices...');
  await BleClient.requestLEScan({ allowDuplicates: false }, (result) => {
    const name = result.device.name ?? result.localName;

    if (!name) return;

    const alreadyExists = this.devices.some(
      d => d.device.deviceId === result.device.deviceId
    );
    if (!alreadyExists) {
      this.devices.push(result);
      console.log('📡 Found:', name);
    }
  });


  setTimeout(async () => {
  await BleClient.stopLEScan();
  this.isScanning = false;
  clearInterval(this.searchInterval);

  // Show ADD message again if no devices found
  if (this.devices.length === 0) {
    this.showAddMessage = true;
  }

  console.log('⏹️ Scan stopped. Devices found:', this.devices.length);
}, 10000);

}




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
    setTimeout(() => {
      this.router.navigate(['/device']);
    }, 100)
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
async enableBluetooth() {
  try {
    await BleClient.enable(); // will request to turn on Bluetooth
    this.showBluetoothModal = false;
    this.scanDevices(); // start scanning after enabling
  } catch (err) {
    console.error('❌ Bluetooth enable failed:', err);
    alert('Failed to enable Bluetooth');
  }
}
    onprofile() {
this.router.navigate(['profile'])
}

updateSearchMessage() {
  const messageEl = document.getElementById('message-1');
  if (messageEl) {
    messageEl.textContent = this.searchMessages[this.searchIndex];
    this.searchIndex = (this.searchIndex + 1) % this.searchMessages.length;
  }
}

}

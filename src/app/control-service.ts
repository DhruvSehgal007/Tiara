// src/app/control-service.ts

import { Injectable } from '@angular/core';
import { BleClient, numbersToDataView } from '@capacitor-community/bluetooth-le';
import { buildFrame, DeviceFamily } from './ble-packets';
import { Router } from '@angular/router';  // ⬅️ Import Router


@Injectable({ providedIn: 'root' })
export class ControlService {
  private connectedDeviceId = localStorage.getItem('connectedDeviceId') || '';

  private svcUuid = '0000ffe0-0000-1000-8000-00805f9b34fb';
  private chrUuid = '0000ffe1-0000-1000-8000-00805f9b34fb';

  constructor(private router: Router) {}

  private async sendCommand(command: number[]) {
    const frame = buildFrame(DeviceFamily.Sanso, command);
    const data = numbersToDataView(Array.from(frame));

    try {
      await BleClient.write(this.connectedDeviceId, this.svcUuid, this.chrUuid, data);
      console.log('✅ Command sent:', command);
    } catch (error) {
      console.error('❌ BLE Write failed:', error);
    }
  }


   async disconnectAndNavigateHome() {
    try {
      if (this.connectedDeviceId) {
        await BleClient.disconnect(this.connectedDeviceId);
        console.log('🔌 Bluetooth disconnected');
        localStorage.removeItem('connectedDeviceId');
        this.connectedDeviceId = '';
      }
    } catch (error) {
      console.error('❌ Failed to disconnect:', error);
    } finally {
      this.router.navigate(['/home']);  // ⬅️ Navigate to Home page
    }
  }

  // Light Toggle
  setLight(on: boolean) {
    return this.sendCommand([0x15, on ? 1 : 0, 0x00]);
  }

  // Lock Toggle
  setLock(on: boolean) {
    return this.sendCommand([0x11, on ? 1 : 0, 0x00]);
  }

  // Fan Toggle
  setFan(on: boolean) {
    return this.sendCommand([0x10, on ? 1 : 0, 0x00]);
  }

  // Fan Speed Control
  setFanSpeed(level: number) {
    return this.sendCommand([0x10, level, 0x00]);
  }

  // Pump Toggle
  setPump(on: boolean) {
    return this.sendCommand([0x12, on ? 1 : 0, 0x00]);
  }

  // Channel Select
  selectChannel(left: boolean) {
    return this.sendCommand([0x17, left ? 0 : 1, 0x00]);
  }

  // Device Power Toggle
  setDevicePower(on: boolean) {
    return this.sendCommand([0x18, on ? 1 : 0, 0x00]);
  }
}

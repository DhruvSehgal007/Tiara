// src/app/frequency-mode.service.ts

import { Injectable } from '@angular/core';
import { BleClient, numbersToDataView } from '@capacitor-community/bluetooth-le';
import { buildFrame, DeviceFamily } from './ble-packets';

export interface FrequencyMode {
  runTime: number;
  stopTime: number;
  enabled: boolean;
  selectedDays: string[];
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

@Injectable({ providedIn: 'root' })
export class FrequencyModeService {
  modes: { [key: string]: FrequencyMode } = {};

  private connectedDeviceId = localStorage.getItem('connectedDeviceId') || '';
  private svcUuid = '0000ffe0-0000-1000-8000-00805f9b34fb';
  private chrUuid = '0000ffe1-0000-1000-8000-00805f9b34fb';
  private looping = false;
  private intervalId: number | null = null;

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultModes();
  }

  initializeDefaultModes() {
    for (let i = 1; i <= 5; i++) {
      const modeId = `mode${i}`;
      if (!this.modes[modeId]) {
        this.modes[modeId] = {
          runTime: 10,
          stopTime: 60,
          enabled: false,
          selectedDays: [],
          startHour: 6,
          startMinute: 0,
          endHour: 22,
          endMinute: 0,
        };
      }
    }
    this.saveToStorage();
  }

  private loadFromStorage() {
    const data = localStorage.getItem('frequencyModes');
    if (data) this.modes = JSON.parse(data);
  }

  private saveToStorage() {
    localStorage.setItem('frequencyModes', JSON.stringify(this.modes));
  }

  getMode(modeId: string): FrequencyMode {
    return this.modes[modeId];
  }

  updateMode(
    modeId: string,
    runTime: number,
    stopTime: number,
    selectedDays: string[],
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number
  ) {
    this.modes[modeId] = {
      ...this.modes[modeId],
      runTime,
      stopTime,
      selectedDays,
      startHour,
      startMinute,
      endHour,
      endMinute,
    };
    this.saveToStorage();
  }

  setEnabled(modeId: string, enabled: boolean) {
    if (this.modes[modeId]) {
      this.modes[modeId].enabled = enabled;
      this.saveToStorage();
    }
  }

  isEnabled(modeId: string): boolean {
    return this.modes[modeId]?.enabled ?? false;
  }

  getActiveModeId(): string | null {
      this.loadFromStorage(); 
    for (let i = 1; i <= 5; i++) {
      const modeId = `mode${i}`;
      if (this.modes[modeId]?.enabled) return modeId;
    }
    return null;
  }

  async startFrequencyLoop(modeId: string) {
    this.loadFromStorage();
    const mode = this.modes[modeId];
    if (!mode || !mode.enabled || this.looping) return;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    if (!mode.selectedDays.includes(today)) return;

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const startMin = mode.startHour * 60 + mode.startMinute;
    const endMin = mode.endHour * 60 + mode.endMinute;
    if (nowMin < startMin || nowMin > endMin) return;

    this.looping = true;

    const loop = async () => {
      if (!mode.enabled || !this.looping) {
        this.setPump(false);
        return;
      }

      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes();
      if (currentMin < startMin || currentMin > endMin) {
        this.setPump(false);
        return;
      }

      await this.setPump(true);
      setTimeout(async () => {
        await this.setPump(false);
        if (mode.enabled && this.looping) {
          setTimeout(loop, mode.stopTime * 1000);
        }
      }, mode.runTime * 1000);
    };

    loop();
  }

  stopLoop() {
    this.looping = false;
    if (this.intervalId) clearInterval(this.intervalId);
    this.setPump(false);
  }

  private async setPump(on: boolean) {
    const command = [0x12, on ? 1 : 0, 0x00];
    const frame = buildFrame(DeviceFamily.Sanso, command);
    const data = numbersToDataView(Array.from(frame));
    try {
      await BleClient.write(this.connectedDeviceId, this.svcUuid, this.chrUuid, data);
    } catch (err) {
      console.error('BLE Pump failed', err);
    }
  }
  startLoopForMode(modeId: string) {
  return this.startFrequencyLoop(modeId);
}


// saveMode(modeId: string, data: FrequencyMode) {
//   localStorage.setItem(modeId, JSON.stringify(data));
// }
saveMode(modeId: string, data: FrequencyMode) {
  this.modes[modeId] = data; // ← update in-memory object
  this.saveToStorage();      // ← update actual localStorage
}


}

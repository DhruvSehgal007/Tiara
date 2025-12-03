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
  }

  // --------------------------------------------------
  // STORAGE
  // --------------------------------------------------

  private loadFromStorage() {
    const data = localStorage.getItem('frequencyModes');
    if (data) this.modes = JSON.parse(data);
  }

  private saveToStorage() {
    localStorage.setItem('frequencyModes', JSON.stringify(this.modes));
  }

  initializeDefaultModes(count: number) {
    for (let i = 1; i <= count; i++) {
      const key = `mode${i}`;
      if (!this.modes[key]) {
        this.modes[key] = {
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
      selectedDays: selectedDays.map(d => d.toUpperCase()),
      startHour,
      startMinute,
      endHour,
      endMinute
    };
    this.saveToStorage();
  }

  saveMode(modeId: string, data: FrequencyMode) {
    this.modes[modeId] = data;
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
    const keys = Object.keys(this.modes);
    return keys.find(k => this.modes[k]?.enabled) || null;
  }

  // --------------------------------------------------
  // ⭐ PUMP COMMAND (FINAL FIX)
  // --------------------------------------------------
private async keepPumpOnFor(seconds: number) {

  let remaining = seconds;

  const sendOn = async () => {
    if (!this.looping || remaining <= 0) return;

    const cmd = [0x12, 1, seconds];
    const frame = buildFrame(DeviceFamily.Sanso, cmd);
    const data = numbersToDataView(Array.from(frame));

    await BleClient.write(this.connectedDeviceId, this.svcUuid, this.chrUuid, data);

    remaining--;
    setTimeout(sendOn, 1000);
  };

  sendOn();
}

private async setPump(on: boolean, runTime?: number) {
  let command;

  if (on) {
    command = [0x12, 1, runTime ?? 5];  // Send the runtime for the pump
  } else {
    command = [0x12, 0, 0x00];          // OFF command
  }

  const frame = buildFrame(DeviceFamily.Sanso, command);
  const data = numbersToDataView(Array.from(frame));

  try {
    await BleClient.write(this.connectedDeviceId, this.svcUuid, this.chrUuid, data);
    console.log("✅ Pump command sent:", command);
  } catch (err) {
    console.error("❌ BLE Pump failed", err);
  }
}




  stopLoop() {
    this.looping = false;
    if (this.intervalId) clearInterval(this.intervalId);
    this.setPump(false);
  }

  // --------------------------------------------------
  // ⭐ MAIN LOOP
  // --------------------------------------------------

// Start Frequency Loop with Dynamic Run and Stop Time
async startFrequencyLoop(modeId: string) {
  this.loadFromStorage();
  const mode = this.modes[modeId];
  if (!mode || !mode.enabled || this.looping) return;

  // TODAY DAY CHECK ----------------
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  if (!mode.selectedDays.includes(today)) return;

  // TIME CHECK ----------------
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const startMin = mode.startHour * 60 + mode.startMinute;
  const endMin = mode.endHour * 60 + mode.endMinute;
  if (nowMin < startMin || nowMin > endMin) return;

  this.looping = true;

  const loop = async () => {
    if (!mode.enabled || !this.looping) {
      await this.setPump(false);
      return;
    }

    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    if (currentMin < startMin || currentMin > endMin) {
      await this.setPump(false);
      return;
    }

    // TURN ON PUMP FOR SPECIFIED TIME (runTime)
    await this.setPump(true, mode.runTime); // Send the runtime command to pump

    // WAIT FOR runTime to elapse
    setTimeout(async () => {
      await this.setPump(false); // TURN OFF pump after the runTime

      if (mode.enabled && this.looping) {
        // WAIT for stopTime before the next loop
        setTimeout(loop, mode.stopTime * 1000);
      }
    }, mode.runTime * 1000);  // Dynamically use the selected runTime
  };

  loop();
}


  startLoopForMode(modeId: string) {
    return this.startFrequencyLoop(modeId);
  }


  
}

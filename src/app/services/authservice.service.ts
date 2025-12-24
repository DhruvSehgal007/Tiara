import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  // private baseUrl = 'http://localhost:5000/api';
  private baseUrl = 'https://staging.ekarigar.com/tiaraapi/api';

  constructor(private http: HttpClient) {
    this.loadConnections();
  }

  // 🔹 Store connected devices with their assigned room
  private connectedDevices: { [roomName: string]: string } = {};
  private currentDevice: string | null = null;

  decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }
  // 🔹 Save device under a room name and persist in localStorage
  setConnectedDevice(roomName: string, deviceName: string) {
    this.connectedDevices[roomName] = deviceName;
    localStorage.setItem(
      'connectedDevices',
      JSON.stringify(this.connectedDevices)
    );
    console.log(`✅ Saved mapping: ${roomName} → ${deviceName}`);
  }

saveMapping(selectedRoomName: string): Observable<any> {
  const userEmail = localStorage.getItem('user_email');
  const bluetoothDeviceName = localStorage.getItem('connectedDeviceName'); // ✅ get stored name

  const body = {
    email: userEmail,
    bluetooth_device_name: bluetoothDeviceName,
    room_name: selectedRoomName,
  };

  return this.http.post(`${this.baseUrl}/save-mapping`, body);
}


  // 🔹 Load connections from localStorage on app start
  private loadConnections() {
    const saved = localStorage.getItem('connectedDevices');
    if (saved) {
      this.connectedDevices = JSON.parse(saved);
    }
  }

  // 🔹 Get device name by room
  getDeviceByRoom(roomName: string): string | null {
    return this.connectedDevices[roomName] || null;
  }

  // 🔹 Return all room-device pairs
  getAllConnections() {
    return this.connectedDevices;
  }

  // 🔹 Store currently connected device name (not by room)
  setCurrentDevice(deviceName: string) {
    this.currentDevice = deviceName;
    localStorage.setItem('currentDevice', deviceName);
  }

  // 🔹 Get currently connected device name
  getCurrentDevice(): string | null {
    if (!this.currentDevice) {
      this.currentDevice = localStorage.getItem('currentDevice');
    }
    return this.currentDevice;
  }

  // 🔹 Remove mapping when device removed
  clearDeviceMapping(roomName: string) {
    delete this.connectedDevices[roomName];
    localStorage.setItem(
      'connectedDevices',
      JSON.stringify(this.connectedDevices)
    );
  }

  // ------------- Existing API Calls -----------------
  signupStepOne(name: string, email: string): Observable<any> {
    const body = { name, email };
    return this.http.post(`${this.baseUrl}/signup`, body);
  }

  setPasswordAfterVerification(email: string, otp: string, password: string) {
    const body = { email, otp, password };
    return this.http.post(`${this.baseUrl}/verify`, body);
  }


  login(email: string, password: string) {
    const body = { email, password };
    return this.http.post(`${this.baseUrl}/login`, body);
  }

  
  getuserdetail(user_id: any) {
    const body = { user_id };
    return this.http.post<any>(`${this.baseUrl}/getuserdetail`, body);
  }


  getUserMappings(): Observable<any> {
  const userEmail = localStorage.getItem('user_email');
  return this.http.get(`${this.baseUrl}/get-mappings?email=${userEmail}`);
}



saveMode(data: any) {
  return this.http.post(this.baseUrl + "/save-mode", data);
}

getModes(user_id: number, bluetooth_name: string) {
  return this.http.get(this.baseUrl + "/get-modes", {
    params: { user_id, bluetooth_name }
  });
}

toggleMode(data: any) {
  return this.http.post(this.baseUrl + "/toggle-mode", data);
}

  // Save user profile data
  saveUserProfile(user_id: any, first_name: string, last_name: string, phone: string, email: string): Observable<any> {
    const body = { user_id, first_name, last_name, phone, email };
    return this.http.post<any>(`${this.baseUrl}/saveuserprofile`, body);
  }


}

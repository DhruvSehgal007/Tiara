import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
  
})
export class AuthserviceService {
  private baseUrl = 'http://localhost:3000/api/auth'; // or use environment.baseUrl

  constructor(private http: HttpClient) {
    // this.initStorage();
  }

  async initStorage() {
    // await this.storage.create();
  }

  signupStepOne(name: string, email: string): Observable<any> {
    const body = { name, email };
    return this.http.post(`${this.baseUrl}/signup`, body);
  }

//   setPasswordAfterVerification(email: string, otp: string, password: string): Observable<any> {
//   const body = { email, otp, password };
//   return this.http.post(`${this.baseUrl}/verify-otp`, body);
// }
setPasswordAfterVerification(email: string, otp: string, password: string) {
  const body = { email, otp, password };
  return this.http.post(`${this.baseUrl}/verify`, body);
}

login(name: string, password: string) {
  const body = { name, password };
  return this.http.post(`${this.baseUrl}/login`, body);
}

}

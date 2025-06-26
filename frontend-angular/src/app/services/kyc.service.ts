import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KycService {
  private apiUrl = 'https://kyc-verifier-rzca.onrender.com/api';

  constructor(private http: HttpClient) {}

  submitKYC(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submitKYC`, data);
  }

  exportKYC(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/exportKYC`, { responseType: 'blob' });
  }
}

import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KycService } from '../../services/kyc.service';

@Component({
  selector: 'app-kyc-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kyc-form.component.html',
  styleUrls: ['./kyc-form.component.css']
})
export class KycFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;

  kyc: any = {
    name: '', pan: '', dob: '', gender: '', mobile: '', email: '',
    address: '', city: '', state: '', pincode: '',
    accountHolder: '', accountNumber: '', ifsc: '', bankName: '',
    fund: '', amount: '', investmentType: '', startDate: '', photoBase64: ''
  };

  previewImage: string | null = null;
  stream: MediaStream | null = null;
  facingMode: 'user' | 'environment' = 'environment';
  showPreview = false;
  isDarkMode = false;

  constructor(private kycService: KycService) {}

  ngAfterViewInit() {
    this.startCamera();
  }

  startCamera() {
    if (this.stream) this.stopCamera();
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: this.facingMode },
      audio: false
    }).then((stream) => {
      this.stream = stream;
      const videoElement = this.video.nativeElement;
      videoElement.srcObject = stream;
      videoElement.play();
    }).catch((err) => alert('Camera access denied: ' + err));
  }

  stopCamera() {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
  }

  switchCamera() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.startCamera();
  }

  captureImage() {
    const video = this.video.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.8);

      const sizeInBytes = base64.length * (3 / 4) - 
        (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
      const sizeInMB = sizeInBytes / (1024 * 1024);
      if (sizeInMB > 5) {
        alert('Captured image exceeds 5MB.');
        return;
      }

      this.previewImage = base64;
      this.kyc.photoBase64 = base64;
      this.showPreview = false;
    }
  }

  togglePreview() {
    this.showPreview = !this.showPreview;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  submitForm() {
    this.kycService.submitKYC(this.kyc).subscribe({
      next: () => {
        alert('KYC submitted successfully.');
        this.resetForm();
      },
      error: (err) => alert('Submission error: ' + err.message)
    });
  }

  resetForm() {
    this.kyc = {
      name: '', pan: '', dob: '', gender: '', mobile: '', email: '',
      address: '', city: '', state: '', pincode: '',
      accountHolder: '', accountNumber: '', ifsc: '', bankName: '',
      fund: '', amount: '', investmentType: '', startDate: '', photoBase64: ''
    };
    this.previewImage = null;
    this.showPreview = false;
  }

  downloadExcel(): void {
    this.kycService.exportKYC().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kyc-data.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}

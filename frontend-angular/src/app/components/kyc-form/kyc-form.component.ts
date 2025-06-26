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
  previewImage: string | null = null;
  stream: MediaStream | null = null;
  facingMode: 'user' | 'environment' = 'environment';
  showPreview = false;
  capturedImageName = 'captured_document.jpg';

  kyc: any = {
    name: '', pan: '', dob: '', gender: '', mobile: '', email: '',
    address: '', city: '', state: '', pincode: '',
    accountHolder: '', accountNumber: '', ifsc: '', bankName: '',
    fund: '', amount: '', investmentType: '', startDate: '',
    photoBase64: ''
  };

  constructor(private kycService: KycService) {}

  ngAfterViewInit() {
    this.startCamera();
  }

  startCamera() {
    if (this.stream) this.stopCamera();

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: this.facingMode }, audio: false
    }).then(stream => {
      this.stream = stream;
      const video = this.video.nativeElement;
      video.srcObject = stream;
      video.play();
    }).catch(err => alert('Camera access denied: ' + err));
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
      const base64 = canvas.toDataURL('image/jpeg', 0.9);

      const sizeInMB = (base64.length * (3 / 4)) / (1024 * 1024);
      if (sizeInMB > 5) {
        alert('❌ Captured image is too large (max 5MB). Please move the camera back slightly or retake.');
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

  submitForm() {
    this.kycService.submitKYC(this.kyc).subscribe({
      next: () => {
        alert('✅ KYC submitted successfully!');
        this.resetForm();
      },
      error: (err) => alert('❌ Submission Error: ' + err.message)
    });
  }

  exportExcel() {
    this.kycService.exportKYC().subscribe(blob => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'kyc-data.xlsx';
      a.click();
    });
  }

  resetForm() {
    this.kyc = {
      name: '', pan: '', dob: '', gender: '', mobile: '', email: '',
      address: '', city: '', state: '', pincode: '',
      accountHolder: '', accountNumber: '', ifsc: '', bankName: '',
      fund: '', amount: '', investmentType: '', startDate: '',
      photoBase64: ''
    };
    this.previewImage = null;
    this.showPreview = false;
  }

  downloadExcel(): void {
    this.kycService.exportKYC().subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'kyc-data.xlsx';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}

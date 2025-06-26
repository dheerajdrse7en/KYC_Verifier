import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KycFormComponent } from './components/kyc-form/kyc-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, KycFormComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}

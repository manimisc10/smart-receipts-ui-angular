import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReceiptService, ScanResult } from '../../../services/receipt.service';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.scss'
})
export class ScanComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  isScanning = false;
  isProcessing = false;
  showCamera = false;
  stream: MediaStream | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private receiptService: ReceiptService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      this.video.nativeElement.srcObject = this.stream;
      this.showCamera = true;
    } catch (error) {
      this.snackBar.open('Camera access denied. Please use file upload instead.', 'Close', {
        duration: 5000
      });
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.showCamera = false;
  }

  capturePhoto() {
    if (this.video && this.canvas) {
      const context = this.canvas.nativeElement.getContext('2d');
      if (context) {
        this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
        this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
        context.drawImage(this.video.nativeElement, 0, 0);
        
        this.canvas.nativeElement.toBlob((blob) => {
          if (blob) {
            this.selectedFile = new File([blob], 'receipt.jpg', { type: 'image/jpeg' });
            this.previewUrl = URL.createObjectURL(blob);
            this.stopCamera();
            this.processReceipt();
          }
        }, 'image/jpeg');
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
      this.processReceipt();
    }
  }

  selectFile() {
    this.fileInput.nativeElement.click();
  }

  processReceipt() {
    if (!this.selectedFile) return;

    this.isProcessing = true;
    this.receiptService.scanReceipt(this.selectedFile).subscribe({
      next: (result: ScanResult) => {
        this.isProcessing = false;
        this.snackBar.open('Receipt scanned successfully!', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/receipt', result.receipt.id]);
      },
      error: (error) => {
        this.isProcessing = false;
        this.snackBar.open('Failed to process receipt. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  reset() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.isProcessing = false;
    this.stopCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}

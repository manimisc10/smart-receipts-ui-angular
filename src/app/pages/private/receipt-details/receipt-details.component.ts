import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReceiptService, Receipt } from '../../../services/receipt.service';

@Component({
  selector: 'app-receipt-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './receipt-details.component.html',
  styleUrl: './receipt-details.component.scss'
})
export class ReceiptDetailsComponent implements OnInit {
  receipt: Receipt | null = null;
  isEditing = false;
  editForm: FormGroup;
  displayedColumns: string[] = ['serial', 'name', 'price', 'quantity', 'total'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private receiptService: ReceiptService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.editForm = this.fb.group({
      merchantName: [''],
      merchantAddress: [''],
      merchantPhone: [''],
      transactionDate: [''],
      category: ['']
    });
  }

  ngOnInit() {
    const receiptId = this.route.snapshot.paramMap.get('id');
    if (receiptId) {
      this.loadReceipt(receiptId);
    }
  }

  loadReceipt(id: string) {
    this.receiptService.getReceiptById(id).subscribe(receipt => {
      if (receipt) {
        this.receipt = receipt;
        this.editForm.patchValue({
          merchantName: receipt.merchantName,
          merchantAddress: receipt.merchantAddress,
          merchantPhone: receipt.merchantPhone,
          transactionDate: receipt.transactionDate,
          category: receipt.category || ''
        });
      } else {
        this.snackBar.open('Receipt not found', 'Close', { duration: 3000 });
        this.router.navigate(['/history']);
      }
    });
  }

  startEditing() {
    this.isEditing = true;
  }

  saveChanges() {
    if (this.receipt && this.editForm.valid) {
      const updatedReceipt: Receipt = {
        ...this.receipt,
        ...this.editForm.value
      };

      this.receiptService.updateReceipt(updatedReceipt).subscribe({
        next: (receipt) => {
          this.receipt = receipt;
          this.isEditing = false;
          this.snackBar.open('Receipt updated successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Failed to update receipt', 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancelEditing() {
    this.isEditing = false;
    this.editForm.patchValue({
      merchantName: this.receipt?.merchantName,
      merchantAddress: this.receipt?.merchantAddress,
      merchantPhone: this.receipt?.merchantPhone,
      transactionDate: this.receipt?.transactionDate,
      category: this.receipt?.category || ''
    });
  }

  deleteReceipt() {
    if (this.receipt) {
      if (confirm('Are you sure you want to delete this receipt?')) {
        this.receiptService.deleteReceipt(this.receipt.id).subscribe({
          next: (success) => {
            if (success) {
              this.snackBar.open('Receipt deleted successfully', 'Close', { duration: 3000 });
              this.router.navigate(['/history']);
            }
          },
          error: (error) => {
            this.snackBar.open('Failed to delete receipt', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  exportToPDF() {
    // Mock PDF export functionality
    this.snackBar.open('PDF export feature coming soon!', 'Close', { duration: 3000 });
  }

  exportToCSV() {
    // Mock CSV export functionality
    this.snackBar.open('CSV export feature coming soon!', 'Close', { duration: 3000 });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  goBack() {
    this.router.navigate(['/history']);
  }
}

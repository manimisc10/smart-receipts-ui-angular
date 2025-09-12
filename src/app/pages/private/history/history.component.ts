import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ReceiptService, Receipt } from '../../../services/receipt.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  receipts: Receipt[] = [];
  filteredReceipts: Receipt[] = [];
  searchQuery = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(private receiptService: ReceiptService) {}

  ngOnInit() {
    this.loadReceipts();
  }

  loadReceipts() {
    this.receiptService.getReceipts().subscribe(receipts => {
      this.receipts = receipts;
      this.filteredReceipts = receipts;
    });
  }

  applyFilters() {
    this.filteredReceipts = this.receipts.filter(receipt => {
      // Search by merchant name or items
      const matchesSearch = !this.searchQuery || 
        receipt.merchantName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        receipt.items.some(item => item.name.toLowerCase().includes(this.searchQuery.toLowerCase()));

      // Date range filter
      const matchesDateRange = !this.startDate || !this.endDate || 
        (receipt.transactionDate >= this.startDate && receipt.transactionDate <= this.endDate);

      // Price range filter
      const matchesPriceRange = (!this.minPrice || receipt.total >= this.minPrice) &&
                               (!this.maxPrice || receipt.total <= this.maxPrice);

      return matchesSearch && matchesDateRange && matchesPriceRange;
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.startDate = null;
    this.endDate = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.filteredReceipts = this.receipts;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}

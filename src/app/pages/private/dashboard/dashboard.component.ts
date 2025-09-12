import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService, User } from '../../../services/auth.service';
import { ReceiptService, Receipt } from '../../../services/receipt.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  receipts: Receipt[] = [];
  stats = {
    totalReceipts: 0,
    totalSpent: 0,
    thisMonth: 0,
    averagePerReceipt: 0
  };

  constructor(
    private authService: AuthService,
    private receiptService: ReceiptService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadReceipts();
  }

  loadReceipts() {
    this.receiptService.getReceipts().subscribe(receipts => {
      this.receipts = receipts;
      this.calculateStats();
    });
  }

  calculateStats() {
    this.stats.totalReceipts = this.receipts.length;
    this.stats.totalSpent = this.receipts.reduce((sum, receipt) => sum + receipt.total, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthReceipts = this.receipts.filter(receipt => {
      const receiptDate = new Date(receipt.transactionDate);
      return receiptDate.getMonth() === currentMonth && receiptDate.getFullYear() === currentYear;
    });
    this.stats.thisMonth = thisMonthReceipts.reduce((sum, receipt) => sum + receipt.total, 0);
    
    this.stats.averagePerReceipt = this.stats.totalReceipts > 0 
      ? this.stats.totalSpent / this.stats.totalReceipts 
      : 0;
  }

  getRecentReceipts(): Receipt[] {
    return this.receipts.slice(0, 5);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }
}

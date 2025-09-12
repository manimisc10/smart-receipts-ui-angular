import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReceiptService, Receipt } from '../../../services/receipt.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit {
  receipts: Receipt[] = [];
  analytics = {
    totalSpent: 0,
    averagePerReceipt: 0,
    totalReceipts: 0,
    thisMonth: 0,
    lastMonth: 0,
    topCategories: [] as { name: string; amount: number }[],
    monthlySpending: [] as { month: string; amount: number }[]
  };

  constructor(private receiptService: ReceiptService) {}

  ngOnInit() {
    this.loadReceipts();
  }

  loadReceipts() {
    this.receiptService.getReceipts().subscribe(receipts => {
      this.receipts = receipts;
      this.calculateAnalytics();
    });
  }

  calculateAnalytics() {
    this.analytics.totalReceipts = this.receipts.length;
    this.analytics.totalSpent = this.receipts.reduce((sum, receipt) => sum + receipt.total, 0);
    this.analytics.averagePerReceipt = this.analytics.totalReceipts > 0 
      ? this.analytics.totalSpent / this.analytics.totalReceipts 
      : 0;

    // Calculate monthly spending
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    this.analytics.thisMonth = this.receipts
      .filter(receipt => {
        const date = new Date(receipt.transactionDate);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, receipt) => sum + receipt.total, 0);

    this.analytics.lastMonth = this.receipts
      .filter(receipt => {
        const date = new Date(receipt.transactionDate);
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      })
      .reduce((sum, receipt) => sum + receipt.total, 0);

    // Calculate top categories
    const categoryMap = new Map<string, number>();
    this.receipts.forEach(receipt => {
      const category = receipt.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + receipt.total);
    });

    this.analytics.topCategories = Array.from(categoryMap.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Calculate monthly spending for the last 6 months
    this.analytics.monthlySpending = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const targetMonth = (currentMonth - i + 12) % 12;
      const targetYear = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      
      const monthTotal = this.receipts
        .filter(receipt => {
          const date = new Date(receipt.transactionDate);
          return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
        })
        .reduce((sum, receipt) => sum + receipt.total, 0);

      this.analytics.monthlySpending.push({
        month: months[targetMonth],
        amount: monthTotal
      });
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getPercentageChange(): number {
    if (this.analytics.lastMonth === 0) return 0;
    return ((this.analytics.thisMonth - this.analytics.lastMonth) / this.analytics.lastMonth) * 100;
  }

  getPercentageChangeColor(): string {
    const change = this.getPercentageChange();
    return change >= 0 ? '#4caf50' : '#f44336';
  }

  getBarHeight(amount: number): number {
    const maxAmount = Math.max(...this.analytics.monthlySpending.map(m => m.amount));
    return maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
  }

  getBarColor(amount: number): string {
    const maxAmount = Math.max(...this.analytics.monthlySpending.map(m => m.amount));
    const percentage = maxAmount > 0 ? amount / maxAmount : 0;
    
    if (percentage > 0.8) return 'linear-gradient(to top, #667eea, #764ba2)';
    if (percentage > 0.6) return 'linear-gradient(to top, #4facfe, #00f2fe)';
    if (percentage > 0.4) return 'linear-gradient(to top, #43e97b, #38f9d7)';
    return 'linear-gradient(to top, #f093fb, #f5576c)';
  }

  getCategoryPercentage(amount: number): number {
    const maxAmount = Math.max(...this.analytics.topCategories.map(c => c.amount));
    return maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
  }

  getCategoryColor(categoryName: string): string {
    const colors = [
      '#667eea', '#f093fb', '#4facfe', '#43e97b', '#f5576c',
      '#764ba2', '#f093fb', '#00f2fe', '#38f9d7', '#f093fb'
    ];
    const index = this.analytics.topCategories.findIndex(c => c.name === categoryName);
    return colors[index % colors.length];
  }

  Math = Math;
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Receipt {
  id: string;
  merchantName: string;
  merchantAddress: string;
  merchantPhone: string;
  transactionDate: Date;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  category?: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface ScanResult {
  receipt: Receipt;
  confidence: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private receipts: Receipt[] = [
    {
      id: '1',
      merchantName: 'Walmart',
      merchantAddress: '123 Main St, City, State 12345',
      merchantPhone: '(555) 123-4567',
      transactionDate: new Date('2024-01-15'),
      items: [
        { id: '1', name: 'Milk', price: 3.99, quantity: 1, total: 3.99 },
        { id: '2', name: 'Bread', price: 2.49, quantity: 2, total: 4.98 },
        { id: '3', name: 'Eggs', price: 4.99, quantity: 1, total: 4.99 }
      ],
      subtotal: 13.96,
      tax: 1.12,
      total: 15.08,
      category: 'Groceries',
      createdAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: '2',
      merchantName: 'Starbucks',
      merchantAddress: '456 Coffee Ave, City, State 12345',
      merchantPhone: '(555) 987-6543',
      transactionDate: new Date('2024-01-14'),
      items: [
        { id: '1', name: 'Caramel Macchiato', price: 5.45, quantity: 1, total: 5.45 },
        { id: '2', name: 'Blueberry Muffin', price: 3.25, quantity: 1, total: 3.25 }
      ],
      subtotal: 8.70,
      tax: 0.70,
      total: 9.40,
      category: 'Food & Beverage',
      createdAt: new Date('2024-01-14T08:15:00')
    },
    {
      id: '3',
      merchantName: 'Target',
      merchantAddress: '789 Shopping Blvd, City, State 12345',
      merchantPhone: '(555) 456-7890',
      transactionDate: new Date('2024-01-13'),
      items: [
        { id: '1', name: 'T-Shirt', price: 19.99, quantity: 1, total: 19.99 },
        { id: '2', name: 'Jeans', price: 39.99, quantity: 1, total: 39.99 },
        { id: '3', name: 'Socks', price: 8.99, quantity: 2, total: 17.98 }
      ],
      subtotal: 77.96,
      tax: 6.24,
      total: 84.20,
      category: 'Clothing',
      createdAt: new Date('2024-01-13T14:20:00')
    }
  ];

  constructor() {}

  getReceipts(): Observable<Receipt[]> {
    return of(this.receipts).pipe(delay(500));
  }

  getReceiptById(id: string): Observable<Receipt | undefined> {
    const receipt = this.receipts.find(r => r.id === id);
    return of(receipt).pipe(delay(300));
  }

  scanReceipt(file: File): Observable<ScanResult> {
    return new Observable(observer => {
      setTimeout(() => {
        const newReceipt: Receipt = {
          id: Date.now().toString(),
          merchantName: 'Scanned Store',
          merchantAddress: '123 Scanned St, City, State 12345',
          merchantPhone: '(555) 000-0000',
          transactionDate: new Date(),
          items: [
            { id: '1', name: 'Scanned Item 1', price: 10.00, quantity: 1, total: 10.00 },
            { id: '2', name: 'Scanned Item 2', price: 15.00, quantity: 1, total: 15.00 }
          ],
          subtotal: 25.00,
          tax: 2.00,
          total: 27.00,
          imageUrl: URL.createObjectURL(file),
          createdAt: new Date()
        };

        this.receipts.unshift(newReceipt);

        observer.next({
          receipt: newReceipt,
          confidence: 0.85
        });
        observer.complete();
      }, 2000);
    });
  }

  updateReceipt(receipt: Receipt): Observable<Receipt> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.receipts.findIndex(r => r.id === receipt.id);
        if (index !== -1) {
          this.receipts[index] = { ...receipt };
          observer.next(this.receipts[index]);
        } else {
          observer.error('Receipt not found');
        }
        observer.complete();
      }, 500);
    });
  }

  deleteReceipt(id: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.receipts.findIndex(r => r.id === id);
        if (index !== -1) {
          this.receipts.splice(index, 1);
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 300);
    });
  }

  searchReceipts(query: string): Observable<Receipt[]> {
    const filtered = this.receipts.filter(receipt =>
      receipt.merchantName.toLowerCase().includes(query.toLowerCase()) ||
      receipt.items.some(item => item.name.toLowerCase().includes(query.toLowerCase()))
    );
    return of(filtered).pipe(delay(300));
  }

  getReceiptsByDateRange(startDate: Date, endDate: Date): Observable<Receipt[]> {
    const filtered = this.receipts.filter(receipt =>
      receipt.transactionDate >= startDate && receipt.transactionDate <= endDate
    );
    return of(filtered).pipe(delay(300));
  }

  getReceiptsByPriceRange(minPrice: number, maxPrice: number): Observable<Receipt[]> {
    const filtered = this.receipts.filter(receipt =>
      receipt.total >= minPrice && receipt.total <= maxPrice
    );
    return of(filtered).pipe(delay(300));
  }
}

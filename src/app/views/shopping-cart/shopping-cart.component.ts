import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Product } from '@core/models/product';
import { Subject, takeUntil } from 'rxjs';
import { ArsCurrencyPipe } from '@shared/pipes/currency.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [NgFor, NgIf, ArsCurrencyPipe, MatIconModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  private readonly _localStorageService: LocalStorageService = inject(LocalStorageService);
  private readonly destroy$: Subject<void> = new Subject<void>();
  public items: Product[] = [];
  public total: number = 0;

  ngOnInit(): void {
    this._localStorageService.cart$
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (response: Product[]) => {
        this.items = response;
        this.total = 0;
        response.forEach((item) => {
          this.total += item.precio * item.cantidad;
        })
      },
      error: (err) => {
        // console.log(err);
      },
      complete: () => {
        // console.log("Se completo la subscripción");
        // No me gusta dejar console.logs en el código
      }
    });
  }

  trackByFn(index: number, item: Product): number {
    return item.id_producto;
  }

  updateQuantity(item: Product, action: string): void {
    this._localStorageService.setItem(item, action);
  }

  deleteItem(item: Product): void {
    this._localStorageService.deleteItem(item);
  }
}

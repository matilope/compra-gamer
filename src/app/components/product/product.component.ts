import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '@core/models/product';
import { ArsCurrencyPipe } from '@shared/pipes/currency.pipe';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgFor, NgIf, ArsCurrencyPipe, MatCardModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  @Input({ required: true }) product!: Product;
  private readonly _localStorageService: LocalStorageService = inject(LocalStorageService);
  private readonly destroy$: Subject<void> = new Subject<void>();
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  public alreadyExists: number[] = [];

  ngOnInit(): void {
    this._localStorageService.cart$
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (response: Product[]) => {
        response.forEach((item: Product) => {
          if (item.id_producto === this.product.id_producto) {
            this.alreadyExists.push(item.id_producto);
          }
        });
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

  openSnackBar(): void {
    this._snackBar.open("Se ha agregado al carrito", "Ok");
  }

  addToCart(event: Product): void {
    this._localStorageService.setItem(event, null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

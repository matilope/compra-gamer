import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Product } from '@core/models/product';
import { Subject, takeUntil } from 'rxjs';
import { ArsCurrencyPipe } from '@shared/pipes/currency.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [NgFor, NgIf, ArsCurrencyPipe, MatIconModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  private readonly _localStorageService: LocalStorageService = inject(LocalStorageService);
  private readonly destroy$: Subject<void> = new Subject<void>();
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  public dialog: MatDialog = inject(MatDialog);
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

  openSnackBar(message: string): void {
    this._snackBar.open(message, "Ok");
  }

  updateQuantity(item: Product, action: string): void {
    this._localStorageService.setItem(item, action);
    this.openSnackBar("Se ha actualizado el producto");
  }

  deleteItem(item: Product): void {
    const dialogRef = this.dialog.open(DialogContent)
    dialogRef.afterClosed().subscribe({
      next: (response) => {
        if(response) {
          this._localStorageService.deleteItem(item);
          this.openSnackBar("Se ha eliminado el producto del carrito");
        } else {
          this.openSnackBar("El producto no se ha eliminado del carrito");
        }
      }
    });
  }
}

@Component({
  selector: 'dialog-content',
  template: `
    <mat-dialog-content>
      <p>¿Estas seguro de eliminar el producto del carrito?</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button color="primary" mat-button [mat-dialog-close]="true">Aceptar</button>
      <button color="accent" mat-button [mat-dialog-close]="false">Cancelar</button>
    </mat-dialog-actions>
    `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogContent { }
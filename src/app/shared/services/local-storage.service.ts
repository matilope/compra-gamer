import { Injectable } from '@angular/core';
import { Product } from '@core/models/product';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private cartSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor() {
    this.updateData();
  }

  get cart$(): Observable<Product[]> {
    return this.cartSubject$.asObservable();
  }

  public setItem(product: Product, action: string | null): void {
    const data: Product[] = JSON.parse(localStorage.getItem("carrito") ?? "[]");
    const filter: Product = data.filter((p: Product) => p.id_producto === product.id_producto)[0];

    if (!filter) {
      product.cantidad = 1;
      data.push(product);
      localStorage.setItem("carrito", JSON.stringify(data));
    } else {
      const index: number = data.indexOf(filter);
      const productModify = data.splice(index, 1)[0];
      if (filter.cantidad < filter.stock) {
        if (action === 'add') {
          productModify.cantidad++;
        } else if (action === 'remove' && filter.cantidad > 1) {
          productModify.cantidad--;
        }
      } else if (action === 'remove' && filter.cantidad > 1) {
        productModify.cantidad--;
      }
      data.push(productModify);
      localStorage.setItem("carrito", JSON.stringify(data));
    }
    this.updateData();
  }

  public getItem(): Product[] | [] {
    return JSON.parse(localStorage.getItem("carrito") ?? "[]").sort((a, b) => a.id_producto - b.id_producto);
  }

  public deleteItem(product: Product): void {
    const data: Product[] = JSON.parse(localStorage.getItem("carrito") ?? "[]");
    const filter: Product = data.filter((p: Product) => p.id_producto === product.id_producto)[0];

    if (filter) {
      const index: number = data.indexOf(filter);
      data.splice(index, 1)[0];
      localStorage.setItem("carrito", JSON.stringify(data));
    }
    this.updateData();
  }

  public updateData(): void {
    this.cartSubject$.next(this.getItem());
  }
}

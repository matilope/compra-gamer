import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProductComponent } from '@components/product/product.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { Product } from '@core/models/product';
import { Subscription, forkJoin, switchMap } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { ProductService } from '@shared/services/product.service';
import { FiltersComponent } from '@components/filters/filters.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, ProductComponent, FiltersComponent, MatGridListModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly _productService: ProductService = inject(ProductService);
  public subscription!: Subscription;
  public safeProducts: Product[] = [];
  public products: Product[] = [];
  public option!: string;

  ngOnInit(): void {
    this.productsData();
  }

  trackByFn(index: number, item: Product): number {
    return item.id_producto;
  }

  categoryData(data: number): void {
    this.products = this.safeProducts;
    if (data !== 0) {
      this.products = this.products.filter(item => item.id_subcategoria === data);
      this.option = this.products[0].nombre_subcategoria;
    }
  }

  priceData(data: string): void {
    this.products = this.safeProducts;
    this.products.sort((a: Product, b: Product): number => {
      if (data === 'Mayor precio') {
        return b.precio - a.precio
      }
      return a.precio - b.precio
    });
  }

  productsData(): void {
    this.subscription = forkJoin([
      this._productService.getProducts(),
      this._productService.getSubcategories()
    ])
      .pipe(
        switchMap(([products, subcategories]) => {
          products.sort(() => Math.random() - 0.5);
          return products.map((product: Product) => {
            const subcategory = subcategories.find(idCategory => idCategory.id === product.id_subcategoria);
            return { ...product, nombre_subcategoria: subcategory ? subcategory.nombre.trim() : 'Sin subcategoría' };
          });
        })
      )
      .subscribe({
        next: (response: Product) => {
          this.safeProducts.push(response);
          this.products.push(response);
        },
        error: (err) => {
          // console.log(err);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

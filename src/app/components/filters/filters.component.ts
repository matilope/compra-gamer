import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { ProductService } from '@shared/services/product.service';
import { Subcategory } from '@core/models/subcategory';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [NgFor, NgIf, MatMenuModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  public subcategories: Subcategory[] = [];
  private subscription!: Subscription;
  private readonly _productService: ProductService = inject(ProductService);
  @Output() categoryEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() priceEvent: EventEmitter<string> = new EventEmitter<string>();
  @Input() public option!: string;

  ngOnInit(): void {
    this.subscription = this._productService.getSubcategories().subscribe({
      next: (response: Subcategory[]) => {
        response.forEach(item => {
          if (!this.subcategories.includes({ id: item.id, nombre: item.nombre.trim(), imagen: item.imagen })) {
            this.subcategories.push({ id: item.id, nombre: item.nombre.trim(), imagen: item.imagen })
          }
        });
      }
    });
  }

  trackByFn(index: number, item: Subcategory): number {
    return item.id;
  }

  reset(event: number): void {
    this.categoryEvent.emit(event);
    this.option = '';
  }

  emitProduct(event: number): void {
    this.categoryEvent.emit(event);
  }

  emitPrice(event: string): void {
    this.priceEvent.emit(event);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

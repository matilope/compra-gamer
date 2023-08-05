import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import { Subcategory } from '@core/models/subcategory';
import { Product } from '@core/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly _http: HttpClient = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(`${environment.backUrl}productos.json`);
  }

  getSubcategories(): Observable<Subcategory[]> {
    return this._http.get<Subcategory[]>(`${environment.backUrl}subcategorias.json`);
  }
}

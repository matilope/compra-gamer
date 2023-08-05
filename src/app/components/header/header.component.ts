import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Product } from '@core/models/product';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatToolbarModule, MatBadgeModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly _localStorageService: LocalStorageService = inject(LocalStorageService);
  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly renderer: Renderer2 = inject(Renderer2);
  public total: number = 0;
  @ViewChild('menuList') public menuList: ElementRef;

  ngOnInit(): void {
    this._localStorageService.cart$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response: Product[]) => {
          this.total = response.length;
        },
        error: (err) => {
          this.total = 0;
        },
        complete: () => {
          // console.log("Se completo la subscripción");
          // No me gusta dejar console.logs en el código
        }
      });
  }

  openNav(): void {
    if (!this.menuList.nativeElement.classList.contains('in-view')) {
      this.renderer.addClass(this.menuList.nativeElement, 'in-view');
    } else {
      this.renderer.removeClass(this.menuList.nativeElement, 'in-view');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Product } from '@core/models/product';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';
import { UserService } from '@shared/services/register.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterLink, MatIconModule, MatButtonModule, MatToolbarModule, MatBadgeModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly _localStorageService: LocalStorageService = inject(LocalStorageService);
  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly _userService: UserService = inject(UserService);
  public total: number = 0;
  public isLoggedIn: boolean = false;
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
      this._userService.getUsers().subscribe({
        next: (response) => {
          if(response[0]?.nombre) {
            this.isLoggedIn = true;
          }
        }
      })
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

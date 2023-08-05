import { CommonModule, NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@components/footer/footer.component';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, RouterOutlet, HeaderComponent, FooterComponent, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public giveOptionToScroll: boolean = false;

  @HostListener('scroll') public scroll(event: Event): void {
    console.log(event);
    if (event && document.body.scrollTop >= 100) {
      this.giveOptionToScroll = true;
    }
  }

}

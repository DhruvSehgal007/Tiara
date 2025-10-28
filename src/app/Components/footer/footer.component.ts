import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonTabBar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonTabBar, CommonModule],
})
export class FooterTabsComponent {
  constructor(private router: Router) { }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  // navigateToCategories() {
  //   this.router.navigate(['/search']);
  // }
  navigateToNotification() {
    this.router.navigate(['/notification']);
  }

  navigateToAddProduct() {
    this.router.navigate(['/ordere-accepted']);
  }

  navigateTomyaccount() {
    this.router.navigate(['/setting']);
  }

  isActive(paths: string[]): boolean {
    const currentRoute = this.router.url;
    return paths.some(path => currentRoute.startsWith(path));
  }
}

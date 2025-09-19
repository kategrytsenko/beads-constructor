import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  currentUser$ = this.authService.user$;
  currentRoute = '';
  isMobileMenuOpen = false;

  private authSubscription!: Subscription;
  private routerSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Subscribe to auth changes
    this.authSubscription = this.authService.authChange$$.subscribe(
      (authStatus: boolean) => {
        this.isAuth = authStatus;
      }
    );

    // Track current route for active navigation - FIXED typing
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRoute = (event as NavigationEnd).url;
        this.isMobileMenuOpen = false; // Close mobile menu on navigation
      });
  }

  onLogout() {
    this.authService.logout();
    this.isMobileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  isActiveRoute(route: string): boolean {
    if (route === '/' && this.currentRoute === '/') return true;
    if (route !== '/' && this.currentRoute.startsWith(route)) return true;
    return false;
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }
}

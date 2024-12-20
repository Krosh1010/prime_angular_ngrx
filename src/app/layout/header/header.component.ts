import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf, NgClass, NgStyle } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../../store/reducers/auth.reducers';
import { logout } from '../../store/actions/auth.actions';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigate.home';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isSidebarOpen = false;
  userInfo$: Observable<{ isLoggedIn: boolean; email: string | null }>;
  isDropdownOpen = false;
  isHovered = false;
  @Output() homeRequested = new EventEmitter<string>();

  constructor(private router: Router, private store: Store<{ auth: AuthState }>, private navigationService: NavigationService) {
    const isLoggedIn$ = this.store.select(state => !!state.auth.token);
    const email$ = this.store.select(state => state.auth.email);

    this.userInfo$ = combineLatest([isLoggedIn$, email$]).pipe(
      map(([isLoggedIn, email]) => ({ isLoggedIn, email }))
    );
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['']);
  }

  openDropdown() {
    this.isDropdownOpen = true;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }
  reloadPage() {
    this.navigationService.navigateToHome();
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private navigateHomeSource = new Subject<void>();
  navigateHome$ = this.navigateHomeSource.asObservable();

  navigateToHome() {
    this.navigateHomeSource.next(); // Emetem evenimentul pentru navigare
  }
}

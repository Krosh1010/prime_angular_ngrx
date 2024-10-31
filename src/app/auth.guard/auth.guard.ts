import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { AuthState } from '../store/reducers/auth.reducers';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<{ auth: AuthState }>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select((state) => state.auth.token).pipe(
      take(1), // Preia valoarea token-ului o singură dată
      map((token) => {
        if (token) {
          this.router.navigate(['']);
          return false;
        } else {
          // Dacă nu există token, permite accesul la pagina de logare
          return true;
        }
      })
    );
  }
}

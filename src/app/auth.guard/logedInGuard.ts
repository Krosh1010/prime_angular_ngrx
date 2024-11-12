
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthState } from '../store/reducers/auth.reducers';

@Injectable({
  providedIn: 'root',
})
export class LoggedInGuard implements CanActivate {
  constructor(private store: Store<{ auth: AuthState }>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select((state) => state.auth.token).pipe(
      take(1),
      map((token) => {
        const localToken = localStorage.getItem('token');
        
        // Dacă există token, redirecționează utilizatorul la pagina de start
        if (token || localToken) {
          this.router.navigate(['']); // sau orice altă pagină destinată utilizatorilor autentificați
          return false;
        }
        
        // Dacă nu există token, permite accesul la pagina de login/register
        return true;
      })
    );
  }
}

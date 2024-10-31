import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/auth.services';
import { login, loginFailure, loginSuccess } from '../actions/auth.actions';
import { Router } from '@angular/router';
import { AuthResponse } from '../../models/auth_model.reponse';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response: AuthResponse) => loginSuccess({ token: response.token })),
          tap(() => this.router.navigate(['/register'])),
          catchError((error) => of(loginFailure({ error: error.message })))
        )
      )
    )
  );
}

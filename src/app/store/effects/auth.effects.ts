import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/auth.services';
import { register, registerFailure, registerSuccess, login, loginFailure, loginSuccess } from '../actions/auth.actions';
import { Router } from '@angular/router';
import { AuthResponse } from '../../models/auth_model.reponse';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  // Efect pentru înregistrare
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      switchMap(({ email, password }) =>
        this.authService.register(email, password).pipe(
          map((response: AuthResponse) => registerSuccess({ token: response.token, email })),
          catchError((error) =>
            of(registerFailure({ error: 'Înregistrare eșuată. Vă rugăm să încercați din nou.' }))
          )
        )
      )
    )
  );

  registerSuccessRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registerSuccess),
        tap(() => this.router.navigate(['login'])) // Redirecționează utilizatorul către pagina de login
      ),
    { dispatch: false }
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response: AuthResponse) => loginSuccess({ token: response.token, email })),
          catchError((error) => 
            of(loginFailure({ error: 'Email sau parola incorectă.' }))
          )
        )
      )
    )
  );

  loginSuccessRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => this.router.navigate(['about']))
      ),
    { dispatch: false }
  );
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthResponse } from '../models/auth_model.reponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // URL-ul pentru json-server sau backend

  constructor(private http: HttpClient) {}

  // Metoda de înregistrare
  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      switchMap(users => {
        if (users.length > 0) {
          // Dacă utilizatorul există deja
          return throwError(() => new Error('Utilizatorul există deja.'));
        } else {
          // Dacă utilizatorul nu există, trimitem cererea POST
          return this.http.post<AuthResponse>(`${this.apiUrl}/users`, { email, password, token: 'fake-jwt-token' });
        }
      }),
      map(response => ({
        token: response.token,
        email: response.email
      })),
      catchError(() => {
        throw new Error('Înregistrare eșuată');
      })
    );
  }

  // Metoda de login
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}&password=${password}`).pipe(
      switchMap(users => {
        if (users.length === 1) {
          // Utilizatorul există și credentialele sunt corecte
          const user = users[0];
          return of({ token: user.token, email: user.email });
        } else {
          // Utilizatorul nu există sau credentialele sunt greșite
          return throwError(() => new Error('Email sau parola incorectă'));
        }
      }),
      catchError(() => {
        throw new Error('Autentificare eșuată');
      })
    );
  }
}

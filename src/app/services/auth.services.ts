import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthResponse } from '../models/auth_model.reponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = ''; // Lasă gol pentru a folosi mock-ul

  // Datele de login locale
  private mockEmail = '1@a.e';
  private mockPassword = '1';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    if (!this.apiUrl) {
      // Verifică dacă email-ul și parola sunt corecte
      if (email === this.mockEmail && password === this.mockPassword) {
        // Returnează un token fals pentru succes
        return of({ token: 'fake-token-for-testing' }).pipe(delay(10));
      } else {
        // Returnează o eroare dacă email-ul sau parola sunt incorecte
        return throwError(() => new Error('Invalid email or password')).pipe(delay(10));
      }
    }

    // Apelul HTTP real, dacă serverul este disponibil
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password });
  }
}

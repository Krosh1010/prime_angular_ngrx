// src/app/services/seo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SEOData } from '../models/seo_model';

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private apiUrl = 'https://example.com/api/seo-data';

  constructor(private http: HttpClient) {}

  getSEOData(): Observable<SEOData> {
    return this.http.get<SEOData>(this.apiUrl);
  }
}

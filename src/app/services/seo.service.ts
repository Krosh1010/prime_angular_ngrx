// src/app/services/seo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SEOData } from '../models/seo_model';

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private apiUrl = 'http://localhost:3000/seoData'; 

  constructor(private http: HttpClient) {}

  getSEOData(): Observable<SEOData> {
    return this.http.get<SEOData>(this.apiUrl);
  }
}

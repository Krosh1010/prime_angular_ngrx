import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeoDataService {
  private seoDataSource = new BehaviorSubject<any>(null);
  seoData$ = this.seoDataSource.asObservable();

  setSeoData(data: any) {
    this.seoDataSource.next(data);
  }
}

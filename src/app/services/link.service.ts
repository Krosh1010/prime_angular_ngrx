import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  private siteLinkSubject = new BehaviorSubject<string>(this.getStoredSiteLink());
  private siteNameSubject = new BehaviorSubject<string>(this.getStoredSiteName());

  siteLink$ = this.siteLinkSubject.asObservable();
  siteName$ = this.siteNameSubject.asObservable();

  updateSiteLink(link: string): void {
    this.siteLinkSubject.next(link);
    localStorage.setItem('siteLink', link); // Salvează în localStorage
  }

  updateSiteName(name: string): void {
    this.siteNameSubject.next(name);
    localStorage.setItem('siteName', name); // Salvează în localStorage
  }

  private getStoredSiteLink(): string {
    return localStorage.getItem('siteLink') || ''; // Încarcă din localStorage
  }

  private getStoredSiteName(): string {
    return localStorage.getItem('siteName') || ''; // Încarcă din localStorage
  }
}

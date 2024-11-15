import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SEOData } from '../../../models/seo_model';
import * as SEOActions from '../../../store/actions/seo.action';
import { selectSEOData} from '../../../store/selectors/seo.selectors';
import { NgStyle, CommonModule} from '@angular/common';

@Component({
  selector: 'app-ux',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ux.component.html',
  styleUrl: './ux.component.css'
})
export class UxComponent implements OnInit {
  seoData$: Observable<SEOData | null>;
  seoData: SEOData | null = null; // Stocăm datele locale

  constructor(private store: Store) {
    this.seoData$ = this.store.pipe(select(selectSEOData));
  }

  ngOnInit(): void {
    // Dispatch action to load SEO data when the component initializes
    this.store.dispatch(SEOActions.loadSEOData());

    // Abonează-te la seoData$ și actualizează seoData local
    this.seoData$.subscribe((data) => {
      this.seoData = data;
    });
  }

  getColor(value: number): string {
    if (value < 1.5) {
      return 'success';
    } else if (value < 5) {
      return 'warning';
    } else {
      return 'error';
    }
  }

  // Metoda pentru a returna iconița bazată pe valoare
  getIcon(value: number): string {
    if (value < 1.5) {
      return '✔️';
    } else if (value < 5) {
      return '⚠️';
    } else {
      return '❗';
    }
  }

  get indicatorPositionSRT() {
    if (!this.seoData) return '0px'; // Returnează 0px dacă seoData nu este încă disponibilă

    const maxSRT = 0.25; // Valoarea maximă de referință pentru 100%
    const maxWidth = 235; // Lățimea totală a barei, folosită în stilul CSS
    const position = (this.seoData.SRT / maxSRT) * maxWidth;

    return Math.min(position, maxWidth) + 'px'; 
  }
  get indicatorPositionCLS() {
    if (!this.seoData) return '0px'; // Returnează 0px dacă seoData nu este încă disponibilă

    const maxSRT = 1; // Valoarea maximă de referință pentru 100%
    const maxWidth = 235; // Lățimea totală a barei, folosită în stilul CSS
    const position = (this.seoData.CLS / maxSRT) * maxWidth;

    return Math.min(position, maxWidth) + 'px'; 
    
  }
  get indicatorPositionLCP() {
    if (!this.seoData) return '0px'; // Returnează 0px dacă seoData nu este încă disponibilă

    const maxSRT = 5.5; // Valoarea maximă de referință pentru 100%
    const maxWidth = 235; // Lățimea totală a barei, folosită în stilul CSS
    const position = (this.seoData.LCP / maxSRT) * maxWidth;

    return Math.min(position, maxWidth) + 'px'; 
  }

}

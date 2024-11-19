import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SEOData } from '../../../models/seo_model';
import * as SEOActions from '../../../store/actions/seo.action';
import { selectSEOData} from '../../../store/selectors/seo.selectors';
import { NgStyle, CommonModule} from '@angular/common';
import { ModalService } from '../../../services/desktop-phone.service';
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
  selectedOption: 'desktop' | 'phone' = 'desktop'; // Opțiunea selectată implicit

  constructor(private store: Store,
              private modalService: ModalService
  ) {
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

  get indicatorPositionLCP() {
    if (!this.seoData) return '0px'; // Returnează 0px dacă seoData nu este încă disponibilă
  
    const key = this.selectedOption === 'desktop' ? 'LCPd' : 'LCPp';
    const maxSRT = 5.5; // Valoarea maximă de referință pentru 100%
    const maxWidth = 235; // Lățimea totală a barei, folosită în stilul CSS
    const position = (this.seoData[key] / maxSRT) * maxWidth;
  
    return Math.min(position, maxWidth) + 'px'; 
  }
  
  get indicatorPositionCLS() {
    if (!this.seoData) return '0px';
  
    const key = this.selectedOption === 'desktop' ? 'CLSd' : 'CLSp';
    const maxCLS = 1;
    const maxWidth = 235;
    const position = (this.seoData[key] / maxCLS) * maxWidth;
  
    return Math.min(position, maxWidth) + 'px';
  }
  
  get indicatorPositionSRT() {
    if (!this.seoData) return '0px';
  
    const key = this.selectedOption === 'desktop' ? 'SRTd' : 'SRTp';
    const maxSRT = 0.25;
    const maxWidth = 235;
    const position = (this.seoData[key] / maxSRT) * maxWidth;
  
    return Math.min(position, maxWidth) + 'px';
  }

  selectOption(mode: 'desktop' | 'phone') {
    this.selectedOption = mode;
    this.modalService.setMode(mode); // Setează modul
    this.modalService.triggerOpenModal(); // Declanșează deschiderea modalului
  }
  getMetricValue(metric: 'LCP' | 'CLS' | 'SRT' | 'FCP' | 'TTI' | 'TBT' | 'SI') {
    const key = `${metric}${this.selectedOption === 'desktop' ? 'd' : 'p'}`;
    const value = this.seoData ? this.seoData[key] : null;
    // Transformă în number dacă este necesar
  return typeof value === 'number' ? value : parseFloat(value as string) || 0;
  }
  
  getMetricColor(metric: 'LCP' | 'CLS' | 'SRT' | 'FCP' | 'TTI' | 'TBT' | 'SI') {
    const value = this.getMetricValue(metric);
    return this.getColor(value);
  }
  
  getMetricIcon(metric: 'LCP' | 'CLS' | 'SRT' | 'FCP' | 'TTI' | 'TBT' | 'SI') {
    const value = this.getMetricValue(metric);
    return this.getIcon(value);
  }

}

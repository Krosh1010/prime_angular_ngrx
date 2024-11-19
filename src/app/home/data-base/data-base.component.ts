import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { SEOData } from '../../models/seo_model';
import { selectSEOData } from '../../store/selectors/seo.selectors';
import { loadSEOData } from '../../store/actions/seo.action';
import { CommonModule, NgIf } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { DoughnutChartService } from './SeoAnaliz/seoScore';
import { RadarChartService } from './SeoAnaliz/seoRadar';
import * as bootstrap from 'bootstrap';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UxComponent } from "./ux/ux.component";
import { ImportantIssuesComponent } from '../important-issues/important-issues.component';
import { KeywordOverviewComponent } from '../keyword-overview/keyword-overview.component';
import { LinkService } from '../../services/link.service';
import { ModalService } from '../../services/desktop-phone.service';


@Component({
  selector: 'app-data-base',
  standalone: true,
  imports: [CommonModule, FormsModule, UxComponent,NgIf, ImportantIssuesComponent, KeywordOverviewComponent],
  templateUrl: './data-base.component.html',
  styleUrls: ['./data-base.component.css']
})
export class DataBaseComponent implements OnInit, OnDestroy {
  seoData$: Observable<SEOData | null>;
  chart: Chart | null = null;
  private seoDataSubscription: Subscription | null = null;
  doughnutChart: Chart | null = null;
  seoScoreD: number = 0;
  seoScoreP: number = 0;
  countryCodes: { code: string; name: string; flag: string }[] = [];
  selectedCountryCode: string = '+373';
  phoneNumber: string = '';
  selectedCountry: { code: string; name: string; flag: string } | null = null;
  dropdownOpen = false;
  emailAddress: string = '';
  currentComponent: string = 'dataBase';
  private subscriptions: Subscription[] = [];
  @Input() siteLinkChange: string = ''; // Link-ul primit din HomeComponent
  @Input() siteNameChange: string = ''; // Denumirea site-ului
  private modalSubscription: Subscription | null = null;
  private modeSubscription: Subscription | null = null;
  showModal: boolean = false;
  currentMode: 'desktop' | 'phone' = 'desktop'; // Mod default

  constructor(
    private store: Store,
    private doughnutChartService: DoughnutChartService,
    private radarChartService: RadarChartService,
    private http: HttpClient,
    private linkService: LinkService,
    private modalService: ModalService
  ) {
    this.seoData$ = this.store.select(selectSEOData);
  }

  ngOnInit(): void {
    const savedComponent = localStorage.getItem('currentComponent');
    this.currentComponent = savedComponent ? savedComponent : 'dataBase';
    this.subscriptions.push(
      this.linkService.siteLink$.subscribe(link => {
        this.siteLinkChange = link;
      }),
      this.linkService.siteName$.subscribe(name => {
        this.siteNameChange = name;
      })
    );
    this.store.dispatch(loadSEOData());

    this.seoDataSubscription = this.seoData$.subscribe(data => {
      console.log(data);
      if (data) {
        this.seoScoreD = data.seoScoreD || 0;
        this.seoScoreP = data.seoScoreP || 0;
        // Generăm graficele inițial, în funcție de modul curent
        this.createRadarChart(data);
        this.createDoughnutChart(data);
      }
    });
    // Abonare la schimbarea modului
    this.modeSubscription = this.modalService.mode$.subscribe(mode => {
      this.currentMode = mode;
      // Re-creează graficele cu datele existente
      this.seoDataSubscription?.unsubscribe();
      this.seoDataSubscription = this.seoData$.subscribe(data => {
        if (data) {
          this.seoScoreD = data.seoScoreD || 0;
          this.seoScoreP = data.seoScoreP || 0;
          this.createRadarChart(data);
          this.createDoughnutChart(data);
        }
      });
    }); 
    

    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(data => {
      this.countryCodes = data.map(country => ({
        code: country.idd?.root && country.idd?.suffixes?.length
          ? `${country.idd.root}${country.idd.suffixes[0]}`
          : '',
        name: country.name.common,
        flag: country.flags?.svg
      })).filter(country => country.code);

      this.selectedCountry = this.countryCodes.find(country => country.code === this.selectedCountryCode) || null;
    });
    
  }
  updateSiteData(name: string, link: string): void {
    this.siteNameChange = name;
    this.siteLinkChange = link;
    localStorage.setItem('siteNameChange', this.siteNameChange);
    localStorage.setItem('siteLinkChange', this.siteLinkChange);
  }
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  selectCountry(country: { code: string; name: string; flag: string }): void {
    this.selectedCountry = country;
    this.selectedCountryCode = country.code;
    this.dropdownOpen = false;
    // Setează codul țării doar dacă nu există deja în input
  if (!this.phoneNumber.startsWith(this.selectedCountryCode)) {
    this.phoneNumber = `${this.selectedCountryCode} `;
  }
  }

  openCountry(): void {
    const modalElement = document.getElementById('customCountry');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  openRaport(): void {
    const modalElemente = document.getElementById('customRaport');
    if (modalElemente) {
      const modal = new bootstrap.Modal(modalElemente);
      modal.show();
    }
  }

  onSubmit(): void {
    alert(`Numărul de telefon cu prefixul selectat este:  ${this.phoneNumber}`);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.seoDataSubscription) {
      this.seoDataSubscription.unsubscribe();
    }
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.modalSubscription?.unsubscribe();
    this.modeSubscription?.unsubscribe();
  }

  getColor(value: number | undefined | null): string {
    if (value === null || value === undefined) return 'black';
    if (value <= 50) return 'red';
    if (value <= 80) return '#d4af37';
    return 'green';
  }

  createDoughnutChart(data: SEOData): void {
    const ctx = document.getElementById('seoDoughnutChart') as HTMLCanvasElement;
    // Distruge graficul existent dacă este deja creat
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
    }
    // Selectează scorul SEO corect în funcție de modul curent
    const currentSeoScore = this.currentMode === 'desktop' ? data.seoScoreD : data.seoScoreP;
    // Creează un grafic nou cu scorul selectat
    this.doughnutChart = this.doughnutChartService.createDoughnutChart(ctx, currentSeoScore);
  }
  
  

  createRadarChart(data: SEOData): void {
    const ctx = document.getElementById('seoRadarChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = this.radarChartService.createRadarChart(ctx, data);
  }
  copyLink() {
    const link = window.location.href; // Get the current link
    navigator.clipboard.writeText(link); // Copy the link to clipboard
  }
  showComponent(component: string) {
    this.currentComponent = component;
    localStorage.setItem('currentComponent', component);
  }
  getSeoScore(): number {
    const score = this.currentMode === 'desktop' ? this.seoScoreD : this.seoScoreP;
    console.log('Scor SEO returnat:', score);
    return score;
  }
  

}

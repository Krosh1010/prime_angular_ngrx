import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { SEOData } from '../../models/seo_model';
import { selectSEOData } from '../../store/selectors/seo.selectors';
import { loadSEOData } from '../../store/actions/seo.action';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { DoughnutChartService } from './SeoAnaliz/seoScore';
import { RadarChartService } from './SeoAnaliz/seoRadar';
import * as bootstrap from 'bootstrap';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-base',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-base.component.html',
  styleUrls: ['./data-base.component.css']
})
export class DataBaseComponent implements OnInit, OnDestroy, OnChanges {
  seoData$: Observable<SEOData | null>;
  chart: Chart | null = null;
  private seoDataSubscription: Subscription | null = null;
  doughnutChart: Chart | null = null;
  seoScore: number = 0;
  countryCodes: { code: string; name: string; flag: string }[] = [];
  selectedCountryCode: string = '+373';
  phoneNumber: string = '';
  selectedCountry: { code: string; name: string; flag: string } | null = null;
  dropdownOpen = false;
  emailAddress: string = '';
  @Input() siteLink: string = ''; // Link-ul primit din HomeComponent
  @Input() siteName: string = ''; // Denumirea site-ului

  constructor(
    private store: Store,
    private doughnutChartService: DoughnutChartService,
    private radarChartService: RadarChartService,
    private http: HttpClient
  ) {
    this.seoData$ = this.store.select(selectSEOData);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['siteName'] && changes['siteName'].currentValue) {
      this.siteName = changes['siteName'].currentValue;
      localStorage.setItem('siteName', this.siteName);
    }
    if (changes['siteLink'] && changes['siteLink'].currentValue) {
      this.siteLink = changes['siteLink'].currentValue;
      localStorage.setItem('siteLink', this.siteLink);
    }
  }

  ngOnInit(): void {
    this.siteName = localStorage.getItem('siteName') || this.siteName;
    this.siteLink = localStorage.getItem('siteLink') || this.siteLink;
    this.store.dispatch(loadSEOData());

    this.seoDataSubscription = this.seoData$.subscribe(data => {
      if (data) {
        this.createRadarChart(data);
        this.createDoughnutChart(data);
      }
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
    this.siteName = name;
    this.siteLink = link;
    localStorage.setItem('siteName', this.siteName);
    localStorage.setItem('siteLink', this.siteLink);
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
  }

  getColor(value: number | undefined | null): string {
    if (value === null || value === undefined) return 'black';
    if (value <= 50) return 'red';
    if (value <= 80) return '#d4af37';
    return 'green';
  }

  createDoughnutChart(data: SEOData): void {
    const ctx = document.getElementById('seoDoughnutChart') as HTMLCanvasElement;
    this.seoScore = data.seoScore ?? 0;
    this.doughnutChartService.createDoughnutChart(ctx, this.seoScore);
  }

  createRadarChart(data: SEOData): void {
    const ctx = document.getElementById('seoRadarChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = this.radarChartService.createRadarChart(ctx, data);
  }
  
}

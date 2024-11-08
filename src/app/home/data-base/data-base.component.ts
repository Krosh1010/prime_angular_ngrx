import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { SEOData } from '../../models/seo_model';
import { selectSEOData } from '../../store/selectors/seo.selectors';
import { loadSEOData } from '../../store/actions/seo.action';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { DoughnutChartService } from './SeoAnaliz/seoScore';
import { RadarChartService } from './SeoAnaliz/seoRadar';

@Component({
  selector: 'app-data-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-base.component.html',
  styleUrls: ['./data-base.component.css']
})
export class DataBaseComponent implements OnInit, OnDestroy {
  seoData$: Observable<SEOData | null>;
  chart: Chart | null = null;
  private seoDataSubscription: Subscription | null = null;
  doughnutChart: Chart | null = null;
  seoScore: number = 0;

  constructor(private store: Store,
    private doughnutChartService: DoughnutChartService,
    private radarChartService: RadarChartService
  ) {
    this.seoData$ = this.store.select(selectSEOData);
  }

  ngOnInit(): void {
    this.store.dispatch(loadSEOData());

    // Subscribe to seoData$ and create the chart
    this.seoDataSubscription = this.seoData$.subscribe(data => {
      if (data) {
        this.createRadarChart(data);
        this.createDoughnutChart(data);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up the chart and unsubscribe to prevent memory leaks
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.seoDataSubscription) {
      this.seoDataSubscription.unsubscribe();
    }
    if (this.doughnutChart) {
      this.doughnutChart.destroy(); // Clean up the doughnut chart
    }
  }
  getColor(value: number | undefined | null): string {
    if (value === null || value === undefined) return 'black'; // Default color for undefined values
    if (value <= 50) return 'red';
    if (value <= 80) return '#d4af37'; // Gold/yellow color for 50-80
    return 'green';
  }
  
  createDoughnutChart(data: SEOData): void {
    const ctx = document.getElementById('seoDoughnutChart') as HTMLCanvasElement;
    this.seoScore = data.seoScore ?? 0;

    // Folosim serviciul pentru a crea graficul
    this.doughnutChartService.createDoughnutChart(ctx, this.seoScore);
  }

  createRadarChart(data: SEOData): void {
    const ctx = document.getElementById('seoRadarChart') as HTMLCanvasElement;

    // Curățăm graficul existent, dacă există
    if (this.chart) {
      this.chart.destroy();
    }

    // Folosim serviciul pentru a crea graficul radar
    this.chart = this.radarChartService.createRadarChart(ctx, data);
  
  }
  
  
}

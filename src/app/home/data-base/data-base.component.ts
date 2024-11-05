import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { SEOData } from '../../models/seo_model';
import { selectSEOData } from '../../store/selectors/seo.selectors';
import { loadSEOData } from '../../store/actions/seo.action';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

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

  constructor(private store: Store) {
    this.seoData$ = this.store.select(selectSEOData);
  }

  ngOnInit(): void {
    this.store.dispatch(loadSEOData());

    // Subscribe to seoData$ and create the chart
    this.seoDataSubscription = this.seoData$.subscribe(data => {
      if (data) {
        this.createRadarChart(data);
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
  }
  getColor(value: number | undefined | null): string {
    if (value === null || value === undefined) return 'black'; // Default color for undefined values
    if (value <= 50) return 'red';
    if (value <= 80) return '#d4af37'; // Gold/yellow color for 50-80
    return 'green';
  }
  
  
  createRadarChart(data: SEOData): void {
    const ctx = document.getElementById('seoRadarChart') as HTMLCanvasElement;
  
    // Destroy existing chart to avoid duplication
    this.chart?.destroy();
  
    this.chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Optimizarea Încărcăturii', 'Desktop', 'Pornire JS', 'Interactiv', 'Mobile'],
        datasets: [{
          data: [
            data.loadingOptimization,
            data.desktop,
            data.jsStart,
            data.interactive,
            data.mobile
          ],
          backgroundColor: 'rgba(128, 128, 255, 0.2)',
          borderColor: 'rgba(128, 128, 255, 0.6)',
          borderWidth: 1
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          r: {
            angleLines: { color: '#ddd' },
            grid: { color: '#ddd' },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              display: true,
              color: '#666',
              font: { size: 10, family: 'Arial, sans-serif' },
              backdropColor: 'transparent'
            },
            pointLabels: {
              font: { size: 12, family: 'Arial, sans-serif', weight: 'bold' },
              color: '#666'
            }
          }
        }
      }
    });
  }
  
}

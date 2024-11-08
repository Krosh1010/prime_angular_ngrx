
import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { SEOData } from '../../../models/seo_model';

@Injectable({
  providedIn: 'root' 
})
export class RadarChartService {
  createRadarChart(ctx: HTMLCanvasElement, data: SEOData): Chart {
    
    return new Chart(ctx, {
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
              backdropColor: 'transparent',
              stepSize: 10
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


import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Injectable({
  providedIn: 'root',
})
export class DoughnutChartService {

  constructor() {}

  createDoughnutChart(ctx: HTMLCanvasElement, seoScore: number): Chart {
    // Alegerea culorii principale pe baza scorului
    let backgroundColor;
    if (seoScore <= 25) {
      backgroundColor = '#dc3545'; // roșu
    } else if (seoScore <= 50) {
      backgroundColor = '#ffc107'; // portocaliu
    } else if (seoScore <= 75) {
      backgroundColor = '#ffeb3b'; // galben
    } else {
      backgroundColor = '#28a745'; // verde
    }

    // Culoare mai deschisă pentru centrul cercului
    let lightBackgroundColor = this.adjustColorBrightness(backgroundColor, 0.7);

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [seoScore, 100 - seoScore],
          backgroundColor: [backgroundColor, '#e6e6e6'],
          hoverBackgroundColor: [backgroundColor, '#e6e6e6'],
          borderWidth: 0
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: (chart: Chart) => {
          const { width, height, ctx } = chart;
          ctx.restore();

          // Desenarea cercului central colorat
          const centerX = width / 2;
          const centerY = height / 2;
          const innerRadius = (chart as any).chartArea
            ? Math.min(chart.chartArea.right - chart.chartArea.left, chart.chartArea.bottom - chart.chartArea.top) / 2 * 0.7
            : 0;
          ctx.fillStyle = lightBackgroundColor;
          ctx.beginPath();
          ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
          ctx.fill();

          // Textul din centrul graficului
          ctx.font = 'bold 24px Arial';
          ctx.textBaseline = 'middle';
          const text = `${seoScore}`;
          const textX = Math.round((width - ctx.measureText(text).width) / 2);
          const textY = height / 2;
          ctx.fillStyle = '#666';
          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }]
    } as any);
  }

  // Funcție pentru a ajusta luminozitatea culorii
  adjustColorBrightness(color: string, factor: number): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const newR = Math.min(255, Math.floor(r + (255 - r) * factor));
    const newG = Math.min(255, Math.floor(g + (255 - g) * factor));
    const newB = Math.min(255, Math.floor(b + (255 - b) * factor));

    return `rgb(${newR}, ${newG}, ${newB})`;
  }
}

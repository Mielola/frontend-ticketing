import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-spline-chart',
  templateUrl: './spline-chart.component.html',
  styleUrls: ['./spline-chart.component.scss'],
})
export class SplineChartComponent {
  public config: any = {
    type: 'line',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            // Display as percentages
            callback: function(value: any) {
              return value + '%';  // Add percentage symbol to y-axis labels
            },
          },
        },
      },
    },
    data: {
      labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00','08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [20, 40, 60, 80],  // Use numeric values, not strings
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
          ],
          borderWidth: 1
        }
      ]
    }
  };

  chart: any;

  ngOnInit(): void {
    this.chart = new Chart('MyChart', this.config);
  }

  constructor() {}
}

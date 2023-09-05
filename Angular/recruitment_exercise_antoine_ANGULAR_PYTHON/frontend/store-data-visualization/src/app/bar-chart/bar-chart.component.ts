import {Component, Input, OnInit, Output} from '@angular/core';
import Chart from 'chart.js/auto';
import {Utils} from "ngx-bootstrap/utils";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit{
  public chart: any;
  @Input() visitorsData: Record<string, number> = {};
  @Input() turnoverData: Record<string, number> = {};

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
    const labels = Object.keys(this.visitorsData);
    const visitorsValues = Object.values(this.visitorsData);
    const turnoverValues = Object.values(this.turnoverData);

    this.chart = new Chart("MyChart", {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Visitors',
            data: visitorsValues,
            backgroundColor: `rgba(0, 0, 255, 0.5)`,
            borderColor: `rgba(0, 0, 255, 1)`,
            borderWidth: 2,
          },
          {
            label: 'Turnover',
            data: turnoverValues,
            backgroundColor: `rgba(194, 112, 253, 0.5)`,
            borderColor: `rgba(194, 112, 253, 1)`,
            borderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Bar Chart'
          }
        }
      }
    });
  }
}

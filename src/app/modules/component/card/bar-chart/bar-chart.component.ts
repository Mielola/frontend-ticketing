import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import ApexCharts from 'apexcharts';
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexTooltip,
    ApexStroke,
    NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
};

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    standalone: true,
    imports: [NgApexchartsModule],
    styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnChanges {
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    data: any = {}
    @Input() seriesData: ApexAxisChartSeries = [];
    @Input() header: string = '';
    @Input() labels: string[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        this.chartOptions = {
            series: this.seriesData || [],
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: true,
                enabledOnSeries: [1],
                style: {
                    fontSize: '18px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                }
            },
            stroke: {
                curve: "straight",
                width: [0, 4]
            },
            xaxis: {
                categories: this.labels || []
            }
        };
    }
}
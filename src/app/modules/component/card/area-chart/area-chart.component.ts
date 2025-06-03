import { CommonModule } from '@angular/common';
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
    colors: string[];
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
    fill: ApexFill;
    dataLabels: ApexDataLabels;
};

@Component({
    selector: 'app-area-chart',
    templateUrl: './area-chart.component.html',
    standalone: true,
    imports: [NgApexchartsModule, CommonModule,],
    styleUrls: ['./area-chart.component.scss'],
})
export class AreaChartComponent implements OnChanges {
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    data: any = {}
    @Input() seriesData: ApexAxisChartSeries = [];
    @Input() header: string = '';
    @Input() labels: string[] = [];

    constructor() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        this.chartOptions = {
            colors: ["#26e7a6"],
            series: this.seriesData,
            chart: {
                id: "dailyHumadityChart",
                height: 350,
                type: "area",
                dropShadow: {
                    enabled: true,
                    top: 4,
                    left: 2,
                    blur: 6,
                    opacity: 0.5,
                    color: "#26e7a6",
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => val !== null ? `${val} Ticket` : "N/A",
                style: {
                    fontWeight: "bold",
                    colors: ["#26e7a6"],
                    fontSize: "12px"
                },
                background: {
                    enabled: true,
                    foreColor: "#fff",
                    borderRadius: 4,
                    padding: 4,
                    opacity: 0.9,
                    borderWidth: 1,
                    borderColor: "#26e7a6",
                    dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 1,
                        blur: 3,
                        opacity: 0.3,
                        color: "#26e7a6",
                    },
                },
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100]
                }
            },
            stroke: { curve: "smooth", width: 2, colors: ["#26e7a6"] },
            xaxis: {
                categories: this.labels
            },
        };
    }
}
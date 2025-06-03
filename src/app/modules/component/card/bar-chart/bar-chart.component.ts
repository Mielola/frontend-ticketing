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
    plotOptions: ApexPlotOptions;
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
                type: 'bar',
                zoom: {
                    enabled: false
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: "45%",
                    distributed: true,
                    borderRadius: 5,
                    borderRadiusApplication: "around",
                }
            },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => val !== null ? `${val} Ticket` : "N/A",
                style: {
                    fontWeight: "bold",
                    colors: ["#3ECA22"],
                    fontSize: "12px"
                },
                background: {
                    enabled: true,
                    foreColor: "#fff",
                    borderRadius: 4,
                    padding: 4,
                    opacity: 0.9,
                    borderWidth: 1,
                    borderColor: "#3ECA22",
                    dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 1,
                        blur: 3,
                        opacity: 0.3,
                        color: "#3ECA22",
                    },
                },
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
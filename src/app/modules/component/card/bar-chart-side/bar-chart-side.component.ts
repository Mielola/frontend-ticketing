import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexTooltip,
    ApexStroke,
    NgApexchartsModule,
    ApexPlotOptions,
    ApexYAxis,
    ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle,
    stroke: ApexStroke;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    subtitle: ApexTitleSubtitle;
    colors: string[];
};

@Component({
    selector: 'app-bar-chart-side',
    templateUrl: './bar-chart-side.component.html',
    standalone: true,
    imports: [NgApexchartsModule],
    styleUrls: ['./bar-chart-side.component.scss'],
})
export class BarChartSideComponent implements OnChanges {
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    data: any = {}
    @Input() seriesData: ApexAxisChartSeries = [];
    @Input() header: string = '';
    @Input() labels: string[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        this.chartOptions = {
            series: this.seriesData,
            chart: {
                type: "bar",
                height: 380
            },
            plotOptions: {
                bar: {
                    barHeight: "100%",
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: "bottom"
                    }
                }
            },
            colors: [
                "#FEB019",
                "#FF4560",
                "#008FFB",
                "#00E396",
            ],
            dataLabels: {
                enabled: true,
                textAnchor: "start",
                style: {
                    colors: ["#fff"]
                },
                formatter: function (val, opt) {
                    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val + "";
                },
                offsetX: 0,
                dropShadow: {
                    enabled: true
                }
            },
            stroke: {
                width: 1,
                colors: ["#fff"]
            },
            xaxis: {
                categories: this.labels
            },
            yaxis: {
                labels: {
                    show: false
                }
            },
            tooltip: {
                theme: "dark",
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function () {
                            return "Ticket Resolved";
                        }
                    }
                }
            }
        };
    }
}
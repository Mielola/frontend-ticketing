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
                    barHeight: "45%",
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
                    fontWeight: "bold",
                    colors: ["#3ECA22"],
                    fontSize: "12px"
                },
                formatter: function (val, opt) {
                    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val + "";
                },
                offsetX: 0,
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
                            return "Ticket";
                        }
                    }
                }
            }
        };
    }
}
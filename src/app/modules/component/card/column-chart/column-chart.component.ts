import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { FuseCardComponent } from "@fuse/components/card";
import {
    ApexChart,
    ApexAxisChartSeries,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexGrid,
    NgApexchartsModule
} from "ng-apexcharts";

type ApexXAxis = {
    type?: "category" | "datetime" | "numeric";
    categories?: any;
    labels?: {
        style?: {
            colors?: string | string[];
            fontSize?: string;
        };
    };
};

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    grid: ApexGrid;
    colors: string[];
    legend: ApexLegend;
    stroke: ApexStroke;
};

@Component({
    selector: 'app-column-chart',
    standalone: true,
    imports: [NgApexchartsModule],
    templateUrl: './column-chart.component.html',
    styleUrls: ['./column-chart.component.scss'],
})
export class ColumnChartComponent implements OnChanges {
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    @Input() seriesData: ApexAxisChartSeries = [];
    @Input() header: string = '';
    @Input() labels: string[] = [];
    @Input() param?: string = '';


    constructor(
        private router: Router,
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.chartOptions = {
            series: this.seriesData,
            chart: {
                height: 350,
                type: "bar",
                events: {
                    click: (event, chartContext, config) => {
                        if (this.param !== '' && this.param !== undefined && this.param !== null) {
                            const clickedIndex = config.dataPointIndex;
                            const label = this.labels[clickedIndex];

                            this.router.navigate([`/dashboards/tickets/${this.param}`, label]);
                        }
                    }
                }
            },
            colors: [
                "#008FFB",
                "#00E396",
                "#FEB019",
                "#FF4560",
                "#008FFB",
                "#00E396",
                "#FEB019",
                "#FF4560",
                "#008FFB",
                "#00E396",
                "#FEB019",
                "#FF4560",
            ],
            plotOptions: {
                bar: {
                    columnWidth: "45%",
                    distributed: true,
                    borderRadius: 5,
                    borderRadiusApplication: "end",
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
            legend: {
                show: false
            },
            grid: {
                borderColor: '#e7e7e7',
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
            },
            stroke: {
                curve: "straight",
                width: [0, 4]
            },
            xaxis: {
                categories: this.labels,
                labels: {
                    style: {
                        colors: [
                            "#008FFB",
                            "#00E396",
                            "#FEB019",
                            "#FF4560",
                            "#008FFB",
                            "#00E396",
                            "#FEB019",
                            "#FF4560",
                            "#008FFB",
                            "#00E396",
                            "#FEB019",
                            "#FF4560",
                        ],
                        fontSize: "12px"
                    }
                }
            }
        };
    }
}

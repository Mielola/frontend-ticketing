import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
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


    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.chartOptions = {
            series: this.seriesData,
            chart: {
                height: 350,
                type: "bar",
                events: {
                    click: function (chart, w, e) {
                        // console.log(chart, w, e)
                    }
                }
            },
            colors: [
                "#008FFB",
                "#00E396",
                "#FEB019",
                "#FF4560",
            ],
            plotOptions: {
                bar: {
                    columnWidth: "45%",
                    distributed: true
                }
            },
            dataLabels: {
                enabled: true,
                style: {
                    fontWeight: 600,
                    fontSize : '24px',
                },
                background: {
                    padding: 5,
                    foreColor: '#FF4560'
                }
            },
            legend: {
                show: false
            },
            grid: {
                show: true
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
                        ],
                        fontSize: "12px"
                    }
                }
            }
        };
    }
}

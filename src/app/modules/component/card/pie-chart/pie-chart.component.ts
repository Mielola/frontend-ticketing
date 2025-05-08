import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FuseCardComponent } from '@fuse/components/card';
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexTooltip,
    ApexStroke,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexLegend,
    NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
    series: ApexNonAxisChartSeries; // Pie chart uses non-axis series
    chart: ApexChart;
    labels: string[];
    dataLabels: ApexDataLabels;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    responsive: ApexResponsive[];
    legend: ApexLegend;
};

@Component({
    selector: 'app-pie-chart',
    standalone: true,
    imports: [NgApexchartsModule, FuseCardComponent],
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnChanges {
    @ViewChild("chart") chart!: ChartComponent;
    @Input() seriesData: ApexNonAxisChartSeries = [];
    @Input() header: string = '';
    @Input() labels: string[] = [];

    public chartOptions: Partial<ChartOptions> = {};

    ngOnChanges(changes: SimpleChanges): void {
        this.chartOptions = this.getChartOptions();
    }

    getChartOptions(): Partial<ChartOptions> {
        return {
            series: this.seriesData || [],
            chart: {
                height: 350,
                width: "100%",
                type: "pie"
            },
            labels: this.labels || [],
            dataLabels: {
                enabled: true,
                style: {
                    fontFamily: "Inter, sans-serif"
                }
            },
            stroke: {
                colors: ["#fff"]
            },
            legend: {
                position: "bottom",
                fontFamily: "Inter, sans-serif"
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 300
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ]
        };
    }
}

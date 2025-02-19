import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import ApexCharts from 'apexcharts';
import { data } from './data';
import { FuseCardComponent } from '@fuse/components/card';
import { ApexChartsComponent } from 'app/modules/admin/ui/other-components/third-party/apex-charts/apex-charts.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
    selector: 'app-area-chart',
    templateUrl: './area-chart.component.html',
    standalone: true,
    imports: [FuseCardComponent, ApexChartsComponent, NgApexchartsModule],
    styleUrls: ['./area-chart.component.scss'],
})
export class AreaChartComponent implements AfterViewInit {
    @ViewChild('chart', { static: false }) chartElement!: ElementRef;

    public chartOptions: any;

    constructor() {
        this.chartOptions = {
            chart: {
                height: 350,
                maxWidth: "100%",
                type: "area",
                fontFamily: "Inter, sans-serif",
                dropShadow: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            tooltip: {
                enabled: true,
            },
            fill: {
                type: "gradient",
                gradient: {
                    opacityFrom: 0.55,
                    opacityTo: 0,
                    shade: "#1C64F2",
                    gradientToColors: ["#1C64F2"],
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 6,
            },
            grid: {
                show: false
            },
            series: [
                {
                    name: "New users",
                    data: data,
                    color: "#1A56DB",
                },
            ],
            xaxis: {
                type: 'datetime', // Menggunakan format waktu pada sumbu X
                categories: [
                    '2024-02-01', '2024-02-02', '2024-02-03', '2024-02-04',
                    '2024-02-05', '2024-02-06', '2024-02-07'
                ],
                labels: {
                    format: 'dd MMM', // Format waktu untuk label X axis
                    style: {
                        colors: '#9aa0ac',
                        fontSize: '12px'
                    }
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
            },
            yaxis: {
                min: 0, // Rentang minimum
                max: 100, // Rentang maksimum
                tickAmount: 5, // Menentukan 5 tick (20%, 40%, 60%, 80%, 100%)
                labels: {
                    formatter: function (val: number) {
                        return val + "%"; // Format label sebagai persentase
                    },
                    style: {
                        colors: '#9aa0ac',
                        fontSize: '12px'
                    }
                },
            },
        };
    }

    ngAfterViewInit(): void {
        const chart = new ApexCharts(this.chartElement.nativeElement, this.chartOptions);
        chart.render();
    }
}

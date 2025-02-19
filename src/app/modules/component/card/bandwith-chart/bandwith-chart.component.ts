import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as ApexCharts from 'apexcharts';

@Component({
  selector: 'app-bandwith-chart',
  templateUrl: './bandwith-chart.component.html',
  styleUrls: ['./bandwith-chart.component.scss'],
})
export class BandwithChartComponent {

  @ViewChild('chart', { static: false }) chartElement!: ElementRef;
  public chartOptions: any;
  public downloadData: number[] = [];
  public uploadData: number[] = [];
  private chart: any

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fetchData();
    setInterval(() => {
      this.fetchData(); // Fetch new data periodically (e.g., every 10 seconds)
    }, 100);
  }

  // Simulasi respons API
  getApiResponse() {
    return {
      total_bytes_in: Math.floor(Math.random() * 5000000000), // Simulasi nilai acak
      total_bytes_out: Math.floor(Math.random() * 5000000000), // Simulasi nilai acak
    };
  }

  fetchData() {
    const response = this.getApiResponse();
    const totalBytesIn = response.total_bytes_in;
    const totalBytesOut = response.total_bytes_out;

    // Konversi bytes ke Mbps
    const bytesInMbps = this.convertBytesToMbps(totalBytesIn);
    const bytesOutMbps = this.convertBytesToMbps(totalBytesOut);

    // Simpan data baru ke array
    this.downloadData.push(bytesInMbps);
    this.uploadData.push(bytesOutMbps);

    // Update chart dengan data baru
    this.updateChart();
  }

  private updateChart() {
    if (this.chart) {
      this.chart.updateSeries([
        {
          name: 'Download',
          data: this.downloadData
        },
        {
          name: 'Upload',
          data: this.uploadData
        }
      ]
      );
    }
  }

  // Fungsi untuk konversi bytes ke Mbps
  convertBytesToMbps(bytes: number): number {
    return (bytes * 8) / (1024 * 1024);
  }


  constructor() {

    this.chartOptions = {
      chart: {
        height: 350,
        maxWidth: "100%",
        type: "line",
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        shared: true,
        y: {
          formatter: (val: number) => `${val} Mbps`,
        }
      },
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      series: [
        {
          name: "Download",
          data: this.downloadData,
          color: "#1A56DB",
        },
        {
          name: "Upload",
          data: this.uploadData,
          color: "#1C64F2",
        },
      ],
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        min: 0, // Rentang minimum 0 Mbps
        max: 40, // Rentang maksimum 40 Mbps (sesuaikan dengan data real)
        tickAmount: 4, // Menampilkan 4 tick (0, 10, 20, 30, 40)
        labels: {
          formatter: function (val: number) {
            return `${val} Mbps`; // Format label Y axis sebagai Mbps
          },
          style: {
            colors: '#9aa0ac',
            fontSize: '12px'
          }
        },
      },
      grid: {
        show: false
      },
    };
  }

  ngAfterViewInit(): void {
    const chart = new ApexCharts(this.chartElement.nativeElement, this.chartOptions);
    chart.render();
  }

}

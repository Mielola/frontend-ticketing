import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IonLoading } from '@ionic/angular/standalone';
import { ApiService } from 'app/services/api.service';
import { DateTime } from 'luxon';
import { Platform } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { products } from 'app/mock-api/apps/ecommerce/inventory/data';
import { ApexAnnotations, ApexLegend, ApexStroke, ApexTooltip, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
} from "ng-apexcharts";
import { Capacitor } from '@capacitor/core';
import { MatDialogRef } from '@angular/material/dialog';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  legend: ApexLegend;
};

@Component({
  selector: 'app-genereate-report',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    IonLoading,
    MatDatepickerModule,
    MatOptionModule,
    MatSelectModule,
    CommonModule,
    NgApexchartsModule,
  ],
  templateUrl: './genereate-report.component.html',
})
export class GenereateReportComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;

  generateForm!: FormGroup
  isLoading: boolean = false
  products: string[] = [];
  hiddenChart: boolean = false;
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @ViewChild('chartContainer2', { static: false }) chartContainer2!: ElementRef;


  selectedStatus: string = '';
  statusList: string[] = ['All', 'New', 'On Progress', 'Resolved']

  constructor(
    private _apiService: ApiService,
    private fb: FormBuilder,
    private platform: Platform,
    private toast: ToastrService,
    public dialogRef: MatDialogRef<GenereateReportComponent>,
  ) {

  }

  ngOnInit(): void {
    this.generateForm = this.fb.group({
      products_name: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      status: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
    })

    this.fetchData()
  }

  async fetchData() {
    try {
      const get = await this._apiService.get("api/V1/list-products");
      this.products = get.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async generateReport() {
    try {
      if (this.generateForm.valid) {
        this.isLoading = true
        const formatDate = (date: any) => {
          if (!date) return null;
          return DateTime.fromJSDate(new Date(date)).toISODate();
        };

        const formData = {
          products_name: this.generateForm.value.products_name,
          start_date: formatDate(this.generateForm.value.start_date),
          end_date: formatDate(this.generateForm.value.end_date),
          start_time: this.generateForm.value.start_time,
          end_time: this.generateForm.value.end_time,
          status: this.selectedStatus
        }

        const post = await this._apiService.post("api/V1/report", formData)
        this.chartOptions = {
          series: [
            {
              data: post.data.chart.ChartPriority.map((item: any) => item.value),
              type: "column",
              color: '#0d3b5f'
            },
            {
              data: post.data.chart.ChartPriority.map((item: any) => item.value),
              type: "line",
              color: '#669940',
            },
          ],
          legend: {
            show: false
          },
          chart: {
            type: "line",
            animations: {
              enabled: false
            },
            toolbar: {
              show: false,
            }
          },
          tooltip: {
            enabled: false
          },
          stroke: {
            width: [0, 4]
          },
          xaxis: {
            categories: post.data.chart.ChartPriority.map((item: any) => item.label),
            labels: {
              style: {
                fontSize: '18px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                colors: '#000000'
              }
            }
          },
          yaxis: {
            tickAmount: 5,
            forceNiceScale: true,
            labels: {
              formatter: function (val: number) {
                return Number.isInteger(val) ? val.toString() : '';
              }
            }
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: [1],
            style: {
              fontSize: '26px',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }
          },
        };

        this.chartOptions2 = {
          series: [
            {
              data: post.data.chart.ChartCategory.map((item: any) => item.total_tickets),
              type: "column",
              color: '#0d3b5f'
            },
            {
              data: post.data.chart.ChartCategory.map((item: any) => item.total_tickets),
              type: "line",
              color: '#669940'
            },
          ],
          legend: {
            show: false
          },
          chart: {
            type: "line",
            animations: {
              enabled: false
            },
            toolbar: {
              show: false,
            }
          },
          tooltip: {
            enabled: false
          },
          stroke: {
            width: [0, 4]
          },
          xaxis: {
            categories: post.data.chart.ChartCategory.map((item: any) => item.category_name),
            labels: {
              style: {
                fontSize: '18px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                colors: '#000000'
              }
            }
          },
          yaxis: {
            tickAmount: 5,
            forceNiceScale: true,
            decimalsInFloat: 1,
            labels: {
              formatter: function (val: number) {
                return Number.isInteger(val) ? val.toString() : '';
              }
            }
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: [1],
            style: {
              fontSize: '26px',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }
          },
        };

        await new Promise(resolve => setTimeout(resolve, 500));
        await this.generateTable(post)
      } else {
        console.log("Form is not valid")
      }

      this.isLoading = false
    } catch (error) {
      this.isLoading = false
      throw error
    }
  }


  async savePdfToDevice(doc: jsPDF, filename: string) {
    try {
      const pdfOutput = doc.output('datauristring');
      const base64Data = pdfOutput.split(',')[1];

      const filePath = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true
      });

      this.toast.success(`PDF Successfully Downloaded ${filePath.uri}`, "Success Download", {
        tapToDismiss: true,
      }).onTap.pipe(take(1)).subscribe(async () => {
        try {
          if (this.platform.is('android') || this.platform.is('ios')) {
            const fileOpenerOptions: FileOpenerOptions = {
              filePath: filePath.uri,
              contentType: 'application/pdf',
              openWithDefault: true,
            };
            await FileOpener.open(fileOpenerOptions);
            return;
          }
        } catch (error) {
          console.error('Error opening file:', error);
        }
      })
    } catch (error) {
      console.error('Error saving file:', error);
    }

  }


  async generateTable(data: any, chartPriority?: any) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    let y = margin;
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const headerHeight = 100; // Define the height of your header for spacing

    // Helper function to add a new page if needed
    const checkAndAddPage = (height: number) => {
      if (y + height > pageHeight - margin) {
        doc.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    // Function to add header to a page
    const addHeader = (pageNumber: number) => {
      doc.setPage(pageNumber);
      const logoCC = 'images/logo/commandcenter.png';
      const logoADV = 'images/logo/logo-adhivasindo.png';

      // 1️⃣ Gambar garis dulu supaya di bawah
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(37);
      doc.line(margin - 10, y, pageWidth, y);

      // 2️⃣ Setelah itu baru gambar logo dan teks (biar tampil di atas garis)
      doc.setFont("helvetica", "normal");
      doc.addImage(logoCC, 'PNG', margin, y, 30, 0);
      doc.addImage(logoADV, 'PNG', margin + 35, y, 40, 0);

      doc.setFontSize(8);
      doc.text('adhivasindo.co.id   022-7508499   admin@adhivasindo.co.id', 125, y);
      doc.text('Jln. Edelweiss CRC 011 Ruko Crystal Summarecon ', 135, y + 5);
      doc.text('Kec.Gedebage  Kota Bandung  ', 160, y + 10);

      y += 20;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(3);
      doc.line(margin - 10, y - 5, pageWidth - 150, y - 5);
      y += 1;
      doc.setLineWidth(0.5);
      doc.line(margin - 10, y - 5, pageWidth, y - 5);
      y += 10;
    };

    // Add header only to the first page
    addHeader(1);

    // Add title
    doc.setTextColor(110, 170, 30); // RGB hijau
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(` LAPORAN HARIAN ${this.generateForm.value.products_name}`, pageWidth / 2, y, { align: 'center' });
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setLineHeightFactor(1.5)
    const text = `Pertanggal ${new Date(this.generateForm.value.end_date).toLocaleDateString('id-ID', options)} ( Aduan masuk dari tanggal ${new Date(this.generateForm.value.start_date).toLocaleDateString('id-ID', options)} Pukul ${this.generateForm.value.start_time} WIB - ${new Date(this.generateForm.value.end_date).toLocaleDateString('id-ID', options)} Pukul ${this.generateForm.value.end_time} WIB )`;

    // Tentukan batas lebar teks sebelum dipisah (misalnya setengah dari pageWidth)
    const maxWidth = pageWidth * 0.75;
    const splitText = doc.splitTextToSize(text, maxWidth);

    // Cetak teks yang sudah dipecah menjadi beberapa baris
    doc.text(splitText, pageWidth / 2, y, { align: 'center' });
    y += 20;

    // Warna Hijau untuk Judul
    doc.setTextColor(110, 170, 30); // RGB hijau

    // Judul 1
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Pendahuluan", 20, y);
    y += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    // Paragraf isi dengan auto wrap
    doc.setLineHeightFactor(1.5)
    doc.text(`Laporan ini disusun untuk memberikan gambaran mengenai perkembangan penanganan error yang terjadi dalam proyek IT. Dalam periode laporan ini, kami telah mengidentifikasi, menganalisis, dan menangani sejumlah error yang mempengaruhi kinerja aplikasi. Tujuan dari laporan ini adalah untuk memberikan transparansi mengenai status penanganan error dan langkah-langkah yang diambil untuk meningkatkan kualitas aplikasi.`, 20, y, { maxWidth: 170 });

    // Spasi tambahan
    y += 40

    // Judul 1
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(110, 170, 30); // RGB hijau
    doc.text("Ringkasan Aduan Yang Masuk ", 20, y);
    y += 10;

    // Warna hitam untuk isi teks
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    // Paragraf isi dengan auto wrap
    doc.setLineHeightFactor(1.5)
    doc.text(`Selama periode laporan, kami telah menerima sejumlah tiket error melalui sistem tiketing. Berikut 
adalah ringkasan error yang ditemukan : `, 20, y, { maxWidth: 170 });

    // Spasi tambahan
    y += 20

    // Add date
    doc.setFontSize(10);
    doc.setFont('Inter', 'normal');
    const today = new Date()


    const start = new Date(this.generateForm.value.start_date).toLocaleDateString('en-CA');
    const end = new Date(this.generateForm.value.end_date).toLocaleDateString('en-CA');

    const startPdf = new Date(this.generateForm.value.start_date).toLocaleDateString('id-ID', options);
    const endPdf = new Date(this.generateForm.value.end_date).toLocaleDateString('id-ID', options);


    const optionsDate: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('id-ID', optionsDate);
    const formattedTime = today.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Helper function to add a table
    const addTable = async (title: string, head: string[][], body: any[][], styles: any = {}) => {
      checkAndAddPage(30);

      autoTable(doc, {
        head: head,
        body: body,
        startY: y,
        margin: { left: margin, right: margin },
        styles: {
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
          textColor: [0, 0, 0],
          cellPadding: 2,
          ...styles
        },
        headStyles: {
          fillColor: [110, 170, 30],
          textColor: [255, 255, 255],
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
        },
        didDrawPage: (data) => {
          // This runs when a new page is added during table rendering
          const currentPage = doc.getCurrentPageInfo().pageNumber;
          console.log("Current page:", currentPage);

          // For new pages, add the header first
          if (currentPage > 1) {
            // Reset y to top margin for the header
            y = margin;

            // Add header
            addHeader(currentPage);
          }

          // Set y position for continuing content
        },
        willDrawCell: (data) => {
          // Check if we're on a page after the first one and adjust cell positions if needed
          const currentPage = doc.getCurrentPageInfo().pageNumber;
          if (currentPage > 1 && data.row.index === 0 && data.section === 'body') {
            // This helps ensure the first row on new pages has proper spacing
            data.cell.y = Math.max(data.cell.y, headerHeight + 1000);
          }
        }
      });
    };

    const tableTickets = [];

    data.data.data.forEach((detail: any) => {
      const [date, time] = detail.created_at.split(' ');
      tableTickets.push([
        detail.tracking_id,
        date,
        time,
        detail.category_name,
        detail.subject,
        detail.respon_admin,
        detail.status,
        detail.priority
      ]);
    });

    // Tambahkan tabel ke PDF atau laporan
    await addTable(`A. Ticket`, [['Tracking ID', 'Created Date', 'Created Time', 'Category', 'Subject', "Action",]], tableTickets);
    if (this.generateForm.value.products_name) {

      try {
        // Ensure chart is visible
        const chartElement = this.chartContainer.nativeElement;
        const chartElement2 = this.chartContainer2.nativeElement;

        let y2 = 30;

        // Make sure element is visible and has dimensions
        if (chartElement.offsetWidth > 0 && chartElement.offsetHeight > 0) {
          const canvas = await html2canvas(chartElement, {
            logging: false,
            useCORS: true,
            scale: 2
          });

          const canvas2 = await html2canvas(chartElement2, {
            logging: false,
            useCORS: true,
            scale: 2
          });

          const imgData = canvas.toDataURL('image/png');
          const imgData2 = canvas2.toDataURL('image/png');
          doc.addPage();

          const currentPage = doc.getCurrentPageInfo().pageNumber;
          if (currentPage >= 2) {
            y = margin;
            addHeader(currentPage);
            y2 += 10;
          }

          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(110, 170, 30);
          doc.text("Gambaran Keseluruhan Aduan Yang Masuk ", pageWidth / 2, y2, { align: 'center' });

          const imgWidth = pageWidth - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          y2 += 15;
          doc.setFontSize(14);
          doc.setFont("helvetica", "semibold");
          doc.setTextColor(0, 0, 0, 0.8);
          doc.text(`Jumlah Aduan Berdasarkan Category`, 20, y2);
          y2 += 5;
          doc.addImage(imgData2, 'PNG', 20, y2, imgWidth, imgHeight);

          y2 += 110;

          doc.setFontSize(14);
          doc.setFont("helvetica", "semibold");
          doc.setTextColor(0, 0, 0, 0.8);
          y2 += 5;
          doc.text(`Jumlah Aduan Berdasarkan Tingkat Prioritas`, 20, y2);
          y2 += 5;
          doc.addImage(imgData, 'PNG', 20, y2, imgWidth, imgHeight);
        } else {
          console.warn("Chart container has no dimensions, skipping chart in PDF");
        }
      } catch (error) {
        console.error("Error adding chart to PDF:", error);
      }
    }

    // Add footer to all pages at the end
    const totalPages = doc.internal.pages.length;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const footer = 'images/cards/footer-pdf.png';
      doc.addImage(footer, 'PNG', 0, pageHeight - 30, pageWidth, 30);
    }

    if (Capacitor.isNativePlatform()) {
      await this.savePdfToDevice(doc, `Report_Daily_ticketing_${startPdf}_${endPdf}.pdf`);
    } else {
      doc.save(`Report_Daily_ticketing_${startPdf}_${endPdf}.pdf`);
    }
  }
}

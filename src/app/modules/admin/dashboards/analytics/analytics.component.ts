import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AreaChartComponent } from 'app/modules/component/card/area-chart/area-chart.component';
import { BarChartComponent } from 'app/modules/component/card/bar-chart/bar-chart.component';
import { PieChartComponent } from 'app/modules/component/card/pie-chart/pie-chart.component';
import { ApiService } from 'app/services/api.service';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, filter } from 'rxjs';
import { ColumnChartComponent } from "../../../component/card/column-chart/column-chart.component";
import { BarChartSideComponent } from 'app/modules/component/card/bar-chart-side/bar-chart-side.component';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    AreaChartComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    CommonModule,
    MatDatepickerModule,
    MatDateRangePicker,
    MatDateRangeInput,
    MatDatepickerToggle,
    MatInputModule,
    BarChartComponent,
    ColumnChartComponent,
    BarChartSideComponent,
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit {
  analyticsForm!: FormGroup
  products: string[] = [];
  today = new Date();
  data: any = {}
  chartUserRole: { total_user_role: string, role: string }[] = [];

  // Chart Role Berdasarkan User
  pieSeriesData: number[] = [];
  pieLabels: string[] = [];

  // Chart Tickets Berdasarkan Kategori
  chartCategoryData: { name: string, data: number[], type: string }[]
  chartCategoryLabels: string[] = []

  // Chart Ticket Berdasarkan Prioritas
  chartPriorityData: { name: string, data: number[], type: string }[]
  chartPriorityLabels: string[] = []

  // Chart Ticket Berdasarkan Prioritas
  chartPeriodeData: { name: string, data: number[], type: string }[]
  chartPeriodeLabels: string[] = []

  // Chart User Tickets
  chartUserTicketsData: { name: string, data: number[], type?: string }[]
  chartUserTicketsLabels: string[] = []

  // Chart Tickets Resolved By Users
  ChartUserResolvedData: { data: number[] }[]
  ChartUserResolvedLabels: string[] = []

  // Chart Total Tickets By Products
  ChartTicketProductsData: { data: number[] }[]
  ChartTicketProductsLabels: string[] = []

  // Chart Tickets By Place
  ChartTicketPlaceData: { name: string, data: number[] }[] = []
  ChartTicketPlaceLabels: string[] = []

  range = new FormGroup({
    start: new FormControl<Date | null>(new Date(year, month)),
    end: new FormControl<Date | null>(new Date()),
  });

  constructor(
    private fb: FormBuilder,
    private _apiService: ApiService,
    private _toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.fetchProducts()

    this.analyticsForm = this.fb.group({
      products_name: [this.products[0], [Validators.required]]
    })

    this.range.get('end')?.valueChanges.pipe(
      filter((endDateRaw) => !!endDateRaw && !!this.range.value.start),
      distinctUntilChanged()
    ).subscribe((endDateRaw) => {
      const endDate = new Date(endDateRaw);
      const startDate = new Date(this.range.value.start as Date);
      const products = this.analyticsForm.value.products_name;

      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && products) {
        this.fetchAnalytics(
          products,
          startDate.toLocaleDateString('en-CA'),
          endDate.toLocaleDateString('en-CA')
        );
      }
    });


    this.analyticsForm.get('products_name')?.valueChanges.subscribe((productsName: string) => {
      const startDateRaw = this.range.value.start;
      const endDateRaw = this.range.value.end;

      const startDate = new Date(startDateRaw as Date);
      const endDate = new Date(endDateRaw as Date);

      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && productsName) {
        this.fetchAnalytics(
          productsName,
          startDate.toLocaleDateString('en-CA'),
          endDate.toLocaleDateString('en-CA')
        );
      }
    });

  }

  formatDate = (date: any) => {
    if (!date) return null;
    return DateTime.fromJSDate(new Date(date)).toISODate();
  };

  async fetchProducts() {
    try {
      const get = await this._apiService.get("api/V1/list-products");
      this.products = get.data;

      this.analyticsForm.patchValue({
        products_name: this.products[0]
      })
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error
    }
  }

  async fetchAnalytics(products_name: string, startDate: string, endDate: string) {
    try {
      const post = await this._apiService.post("api/V1/statistik", {
        "products_name": products_name,
        "start_date": startDate,
        "end_date": endDate,
      })
      this.data = post.data.data

      // Chart Role Berdasarkan User 
      this.chartUserRole = [];
      this.data.CharUserRole.forEach(e => {
        this.chartUserRole.push({ total_user_role: e.total_user_role, role: e.role });
      });
      this.pieSeriesData = this.chartUserRole.map(e => Number(e.total_user_role));
      this.pieLabels = this.chartUserRole.map(e => e.role);

      // Chart Ticket Berdasarkan Category
      this.chartCategoryData = [
        {
          name: 'Total Tiket',
          data: this.data.ChartCategory.map((e) => e.total_tickets),
          type: 'bar'
        },
      ];
      this.chartCategoryLabels = this.data.ChartCategory.map((e) => e.category_name);

      // Chart Tikcet Berdasarkan Priority
      this.chartPriorityData = [
        {
          name: 'Total Tiket',
          data: this.data.ChartPriority.map((e) => e.value),
          type: 'bar'
        },
      ]
      this.chartPriorityLabels = this.data.ChartPriority.map((e) => e.label);

      // Chart Tikcet Berdasarkan Periode
      this.chartPeriodeData = [
        {
          name: 'Total Tiket',
          data: this.data.ChartTicketPeriode.map((e) => e.total_tickets),
          type: 'area'
        },
      ]
      this.chartPeriodeLabels = this.data.ChartTicketPeriode.map((e) => e.created_at);

      // Chart User Tickets
      this.chartUserTicketsData = [
        {
          name: 'Tickets Created',
          data: this.data.ChartUserTickets.map((e) => e.total_user_tickets),
          type: 'bar',
        },
      ]
      this.chartUserTicketsLabels = this.data.ChartUserTickets.map((e) => e.name);

      // Chart Tickets Resolved By User
      this.ChartUserResolvedData = [
        {
          data: this.data.ChartUserResolved.map((e) => e.resolved_count)
        }
      ]
      this.ChartUserResolvedLabels = this.data.ChartUserResolved.map((e) => e.name)

      // Chart Total Tickets By Products
      this.ChartTicketProductsData = [
        {
          data: this.data.ChartTicketProducts.map((e) => e.total_tickets)
        }
      ]
      this.ChartTicketProductsLabels = this.data.ChartTicketProducts.map((e) => e.name)

      // Chart Total Tickets By Place
      const chartPlacesData = (this.data.ChartPlaces ?? []).map((e) => e.total_tickets);
      const chartPlacesLabels = (this.data.ChartPlaces ?? []).map((e) => e.places_name);

      if (chartPlacesData.length > 0) {
        this.ChartTicketPlaceData = [
          {
            name: 'Total Tiket',
            data: chartPlacesData
          }
        ];
        this.ChartTicketPlaceLabels = chartPlacesLabels;
      } else {
        this.ChartTicketPlaceData = [];
        this.ChartTicketPlaceLabels = [];
      }

    } catch (error) {
      this._toast.error("Failed Fetch Data", "Error")
      throw error
    }
  }
}
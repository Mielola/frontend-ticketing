import { CdkScrollable } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, formatDate } from '@angular/common';
import { MatTimepickerModule } from 'mat-timepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DemoSidebarComponent } from "../../ui/page-layouts/common/demo-sidebar/demo-sidebar.component";
import { ApiService } from 'app/services/api.service';
import { DateTime } from 'luxon';
import { MatSelectModule } from '@angular/material/select';
import { IonLoading } from '@ionic/angular/standalone';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDay()

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    CdkScrollable,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatSelectModule,
    DemoSidebarComponent,
    NgMultiSelectDropDownModule,
    IonLoading,
    MatError,
  ],
  templateUrl: './export.component.html',
  styleUrl: './export.component.scss',
})
export class ExportComponent implements OnInit {
  @ViewChild("matDrawer") matDrawer: MatDrawer
  ticketForm!: FormGroup
  content: string
  timePickerVisible = false;
  selectedDate: Date = new Date();
  selectedTime: string = '';
  isLoading: boolean;

  // Multi Select Input Settings
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  products: string[] = [];


  readonly range = new FormGroup({
    start: new FormControl<Date | null>(new Date(year, month - 1)),
    end: new FormControl<Date | null>(new Date()),
  });

  constructor(
    private fb: FormBuilder,
    private _apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.fetchDataEmail()

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.ticketForm = this.fb.group({
      products_name: ["", Validators.required],
      email: [[], Validators.required],
      entry_time: ["", Validators.required],
      end_time: ["", Validators.required],
    })
  }

  async fetchDataProducts() {
    try {
      const get = await this._apiService.get("api/V1/products");
      this.products = get.data;

      this.ticketForm.patchValue({
        products_name: this.products[0]
      })
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async fetchDataEmail() {
    try {
      const email = await this._apiService.get("api/V1/email")

      email.data.forEach(email => {
        this.dropdownList.push(email.email)
      });

    } catch (error) {
      throw error
    }
  }

  async tooggleDrawer(contents: string) {
    this.content = contents

    await this.fetchDataProducts()

    this.matDrawer.toggle()
  }


  // --------------------------------------------
  // @ Tickets Function
  // --------------------------------------------

  async onSubmitTickets() {
    this.isLoading = true
    try {
      const formatDate = (date: any) => {
        if (!date) return null;
        return DateTime.fromJSDate(new Date(date)).toISODate();
      };

      const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }

      if (this.ticketForm.valid && this.range.valid) {
        const post = await this._apiService.post("api/V1/export/tickets", {
          start_date: formatDate(this.range.value.start),
          end_date: formatDate(this.range.value.end),
          start_time: formatTime(this.ticketForm.value.entry_time),
          end_time: formatTime(this.ticketForm.value.end_time),
          products_name: this.ticketForm.value.products_name,
          email: this.ticketForm.value.email
        })

        await this.exportToExcelTickets(post.data.data)

        this.isLoading = false
      } else {
        this.ticketForm.markAllAsTouched();
      }
    } catch (error) {
      throw error
    }
  }

  async exportToExcelTickets(data: any) {

    const formatDate = (date: any) => {
      if (!date) return null;
      return DateTime.fromJSDate(new Date(date)).toISODate();
    };

    const formatTime = (dateString: string): string => {
      const date = new Date(dateString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    const excelData = [
      [
        'tracking_id',
        'products_name',
        'no_client',
        'status',
        'priority',
        'created_ticket_user',
        'last_replier',
        'firs_respon_at',
        'first_respon_in_date',
        'first_respon_in_time',
        'new_time',
        'on-progress_time',
        'resolved_time',
        'ticket_created_at',
        'solved_time'
      ], // Header
      ...data.map(item => [
        item.tracking_id,
        item.products_name,
        item.no_client,
        item.status,
        item.priority,
        item.created_ticket.name,
        item.last_replier.name,
        item.firs_respon_at,
        item.first_respon_in_date,
        item.first_respon_in_time,
        formatTime(item.status_timestamps[0].updated_at),
        formatTime(item.status_timestamps[1].updated_at),
        formatTime(item.status_timestamps[2].updated_at),
        item.created_at,
        item.solved_time
      ])
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(excelData);

    // Set column widths (dalam satuan karakter)
    worksheet['!cols'] = [
      { wch: 25 }, // tracking_id
      { wch: 25 }, // products_name
      { wch: 25 }, // no_client
      { wch: 25 }, // status
      { wch: 25 }, // priority
      { wch: 25 }, // created_ticket_user
      { wch: 25 }, // last_replier
      { wch: 25 }, // firs_respon_at
      { wch: 25 }, // first_respon_in_date
      { wch: 25 }, // first_respon_in_time
      { wch: 25 }, // new_time
      { wch: 25 }, // on-progress_in_time
      { wch: 25 }, // resolved_in_time
      { wch: 25 }, // created_at
      { wch: 25 }, // solved_time
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'DataPelanggan': worksheet },
      SheetNames: ['DataPelanggan']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const fileData: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(fileData, `list_tickets ${formatDate(this.range.value.start)} - ${formatDate(this.range.value.end)}.xlsx`);
  }

  // --------------------------------------------
  // @ Users Function
  // --------------------------------------------

  async onSubmitUsers() {
    this.isLoading = true
    try {
      const formatDate = (date: any) => {
        if (!date) return null;
        return DateTime.fromJSDate(new Date(date)).toISODate();
      };

      const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }

      if (this.ticketForm.valid && this.range.valid) {
        const post = await this._apiService.post("api/V1/export/users", {
          start_date: formatDate(this.range.value.start),
          end_date: formatDate(this.range.value.end),
          start_time: formatTime(this.ticketForm.value.entry_time),
          end_time: formatTime(this.ticketForm.value.end_time),
          products_name: this.ticketForm.value.products_name,
          email: this.ticketForm.value.email
        })

        await this.exportToExcelUsers(post.data.data)

        this.isLoading = false
      } else {
        this.ticketForm.markAllAsTouched();
      }
    } catch (error) {
      throw error
    }
  }

  async exportToExcelUsers(data: any) {

    const formatDate = (date: any) => {
      if (!date) return null;
      return DateTime.fromJSDate(new Date(date)).toISODate();
    };

    const formatTime = (dateString: string): string => {
      const date = new Date(dateString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    // Header
    const excelData = [
      [
        'created_ticket_user',
        'tracking_id',
        'products_name',
        'no_client',
        'status',
        'priority',
        'firs_respon_at',
        'first_respon_in_date',
        'first_respon_in_time',
        'new_time',
        'on-progress_time',
        'resolved_time',
        'ticket_created_at',
        'solved_time',
        'last_replier',
      ],

      ...data.map(item => [
        item.created_ticket.name,
        item.tracking_id,
        item.products_name,
        item.no_client,
        item.status,
        item.priority,
        item.firs_respon_at,
        item.first_respon_in_date,
        item.first_respon_in_time,
        formatTime(item.status_timestamps[0].updated_at),
        formatTime(item.status_timestamps[1].updated_at),
        formatTime(item.status_timestamps[2].updated_at),
        item.created_at,
        item.solved_time,
        item.last_replier.name,
      ])
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(excelData);

    // Set column widths (dalam satuan karakter)
    worksheet['!cols'] = [
      { wch: 25 }, // tracking_id
      { wch: 25 }, // products_name
      { wch: 25 }, // no_client
      { wch: 25 }, // status
      { wch: 25 }, // priority
      { wch: 25 }, // created_ticket_user
      { wch: 25 }, // last_replier
      { wch: 25 }, // firs_respon_at
      { wch: 25 }, // first_respon_in_date
      { wch: 25 }, // first_respon_in_time
      { wch: 25 }, // new_time
      { wch: 25 }, // on-progress_in_time
      { wch: 25 }, // resolved_in_time
      { wch: 25 }, // created_at
      { wch: 25 }, // solved_time
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'DataPelanggan': worksheet },
      SheetNames: ['DataPelanggan']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const fileData: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(fileData, `list_users ${formatDate(this.range.value.start)} - ${formatDate(this.range.value.end)}.xlsx`);
  }
}

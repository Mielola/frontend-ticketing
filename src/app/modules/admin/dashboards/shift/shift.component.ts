import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ApiService } from 'app/services/api.service';
import _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { FormAddComponent } from './form-add/form-add.component';
import { ShiftService } from './shift.service';
import { FormEditDeleteComponent } from './form-edit-delete/form-edit-delete.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { DemoSidebarComponent } from '../../ui/page-layouts/common/demo-sidebar/demo-sidebar.component';
import { MatButtonModule } from '@angular/material/button';
import { FormPrintComponent } from './form-print/form-print.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule, MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { DateTime } from 'luxon';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-shift',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatIcon,
    RouterLink,
    MatDrawerContainer,
    MatDrawerContent,
    MatDrawer,
    MatButtonModule,
    MatFormFieldModule,
    MatLabel,
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerToggle,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './shift.component.html',
  styleUrl: './shift.component.scss'
})
export class ShiftComponent implements OnInit {

  today = new Date();
  isLoading: boolean = false;
  exportShiftForm!: FormGroup;

  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings = {};
  products: string[] = [];

  range = new FormGroup({
    start: new FormControl<Date | null>(new Date(year, month)),
    end: new FormControl<Date | null>(new Date()),
  });

  constructor(
    private _apiSevice: ApiService,
    private _matDialog: MatDialog,
    private _shiftService: ShiftService,
    private _apiService: ApiService,
    private fb: FormBuilder,
    private _toastService: ToastrService,
  ) {
    effect(() => {
      this.getShift(_shiftService.shiftSchedule())
    })
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    eventClick: (info) => {
      const event = info.event;
      this._shiftService.shiftUserId.set(event.extendedProps.shiftId)
      this._matDialog.open(FormEditDeleteComponent, {
        width: window.innerWidth < 600 ? '90%' : '50%',
        maxWidth: '100vw'
      });
    }
  };

  handleDateClick(arg: DateClickArg) {
    // alert('Tanggal yang diklik: ' + arg.dateStr);
    this._shiftService.dateCallendar.set(arg.dateStr)
    this._matDialog.open(FormAddComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw'
    });
  }

  ngOnInit(): void {
    this._shiftService.fetchData()
    this.fetchDataEmail();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.exportShiftForm = this.fb.group({
      email: [[], Validators.required],
    });
  }

  formatDate = (date: any) => {
    if (!date) return null;
    return DateTime.fromJSDate(new Date(date)).toISODate();
  };

  async onSubmit() {
    if (this.range.invalid || this.exportShiftForm.invalid) {
      this._toastService.warning("Please fill in all fields", "Information")
      return
    }

    this.isLoading = true
    try {
      const post = await this._apiService.post("api/V1/shifts/export", {
        email: this.exportShiftForm.value.email.map((element: any) => element.item_id),
        start_date: this.formatDate(this.range.value.start),
        end_date: this.formatDate(this.range.value.end)
      })

      this.isLoading = false
      if (post.status === 200) {
        this._toastService.success("Success Export User Shifts", "Error")
        this.exportToExcelShifts(post.data.data)
      }
    } catch (error) {
      this._toastService.error("Error Export User Shifts", "Error")
      throw error
    }
  }

  async fetchDataEmail() {
    try {
      const response = await this._apiService.get("api/V1/email");

      if (response && response.data) {
        this.dropdownList = response.data.map((email: any) => ({
          item_id: email.email,
          item_text: email.name
        }));
      }
    } catch (error) {
      console.error('Error fetching email data:', error);
    }
  }

  handleExport() {
    this._matDialog.open(FormPrintComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw'
    });
  }

  async getShift(response: any) {
    try {

      // Definisikan urutan prioritas shift
      const shiftOrder = {
        'pagi': 1,
        'sore': 2,
        'malam': 3
      };

      const sortedData = await response.data.sort((a, b) => {
        // Pertama, urutkan berdasarkan tanggal
        const dateComparison = new Date(a.shift_date).getTime() - new Date(b.shift_date).getTime();

        if (dateComparison === 0) {
          const aShiftName = a.shift_name.toLowerCase();
          const bShiftName = b.shift_name.toLowerCase();

          // Tentukan prioritas berdasarkan nama shift
          const aOrder = shiftOrder[aShiftName] || 999; // Default tinggi jika tidak ditemukan
          const bOrder = shiftOrder[bShiftName] || 999;

          return aOrder - bOrder;
        }

        return dateComparison;
      });

      // Map the sorted data into events format
      const events = sortedData.map((item: any) => {
        const baseDate = new Date(item.shift_date);
        let color = "#07f236"

        if (item.shift_id === 2) {
          color = "#f2a807"
        } else if (item.shift_id === 3) {
          color = "#0756f2"
        }

        const fullDateTime = `${item.shift_date}T${item.StartTime}`;



        return {
          title: `${item.shift_id} (${item.name})`,
          start: fullDateTime,
          shiftId: item.id,
          allDay: false,
          color: color
        };
      });

      // Set up FullCalendar options with the sorted events
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        events: events,
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        },
        displayEventTime: true
      };
    } catch (error) {
      throw error;
    }
  }

  async exportToExcelShifts(data: any) {
    const formatDate = (date: any) => {
      if (!date) return null;
      return DateTime.fromJSDate(new Date(date)).toISODate();
    };

    // Dapatkan daftar unik tanggal dan nama
    const uniqueDates = [...new Set(data.map((item: any) => item.shift_date))].sort();
    const uniqueNames = [...new Set(data.map((item: any) => item.name))];

    const shiftEmoji = {
      'Pagi': '🟢',
      'Sore': '🟡',
      'Malam': '🔵',
      'Libur': '🔴'
    };

    const excelData = [
      ['Nama', ...uniqueDates]
    ];

    uniqueNames.forEach(name => {
      const row: any[] = [name];
      uniqueDates.forEach(date => {
        const shift = data.find((item: any) => item.name === name && item.shift_date === date);
        const shiftName = shift?.shift_id || 'Libur';
        const emoji = shiftEmoji[shiftName] || '';
        row.push(`${shiftName}`);
      });
      excelData.push(row);
    });

    // Generate file Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(excelData);
    worksheet['!cols'] = [{ wch: 20 }, ...uniqueDates.map(() => ({ wch: 15 }))];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'ShiftKaryawan': worksheet },
      SheetNames: ['ShiftKaryawan']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(fileData, `shift_karyawan_${formatDate(this.range.value.start)}_to_${formatDate(this.range.value.end)}.xlsx`);
  }


}
import { CommonModule } from '@angular/common';
import { Component, effect, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DateTime } from 'luxon';
import { ApiService } from 'app/services/api.service';
import { Subject } from 'rxjs';
import { ShiftTimingTableService } from './shift-timing.service';
import { FormAddShiftTimeComponent } from 'app/modules/admin/dashboards/shift-timing/form-add-shift-time/form-add-shift-time.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { FormEditShiftTimeComponent } from 'app/modules/admin/dashboards/shift-timing/form-edit-shift-time/form-edit-shift-time.component';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDay()

@Component({
  selector: 'app-table-shift-timing',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSortModule,
    MatIcon,
    MatMenuModule,
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ],
  templateUrl: './shift-timing.component.html',
  styleUrl: './shift-timing.component.scss'
})
export class ShiftTimingTableComponent {
  filterValues = {
    search: '',
    category: [],
    products: [],
    status: [],
    priority: []
  };

  shiftStatus: boolean = true
  ticketStatus: boolean = false

  statusList: string[] = ['New', 'On Progress', 'Resolved']
  productsItems: { name: string, checked: boolean }[] = []
  category: { name: string, checked: boolean }[] = []
  statusItems: { name: string, checked: boolean }[] = []
  priorityItems: { name: string, checked: boolean }[] = []

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  // Table
  public displayedColumns = ['id', 'shift_name', 'start_time', 'end_time', 'action'];
  public dataSource = new MatTableDataSource<any>();

  // Paginator
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(new Date(year, month - 1)),
    end: new FormControl<Date | null>(new Date()),
  });


  constructor(
    private _apiService: ApiService,
    private fuseConfirmationService: FuseConfirmationService,
    private _shiftTimingService: ShiftTimingTableService,
    private _matDialog: MatDialog,
    private _toastService: ToastrService,
  ) {
    effect(() => {
      this.dataSource.data = this.datas
    })
  }

  get datas() {
    return this._shiftTimingService._data()
  }

  get isLoading(): boolean {
    return this._shiftTimingService.isLoading()
  }

  get isNotDataFound(): boolean {
    return this._shiftTimingService.isNotFound()
  }

  ngOnInit(): void {
    this._shiftTimingService.fetchData()
  }

  /**
  * After View Init
  */

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
  * On Destroy
  */

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  /**
  * Public Functions
  */

  formatDate = (date: any) => {
    if (!date) return null;
    return DateTime.fromJSDate(new Date(date)).toISODate();
  };

  formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  addShiftTime() {
    this._matDialog.open(FormAddShiftTimeComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw',
    })
  }

  editShiftTime(id: number) {
    this._matDialog.open(FormEditShiftTimeComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw',
      data: {
        id: id
      }
    })
  }

  handleDeleteShifTime(id: number) {
    const confirm = this.fuseConfirmationService.open({
      title: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus akun ${id}?`,
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    confirm.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.deleteShiftTime(id)
      }
    });
  }

  async deleteShiftTime(id: number) {
    try {
      const { data, status } = await this._apiService.delete(`api/V1/shifts-time/${id}`)

      if (status === 200) {
        this._toastService.success("Success Delete Shift Time", "Success")
        this._shiftTimingService.fetchData()
        return
      } else {
        this._toastService.error("Failed Delete Shift Time", "Failed")
        return
      }
    } catch (error) {
      this._toastService.error("Failed Delete Shift Time", "Failed")
      throw error
    }
  }
}

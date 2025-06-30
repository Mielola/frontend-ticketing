import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, effect, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from 'app/services/api.service';
import { TicketLogsService } from '../ticket-logs/ticket-logs.service';
import { Subject, takeUntil } from 'rxjs';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { GenereateReportComponent } from '../../dialog/genereate-report/genereate-report.component';
import { UserService } from 'app/services/userService/user.service';
import { User } from 'app/core/user/user.types';
import { data } from '../../card/area-chart/data';
import { HandOversService } from './handovers.service';
import { DateTime } from 'luxon';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDay()

@Component({
  selector: 'app-handovers',
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
    NgClass,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './handovers.component.html',
  styleUrls: ['./handovers.component.scss']

})
export class HandoversComponent implements OnInit, OnDestroy {

  filterValues = {
    search: '',
    category: [],
    products: [],
    status: [],
    priority: []
  };

  shiftStatus: boolean = true
  isAdmin: boolean = localStorage.getItem("userRole") === 'admin';
  ticketStatus: boolean = false

  statusList: string[] = ['New', 'Hold', 'On Progress', 'Resolved']
  productsItems: { name: string, checked: boolean }[] = []
  category: { name: string, checked: boolean }[] = []
  statusItems: { name: string, checked: boolean }[] = []
  priorityItems: { name: string, checked: boolean }[] = []

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  // Table
  public displayedColumns = ['tracking_id', 'name', 'shift_created', 'create_date', 'create_time', 'category', 'subject', 'pic', 'no_whatsapp', 'status', 'priority'];
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
    private cdr: ChangeDetectorRef,
    private _ticketLogsService: TicketLogsService,
    private _handOversService: HandOversService,
    private _matDialog: MatDialog,
  ) {
    effect(() => {
      this.dataSource.data = this.datas

      const categorySet = new Set<string>();
      const statusSet = new Set<string>();
      const prioritySet = new Set<string>();
      const productsSet = new Set<string>();

      this.datas.forEach(tickets => {

        // Push product to Set
        if (tickets.products_name) {
          if (Array.isArray(tickets.products_name)) {
            tickets.products_name.forEach(product => productsSet.add(product));
          } else {
            productsSet.add(tickets.products_name)
          }
        }

        // Push category to Set
        if (tickets.category_name) {
          if (Array.isArray(tickets.category_name)) {
            tickets.category_name.forEach(cat => categorySet.add(cat));
          } else {
            categorySet.add(tickets.category_name)
            statusSet.add(tickets.status)
          }
        }

        // Push status to Set
        if (tickets.status) {
          if (Array.isArray(tickets.status)) {
            tickets.status.forEach(stat => statusSet.add(stat));
          } else {
            statusSet.add(tickets.status)
          }
        }

        // push priority to Set
        if (tickets.priority) {
          if (Array.isArray(tickets.priority)) {
            tickets.priority.forEach(priority => priority.add(priority));
          } else {
            prioritySet.add(tickets.priority)
          }
        }


        if (!tickets.subject) {
          tickets.subject = "Subject Not Found";
        }
      });

      // Convert Set ke array unik dan tambahkan properti checked
      this.statusItems = [...statusSet].map(stats => ({ name: stats, checked: false }));
      this.category = [...categorySet].map(category => ({ name: category, checked: false }));
      this.priorityItems = [...prioritySet].map(priority => ({ name: priority, checked: false }));
      this.productsItems = [...productsSet].map(product => ({ name: product, checked: false }));
    })
  }

  get datas() {
    return this._handOversService._data()
  }

  get isLoading(): boolean {
    return this._handOversService.isLoading()
  }

  get isNotDataFound(): boolean {
    return this._handOversService.isNotFound()
  }

  ngOnInit(): void {
    this._handOversService.fetchData()
    this.fetchUsers()

    this.range.valueChanges.subscribe(({ start, end }) => {
      if (end) {
        const startDate = start instanceof Date ? start : new Date(start);
        const endDate = end instanceof Date ? end : new Date(end);

      }
    });
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

  generateReport() {
    this._matDialog.open(GenereateReportComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw'
    })
  }

  async fetchUsers() {
    try {
      const findUser = await this._apiService.get(`api/V1/get-profile`)

      this.shiftStatus = findUser.data.shift_status !== 'Active Shift'
      this.cdr.detectChanges();
    } catch (error) {
      throw error
    }
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      let filters = JSON.parse(filter);
      console.log(data)

      let searchMatch =
        filters.search === '' ||
        data.tracking_id.toLowerCase().includes(filters.search) ||
        data.products_name.toLowerCase().includes(filters.search) ||
        data.category_name.toLowerCase().includes(filters.search) ||
        data.subject.toLowerCase().includes(filters.search) ||
        data.status.toLowerCase().includes(filters.search) ||
        data.priority.toLowerCase().includes(filters.search) ||
        data.no_whatsapp
          .toLowerCase().includes(filters.search)
        || data.user?.name.toLowerCase().includes(filters.search)
        || data.last_replier?.name.toLowerCase().includes(filters.search);

      let categoryMatch =
        filters.category.length === 0 || filters.category.includes(data.category_name.toLowerCase());

      let statusMatch =
        filters.status.length === 0 || filters.status.includes(data.status.toLowerCase());

      let priorityMatch =
        filters.priority.length === 0 || filters.priority.includes(data.priority.toLowerCase());

      let productsMatch =
        filters.products.length === 0 || filters.products.includes(data.products_name.toLowerCase());

      return searchMatch && categoryMatch && statusMatch && priorityMatch && productsMatch;
    };

    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  applySearchFilter(filterValue: string) {
    this.filterValues.search = filterValue.trim().toLowerCase();
    this.applyFilter();
  }

  applyProductsFilter() {
    this.filterValues.products = this.productsItems
      .filter(item => item.checked)
      .map(item => item.name.toLowerCase());
    this.applyFilter();
  }

  applyCategoryFilter() {
    this.filterValues.category = this.category
      .filter(item => item.checked)
      .map(item => item.name.toLowerCase());
    this.applyFilter();
  }

  applyStatusFilter() {
    this.filterValues.status = this.statusItems
      .filter(item => item.checked)
      .map(item => item.name.toLowerCase());
    this.applyFilter();
  }

  applyPriorityFilter() {
    this.filterValues.priority = this.priorityItems
      .filter(item => item.checked)
      .map(item => item.name.toLowerCase());
    this.applyFilter();
  }

  async changeStatus(ticketId: string, newStatus: string) {
    try {
      const { status, data } = await this._apiService.post(`api/V1/ticket-status/${ticketId}`, {
        status: newStatus
      });

      if (status === 200) {
        const updateDataTable = await this._apiService.get("api/V1/tickets/handover")
        this._handOversService.Update(updateDataTable.data)
      }
    } catch (error) {
      throw error
    }
  }
}

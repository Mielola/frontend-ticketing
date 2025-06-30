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
import { Subject } from 'rxjs';
import { TicketTableService } from './ticket.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { GenereateReportComponent } from '../../dialog/genereate-report/genereate-report.component';
import { ImportExcelComponent } from 'app/modules/admin/dashboards/tickets/import-excel/import-excel.component';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDay()

@Component({
  selector: 'app-ticket',
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
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']

})
export class TicketComponent implements OnInit, OnDestroy {
  filterValues = {
    search: '',
    category: [],
    products: [],
    places: [],
    status: [],
    priority: []
  };

  shiftStatus: boolean = true
  ticketStatus: boolean = false
  isAdmin: boolean = localStorage.getItem("userRole") === 'admin';

  statusList: string[] = ['New', 'Hold', 'On Progress', 'Resolved']
  productsItems: { name: string, checked: boolean }[] = []
  category: { name: string, checked: boolean }[] = []
  statusItems: { name: string, checked: boolean }[] = []
  priorityItems: { name: string, checked: boolean }[] = []
  placesItems: { name: string, checked: boolean }[] = []

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  // Table
  public displayedColumns = ['tracking_id', 'hari_masuk', 'waktu_masuk', 'place', 'name', 'category', 'subject', 'pic', 'no_whatsapp', 'status', 'solved_time', 'last_replier', 'priority', 'create_date', 'create_time',];
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
    private _ticketTableService: TicketTableService,
    private _matDialog: MatDialog,
  ) {
    this._ticketTableService.checkTickets()
    effect(() => {
      const getData = this.datas;

      const categorySet = new Set<string>();
      const statusSet = new Set<string>();
      const prioritySet = new Set<string>();
      const productsSet = new Set<string>();
      const placesSet = new Set<string>();

      getData.forEach(tickets => {
        if (tickets.products_name) {
          if (Array.isArray(tickets.products_name)) {
            tickets.products_name.forEach(product => productsSet.add(product));
          } else {
            productsSet.add(tickets.products_name)
          }
        }

        if (tickets.places_name) {
          if (Array.isArray(tickets.places_name)) {
            tickets.places_name.forEach(product => placesSet.add(product));
          } else {
            placesSet.add(tickets.places_name)
          }
        }

        if (tickets.category) {
          if (Array.isArray(tickets.category)) {
            tickets.category.forEach(cat => categorySet.add(cat));
          } else {
            categorySet.add(tickets.category)
            statusSet.add(tickets.status)
          }
        }

        if (tickets.status) {
          if (Array.isArray(tickets.status)) {
            tickets.status.forEach(stat => statusSet.add(stat));
          } else {
            statusSet.add(tickets.status)
          }
        }

        if (tickets.priority) {
          if (Array.isArray(tickets.priority)) {
            tickets.priority.forEach(priority => prioritySet.add(priority));
          } else {
            prioritySet.add(tickets.priority)
          }
        }

        if (!tickets.subject) {
          tickets.subject = "Subject Not Found";
        }
      });

      this.statusItems = [...statusSet].map(stats => ({ name: stats, checked: false }));
      this.category = [...categorySet].map(category => ({ name: category, checked: false }));
      this.priorityItems = [...prioritySet].map(priority => ({ name: priority, checked: false }));
      this.productsItems = [...productsSet].map(product => ({ name: product, checked: false }));
      this.placesItems = [...placesSet].map(places => ({ name: places, checked: false }));

      if (this._ticketTableService._datas().length === 0) {
        this.dataSource.data = [];
        return
      }

      this.dataSource.data = getData.map(item => ({
        ...item,
        originalStatus: item.status
      }));
    });
  }

  get datas() {
    return this._ticketTableService._datas()
  }

  get isLoading() {
    return this._ticketTableService.isLoading()
  }

  get isNotFound() {
    return this._ticketTableService.isNotFound()
  }

  ngOnInit(): void {
    this.fetchUsers()

    this.range.valueChanges.subscribe(({ start, end }) => {
      if (end) {
        const startDate = start instanceof Date ? start : new Date(start);
        const endDate = end instanceof Date ? end : new Date(end);

        this._ticketTableService.fetchDataByDate(startDate.toLocaleDateString("en-CA"), endDate.toLocaleDateString("en-CA"));
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

  importExcel() {
    this._matDialog.open(ImportExcelComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw',
    })
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
        data.created_date.toLowerCase().includes(filters.search) ||
        data.created_time.toLowerCase().includes(filters.search) ||
        data.hari_masuk.toLowerCase().includes(filters.search) ||
        data.waktu_masuk.toLowerCase().includes(filters.search) ||
        data.products_name.toLowerCase().includes(filters.search) ||
        data.pic.toLowerCase().includes(filters.search) ||
        data.category.toLowerCase().includes(filters.search) ||
        data.subject.toLowerCase().includes(filters.search) ||
        data.status.toLowerCase().includes(filters.search) ||
        data.priority.toLowerCase().includes(filters.search) ||
        data.places_name.toLowerCase().includes(filters.search) ||
        data.no_whatsapp
          .toLowerCase().includes(filters.search)
        || data.user?.name.toLowerCase().includes(filters.search)
        || data.last_replier?.name.toLowerCase().includes(filters.search);

      let categoryMatch =
        filters.category.length === 0 || filters.category.includes(data.category.toLowerCase());

      let statusMatch =
        filters.status.length === 0 || filters.status.includes(data.status.toLowerCase());

      let priorityMatch =
        filters.priority.length === 0 || filters.priority.includes(data.priority.toLowerCase());

      let productsMatch =
        filters.products.length === 0 || filters.products.includes(data.products_name.toLowerCase());

      let placesMatch =
        filters.places.length === 0 || filters.places.includes((data.places_name || '').toLowerCase());

      return searchMatch && categoryMatch && statusMatch && priorityMatch && productsMatch && placesMatch;
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

  applyPlacesFilter() {
    this.filterValues.places = this.placesItems
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

  onStatusChange(newStatus: string, element: any): void {
    if (newStatus !== element.originalStatus) {
      console.log('Status changed:', newStatus);
      // Terserah mau langsung update atau simpan perubahan dulu
      this.changeStatus(element.tracking_id, newStatus);
    }
  }

  async changeStatus(ticketId: string, newStatus: string) {
    try {
      const { status, data } = await this._apiService.post(`api/V1/ticket-status/${ticketId}`, {
        status: newStatus
      });
      if (status === 200) {
        this._ticketLogsService.fetchDatas()

        this._ticketTableService.fetchData()
      }
    } catch (error) {
      throw error
    }
  }
}

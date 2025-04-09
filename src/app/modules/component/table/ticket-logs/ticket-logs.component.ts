import { Component, ViewChild } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from 'app/services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { TicketLogsService } from './ticket-logs.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ticket-logs',
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
    RouterLink,
  ],
  templateUrl: './ticket-logs.component.html',
})
export class TicketLogsComponent {
  isLoading: boolean = false
  isNotDataFound: boolean
  filterValues = {
    search: '',
    category: [],
    status: [],
    priority: []
  };

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // Filter
  category: { name: string, checked: boolean }[] = []
  statusItems: { name: string, checked: boolean }[] = []
  priorityItems: { name: string, checked: boolean }[] = []

  // Table
  public displayedColumns = ['tracking_id', 'user', 'current_status', 'new_status', 'priority', 'update_at',];
  public dataSource = new MatTableDataSource<any>();

  // Paginator
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _apiService: ApiService,
    private _ticketLogsService: TicketLogsService
  ) { }

  ngOnInit(): void {
    // this._ticketLogsService.fetchData()

    this._ticketLogsService.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((datas) => {
      this.dataSource.data = datas.data;
    });
  }

  /**
 * After View Init
 */

  ngAfterViewInit() {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  }

  public async fetchData() {

    try {
      this.isLoading = true
      const get = await this._apiService.get("api/V1/tickets-logs");

      this.dataSource.data = get.data;

    } catch (error) {
      this.isLoading = false
      throw error
    } finally {
      this.isLoading = false
    }
  }


  applyFilter() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      let filters = JSON.parse(filter);

      let searchMatch =
        filters.search === '' ||
        data.tracking_id.toLowerCase().includes(filters.search) ||
        data.category.toLowerCase().includes(filters.search) ||
        data.subject.toLowerCase().includes(filters.search) ||
        data.status.toLowerCase().includes(filters.search) ||
        data.priority.toLowerCase().includes(filters.search) ||
        data.no_whatsapp
          .toLowerCase().includes(filters.search) ||
        data.user?.name.toLowerCase().includes(filters.search);

      let categoryMatch =
        filters.category.length === 0 || filters.category.includes(data.category.toLowerCase());

      let statusMatch =
        filters.status.length === 0 || filters.status.includes(data.status.toLowerCase());

      let priorityMatch =
        filters.priority.length === 0 || filters.priority.includes(data.priority.toLowerCase());

      return searchMatch && categoryMatch && statusMatch && priorityMatch;
    };

    this.dataSource.filter = JSON.stringify(this.filterValues);
    this.isNotDataFound = this.dataSource.filteredData.length === 0;
  }


  applySearchFilter(filterValue: string) {
    this.filterValues.search = filterValue.trim().toLowerCase();
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


}

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
  public displayedColumns = ['tracking_id', 'user','new_status', 'priority', 'details', 'update_at',];
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


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}

import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject } from 'rxjs';
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
  public displayedColumns = ['tracking_id', 'user', 'new_status', 'priority', 'details', 'update_at',];
  public dataSource = new MatTableDataSource<any>();

  // Paginator
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _ticketLogsService: TicketLogsService
  ) {
    this._ticketLogsService.fetchDatas()
    effect(() => {
      this.dataSource.data = this.dataLogs
    })
  }

  get isNotDataFound() {
    return this._ticketLogsService.isNotFound()
  }

  get isLoading() {
    return this._ticketLogsService.isLoading()
  }

  get dataLogs() {
    return this._ticketLogsService._datas()
  }

  ngOnInit(): void {
  }

  /**
 * After View Init
 */

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}

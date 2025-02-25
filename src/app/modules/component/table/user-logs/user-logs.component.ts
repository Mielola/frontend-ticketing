import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HomeService } from 'app/modules/admin/dashboards/home/home.service';
import { UserLogs } from 'app/types/userLogs';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-logs',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSortModule,
  ],
  templateUrl: './user-logs.component.html',
})
export class UserLogsComponent implements OnInit {
  isLoading: boolean = false
  private _unsubscribeAll: Subject<any> = new Subject<UserLogs>();

  // Table
  public displayedColumns = ['name', 'role', 'shift', 'login_date', 'login_time'];
  public dataSource = new MatTableDataSource<any>();

  // Paginator
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _homeService: HomeService,) { }

  ngOnInit(): void {
    this.fetchData()
  }


  /**
 * After View Init
 */

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }


  async fetchData() {
    try {
      this.isLoading = true

      this._homeService.datas$.pipe(takeUntil(this._unsubscribeAll)).
        subscribe((reesponse) => {
          const dataTickets = reesponse

          // Users Logs
          this.dataSource.data = dataTickets.data.user_logs
        })

    } catch (error) {
      throw error
    } finally {
      this.isLoading = false
    }
  }
}

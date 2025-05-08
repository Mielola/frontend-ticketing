import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GenereateReportComponent } from '../../dialog/genereate-report/genereate-report.component';
import { TicketTableService } from '../ticket/ticket.service';
import { ExportHistoryService } from './export-history.service';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDay()

@Component({
  selector: 'app-export-history',
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
  templateUrl: './export-history.component.html',
  styleUrl: './export-history.component.scss'

})
export class ExportHistoryComponent implements OnInit, OnDestroy {
  isLoading: boolean = false
  isNotDataFound: boolean = false
  name: string
  // filterValues = {
  //   search: '',
  //   category: [],
  //   products: [],
  //   status: [],
  //   priority: []
  // };

  // statusList: string[] = ['New', 'On Progress', 'Resolved']
  // productsItems: { name: string, checked: boolean }[] = []
  // category: { name: string, checked: boolean }[] = []
  // statusItems: { name: string, checked: boolean }[] = []
  // priorityItems: { name: string, checked: boolean }[] = []

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  // Table
  public displayedColumns = ['file_name', 'user_email', 'created_at'];
  public dataSource = new MatTableDataSource<any>();

  // Paginator
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(new Date(year, month - 1)),
    end: new FormControl<Date | null>(new Date()),
  });


  constructor(
    private route: ActivatedRoute,
    private _exportHistory: ExportHistoryService,
  ) {

  }

  ngOnInit(): void {
    this.fetchData()
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

  private fetchData() {
    try {
      this.isLoading = true

      this._exportHistory.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((get) => {
        this.dataSource.data = get.data.data;
      })

      console.log(this.dataSource.data.length)

      if (this.dataSource.data.length === 0) {
        this.isLoading = false
        this.isNotDataFound = true
      } else {
        this.isLoading = false
        this.isNotDataFound = false
      }

    } catch (error) {
      this.isLoading = false
      this.isNotDataFound = true
      throw error
    }
  }

}

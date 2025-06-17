import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TempTicketsTableService } from './temp-tickets.service';
import { MatIcon } from '@angular/material/icon';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApiService } from 'app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { TicketTableService } from '../ticket/ticket.service';
import { TicketLogsService } from '../ticket-logs/ticket-logs.service';

@Component({
  selector: 'app-temp-tickets',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSortModule,
    MatMenuModule,
    MatCheckboxModule,
    FormsModule,
    MatIcon,
  ],
  templateUrl: './temp-tickets.component.html',
  styleUrl: './temp-tickets.component.scss'
})
export class TempTicketsComponent {

  // Table
  public displayedColumns = ['tracking_id', 'category', 'product', 'deleted_by', 'deleted_at', 'action'];
  public dataSource = new MatTableDataSource<any>();
  isAdmin: boolean = localStorage.getItem("userRole") === 'admin';

  // Paginator
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _tempTicketsService: TempTicketsTableService,
    private fuseConfirmationService: FuseConfirmationService,
    private _apiService: ApiService,
    private _toastService: ToastrService,
    private _ticketTableService: TicketTableService,
    private _ticketLogsService: TicketLogsService,
  ) {
    this._tempTicketsService.fetchData()
    effect(() => {
      this.dataSource.data = this.dataTempTickets
    })
  }

  get isNotDataFound() {
    return this._tempTicketsService.isNotFound()
  }

  get isLoading() {
    return this._tempTicketsService.isLoading()
  }

  get dataTempTickets() {
    return this._tempTicketsService._data()
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

  handleRestoreTickets(id: number) {
    const confirm = this.fuseConfirmationService.open({
      title: 'Restore Confirmation',
      message: `Are you sure want to restore this ticket ${id}?`,
      icon: {
        show: true,
        name: 'restore',
        color: 'primary',
      },
      actions: {
        confirm: {
          label: 'Restore',
          color: 'primary',
        },
      },
    });

    confirm.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.restoreTickets(id)
      }
    });
  }

  async restoreTickets(id: number) {
    try {
      const { data, status } = await this._apiService.post(`api/V1/tickets/restore/${id}`, {})

      if (status === 200) {
        this._toastService.success("Success Restore Ticket", "Success")
        this._tempTicketsService.fetchData()
        this._ticketTableService.fetchData()
        this._ticketLogsService.fetchDatas()
        return
      } else {
        this._toastService.error("Failed Restore Ticket", "Failed")
        return
      }
    } catch (error) {
      this._toastService.error("Failed Restore Ticket", "Failed")
      throw error
    }
  }



  handleDeleteTempTicket(id: number) {
    const confirm = this.fuseConfirmationService.open({
      title: 'Delete Confirmation',
      message: `Are you sure want to delete this ticket permanent ${id}?`,
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    confirm.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.deleteTempTicket(id)
      }
    });
  }

  async deleteTempTicket(id: number) {
    try {
      const { data, status } = await this._apiService.delete(`api/V1/tickets/temp/${id}`)

      if (status === 200) {
        this._toastService.success("Success Delete Tickets Permanent", "Success")
        this._tempTicketsService.fetchData()
        return
      } else {
        this._toastService.error("Failed Delete Tickets Permanent", "Failed")
        return
      }
    } catch (error) {
      this._toastService.error("Failed Delete Tickets Permanent", "Failed")
      throw error
    }
  }
}

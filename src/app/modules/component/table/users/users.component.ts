import { CommonModule } from '@angular/common';
import { Component, effect, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ApiService } from 'app/services/api.service';
import { Subject } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { UsersTableService } from './users.service';
import { FormAddEditUsersComponent } from 'app/modules/admin/dashboards/users/form-add-edit-users/form-add-edit-users.component';

@Component({
  selector: 'app-table-users',
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
  templateUrl: './users.component.html',
})
export class TableUsersComponent {
  shiftStatus: boolean = true
  ticketStatus: boolean = false

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  // Table
  public displayedColumns = ['users', 'password', 'role', 'action'];
  public dataSource = new MatTableDataSource<any>();

  // Paginator
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private _apiService: ApiService,
    private fuseConfirmationService: FuseConfirmationService,
    private _usersService: UsersTableService,
    private _matDialog: MatDialog,
    private _toastService: ToastrService,
  ) {
    effect(() => {
      this.dataSource.data = this.datas
    })
  }

  get datas() {
    return this._usersService._data()
  }

  get isLoading(): boolean {
    return this._usersService.isLoading()
  }

  get isNotDataFound(): boolean {
    return this._usersService.isNotFound()
  }

  ngOnInit(): void {
    this._usersService.fetchData()
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

  addUsers() {
    this._matDialog.open(FormAddEditUsersComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw',
      data: {
        id: null,
        mode: 'add'
      }
    })
  }

  editUsers(id: number) {
    this._matDialog.open(FormAddEditUsersComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw',
      data: {
        id: id,
        mode: 'edit'
      }
    })
  }

  handleDeleteUsers(id: number, name: string) {
    const confirm = this.fuseConfirmationService.open({
      title: 'Confirmation Delete',
      message: `Are you sure want to delete ${name}?`,
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    confirm.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.deleteUsers(id)
      }
    });
  }

  async deleteUsers(id: number) {
    try {
      const { data, status } = await this._apiService.delete(`api/V1/users/${id}`)

      if (status === 200) {
        this._toastService.success("Success Delete Users", "Success")
        this._usersService.fetchData()
        return
      } else {
        this._toastService.error("Failed Delete Users", "Failed")
        return
      }
    } catch (error) {
      this._toastService.error("Failed Delete Users", "Failed")
      throw error
    }
  }
}

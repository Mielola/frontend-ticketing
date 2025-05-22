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
import { ProductsTableService } from './products.service';
import { FormAddProductsComponent } from 'app/modules/admin/dashboards/products/form-add-products/form-add-products.component';
import { FormEditProductsComponent } from 'app/modules/admin/dashboards/products/form-edit-products/form-edit-products.component';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDay()

@Component({
  selector: 'app-table-products',
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
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class TableProductsComponent {
  filterValues = {
    search: '',
    category: [],
    products: [],
    status: [],
    priority: []
  };

  shiftStatus: boolean = true
  ticketStatus: boolean = false

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  // Table
  public displayedColumns = ['name', 'total_tickets', 'action'];
  public dataSource = new MatTableDataSource<any>();

  // Paginator
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private _apiService: ApiService,
    private fuseConfirmationService: FuseConfirmationService,
    private _productsService: ProductsTableService,
    private _matDialog: MatDialog,
    private _toastService: ToastrService,
  ) {
    effect(() => {
      this.dataSource.data = this.datas
    })
  }

  get datas() {
    return this._productsService._data()
  }

  get isLoading(): boolean {
    return this._productsService.isLoading()
  }

  get isNotDataFound(): boolean {
    return this._productsService.isNotFound()
  }

  ngOnInit(): void {
    this._productsService.fetchData()
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

  addProducts() {
    this._matDialog.open(FormAddProductsComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw',
    })
  }

  editProducts(id: number) {
    this._matDialog.open(FormEditProductsComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw',
      data: {
        id: id
      }
    })
  }

  handleDeleteProducts(id: number) {
    const confirm = this.fuseConfirmationService.open({
      title: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus Products ${id}?`,
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    confirm.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.deleteProducts(id)
      }
    });
  }

  async deleteProducts(id: number) {
    try {
      const { data, status } = await this._apiService.delete(`api/V1/products/${id}`)

      if (status === 200) {
        this._toastService.success("Success Delete Products", "Success")
        this._productsService.fetchData()
        return
      } else {
        this._toastService.error("Failed Delete Products", "Failed")
        return
      }
    } catch (error) {
      this._toastService.error("Failed Delete Products", "Failed")
      throw error
    }
  }
}

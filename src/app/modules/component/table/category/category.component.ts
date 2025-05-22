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
import { FormEditProductsComponent } from 'app/modules/admin/dashboards/products/form-edit-products/form-edit-products.component';
import { CategoryTableService } from './products.service';
import { FormAddCategoryComponent } from 'app/modules/admin/dashboards/category/form-add-category/form-add-category.component';
import { FormEditCategoryComponent } from 'app/modules/admin/dashboards/category/form-edit-category/form-edit-category.component';
@Component({
  selector: 'app-table-category',
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
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class TableCategoryComponent {

  shiftStatus: boolean = true
  ticketStatus: boolean = false

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  // Table
  public displayedColumns = ['category_name', 'products_name', 'action'];
  public dataSource = new MatTableDataSource<any>();

  // Paginator
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private _apiService: ApiService,
    private fuseConfirmationService: FuseConfirmationService,
    private _categoryService: CategoryTableService,
    private _matDialog: MatDialog,
    private _toastService: ToastrService,
  ) {
    effect(() => {
      this.dataSource.data = this.datas
    })
  }

  get datas() {
    return this._categoryService._data()
  }

  get isLoading(): boolean {
    return this._categoryService.isLoading()
  }

  get isNotDataFound(): boolean {
    return this._categoryService.isNotFound()
  }

  ngOnInit(): void {
    this._categoryService.fetchData()
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

  addCategory() {
    this._matDialog.open(FormAddCategoryComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw',
    })
  }

  editCategory(id: number) {
    this._matDialog.open(FormEditCategoryComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw',
      data: {
        id: id
      }
    })
  }

  handleDeleteCategory(id: number) {
    const confirm = this.fuseConfirmationService.open({
      title: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus Category ${id}?`,
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    confirm.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.deleteCategory(id)
      }
    });
  }

  async deleteCategory(id: number) {
    try {
      const { data, status } = await this._apiService.delete(`api/V1/category/${id}`)

      if (status === 200) {
        this._toastService.success("Success Delete Products", "Success")
        this._categoryService.fetchData()
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

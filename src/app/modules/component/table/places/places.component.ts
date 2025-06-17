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
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { FormAddProductsComponent } from 'app/modules/admin/dashboards/products/form-add-products/form-add-products.component';
import { FormEditProductsComponent } from 'app/modules/admin/dashboards/products/form-edit-products/form-edit-products.component';
import { PlacesTableService } from './places.service';
import { FormAddEditPlacesComponent } from 'app/modules/admin/dashboards/place/form-add-edit-places/form-add-edit-places.component';


@Component({
  selector: 'app-table-places',
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
  templateUrl: './places.component.html',
  styleUrl: './places.component.scss'
})
export class TablePlacesComponent {
  public displayedColumns = ['id', 'name', 'products', 'action'];
  public dataSource = new MatTableDataSource<any>();

  // Paginator
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private _apiService: ApiService,
    private fuseConfirmationService: FuseConfirmationService,
    private _placesService: PlacesTableService,
    private _matDialog: MatDialog,
    private _toastService: ToastrService,
  ) {
    effect(() => {
      this.dataSource.data = this.datas
    })
  }

  get datas() {
    return this._placesService._data()
  }

  get isLoading(): boolean {
    return this._placesService.isLoading()
  }

  get isNotDataFound(): boolean {
    return this._placesService.isNotFound()
  }

  ngOnInit(): void {
    this._placesService.fetchData()
  }

  /**
  * After View Init
  */

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
  * Public Functions
  */

  addPlaces() {
    this._matDialog.open(FormAddEditPlacesComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw',
      data: {
        mode: "Add"
      }
    })
  }

  editPlaces( place: any) {
    this._matDialog.open(FormAddEditPlacesComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw',
      data: {
        mode: "Edit",
        place: place
      }
    })
  }

  handleDeletePlaces(id: number) {
    const confirm = this.fuseConfirmationService.open({
      title: 'Delete Confirmation',
      message: `Are you sure want to delete this Places ?`,
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    confirm.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.deletePlaces(id)
      }
    });
  }

  async deletePlaces(id: number) {
    try {
      const { data, status } = await this._apiService.delete(`api/V1/places/${id}`)

      if (status === 200) {
        this._toastService.success("Success Delete Places", "Success")
        this._placesService.fetchData()
        return
      } else {
        this._toastService.error("Failed Delete Places", "Failed")
        return
      }
    } catch (error) {
      this._toastService.error("Failed Delete Places", "Failed")
      throw error
    }
  }
}

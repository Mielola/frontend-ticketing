import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IonLoading } from '@ionic/angular/standalone';
import { ApiService } from 'app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ProductsTableService } from 'app/modules/component/table/products/products.service';
import { CategoryTableService } from 'app/modules/component/table/category/products.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-form-edit-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    IonLoading,
    MatDatepickerModule,
    MatOptionModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './form-edit-category.component.html',
  styleUrl: './form-edit-category.component.scss'
})
export class FormEditCategoryComponent {
  productsForm!: FormGroup
  isLoading: boolean = false
  products: { id: string, name: string }[]
  id: number


  constructor(
    private _apiService: ApiService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private fuseConfirmationService: FuseConfirmationService,
    private _categoryTableService: CategoryTableService,
    public dialogRef: MatDialogRef<FormEditCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = data.id
  }

  async ngOnInit() {
    this.productsForm = this.fb.group({
      category_name: [null, [Validators.required]],
      products_id: [null, [Validators.required]],
    })

    await this.fetchData()
    this.fetchCategoryById()
  }

  async fetchData() {
    try {
      const get = await this._apiService.get("api/V1/products");
      this.products = get.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async fetchCategoryById() {
    try {
      const response = await this._apiService.get(`api/V1/category/${this.id}`)
      this.productsForm.patchValue({
        category_name: response.data.category_name,
        products_id: response.data.products_name
      })
    } catch (error) {
      throw error
    }
  }

  async onSubmit() {
    if (this.productsForm.invalid) {
      this.toast.warning("Please Fill All Form", "Warning")
      return
    }

    try {
      this.isLoading = true
      const { data, status } = await this._apiService.post(`api/V1/category/${this.id}`, {
        category_name: this.productsForm.value.category_name,
        products_id: this.productsForm.value.products_id
      })

      if (status === 200) {
        this.toast.success("Success Update Products", "Success")
        this._categoryTableService.fetchData()
        this.dialogRef.close()
        this.isLoading = false
        return
      } else if (status === 500) {
        this.toast.error("Internal Server Error", "Failed")
        this.dialogRef.close()
        this.isLoading = false
        return
      } else if (status === 409) {
        this.isLoading = false
        const confirm = this.fuseConfirmationService.open({
          title: 'Notification',
          message: 'The Category already exists on the server. Would you like to create another Category time anyway?',
          icon: {
            color: 'warn'
          },
          actions: {
            confirm: {
              label: 'Confirmation',
              color: 'primary'
            },
          },
        })
      }

    } catch (error) {
      throw error
    }
  }
}

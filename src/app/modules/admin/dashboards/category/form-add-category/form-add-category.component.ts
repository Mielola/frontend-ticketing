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
import { CategoryTableService } from 'app/modules/component/table/category/category.service';

@Component({
  selector: 'app-form-add-category',
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
  templateUrl: './form-add-category.component.html',
  styleUrl: './form-add-category.component.scss'
})
export class FormAddCategoryComponent {
  productsForm!: FormGroup
  isLoading: boolean = false
  products: { id: string, name: string }[]


  constructor(
    private _apiService: ApiService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private fuseConfirmationService: FuseConfirmationService,
    private _categoryTableService: CategoryTableService,
    public dialogRef: MatDialogRef<FormAddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.productsForm = this.fb.group({
      category_name: [null, [Validators.required]],
      products_id: [null, [Validators.required]],
    })

    this.fetchData()
  }

  async fetchData() {
    try {
      const get = await this._apiService.get("api/V1/products");
      this.products = get.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async onSubmit() {
    if (this.productsForm.invalid) {
      this.toast.warning("Please Fill All Form", "Warning")
      return
    }

    try {
      this.isLoading = true
      const { data, status } = await this._apiService.post("api/V1/category", {
        category_name: this.productsForm.value.category_name,
        products_id: this.productsForm.value.products_id
      })

      if (status === 201) {
        this.toast.success("Success Create Products", "Success")
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
          message: 'The Products already exists on the server. Would you like to create another Products time anyway?',
          icon: {
            color: 'info'
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

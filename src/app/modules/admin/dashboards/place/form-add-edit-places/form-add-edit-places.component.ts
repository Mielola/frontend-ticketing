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
import { CategoryTableService } from 'app/modules/component/table/category/category.service';
import { PlacesTableService } from 'app/modules/component/table/places/places.service';

@Component({
  selector: 'app-form-add-edit-places',
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
  templateUrl: './form-add-edit-places.component.html',
  styleUrl: './form-add-edit-places.component.scss'
})
export class FormAddEditPlacesComponent {
  placesForm!: FormGroup
  isLoading: boolean = false
  products: { id: string, name: string }[]


  constructor(
    private _apiService: ApiService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private fuseConfirmationService: FuseConfirmationService,
    private _placesTableService: PlacesTableService,
    public dialogRef: MatDialogRef<FormAddEditPlacesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    this.placesForm = this.fb.group({
      products_id: [null, [Validators.required]],
      name: [null, [Validators.required]],
    })

    this.fetchData()

  }

  async fetchData() {
    try {
      const get = await this._apiService.get("api/V1/products");
      this.products = get.data;

      if (this.data.mode === "Edit") {
        this.pacthValueForm()
      }
    } catch (error) {
      throw error
    }
  }

  pacthValueForm() {
    this.placesForm.patchValue({
      name: this.data.place.Name,
      products_id: String(this.data.place.ProductsID)
    })
  }

  async onSubmit() {
    if (this.placesForm.invalid) {
      this.toast.warning("Please Fill All Form", "Warning")
      return
    }

    try {
      this.isLoading = true
      const endPoint = this.data.mode == "Add" ? 'api/V1/places' : `api/V1/places/${this.data.place.ID}`
      const { data, status } = await this._apiService.post(endPoint, {
        name: this.placesForm.value.name,
        products_id: Number(this.placesForm.value.products_id)
      })

      if (status === 201) {
        this.toast.success("Success Create Products", "Success")
        this._placesTableService.fetchData()
        this.dialogRef.close()
        this.isLoading = false
        return
      } else if (status === 200) {
        this.toast.success("Success Update Products", "Success")
        this._placesTableService.fetchData()
        this.dialogRef.close()
        this.isLoading = false
        return
      }
      else if (status === 500) {
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
      } else {
        this.isLoading = false
        this.toast.error("Unknown Error", "Failed")
      }

    } catch (error) {
      throw error
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
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
import { UsersTableService } from 'app/modules/component/table/users/users.service';

@Component({
  selector: 'app-form-add-edit-users',
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
  templateUrl: './form-add-edit-users.component.html',
})
export class FormAddEditUsersComponent {
  usersForm!: FormGroup
  isLoading: boolean = false
  role: { id: number, name: string }[]


  constructor(
    private _apiService: ApiService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private fuseConfirmationService: FuseConfirmationService,
    private _usersTableService: UsersTableService,
    public dialogRef: MatDialogRef<FormAddEditUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.fetchRole()
    this.usersForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      role: [null, [Validators.required]],
    })

    if (this.data.id != null && this.data.mode === 'edit') {
      this.getUsersById()
    }
  }

  async fetchRole() {
    const response = await this._apiService.get("api/V1/role")
    const { data } = response
    this.role = data
  }

  async getUsersById() {
    try {
      const response = await this._apiService.get(`api/V1/users/${this.data.id}`)
      const { data } = response
      this.usersForm.patchValue({
        name: data.Name,
        email: data.Email,
        password: data.Password,
      })

    } catch (error) {
      this.toast.error("Failed Get Users", "Error");
      throw error;
    }
  }

  async onSubmit() {
    if (this.usersForm.invalid) {
      this.toast.warning("Please Fill All Form", "Warning")
      return
    }

    let endpoint = "api/V1/register"
    if (this.data.mode === 'edit') {
      endpoint = `api/V1/users/${this.data.id}`
    }

    try {
      this.isLoading = true
      const { data, status } = await this._apiService.post(endpoint, this.usersForm.value)

      if (status === 201) {
        this.toast.success("Success Create Users", "Success")
        this._usersTableService.fetchData()
        this.dialogRef.close()
        this.isLoading = false
        return
      } else if (status === 200) {
        this.toast.success("Success Update Users", "Success")
        this._usersTableService.fetchData()
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
          message: 'The Users already exists on the server. Would you like to create another Users time anyway?',
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

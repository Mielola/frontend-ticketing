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
import { ShiftTimingTableService } from 'app/modules/component/table/shift-timing/shift-timing.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-form-add-shift-time',
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
  templateUrl: './form-add-shift-time.component.html',
  styleUrl: './form-add-shift-time.component.scss'
})
export class FormAddShiftTimeComponent {
  shiftTimeForm!: FormGroup
  isLoading: boolean = false

  constructor(
    private _apiService: ApiService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private fuseConfirmationService: FuseConfirmationService,
    private _shiftTimingTableService: ShiftTimingTableService,
    public dialogRef: MatDialogRef<FormAddShiftTimeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.shiftTimeForm = this.fb.group({
      id: [null, [Validators.required]],
      shift_name: [null, [Validators.required]],
      start_time: [null, Validators.required],
      end_time: [null, Validators.required],
    })
  }

  async onSubmit() {
    if (this.shiftTimeForm.invalid) {
      this.toast.warning("Please Fill All Form", "Warning")
      return
    }

    try {
      this.isLoading = true
      const { data, status } = await this._apiService.post("api/V1/shifts-time", {
        id: `${this.shiftTimeForm.value.id}`,
        shift_name: this.shiftTimeForm.value.shift_name,
        start_time: `${this.shiftTimeForm.value.start_time}:00`,
        end_time: `${this.shiftTimeForm.value.end_time}:00`
      })

      if (status === 201) {
        this.toast.success("Success Create Shift Time", "Success")
        this._shiftTimingTableService.fetchData()
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
          message: 'The Shift Time already exists on the server. Would you like to create another shift time anyway?',
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

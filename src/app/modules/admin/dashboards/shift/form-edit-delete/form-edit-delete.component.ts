import { CommonModule } from '@angular/common';
import { Component, effect, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IonLoading } from '@ionic/angular/standalone';
import { ApiService } from 'app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ShiftService } from '../shift.service';


const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDay()

@Component({
  selector: 'app-form-edit-delete',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    IonLoading,
    MatButton,
    MatDatepickerModule,
  ],
  templateUrl: './form-edit-delete.component.html',
  styleUrl: './form-edit-delete.component.scss'
})
export class FormEditDeleteComponent {
  editShiftForm!: FormGroup
  isLoading: boolean = false
  emailData: { id: number, email: string }[] = []

  constructor(
    private fb: FormBuilder,
    private _apiService: ApiService,
    private _toast: ToastrService,
    private _shiftService: ShiftService,
    public dialogRef: MatDialogRef<FormEditDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    effect(() => {
      const response = this._shiftService.detailUserShift()
      this.editShiftForm.patchValue({
        user_email: response.data?.user_email,
        shift_date: response.data?.shift_date,
        shift_id: response.data?.shift_id
      })
    })
  }

  ngOnInit(): void {
    this._shiftService.fetchById(this._shiftService.shiftUserId())
    this.editShiftForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
      shift_id: ['', Validators.required],
      shift_date: ['', [Validators.required]],
    })

    this.fetchEmail()
  }

  async fetchEmail() {
    const response = await this._apiService.get("api/V1/email")
    this.emailData = response.data
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async handleDelete() {
    try {
      const response = await this._apiService.delete(`api/V1/shifts/${this._shiftService.shiftUserId()}`)

      if (response.status === 200) {
        this._toast.success("Succesfully Delete User Shifts", "Success")
        this._shiftService.fetchData()
        this.onNoClick()
      } else {
        this._toast.error("Error Delete User Shifts", "Error")
      }
    } catch (error) {
      throw error
    }
  }

  async onSubmit() {
    if (this.editShiftForm.invalid) {
      this._toast.warning("Please fill in all fields", "Information")
      return
    }

    try {

      const rawDate = new Date(this.editShiftForm.value.shift_date);
      const formatted = rawDate.toLocaleDateString('en-CA');

      const response = await this._apiService.post(`api/V1/shifts/${this._shiftService.shiftUserId()}`, {
        user_email: this.editShiftForm.value.user_email,
        shift_id: (this.editShiftForm.value.shift_id).toString(),
        shift_date: formatted,
        reason: "Cuti"
      })

      if (response.status === 200) {
        this._toast.success("Success Create Shift", "Success")
        this._shiftService.fetchData()
        this.onNoClick()
      } else {
        this._toast.error("Failde Create Shift", "Error")
      }
    } catch (error) {
      throw error
    }
  }
}

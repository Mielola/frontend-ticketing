import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
  selector: 'app-form-add',
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
  templateUrl: './form-add.component.html',
  styleUrl: './form-add.component.scss'
})
export class FormAddComponent implements OnInit {
  shiftForm!: FormGroup
  isLoading: boolean = false
  emailData: { id: number, email: string }[] = []

  constructor(
    private fb: FormBuilder,
    private _apiService: ApiService,
    private _toast: ToastrService,
    private _shiftService: ShiftService,
    public dialogRef: MatDialogRef<FormAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.shiftForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
      shift_id: ['', Validators.required],
    })

    this.fetchEmail()
    console.log(this._shiftService.dateCallendar())
  }

  async fetchEmail() {
    const response = await this._apiService.get("api/V1/email")
    this.emailData = response.data
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit() {
    if (this.shiftForm.invalid) {
      this._toast.warning("Please fill in all fields", "Information")
      return
    }

    try {
      const response = await this._apiService.post("api/V1/shifts", {
        user_email: this.shiftForm.value.user_email,
        shift_id: this.shiftForm.value.shift_id,
        shift_date: this._shiftService.dateCallendar()
      })

      if (response.status === 201) {
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

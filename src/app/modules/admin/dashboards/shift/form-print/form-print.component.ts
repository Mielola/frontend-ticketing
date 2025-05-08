import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IonLoading } from '@ionic/angular/standalone';
import { ApiService } from 'app/services/api.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-form-print',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    IonLoading,
    MatDatepickerModule,
    MatInputModule,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: './form-print.component.html',
  styleUrl: './form-print.component.scss'
})
export class FormPrintComponent implements OnInit {
  isLoading: boolean = false;
  exportShiftForm!: FormGroup;

  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings = {};
  products: string[] = [];

  range = new FormGroup({
    start: new FormControl<Date | null>(new Date(year, month - 1)),
    end: new FormControl<Date | null>(new Date()),
  });

  constructor(
    private fb: FormBuilder,
    private _apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.fetchDataEmail();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.exportShiftForm = this.fb.group({
      email: [[], Validators.required],
    });
  }

  onSubmit() {
    if (this.exportShiftForm.valid && this.range.valid) {
      this.isLoading = true;

      const formData = {
        startDate: this.range.get('start')?.value,
        endDate: this.range.get('end')?.value,
        email: this.exportShiftForm.get('email')?.value
      };

      console.log('Form submitted:', formData);

      // Here you would call your API service
      // this._apiService.post('your-endpoint', formData)
      //   .then(() => {
      //     this.isLoading = false;
      //     // Success handling
      //   })
      //   .catch(error => {
      //     this.isLoading = false;
      //     console.error('Error submitting form:', error);
      //   });

      this.isLoading = false; // Remove this line when implementing actual API call
    }
  }

  onNoClick() {
    // Close dialog or navigate away logic
  }

  async fetchDataEmail() {
    try {
      const response = await this._apiService.get("api/V1/email");

      if (response && response.data) {
        this.dropdownList = response.data.map((email: any) => ({
          item_id: email.email,
          item_text: email.email
        }));
      }
    } catch (error) {
      console.error('Error fetching email data:', error);
    }
  }
}
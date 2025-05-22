import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { IonLoading } from '@ionic/angular/standalone';
import { ApiService } from 'app/services/api.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-form-add-tickets',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatStepperModule,
    CommonModule,
    MatIconModule,
    MatNativeDateModule,
    IonLoading,
  ],
  templateUrl: './form-add-tickets.component.html',
})
export class FormAddTicketsComponent implements OnInit {

  firstTicketForm!: FormGroup;
  secondTicketForm!: FormGroup;

  products: string[] = [];
  category: string[] = [];
  priority: string[] = ['Low', 'Medium', 'High'];
  disableInput: boolean = true;

  isLoading: boolean = false

  constructor(
    private _apiService: ApiService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchDataProducts();

    this.firstTicketForm = this.fb.group({
      products_name: ['', Validators.required],
      subject: [{ value: '', disabled: this.disableInput }, Validators.required],
      category_name: [{ value: '', disabled: this.disableInput }, Validators.required],
      detail_kendala: [{ value: '', disabled: this.disableInput }, Validators.required],
      priority: [{ value: '', disabled: this.disableInput }, Validators.required],
      hari_masuk: [{ value: null, disabled: this.disableInput }, Validators.required],
      waktu_masuk: [{ value: '', disabled: this.disableInput }, Validators.required],
      hari_respon: [{ value: null, disabled: this.disableInput }, Validators.required],
      waktu_respon: [{ value: '', disabled: this.disableInput }, Validators.required],
    });

    this.secondTicketForm = this.fb.group({
      respon_diberikan: ['', Validators.required],
    });

    this.firstTicketForm.get('products_name')?.valueChanges.subscribe(async (value) => {
      if (value) {
        const { data } = await this._apiService.post("api/V1/get-data-form", { name: value })
        this.category = data.data
        this.enableFields();
      } else {
        this.disableFields();
      }
    });
  }

  enableFields() {
    Object.keys(this.firstTicketForm.controls).forEach((field) => {
      if (field !== 'products_name') {
        this.firstTicketForm.get(field)?.enable();
      }
    });
  }

  disableFields() {
    Object.keys(this.firstTicketForm.controls).forEach((field) => {
      if (field !== 'products_name') {
        this.firstTicketForm.get(field)?.disable();
      }
    });
  }

  async fetchDataProducts() {
    try {
      const get = await this._apiService.get("api/V1/list-products");
      this.products = get.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async onSubmit() {
    try {
      this.isLoading = true;

      const formatDate = (date: any) => {
        if (!date) return null;
        return DateTime.fromJSDate(new Date(date)).toISODate();
      };

      const data = {
        ...this.firstTicketForm.value,
        ...this.secondTicketForm.value,
        hari_masuk: formatDate(this.firstTicketForm.value.hari_masuk),
        hari_respon: formatDate(this.firstTicketForm.value.hari_respon),
        entry_day: formatDate(this.firstTicketForm.value.entry_day),
        response_day: formatDate(this.firstTicketForm.value.response_day),
        PIC: "Jibril",
        no_whatsapp: "081319107692"
      };

      console.log("Data yang dikirim:", data);

      const post = await this._apiService.post("api/V1/tickets", data);
      console.log("Response API:", post);

      this.isLoading = false;

      if (post.status === 201) {
        // Reset Form 1
        this.router.navigateByUrl("/dashboards/tickets")
        this.firstTicketForm.disable()
        this.firstTicketForm.reset()

        // Reset Form 2
        this.secondTicketForm.disable()
        this.secondTicketForm.reset()
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      this.isLoading = false;
    }
  }

}

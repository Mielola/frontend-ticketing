import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { Ticket } from 'app/types/tickets';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { IonLoading } from '@ionic/angular/standalone';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-detail-tickets',
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
  templateUrl: './detail-tickets.component.html',
  styleUrl: './detail-tickets.component.scss'
})
export class DetailTicketsComponent implements OnInit {

  TicketForm!: FormGroup;
  products: string[] = [];
  category: string[] = [];
  disableInput: boolean = true;
  priority: string[] = ['Low', 'Medium', 'High'];
  status: string[] = ['New', 'In Progress', 'Resolved', 'Critical'];
  tracking_id: string;


  constructor(
    private route: ActivatedRoute,
    private _apiService: ApiService,
    private fb: FormBuilder,
  ) { }

  data: Ticket

  ngOnInit() {

    this.TicketForm = this.fb.group({
      products_name: ['', Validators.required],
      category_name: [{ value: '', disabled: this.disableInput }, Validators.required],
      no_whatsapp: [{ value: '', disabled: this.disableInput }, Validators.required],
      detail_kendala: [{ value: '', disabled: this.disableInput }, Validators.required],
      priority: [{ value: '', disabled: this.disableInput }, Validators.required],
      status: [{ value: '', disabled: this.disableInput }, Validators.required],
      hari_masuk: [{ value: null, disabled: this.disableInput }, Validators.required],
      waktu_masuk: [{ value: '', disabled: this.disableInput }, Validators.required],
      respon_diberikan: [{ value: '', disabled: this.disableInput }, Validators.required],
      PIC : [{ value: '', disabled: this.disableInput }, Validators.required],
    })

    this.fetchDataProducts();
    this.route.paramMap.subscribe(params => {
      const trackingId = params.get('trackingId');
      if (trackingId) {
        this.tracking_id = trackingId
      }
      this.fetchData(trackingId)
    });



    this.TicketForm.get('products_name')?.valueChanges.subscribe(async (value) => {
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
    Object.keys(this.TicketForm.controls).forEach((field) => {
      if (field !== 'products_name') {
        this.TicketForm.get(field)?.enable();
      }
    });
  }

  disableFields() {
    Object.keys(this.TicketForm.controls).forEach((field) => {
      if (field !== 'products_name') {
        this.TicketForm.get(field)?.disable();
      }
    });
  }

  async onSubmit() {
    alert(this.TicketForm.value)
    console.log(this.TicketForm.value)
    const post = await this._apiService.post(`api/V1/tickets/${this.tracking_id}`, this.TicketForm.value)
    console.log(post)
  }


  async fetchDataProducts() {
    try {
      const get = await this._apiService.get("api/V1/products");
      this.products = get.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async fetchData(trackingId: string) {
    const data = await this._apiService.get(`api/V1/tickets/${trackingId}`)
    this.data = data.data

    const formatDate = (date: any) => {
      if (!date) return null;
      return DateTime.fromJSDate(new Date(date)).toISODate();
    };

    this.TicketForm.patchValue({
      products_name: data.data.products_name,
      category_name: data.data.category,
      no_whatsapp: data.data.no_whatsapp,
      detail_kendala: data.data.detail_kendala,
      priority: data.data.priority,
      status: data.data.status,
      hari_masuk: new Date(data.data.hari_masuk),
      waktu_masuk: data.data.waktu_masuk,
      respon_diberikan: data.data.respon_admin,
      PIC : data.data.pic,
    })
  }
}

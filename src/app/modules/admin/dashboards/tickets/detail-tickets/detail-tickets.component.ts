import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { Ticket } from 'app/types/tickets';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { TicketTableService } from 'app/modules/component/table/ticket/ticket.service';
import { TempTicketsTableService } from 'app/modules/component/table/temp-tickets/temp-tickets.service';

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
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './detail-tickets.component.html',
  styleUrl: './detail-tickets.component.scss'
})
export class DetailTicketsComponent implements OnInit, AfterViewInit {

  TicketForm!: FormGroup;
  products: string[] = [];
  category: string[] = [];
  categoryResolved: { id: string, name: string }[]
  disableInput: boolean = true;
  priority: string[] = ['Low', 'Medium', 'High', 'Critical'];
  status: string[] = ['New', 'Hold', 'On Progress', 'Resolved'];
  tracking_id: string;
  isLoading: boolean = false
  isNotDataFound: boolean
  shiftStatus: boolean = false
  isAdmin: boolean = localStorage.getItem("userRole") === 'admin';
  place: { id: number, name: string }[] = []
  subject: string = ''

  public displayedColumns = ['tracking_id', 'user', 'new_status', 'priority', 'details', 'update_at',];
  public dataSource = new MatTableDataSource<any>();

  // Paginator
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _apiService: ApiService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _toastService: ToastrService,
    private fuseConfirmationService: FuseConfirmationService,
    private _ticketTableService: TicketTableService,
    private _tempTicketService: TempTicketsTableService,
  ) { }

  data: Ticket

  ngOnInit() {
    this.fetchUsers()
    this.TicketForm = this.fb.group({
      products_name: ['', Validators.required],
      category_id: [{ value: 0, disabled: this.disableInput }, Validators.required],
      places_id: [{ value: null, disabled: this.disableInput }],
      category_resolved_id: [{ value: null, disabled: this.disableInput }],
      note_resolved: [{ value: null, disabled: this.disableInput }],
      no_whatsapp: [{ value: '', disabled: this.disableInput }],
      detail_kendala: [{ value: '', disabled: this.disableInput }, Validators.required],
      priority: [{ value: '', disabled: this.disableInput }, Validators.required],
      status: [{ value: '', disabled: this.disableInput }, Validators.required],
      subject: [{ value: '', disabled: this.disableInput }, Validators.required],
      hari_masuk: [{ value: null, disabled: this.disableInput }, Validators.required],
      waktu_masuk: [{ value: '', disabled: this.disableInput }, Validators.required],
      respon_diberikan: [{ value: '', disabled: this.disableInput }, Validators.required],
      PIC: [{ value: '', disabled: this.disableInput }],
    })

    this.fetchDataProducts();
    this.fetchCategoryResolved()
    this.route.paramMap.subscribe(params => {
      const trackingId = params.get('trackingId');
      if (trackingId) {
        this.tracking_id = trackingId
      }
      this.fetchData(trackingId)
    });


    this.TicketForm.get("status")?.valueChanges.subscribe(async (value) => {
      this.applyStatusBasedResolvedValidators(value)
    })

    this.TicketForm.get('products_name')?.valueChanges.subscribe(async (value) => {
      if (value) {
        const { data } = await this._apiService.post("api/V1/get-data-form", { name: value })
        this.category = data.data.category
        this.place = data.data.places

        this.enableFields();
      } else {
        this.disableFields();
      }
    });

  }

  goBack() {
    window.history.back();
  }

  applyInitialResolvedValidators() {
    if (this.data?.category_resolved_id && this.data?.note_resolved) {
      this.TicketForm.get('note_resolved')?.setValidators([Validators.required]);
      this.TicketForm.get('category_resolved_id')?.setValidators([Validators.required]);
    }
  }

  applyStatusBasedResolvedValidators(status: string) {
    if (status === 'Resolved') {
      this.TicketForm.get('note_resolved')?.setValidators([Validators.required]);
      this.TicketForm.get('category_resolved_id')?.setValidators([Validators.required]);
    } else {
      this.TicketForm.get('note_resolved')?.clearValidators();
      this.TicketForm.get('category_resolved_id')?.clearValidators();
    }
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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

    if (this.TicketForm.invalid) {
      this._toastService.error('Form tidak valid. Mohon lengkapi semua field yang wajib.', 'Error');
      this.TicketForm.markAllAsTouched();
      return;
    }

    try {
      const post = await this._apiService.post(`api/V1/tickets/${this.tracking_id}`, this.TicketForm.value)
      if (post.status === 200) {
        this.fetchData(this.tracking_id)
        this._toastService.success("Success Update Ticket", "Success")
      } else {
        this._toastService.error("Failed Update Ticket", "Error")
      }
    } catch (error) {
      throw error
    }
  }

  handleDeleteTicket() {
    const confirm = this.fuseConfirmationService.open({
      title: 'Delete Confirmation',
      message: `Are you sure want to delete this ticket ${this.tracking_id}?`,
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    confirm.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.deleteTickets(this.tracking_id)
      }
    });
  }

  async deleteTickets(id: string) {
    try {
      const { data, status } = await this._apiService.delete(`api/V1/tickets/${id}`)

      if (status === 200) {
        this._toastService.success("Success Delete Tickets", "Success")
        await this._ticketTableService.fetchData()
        await this._tempTicketService.fetchData()
        this.router.navigate(['/dashboards/tickets'])
        return
      } else {
        this._toastService.error("Failed Delete Tickets", "Failed")
        return
      }
    } catch (error) {
      this._toastService.error("Failed Delete Tickets", "Failed")
      throw error
    }
  }

  async fetchCategoryResolved() {
    try {
      const get = await this._apiService.get("api/V1/category-resolved");
      this.categoryResolved = get.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }


  async fetchDataProducts() {
    try {
      const get = await this._apiService.get("api/V1/list-products");
      this.products = get.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async fetchData(trackingId: string) {
    const data = await this._apiService.get(`api/V1/tickets/${trackingId}`)
    this.dataSource.data = data.data.history;
    this.data = data.data

    this.TicketForm.patchValue({
      subject: data.data.subject,
      products_name: data.data.products_name,
      places_id: data.data.place_id,
      category_resolved_id: data.data.category_resolved_id,
      note_resolved: data.data.note_resolved,
      category_id: data.data.category_id,
      no_whatsapp: data.data.no_whatsapp,
      detail_kendala: data.data.detail_kendala,
      priority: data.data.priority,
      status: data.data.status,
      hari_masuk: new Date(data.data.hari_masuk),
      waktu_masuk: data.data.waktu_masuk,
      respon_diberikan: data.data.respon_admin,
      PIC: data.data.pic,
    })
    this.applyInitialResolvedValidators()
  }

  async fetchUsers() {
    try {
      this.isLoading = true
      const findUser = await this._apiService.get(`api/V1/get-profile`)

      this.shiftStatus = findUser.data.shift_status !== 'Active Shift'
      this.cdr.detectChanges();
    } catch (error) {
      throw error
    } finally {
      this.isLoading = false
    }
  }
}

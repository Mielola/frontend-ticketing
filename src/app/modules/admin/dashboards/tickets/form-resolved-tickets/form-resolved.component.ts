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
import { TicketTableService } from 'app/modules/component/table/ticket/ticket.service';
import { TicketLogsService } from 'app/modules/component/table/ticket-logs/ticket-logs.service';

@Component({
  selector: 'app-form-resolved',
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
  templateUrl: './form-resolved.component.html',
  styleUrl: './form-resolved.component.scss'
})
export class FormResolvedComponent {
  productsForm!: FormGroup
  isLoading: boolean = false
  categoryResolved: { id: string, name: string }[]


  constructor(
    private _apiService: ApiService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private fuseConfirmationService: FuseConfirmationService,
    private _ticketTableService: TicketTableService,
    private _ticketLogsService: TicketLogsService,
    public dialogRef: MatDialogRef<FormResolvedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.productsForm = this.fb.group({
      note_resolved: [null, [Validators.required]],
      category_resolved_id: [null, [Validators.required]],
    })

    this.fetchData()
  }

  async fetchData() {
    try {
      const get = await this._apiService.get("api/V1/category-resolved");
      this.categoryResolved = get.data;
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
      const { data, status } = await this._apiService.post(`api/V1/tickets-resolved/${this.data.tracking_id}`, {
        note_resolved: this.productsForm.value.note_resolved,
        category_resolved_id: this.productsForm.value.category_resolved_id
      })

      if (status === 200) {
        this.toast.success("Success Resolved Tickets", "Success")
        this._ticketLogsService.fetchDatas()
        this._ticketTableService.fetchData()
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

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
import { ProductsTableService } from 'app/modules/component/table/products/products.service';
import * as XLSX from 'xlsx';
import { TicketTableService } from 'app/modules/component/table/ticket/ticket.service';

@Component({
  selector: 'app-import-excel',
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
  templateUrl: './import-excel.component.html',
  styleUrl: './import-excel.component.scss'
})
export class ImportExcelComponent {
  excelForm!: FormGroup
  isLoading: boolean = false

  excelData: any[] = [];
  selectedFile: File | null = null;

  constructor(
    private _apiService: ApiService,
    private toast: ToastrService,
    private _ticketTableSerivce: TicketTableService,
    private fuseConfirmationService: FuseConfirmationService,
    public dialogRef: MatDialogRef<ImportExcelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {

  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        this.excelData = XLSX.utils.sheet_to_json(worksheet);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  async onSubmit() {

    try {
      this.isLoading = true
      console.log(this.excelData)
      const { data, status } = await this._apiService.post("api/V1/tickets/excel", this.excelData)

      if (status === 201) {
        this.toast.success("Success Create Tickets", "Success")
        this._ticketTableSerivce.fetchData()
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
          message: 'The Tickets already exists on the server. Would you like to create another Tickets time anyway?',
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
      } else if (status === 400) {
        this.toast.error("Bad Request", "Failed")
        this.dialogRef.close()
        this.isLoading = false
        return
      }

    } catch (error) {
      throw error
    }
  }
}

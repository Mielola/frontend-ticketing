import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatTimepickerModule } from 'mat-timepicker';
import { DemoPlaceholderComponent } from "../../ui/page-layouts/common/demo-placeholder/demo-placeholder.component";
import { DemoSidebarComponent } from "../../ui/page-layouts/common/demo-sidebar/demo-sidebar.component";

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDay()

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    CdkScrollable,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
    DemoSidebarComponent
],
  templateUrl: './export.component.html',
  styleUrl: './export.component.scss'
})
export class ExportComponent implements OnInit {
  @ViewChild("matDrawer") matDrawer: MatDrawer
  ticketForm!: FormGroup
  content: string
  timePickerVisible = false;
  selectedDate: Date = new Date();
  selectedTime: string = '';

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(new Date(year, month - 1)),
    end: new FormControl<Date | null>(new Date()),
  });

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.ticketForm = this.fb.group({
      products_name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    })
  }

  tooggleDrawer(contents: string) {
    this.content = contents
    this.matDrawer.toggle()
  }
}

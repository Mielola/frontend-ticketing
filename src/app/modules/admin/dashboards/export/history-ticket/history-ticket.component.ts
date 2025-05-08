import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonLoading } from '@ionic/angular/standalone';
import { MatTimepickerModule } from 'mat-timepicker';
import { TicketComponent } from "../../../../component/table/ticket/ticket.component";
import { ExportHistoryComponent } from "../../../../component/table/export-history/export-history.component";

@Component({
  selector: 'app-history-ticket',
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
    MatSelectModule,
    IonLoading,
    TicketComponent,
    ExportHistoryComponent
  ],
  templateUrl: './history-ticket.component.html',
  styleUrl: './history-ticket.component.scss'
})
export class HistoryTicketComponent implements OnInit {

  name: string

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const param = params.get('history-type');
      this.name = param ? param.charAt(0).toUpperCase() + param.slice(1) : '';
    })
  }
}

import { Component, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketComponent } from 'app/modules/component/table/ticket/ticket.component';
import { TicketTableService } from 'app/modules/component/table/ticket/ticket.service';

@Component({
  selector: 'app-places-tickets',
  standalone: true,
  imports: [
    TicketComponent,
    RouterLink,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './places-tickets.component.html',
  styleUrl: './places-tickets.component.scss'
})
export class PlacesTicketsComponent {
  placesName: string = '';
  summary: any;

  get sumarys() {
    return this._ticketTableService.sumarry();
  }

  goBack() {
    window.history.back();
  }

  constructor(
    private _ticketTableService: TicketTableService,
    private currentRoute: ActivatedRoute,
  ) {
    effect(() => {
      this.summary = this.sumarys;
      console.log('Summary updated:', this.summary);
    })
    currentRoute.params.subscribe(params => {
      const placesName = params['places_name'];
      if (placesName) {
        this.placesName = placesName;
        this._ticketTableService.fetchDataByPlaces(placesName);
      }
    });
  }
}

import { Component, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketComponent } from 'app/modules/component/table/ticket/ticket.component';
import { TicketTableService } from 'app/modules/component/table/ticket/ticket.service';

@Component({
  selector: 'app-category-tickets',
  standalone: true,
  imports: [
    TicketComponent,
    RouterLink,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './category-tickets.component.html',
  styleUrl: './category-tickets.component.scss'
})
export class CategoryTicketsComponent {
  categoryName: string = '';
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
    })
    currentRoute.params.subscribe(params => {
      const categoryName = params['category_name'];
      if (categoryName) {
        this.categoryName = categoryName;
        this._ticketTableService.fetchDataByCategory(categoryName);
      }
    });
  }
}

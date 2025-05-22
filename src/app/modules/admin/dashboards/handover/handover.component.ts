import { Component } from '@angular/core';
import { HandoversComponent } from 'app/modules/component/table/handovers/handovers.component';

@Component({
  selector: 'app-handover',
  standalone: true,
  imports: [
    HandoversComponent
  ],
  templateUrl: './handover.component.html',
  styleUrl: './handover.component.scss'
})
export class HandoverComponent {

}

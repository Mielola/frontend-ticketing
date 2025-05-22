import { Component } from '@angular/core';
import { ShiftTimingTableComponent } from 'app/modules/component/table/shift-timing/shift-timing.component';

@Component({
  selector: 'app-shift-timing',
  standalone: true,
  imports: [
    ShiftTimingTableComponent
  ],
  templateUrl: './shift-timing.component.html',
  styleUrl: './shift-timing.component.scss'
})
export class ShiftTimingComponent {

}

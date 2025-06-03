import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HandoversComponent } from 'app/modules/component/table/handovers/handovers.component';
import { NotesComponent } from '../../apps/notes/notes.component';

@Component({
  selector: 'app-handover',
  standalone: true,
  imports: [
    HandoversComponent,
    RouterLink,
    NotesComponent
],
  templateUrl: './handover.component.html',
  styleUrl: './handover.component.scss'
})
export class HandoverComponent {

}

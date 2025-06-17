import { Component } from '@angular/core';
import { TablePlacesComponent } from 'app/modules/component/table/places/places.component';

@Component({
  selector: 'app-place',
  standalone: true,
  imports: [
    TablePlacesComponent,
  ],
  templateUrl: './place.component.html',
  styleUrl: './place.component.scss'
})
export class PlaceComponent {

}

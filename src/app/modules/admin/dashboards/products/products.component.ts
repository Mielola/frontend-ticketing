import { Component } from '@angular/core';
import { TableProductsComponent } from 'app/modules/component/table/products/products.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    TableProductsComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

}

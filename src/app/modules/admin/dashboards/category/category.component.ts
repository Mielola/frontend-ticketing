import { Component } from '@angular/core';
import { TableCategoryComponent } from 'app/modules/component/table/category/category.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    TableCategoryComponent,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {

}

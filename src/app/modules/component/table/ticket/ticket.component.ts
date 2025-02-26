import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from 'app/services/api.service';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSortModule,
    MatIcon,
    MatMenuModule,
    MatCheckboxModule,
    NgClass,
    FormsModule,
  ],
  templateUrl: './ticket.component.html',
})
export class TicketComponent implements OnInit {
  isLoading: boolean = false
  category: { name: string, checked: boolean }[] = []

  // Table
  public displayedColumns = ['tracking_id', 'create_date', 'create_time', 'category', 'name', 'subject', 'status', 'solved_time', 'last_replier', 'priority'];
  public dataSource = new MatTableDataSource<any>();

  // Paginator
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.fetchData()
  }

  /**
 * After View Init
 */

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  async fetchData() {
    const get = await this._apiService.get("api/V1/tickets");

    const categorySet = new Set<string>();

    get.data.forEach(tickets => {
      if (tickets.category) {
        if (Array.isArray(tickets.category)) {
          tickets.category.forEach(cat => categorySet.add(cat));
        } else {
          categorySet.add(tickets.category)
        }
      }

      if (!tickets.subject) {
        tickets.subject = "Subject Not Found";
      }
    });

    // Convert Set ke array unik dan tambahkan properti checked
    this.category = [...categorySet].map(category => ({ name: category, checked: false }));

    this.dataSource.data = get.data;
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLocaleLowerCase();
    this.dataSource.filter = filterValue;
  }

  applyCategoryFilter() {
    const selectedCategories = this.category
      .filter(item => item.checked)
      .map(item => item.name.toLowerCase());

    if (selectedCategories.length === 0) {
      this.dataSource.filter = '';
      return;
    }

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return selectedCategories.includes(data.category.toLowerCase());
    };

    this.dataSource.filter = 'apply_filter';
  }


}

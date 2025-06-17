import { Component, effect, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HandoversComponent } from 'app/modules/component/table/handovers/handovers.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { HandoverService } from './handover.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApiService } from 'app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormAddNotesComponent } from './form-add-notes/form-add-notes.component';
import { FormsModule } from '@angular/forms';
import { FormEditNotesComponent } from './form-edit-notes/form-edit-notes.component';

@Component({
  selector: 'app-handover',
  standalone: true,
  imports: [
    HandoversComponent,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './handover.component.html',
})
export class HandoverComponent implements OnInit {

  data: any[] = []
  searchText: string = '';
  filteredData: any[] = [];

  constructor(
    private _handoverService: HandoverService,
    private _apiService: ApiService,
    private fuseConfirmationService: FuseConfirmationService,
    private _matDialog: MatDialog,
    private _toastService: ToastrService,
  ) {
    effect(() => {
      this.data = this._data;
      this.filteredData = this.data;

    })
  }

  get _data() {
    return this._handoverService._data()
  }

  get isNotFound() {
    return this._handoverService.isNotFound()
  }

  ngOnInit(): void {
    this._handoverService.fetchData()
  }

  filterNotes() {
    const lowerSearch = this.searchText.toLowerCase();
    this.filteredData = this.data.filter(note =>
      note.title.toLowerCase().includes(lowerSearch) ||
      note.content.toLowerCase().includes(lowerSearch) ||
      note.name.toLowerCase().includes(lowerSearch)
    );
  }


  addNotes() {
    this._matDialog.open(FormAddNotesComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw',
    })
  }

  editNotes(notes: any) {
    this._matDialog.open(FormEditNotesComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      maxWidth: '100vw',
      data: notes
    })
  }

  handleDeleteNotes(id: number) {
    const confirm = this.fuseConfirmationService.open({
      title: 'Confirmation Delete',
      message: `Are you sure want to delete this note ?`,
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    confirm.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.deleteNotes(id)
      }
    });
  }

  async deleteNotes(id: number) {
    try {
      const { data, status } = await this._apiService.delete(`api/V1/notes/${id}`)

      if (status === 200) {
        this._toastService.success("Success Delete Notes", "Success")
        this._handoverService.fetchData()
        return
      } else {
        this._toastService.error("Failed Delete Notes", "Failed")
        return
      }
    } catch (error) {
      this._toastService.error("Failed Delete Notes", "Failed")
      throw error
    }
  }

}

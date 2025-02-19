import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-user-form-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],

    template: `
  <h2>User Form</h2>
  <form (ngSubmit)="onSubmit()">
    <label for="name">Name:</label>
    <input id="name" [(ngModel)]="user.name" name="name" required />

    <label for="email">Email:</label>
    <input id="email" [(ngModel)]="user.email" name="email" required />

    <button type="submit">Submit</button>
    <button type="button" (click)="close()">Cancel</button>
  </form>
`,
    styleUrl: './user-form-dialog.component.scss'
})
export class UserFormDialogComponent {
    user = { name: '', email: '' };

    constructor() { }

    onSubmit() {
        // Logic to handle form submission
        console.log(this.user);
        // Close modal after submission
    }

    close() {
        // Logic to close the modal
    }
}

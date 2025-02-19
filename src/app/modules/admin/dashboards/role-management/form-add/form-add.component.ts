import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { RoleService } from 'app/services/roleService/role.service';

@Component({
    selector: 'app-form-add',
    standalone: true,
    imports: [
        IonIcon, RouterLink, MatFormFieldModule, FormsModule,
        MatInputModule, ReactiveFormsModule, CommonModule, MatIconModule, CommonModule
    ],
    templateUrl: './form-add.component.html',
    styleUrl: './form-add.component.scss'
})
export class FormAddComponent {
    roleForm!: FormGroup;

    constructor(private roleService: RoleService, private fb: FormBuilder, private route: Router, private location: Location) { }

    ngOnInit() {
        // Ubah nama field form agar sesuai dengan API
        this.roleForm = this.fb.group({
            profile_name: ['', [Validators.required]],
            shared_users: ['', Validators.required],
            upload: ['', Validators.required],
            download: ['', Validators.required],
        });
    }

    async onSubmit() {
        if (this.roleForm.valid) {
            const profile_name = this.roleForm.get('profile_name')?.value;
            const shared_users = this.roleForm.get('shared_users')?.value;
            const upload = this.roleForm.get('upload')?.value;
            const download = this.roleForm.get('download')?.value;

            const rate_limit = `${upload}/${download}`
            const role = {
                profile_name,
                shared_users,
                rate_limit
            };

            const post = await this.roleService.addProfile(role)
            if (post) {
                console.log(post);
                this.roleForm.reset();
                this.location.back()
            }
        } else {
            console.log("Form Not Valid", this.roleForm); // Menampilkan status form dan error
            Object.keys(this.roleForm.controls).forEach(key => {
                const controlErrors = this.roleForm.get(key)?.errors;
                if (controlErrors != null) {
                    console.log('Key control: ' + key + ', error: ', controlErrors);
                }
            });
        }
    }
}

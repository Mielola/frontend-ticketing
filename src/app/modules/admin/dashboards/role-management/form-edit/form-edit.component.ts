import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { RoleService } from 'app/services/roleService/role.service';

@Component({
    selector: 'app-form-edit',
    standalone: true,
    imports: [
        IonIcon, RouterLink, MatFormFieldModule, FormsModule,
        MatInputModule, ReactiveFormsModule, CommonModule, MatIconModule
    ],
    templateUrl: './form-edit.component.html',
    styleUrl: './form-edit.component.scss'
})
export class FormEditComponent {
    userFormEdit!: FormGroup;
    profile_name: any;
    profile_datas: any

    constructor(private roleService: RoleService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) { }

    async ngOnInit() {
        this.userFormEdit = this.fb.group({
            shared_users: ['', Validators.required],
            upload: ['', Validators.required],
            download: ['', Validators.required],
        })

        this.route.paramMap.subscribe(params => {
            this.profile_name = params.get('name');
        })

        if (this.profile_name) {
            const profiledData = await this.roleService.getProfileByName(this.profile_name)
            console.log("profile data " + profiledData)
            const [upload, download] = profiledData.rate_limit.split('/')
            this.profile_datas = profiledData
            this.userFormEdit.patchValue({
                shared_users: this.profile_datas.shared_users,
                upload: upload,
                download: download,
            })
        }
    }

    async onSubmit() {
        if (this.userFormEdit.valid) {
            const formData = new FormData()
            const rate_limit = `${this.userFormEdit.value.upload}/${this.userFormEdit.value.download}`

            formData.append('shared_users', this.userFormEdit.value.shared_users)
            formData.append('rate_limit', rate_limit)

            const updateData = await this.roleService.updateProfile(this.profile_name, formData)
            console.log(updateData)
            if (updateData) {
                this.userFormEdit.reset()
                this.router.navigate(['tabs/role-management'])
            }
        } else {
            console.log("form tidak valid")
        }
    }

}

import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { RoleService } from 'app/services/roleService/role.service';
import { UserService } from 'app/services/userService/user.service';

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
    userFormEdit!: FormGroup
    name: any;
    userData: any
    roleDatas: any[] = []

    constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private userService: UserService, private roleService: RoleService, private location: Location) { }

    async ngOnInit() {
        this.userFormEdit = this.fb.group({
            name: ['', Validators.required],
            comment: ['', Validators.required],
            profile: ['', Validators.required],
            status: ['', Validators.required]
        })

        this.route.paramMap.subscribe(params => {
            this.name = params.get('name')
        })

        if (this.name) {
            const userDatas = await this.userService.getUserByPhone(this.name)
            console.log("IUYYYY" + userDatas)
            this.userData = userDatas.user

            // Get Role
            const roleData = await this.roleService.getProfile()
            console.log(roleData)
            this.roleDatas = roleData.profiles
            this.userFormEdit.patchValue({
                name: this.userData.name,
                comment: this.userData.comment,
                profile: this.userData.profile,
                status: this.userData.disabled
            })
        }
    }

    async onSubmit() {
        if (this.userFormEdit.valid) {
            const formData = new FormData()

            formData.append('name', this.userFormEdit.value.name)
            formData.append('comment', this.userFormEdit.value.comment)
            formData.append('profile', this.userFormEdit.value.profile)
            formData.append('disabled', this.userFormEdit.value.status)

            console.log("DATA YANG DIKIRIM:");
            formData.forEach((value, key) => {
                console.log(key + ': ' + value);
            });
            const updateData = await this.userService.updateUsers(this.name, formData)
            console.log(updateData)
            if (updateData) {
                this.userFormEdit.reset()
                this.location.back()
            }
        } else {
            console.log("FORM BELUM LENGKAP")
        }
    }
}

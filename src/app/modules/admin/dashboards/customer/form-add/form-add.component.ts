import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { IonIcon, Platform } from '@ionic/angular/standalone';
import { RoleService } from 'app/services/roleService/role.service';
import { UserService } from 'app/services/userService/user.service';

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
    userForm!: FormGroup
    roleDatas: any[] = []


    constructor(private platform: Platform, private router: Router, private fb: FormBuilder, private roleService: RoleService, private userService: UserService, private route: Router, private location: Location) { }

    ngOnInit(): void {
        this.userForm = this.fb.group({
            no_hp: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            name: ['', Validators.required],
            profile: ['', Validators.required]
        })

        this.platform.backButton.subscribeWithPriority(10, () => {
            this.router.navigate(['/dashboard/customer']); // Ganti dengan path yang sesuai
        });

        this.userForm.patchValue({
            profile: 'default'
        })

        this.getRole()
    }

    async getRole() {
        const roleData = await this.roleService.getProfile()
        console.log(roleData)
        this.roleDatas = roleData.profiles
    }

    async onSubmit() {
        if (this.userForm.valid) {
            const formData = new FormData()

            formData.append('no_hp', this.userForm.value.no_hp)
            formData.append('name', this.userForm.value.name)
            formData.append('profile', this.userForm.value.profile)

            const dataPost = await this.userService.addUsers(formData)
            console.log(dataPost)
            if (formData) {
                this.userForm.reset()
                this.location.back()

            }
        } else {
            console.log('invalid form')
        }
    }
}

import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoleService } from 'app/services/roleService/role.service';

interface User {
    name: string;
    email: string;
    phone: string;
}

@Component({
    selector: 'app-userlistcomponenttry',
    standalone: true,
    imports: [MatSidenavModule, MatTableModule, CommonModule, MatButtonModule],
    templateUrl: './userlistcomponenttry.component.html',
    styleUrls: ['./userlistcomponenttry.component.scss']
})
export class UserlistcomponenttryComponent {
    @ViewChild('drawer') drawer: any;

    users: User[] = [];
    displayedColumns: string[] = ['name', 'email'];
    selectedUser: User | null = null;

    constructor(private roleService: RoleService) { }

    async ngOnInit() {
        const dataUserProfile = await this.roleService.getProfile()
        console.log(dataUserProfile)
        this.users = dataUserProfile.profiles;
    }

    async openDrawer(name: string) {
        const dataUserProfile = await this.roleService.getProfileByName(name)
        console.log(dataUserProfile)
        this.selectedUser = dataUserProfile;
        this.drawer.open()
    }
}

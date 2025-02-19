import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { FuseLoadingService } from '@fuse/services/loading';
import { RoleService } from 'app/services/roleService/role.service';
import { UserService } from 'app/services/userService/user.service';

@Component({
    selector: 'app-bandwith-profile',
    standalone: true,
    imports: [
        RouterLink, MatIcon, MatButtonModule, MatSidenav, MatSidenavContainer, MatSidenavContent,
        CommonModule, FuseCardComponent, MatDrawerContainer, MatDrawerContent, MatDrawer,
        MatPaginatorModule
    ],
    templateUrl: './bandwith-profile.component.html',
    styleUrl: './bandwith-profile.component.scss'
})
export class BandwithProfileComponent {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('drawer') drawer: any;

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;

    pagedRoleDatas: any[] = [];
    roleDatas: any[] = [];
    displayedColumns: string[] = ['name', 'email'];
    pageSize: number = 5;
    currentPage: number = 1;
    total_pages: any;
    selectedUser: any | null = null;

    totalUser: any;
    totalUserProfile: any

    constructor(private roleService: RoleService, private userService: UserService, private fuseLoadingService: FuseLoadingService) { }


    async ngOnInit() {
        this.fuseLoadingService.show();
        this.totalUser = 'Memuat Data '
        this.totalUserProfile = 'Memuat Data '
        try {
            const dataUserProfile = await this.roleService.getProfilePagination(this.currentPage)
            console.log(dataUserProfile)
            this.roleDatas = dataUserProfile.profiles;
            this.totalUserProfile = dataUserProfile.total_profiles;
            this.total_pages = dataUserProfile.total_pages
            this.updatePagedData()
            this.getTotalUser()
        } catch (error) {
            console.error(error)
        } finally {
            this.fuseLoadingService.hide()
        }
    }

    updatePagedData() {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.pagedRoleDatas = this.roleDatas.slice(startIndex, endIndex);
    }

    async handlePage(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex + 1;

        try {
            const dataUserProfile = await this.roleService.getProfilePagination(this.currentPage);
            this.roleDatas = dataUserProfile.profiles;
            this.total_pages = dataUserProfile.total_pages;
            this.updatePagedData();
        } catch (error) {
            console.error("Gagal memuat data halaman:", error);
        }
    }


    async getTotalUser() {
        const data = await this.userService.getUser()
        this.totalUser = data.users.length;
    }

    async openDrawer(name: string) {
        const dataUserProfile = await this.roleService.getProfileByName(name)
        console.log(dataUserProfile)
        this.selectedUser = dataUserProfile;
        this.drawer.open()
    }

}

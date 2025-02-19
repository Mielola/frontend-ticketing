import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterLink } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseLoadingService } from '@fuse/services/loading';
import { AlertController } from '@ionic/angular';
import { RoleService } from 'app/services/roleService/role.service';
import { result } from 'lodash';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-role-management',
    standalone: true,
    imports: [MatIcon, CommonModule, RouterLink, MatButtonModule, MatPaginatorModule, MatDialogModule],
    templateUrl: './role-management.component.html',
    styleUrl: './role-management.component.scss'
})
export class RoleManagementComponent {
    @ViewChild('userFormTemplate') userFormTemplate!: TemplateRef<any>;
    userForm: FormGroup;
    dialogRef: any; // Referensi untuk dialog
    roleDatas: any[] = [];
    page_totals: any;
    currentPage: any = 1;
    pageSize: number = 1;

    constructor(
        private roleService: RoleService, private alertController: AlertController,
        private fuseLoadingService: FuseLoadingService, private fuseConfirmationService: FuseConfirmationService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.fetchRoles()
    }

    async fetchRoles() {
        // this.fuseLoadingService.show();
        try {
            const roleData = await this.roleService.getProfilePagination(this.currentPage);
            this.page_totals = roleData.total_pages;
            this.roleDatas = roleData.profiles;
        } catch (error) {
            console.error(error);
        } finally {
            // this.fuseLoadingService.hide();
        }
    }

    onPageChange(event: any) {
        this.currentPage = event.pageIndex + 1; // pageIndex starts from 0
        this.pageSize = event.pageSize;
        this.fetchRoles(); // Fetch roles for the new page
    }

    deteleProfiles(profile_name: string) {
        const confirm = this.fuseConfirmationService.open({
            title: 'Delete Profile',
            message: `Are you sure you want to delete ${profile_name}?`,
            actions: {
                confirm: {
                    label: 'Delete',
                }
            }
        })

        confirm.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.delete(profile_name)
                window.location.reload()
            }
        })
    }

    openUserForm() {
        const dialogRef = this.dialog.open(this.userFormTemplate, {
            width: '500px',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // Logic after modal closed, e.g., refresh data
                console.log('Received data from form:', result);
            }
        });
    }

    async delete(profile_name: string) {
        const deleteProfile = await this.roleService.deleteProfile(profile_name)
        if (deleteProfile) {
            console.log(deleteProfile)
        }
    }



    convertBytesToMB(bytes: string): number {
        return parseFloat(bytes) / (1024 * 1024);
    }

    calculateSpeed(bytes: string, seconds: number): number {
        const mb = this.convertBytesToMB(bytes);
        return (mb / seconds) * 8;
    }

}

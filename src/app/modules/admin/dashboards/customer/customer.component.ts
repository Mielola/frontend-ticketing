import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { FuseLoadingService } from '@fuse/services/loading';
import { IonicModule } from '@ionic/angular';
import { UserService } from 'app/services/userService/user.service';

@Component({
    selector: 'app-customer',
    standalone: true,
    imports: [
        IonicModule, CommonModule, MatIcon, MatButtonModule, RouterOutlet,
        RouterLink, MatDrawerContent, MatDrawer, MatDrawerContainer, MatPaginatorModule
    ],
    templateUrl: './customer.component.html',
    styleUrl: './customer.component.scss'
})
export class CustomerComponent {
    customerData: any
    pageSize: any
    total_pages: any
    current_page: any = 1

    constructor(private userService: UserService, private fuseLoadingService: FuseLoadingService, private fuseConfirmationService: FuseConfirmationService) { }

    async ngOnInit() {
        this.loadData(this.current_page)
    }

    async loadData(current_pages: number) {
        this.fuseLoadingService.show()
        try {
            const data = await this.userService.getUserPagination(current_pages)
            this.total_pages = data.total_pages
            current_pages = data.current_page
            console.log(data)
            this.customerData = data.users
        } catch (error) {
            console.error(error)
        } finally {
            this.fuseLoadingService.hide()
        }
    }

    handlePageChange(event: PageEvent) {
        this.current_page = event.pageIndex + 1;
        console.log(this.current_page);
        this.loadData(this.current_page);
    }

    deleteUser(no_hp: string) {
        const confirm = this.fuseConfirmationService.open({
            title: 'Delete User',
            message: `Are you sure you want to delete this user ${no_hp}?`,
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirm.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.deleteUserByPhone(no_hp);
            }
        });
    }



    async deleteUserByPhone(no_hp: string) {
        const deleteData = await this.userService.deleteUsers(no_hp)
        console.log(no_hp)
        if (deleteData) {
            console.log(deleteData)
            window.location.reload()
        }
    }

    // Fungsi untuk mengonversi byte ke MB
    convertBytesToMB(bytes: string): number {
        return parseFloat(bytes) / (1024 * 1024);
    }

    // Fungsi untuk menghitung kecepatan dalam MB/s
    calculateSpeed(bytes: string, seconds: number): number {
        const mb = this.convertBytesToMB(bytes);
        return (mb / seconds) * 8;
    }
}

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { IonicModule } from '@ionic/angular';
import { AreaChartComponent } from "../../../component/card/area-chart/area-chart.component";
import { UserService } from 'app/services/userService/user.service';
import { CommonModule } from '@angular/common';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserlistcomponenttryComponent } from '../userlistcomponenttry/userlistcomponenttry.component';
import { PieChartComponent } from "../../../component/card/pie-chart/pie-chart.component";
import { RoleService } from 'app/services/roleService/role.service';
import { FuseLoadingService } from '@fuse/services/loading';

// Call the element loader before the bootstrapModule/bootstrapApplication call
defineCustomElements(window);


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [FuseCardComponent, MatIconModule, MatButtonModule, IonicModule, AreaChartComponent, CommonModule, MatSidenavModule, UserlistcomponenttryComponent, PieChartComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    customerData: any
    totalUser: any

    totalBytesInMB: number;
    totalBytesOutMB: number;

    totalUserProfile: any
    downloadPecentage: any
    uploadPecentage: any
    totalBandwidthMax: number = 1000000000;

    constructor(private userService: UserService, private profileService: RoleService, private loadingService: FuseLoadingService) { }

    async ngOnInit() {
        this.loadingService.show()
        try {
            this.totalUser = 'Memuat data '
            this.totalUserProfile = 'Memuat data '
            const data = await this.userService.getUser()
            const dataProfile = await this.profileService.getProfile()

            this.totalBytesInMB = data.total_bytes_in;
            this.totalBytesOutMB = data.total_bytes_out;

            this.downloadPecentage = this.calculatePercentage(data.total_bytes_in)
            this.uploadPecentage = this.calculatePercentage(data.total_bytes_out)

            this.totalUserProfile = dataProfile.profiles.length
            this.totalUser = data.users.length
            console.log(data)
            this.customerData = data.users
        } catch (error) {
            console.log(error)
        } finally {
            this.loadingService.hide()
        }
    }

    async deleteUserByPhone(no_hp: string) {
        const deleteData = await this.userService.deleteUsers(no_hp)
        console.log(no_hp)
        if (deleteData) {
            console.log(deleteData)
            window.location.reload()
        }
    }

    // Fungsi untuk menentukan warna berdasarkan persentase
    getBarColor(percentage: number): string {
        if (percentage < 50) {
            return 'green';
        } else if (percentage >= 50 && percentage < 80) {
            return 'orange';
        } else {
            return 'red';
        }
    }


    // Fungsi untuk mengonversi byte ke MB
    convertBytesToMB(bytes: number): number {
        return bytes / (1024 * 1024);
    }

    // Fungsi untuk menghitung kecepatan dalam MB/s
    calculatePercentage(bytes: number): number {
        return (bytes / this.totalBandwidthMax) * 100;
    }
}

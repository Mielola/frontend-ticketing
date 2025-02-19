import { Component, OnInit } from '@angular/core';
import { FuseCardComponent } from '@fuse/components/card';
import { AreaChartComponent } from "../../../component/card/area-chart/area-chart.component";
import { UserService } from 'app/services/userService/user.service';
import { RoleService } from 'app/services/roleService/role.service';
import { FuseLoadingService } from '@fuse/services/loading';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-bandwith',
    standalone: true,
    imports: [FuseCardComponent, AreaChartComponent],
    templateUrl: './bandwith.component.html',
    styleUrls: ['./bandwith.component.scss']
})
export class BandwithComponent implements OnInit {
    totalUser: any;
    totalUserProfile: any
    bytesIn: any
    bytesOut: any
    downloadPecentage: any
    uploadPecentage: any
    totalBandwidthMax: number = 1000000000;


    constructor(private userService: UserService, private profileService: RoleService, private fuseLoadingService: FuseLoadingService) { }

    ngOnInit(): void {
        this.fuseLoadingService.show();
        this.totalUser = 'Memuat Data '
        this.totalUserProfile = 'Memuat Data '
        try {
            this.getTotalUser();
            this.getTotalUserProfile()
        } catch (error) {
            console.error(error);
        } finally {
            this.fuseLoadingService.hide();
        }
    }

    async getTotalUser() {
        const data = await this.userService.getUser()
        const users = data.users;


        this.bytesIn = data.total_bytes_in
        this.bytesOut = data.total_bytes_out

        this.downloadPecentage = this.calculatePercentage(data.total_bytes_in)
        this.uploadPecentage = this.calculatePercentage(data.total_bytes_out)


        this.totalUser = users.length;
    }

    async getTotalUserProfile() {
        const data = await this.profileService.getProfile()
        console.log(data)
        const userProfile = data.profiles
        this.totalUserProfile = userProfile.length
    }

    getBarColor(percentage: number): string {
        if (percentage < 50) {
            return 'green';
        } else if (percentage >= 50 && percentage < 80) {
            return 'orange';
        } else {
            return 'red';
        }
    }

    convertBytesToMB(bytes: string): number {
        return parseFloat(bytes) / (1024 * 1024);
    }

    // Fungsi untuk menghitung kecepatan dalam MB/s
    calculatePercentage(bytes: number): number {
        return (bytes / this.totalBandwidthMax) * 100;
    }
}

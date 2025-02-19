import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { IonIcon } from "@ionic/angular/standalone";
import { UserService } from 'app/services/userService/user.service';
import * as QRCode from 'qrcode';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-view-detail',
    standalone: true,
    imports: [
        IonIcon, RouterLink, MatFormFieldModule, FormsModule,
        MatInputModule, ReactiveFormsModule, CommonModule, MatIconModule, MatMenuModule,
        FuseCardComponent
    ],
    templateUrl: './view-detail.component.html',
    styleUrl: './view-detail.component.scss'
})
export class ViewDetailComponent {
    name: string | null = null;
    usersData: any

    constructor(private route: ActivatedRoute, private userService: UserService) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.name = params.get('name')

            if (this.name) {
                this.getUsersByPhone(this.name)
            }
        })
    }

    async getUsersByPhone(name: string) {
        const userDatas = await this.userService.getUserByPhone(name)
        console.log(userDatas)
        this.usersData = userDatas.user
        const username = userDatas.user.name
        const password = userDatas.user.password
        this.generateQRCode(username, password)
        console.log(username, password)
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

    generateQRCode(name: string, password: string) {
        const qrCodeData = `http://wildan.com/login?username=${name}&password=${password}`;

        const canvas = document.getElementById('qrcode-canvas') as HTMLCanvasElement;
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        QRCode.toCanvas(canvas, qrCodeData, { errorCorrectionLevel: 'H' }, function (error) {
            if (error) console.error(error);
            console.log('QR Code berhasil dibuat!');
        });
    }
}

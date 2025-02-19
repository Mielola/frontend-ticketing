import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import FormBuilder dan Validators
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FuseCardComponent } from '@fuse/components/card';
import { IonModal } from '@ionic/angular/standalone';
import { LinkServiceService } from 'app/services/linkService/link-service.service';

@Component({
    selector: 'app-block-link',
    standalone: true,
    imports: [FuseCardComponent, MatIconModule, MatButtonModule, MatTableModule, CommonModule, IonModal, ReactiveFormsModule],
    templateUrl: './block-link.component.html',
    styleUrls: ['./block-link.component.scss']
})
export class BlockLinkComponent {
    @ViewChild('userFormTemplate') userFormTemplate!: TemplateRef<any>;
    linkForm: FormGroup;
    @ViewChild(IonModal) modal: IonModal;

    listLink: any;
    displayedColumns: string[] = ['ip', 'domain', 'comment'];

    constructor(private fb: FormBuilder, private linkService: LinkServiceService, private dialog: MatDialog) {
        this.linkForm = this.fb.group({
            domain: ['', [Validators.required, this.domainValidator]]
        });
    }

    domainValidator(control: any) {
        const domainPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/; // Contoh regex untuk domain
        return domainPattern.test(control.value) ? null : { invalidDomain: true };
    }

    openUserForm() {
        const dialogRef = this.dialog.open(this.userFormTemplate, {
            width: '500px',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (this.linkForm.valid) {
                    console.log('Data yang diterima dari form:', this.linkForm.value);
                } else {
                    console.error('Form tidak valid:', this.linkForm.errors);
                }
            }
        });
    }

    ngOnInit() {
        this.getLink();
    }

    async getLink() {
        const data = await this.linkService.getLinkBlock();
        this.listLink = data.blocked_websites;
    }
}

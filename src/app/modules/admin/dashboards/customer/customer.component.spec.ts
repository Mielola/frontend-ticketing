import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComponent } from './customer.component';
import { IonicModule } from '@ionic/angular';

describe('CustomerComponent', () => {
    let component: CustomerComponent;
    let fixture: ComponentFixture<CustomerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IonicModule.forRoot()]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CustomerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

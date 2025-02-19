import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddComponent } from './form-add.component';
import { IonicModule } from '@ionic/angular';

describe('FormAddComponent', () => {
    let component: FormAddComponent;
    let fixture: ComponentFixture<FormAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormAddComponent, IonicModule.forRoot()]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FormAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

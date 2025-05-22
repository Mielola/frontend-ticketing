import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditProductsComponent } from './form-edit-products.component';

describe('FormEditProductsComponent', () => {
  let component: FormEditProductsComponent;
  let fixture: ComponentFixture<FormEditProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEditProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEditProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

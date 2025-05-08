import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditDeleteComponent } from './form-edit-delete.component';

describe('FormEditDeleteComponent', () => {
  let component: FormEditDeleteComponent;
  let fixture: ComponentFixture<FormEditDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEditDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEditDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

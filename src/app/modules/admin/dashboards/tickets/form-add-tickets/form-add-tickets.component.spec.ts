import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddTicketsComponent } from './form-add-tickets.component';

describe('FormAddTicketsComponent', () => {
  let component: FormAddTicketsComponent;
  let fixture: ComponentFixture<FormAddTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

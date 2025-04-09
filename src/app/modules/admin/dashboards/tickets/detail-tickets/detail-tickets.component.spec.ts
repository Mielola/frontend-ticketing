import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTicketsComponent } from './detail-tickets.component';

describe('DetailTicketsComponent', () => {
  let component: DetailTicketsComponent;
  let fixture: ComponentFixture<DetailTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

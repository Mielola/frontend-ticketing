import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandwithComponent } from './bandwith.component';

describe('BandwithComponent', () => {
  let component: BandwithComponent;
  let fixture: ComponentFixture<BandwithComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandwithComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BandwithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

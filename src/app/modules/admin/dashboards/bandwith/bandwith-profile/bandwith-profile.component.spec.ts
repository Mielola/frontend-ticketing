import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandwithProfileComponent } from './bandwith-profile.component';

describe('BandwithProfileComponent', () => {
  let component: BandwithProfileComponent;
  let fixture: ComponentFixture<BandwithProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandwithProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BandwithProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

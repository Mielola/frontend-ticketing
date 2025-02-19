import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockLinkComponent } from './block-link.component';

describe('BlockLinkComponent', () => {
  let component: BlockLinkComponent;
  let fixture: ComponentFixture<BlockLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

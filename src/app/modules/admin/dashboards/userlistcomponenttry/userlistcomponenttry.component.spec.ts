import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistcomponenttryComponent } from './userlistcomponenttry.component';

describe('UserlistcomponenttryComponent', () => {
  let component: UserlistcomponenttryComponent;
  let fixture: ComponentFixture<UserlistcomponenttryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserlistcomponenttryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserlistcomponenttryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

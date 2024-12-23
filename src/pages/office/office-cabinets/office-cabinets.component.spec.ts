import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeCabinetsComponent } from './office-cabinets.component';

describe('OfficeCabinetsComponent', () => {
  let component: OfficeCabinetsComponent;
  let fixture: ComponentFixture<OfficeCabinetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficeCabinetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficeCabinetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

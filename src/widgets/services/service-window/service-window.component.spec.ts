import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceWindowComponent } from './service-window.component';

describe('ServiceWindowComponent', () => {
  let component: ServiceWindowComponent;
  let fixture: ComponentFixture<ServiceWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

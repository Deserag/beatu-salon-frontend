import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsOrdersComponent } from './clients-orders.component';

describe('ClientsOrdersComponent', () => {
  let component: ClientsOrdersComponent;
  let fixture: ComponentFixture<ClientsOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

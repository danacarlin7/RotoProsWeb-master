import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeOfferComponent } from './free-offer.component';

describe('FreeOfferComponent', () => {
  let component: FreeOfferComponent;
  let fixture: ComponentFixture<FreeOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

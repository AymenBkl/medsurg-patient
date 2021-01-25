import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CashfreePage } from './cashfree.page';

describe('CashfreePage', () => {
  let component: CashfreePage;
  let fixture: ComponentFixture<CashfreePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashfreePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CashfreePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

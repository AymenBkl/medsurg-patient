import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CetegorieSearchPage } from './cetegorie-search.page';

describe('CetegorieSearchPage', () => {
  let component: CetegorieSearchPage;
  let fixture: ComponentFixture<CetegorieSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CetegorieSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CetegorieSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReferalpagePage } from './referalpage.page';

describe('ReferalpagePage', () => {
  let component: ReferalpagePage;
  let fixture: ComponentFixture<ReferalpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferalpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReferalpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

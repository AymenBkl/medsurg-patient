import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddReferalComponent } from './add-referal.component';

describe('AddReferalComponent', () => {
  let component: AddReferalComponent;
  let fixture: ComponentFixture<AddReferalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReferalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddReferalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

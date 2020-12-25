import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LsitComponent } from './lsit.component';

describe('LsitComponent', () => {
  let component: LsitComponent;
  let fixture: ComponentFixture<LsitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LsitComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LsitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

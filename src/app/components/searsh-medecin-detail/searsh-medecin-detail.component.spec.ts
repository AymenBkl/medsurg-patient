import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearshMedecinDetailComponent } from './searsh-medecin-detail.component';

describe('SearshMedecinDetailComponent', () => {
  let component: SearshMedecinDetailComponent;
  let fixture: ComponentFixture<SearshMedecinDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearshMedecinDetailComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearshMedecinDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchMedecinPage } from './search-medecin.page';

describe('SearchMedecinPage', () => {
  let component: SearchMedecinPage;
  let fixture: ComponentFixture<SearchMedecinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchMedecinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchMedecinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

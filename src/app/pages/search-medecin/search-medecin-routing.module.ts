import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchMedecinPage } from './search-medecin.page';

const routes: Routes = [
  {
    path: '',
    component: SearchMedecinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchMedecinPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CetegorieSearchPage } from './cetegorie-search.page';

const routes: Routes = [
  {
    path: '',
    component: CetegorieSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CetegorieSearchPageRoutingModule {}

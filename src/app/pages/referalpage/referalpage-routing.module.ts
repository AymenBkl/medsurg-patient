import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferalpagePage } from './referalpage.page';

const routes: Routes = [
  {
    path: '',
    component: ReferalpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferalpagePageRoutingModule {}

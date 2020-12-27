import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuardService as AuthGuard} from '../services/auth-guard.service';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'tab4',
        loadChildren: () => import('../pages/profile/profile.module').then( m => m.ProfilePageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'search-medecin',
        loadChildren: () => import('../pages/search-medecin/search-medecin.module').then( m => m.SearchMedecinPageModule),
        canActivate : [AuthGuard]
      },
      {
        path: 'tab4/prescription',
        loadChildren: () => import('../pages/prescription/prescription.module').then( m => m.PrescriptionPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'tab4/messages',
        loadChildren: () => import('../pages/messages/messages.module').then( m => m.MessagesPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'tab4/referal',
        loadChildren: () => import('../pages/referalpage/referalpage.module').then( m => m.ReferalpagePageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'tab3',
        loadChildren: () => import('../pages/orders/orders.module').then( m => m.OrdersPageModule),
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

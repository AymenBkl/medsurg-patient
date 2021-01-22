import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard} from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    redirectTo:'tabs/tab1',
    canActivate : [AuthGuard]
  },
  {
    path: 'profile',
    redirectTo:'tabs/tab4',
    canActivate : [AuthGuard]
  },
  {
    path: 'search-medecin',
    redirectTo:'tabs/search-medecin',
    canActivate : [AuthGuard]
  },
  {
    path: 'prescription',
    redirectTo:'tabs/tab4/prescription',
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    redirectTo:'tabs/tab4/messages',
    canActivate: [AuthGuard]
  },
  {
    path: 'referal',
    redirectTo:'tabs/tab4/referal',
    canActivate: [AuthGuard]
  },
  {
    path: 'categories',
    redirectTo:'tabs/tab4/categories',
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    redirectTo:'tabs/tab3',
    canActivate: [AuthGuard]
  },
  {
    path: 'cetegorie-search',
    redirectTo: 'tabs/tab4/search-categorie',
    canActivate: [AuthGuard]
  },
  {
    path: 'addresses',
    loadChildren: () => import('./pages/addresses/addresses.module').then( m => m.AddressesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

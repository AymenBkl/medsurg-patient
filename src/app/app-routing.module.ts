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
    path: 'orders',
    redirectTo:'tabs/tab3',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

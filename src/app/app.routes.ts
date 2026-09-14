import { Routes } from '@angular/router';
import { DirectoryListComponent } from './components/directory/directory-list/directory-list.component';
import { ProfileViewComponent } from './components/profile/profile-view/profile-view.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminContactFormComponent } from './components/admin/admin-contact-form/admin-contact-form.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: DirectoryListComponent },
  { path: 'contacto/:id', component: ProfileViewComponent },
  { path: 'admin-secreto', component: AdminLoginComponent },
  { path: 'admin-secreto/dashboard', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path: 'admin-secreto/dashboard/nuevo', component: AdminContactFormComponent, canActivate: [authGuard] },
  { path: 'admin-secreto/dashboard/editar/:id', component: AdminContactFormComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];

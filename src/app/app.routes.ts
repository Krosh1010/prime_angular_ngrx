import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { LoggedInGuard } from './auth.guard/logedInGuard';
import { AboutComponent } from './about/about.component';
import { DataBaseComponent } from './home/data-base/data-base.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard]  },
    { path: '', component: HomeComponent },
    { path: 'base', component: DataBaseComponent},
    { path: 'about', component: AboutComponent}
];

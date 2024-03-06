import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';

export //const routes: Routes = [];


const routes: Routes = [
    {path:'login', component: LoginComponent},
    {path:'home', component: HomeComponent},
    {path:'dashboard/:page', component: DashboardComponent},
    {path:'', redirectTo:'/login', pathMatch:'full'}, //Default route
  ]
  

  
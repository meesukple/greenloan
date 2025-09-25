import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashBoardComponent } from './dashboard/dashBoard.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent 
  },
  {
    path: 'dashboard',
    component: DashBoardComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
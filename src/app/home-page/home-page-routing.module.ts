import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* HomePage Layout */
import { HomePageLayoutComponent } from '../layouts/home-page-layout/home-page-layout.component';

/* HomePage Component */
import { HomePageComponent } from '../home-page/home-page.component';

const routes: Routes = [
  { path: '', component: HomePageLayoutComponent,
    children: [
      { path: '', component: HomePageComponent},
      { path: 'inicio', component: HomePageComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }

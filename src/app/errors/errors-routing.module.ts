import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Error 404 */
import { Error404Component } from './../errors/error404/error404.component';

const routes: Routes = [
  { path: '404', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorsRoutingModule { }

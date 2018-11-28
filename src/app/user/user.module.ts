import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';

import { UserService } from './service/user.service';

/* Components */
import { UserHomePageComponent } from './user-home-page/user-home-page.component';

@NgModule({
  declarations: [
    UserHomePageComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
  ],
  providers: [
    UserService
  ]
})
export class UserModule { }

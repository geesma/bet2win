import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';

/* Components */
import { UserHomePageComponent } from './user-home-page/user-home-page.component';
import { InfoComponent } from './register/info/info.component';

@NgModule({
  declarations: [
    UserHomePageComponent,
    InfoComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
  ],
  providers: []
})
export class UserModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* AngularFire */
import { NotifyService } from './notifiers/notify.service';
import { AuthService } from './auth/services/auth.service';


import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/Storage';
import { AngularFireMessagingModule } from '@angular/fire/Messaging';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    /* AngularFire */
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireFunctionsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireMessagingModule
  ],
  providers: [
    NotifyService,
    AuthService
  ]
})
export class CoreModule { }

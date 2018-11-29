import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from '../../environments/environment';

/* Services */
import { NotifyService } from './notifiers/notify.service';
import { AuthService } from './auth/services/auth.service';

/* Firebase */
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/Storage';
import { AngularFireMessagingModule } from '@angular/fire/Messaging';


const FIREBASE_IMPORTS = [
  AngularFireModule.initializeApp(environment.firebase),
  AngularFireAuthModule,
  AngularFireDatabaseModule,
  AngularFireFunctionsModule,
  AngularFirestoreModule,
  AngularFireStorageModule,
  AngularFireMessagingModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    ...FIREBASE_IMPORTS

  ],
  providers: [
    NotifyService,
    AuthService
  ]
})
export class CoreModule { }

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
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/Storage';
import { AngularFireMessagingModule } from '@angular/fire/Messaging';
import { FirebaseFunctionsService } from './services/firebase-functions.service';
import { LoadingSpinnerComponent } from '../layouts/ui/loading-spinner/loading-spinner.component';


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
  declarations: [
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,

    ...FIREBASE_IMPORTS

  ],
  providers: [
    NotifyService,
    AuthService,
    FirebaseFunctionsService,
    { provide: FunctionsRegionToken, useValue: 'us-central1' }
  ],
  exports: [LoadingSpinnerComponent]
})
export class CoreModule { }

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule ,ReactiveFormsModule }   from '@angular/forms';

/* Modules */
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreModule } from './core/core.module';
import { HomePageModule } from './home-page/home-page.module';

/* Components */
import { AppComponent } from './app.component';

/* Firebase */
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

/* Routing */
import { AppRoutingModule } from './app-routing.module';

/* Layouts */
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { HomePageLayoutComponent } from './layouts/home-page-layout/home-page-layout.component';
import { NotificationMessageComponent } from './layouts/notification-message/notification-message.component';

/* HomePage */
import { HeaderComponent } from './layouts/page-parts/header/header.component';
import { FooterComponent } from './layouts/page-parts/footer/footer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { InteractiveExampleComponent } from './home-page/interactive-example/interactive-example.component';
import { PricingComponent } from './home-page/pricing/pricing.component';

import { metaReducers, reducers } from './core/reducers/reducers';

const NGRX_IMPORTS = [
  StoreModule.forRoot(reducers, { metaReducers }),
  StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
  EffectsModule.forRoot([]),
  StoreDevtoolsModule.instrument({
    name: 'AngularBet2winNgRX',
    logOnly: environment.production,
    maxAge: 25
  })
]


@NgModule({
  declarations: [
    AppComponent,

    /* Layouts */
    UserLayoutComponent,
    HomePageLayoutComponent,
    LoginLayoutComponent,
    NotificationMessageComponent,

    /* HomePage */
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    InteractiveExampleComponent,
    PricingComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,

    /* Firebase */
    AngularFireModule.initializeApp(environment.firebase),

    /* Routes */
    HomePageModule,
    AppRoutingModule,
    ...NGRX_IMPORTS
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

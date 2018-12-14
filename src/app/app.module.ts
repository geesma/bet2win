import { BrowserModule } from '@angular/platform-browser';
import { FormsModule ,ReactiveFormsModule }   from '@angular/forms';

/* Modules */
import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { HomePageModule } from './home-page/home-page.module';
import { HttpClientModule } from '@angular/common/http';

/* Components */
import { AppComponent } from './app.component';

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
    HttpClientModule,

    /* Routes */
    HomePageModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

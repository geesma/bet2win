import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

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
import { RegisterLayoutComponent } from './layouts/register-layout/register-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

import { FooterDashboardComponent } from './layouts/ui/dashboard/footer/footer.component';
import { NavbarComponent } from './layouts/ui/dashboard/navbar/navbar.component';
import { SidebarComponent } from './layouts/ui/dashboard/sidebar/sidebar.component';
import { MailComponent } from './layouts/ui/dashboard/elements/mail/mail.component';
import { NotificationComponent } from './layouts/ui/dashboard/elements/notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,

    /* Layouts */
    UserLayoutComponent,
    HomePageLayoutComponent,
    LoginLayoutComponent,
    NotificationMessageComponent,
    FooterComponent,

    /* HomePage */
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    InteractiveExampleComponent,
    PricingComponent,
    RegisterLayoutComponent,
    DashboardLayoutComponent,

    /* Dashboard */
    NavbarComponent,
    SidebarComponent,
    MailComponent,
    NotificationComponent,
    FooterDashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    HttpClientModule,

    /* Routes */
    HomePageModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

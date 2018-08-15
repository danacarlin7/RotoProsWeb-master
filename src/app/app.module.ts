import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ErrorHandler } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from "./shared/shared.module";
import { FrontModule } from "./front/front.module";
import { UserModule } from "./user/user.module";
import { AdminModule } from "./new-admin/admin.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthService } from "./shared/services/auth.service";
import { environment } from "../environments/environment";
import { RPErrorHandler } from "./error-handler";



// import { CuppaOAuthModule } from 'ng2-social-login';

// const metaConfig: MetaConfig = {
//   //Append a title suffix such as a site name to all titles
//   //Defaults to false
//   useTitleSuffix: true,
//   defaults: {
//     title: 'RotoPros - Daily Fantasy Sports Expert Advice & Tools'
//   }
// };

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FrontModule,
    UserModule,
    AdminModule,
    // CuppaOAuthModule,
    SharedModule.forRoot(),
    AppRoutingModule,
    // MetaModule.forRoot()
  ],
  providers: [{ provide: ErrorHandler, useClass: RPErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private authService: AuthService) {
    if (this.authService.isLoggedIn()) {
      environment.token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
      environment.role = localStorage.getItem('role') ? localStorage.getItem('role') : '';
    }
  }
}

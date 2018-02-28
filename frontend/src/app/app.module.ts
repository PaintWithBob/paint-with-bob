import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

// Page Components
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found';
import { AccountPage } from './pages/account/account';
import { HomePage } from './pages/home/home';
import { LobbyPageComponent } from './pages/lobby-page/lobby-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

// Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { StreamEmbedComponent } from './components/stream-embed/stream-embed.component';
import { LobbyPopupComponent } from './components/lobby-popup/lobby-popup.component';

// Providers
import { AuthService, LobbyService } from './providers';

// 3P Modules
import { ColorPickerModule } from 'ngx-color-picker';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';


// The main app routes that will be used for navigation.
const appRoutes: Routes = [
  { path: 'lobby/:roomId', component: LobbyPageComponent, data: { title: 'Lobby Page' } },
  { path: 'account', component: AccountPage, data: { title: 'Account Page' } },
  { path: 'login', component: LoginPageComponent, data: { title: 'Login Page' } },
  { path: 'register', component: RegisterPageComponent, data: { title: 'Register Page' } },
  { path: '', component: HomePage, data: { title: 'Home Page' } },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    AccountPage,
    HomePage,
    HeaderComponent,
    FooterComponent,
    CanvasComponent,
    LobbyPageComponent,
    StreamEmbedComponent,
    LoginPageComponent,
    RegisterPageComponent,
    LobbyPopupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AsyncLocalStorageModule,
    ColorPickerModule,
    ClipboardModule,
    AngularFontAwesomeModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    NgbModule.forRoot()
  ],
  providers: [ AuthService, LobbyService ],
  bootstrap: [ AppComponent ],
  entryComponents: [
    PageNotFoundComponent,
    AccountPage,
    HomePage,
    HeaderComponent,
    FooterComponent,
    LobbyPopupComponent
  ]
})
export class AppModule { }

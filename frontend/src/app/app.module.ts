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
import { TestCanvasComponent } from './pages/test-canvas/test-canvas.component';
import { LobbyPageComponent } from './pages/lobby-page/lobby-page.component';

// Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { StreamEmbedComponent } from './components/stream-embed/stream-embed.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

//Providers
import { AuthService } from './providers/auth-service/auth.service';


// The main app routes that will be used for navigation.
const appRoutes: Routes = [
  { path: 'lobby', component: LobbyPageComponent, data: { title: 'Lobby Page' } },
  { path: 'account', component: AccountPage, data: { title: 'Account Page' } },
  { path: 'test-canvas', component: TestCanvasComponent, data: { title: 'Test Canvas Page' } },
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
    TestCanvasComponent,
    LobbyPageComponent,
    StreamEmbedComponent,
    LoginPageComponent,
    RegisterPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AsyncLocalStorageModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
  entryComponents: [
    PageNotFoundComponent,
    AccountPage,
    HomePage,
    HeaderComponent,
    FooterComponent
  ]
})
export class AppModule { }

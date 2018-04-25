// Native Angular Modules
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Services used by components
import { AuthService } from './app/providers/auth-service/auth.service';
import { UserService } from './app/providers/user-service/user.service';
import { LobbyService } from './app/providers/lobby-service/lobby.service';

// Components used by pages
import { HeaderComponent } from './app/components/header/header.component';
import { FooterComponent } from './app/components/footer/footer.component';
import { CanvasComponent } from './app/components/canvas/canvas.component';
import { ChatComponent } from './app/components/chat/chat.component';
import { StreamEmbedComponent } from './app/components/stream-embed/stream-embed.component';
import { LobbyPopupComponent } from './app/components/lobby-popup/lobby-popup.component';
import { CreateLobbyPopupComponent } from './app/components/create-lobby-popup/create-lobby-popup.component';
import { EditAccountPopupComponent } from './app/components/edit-account-popup/edit-account-popup.component';
import { DeleteAccountPopupComponent } from './app/components/delete-account-popup/delete-account-popup.component';

// 3P Modules used in component syntax
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import { ColorPickerModule } from 'ngx-color-picker';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';

// 3P Services
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Pipes
import { InRoomSincePipe } from '../src/app/pipes';


export function configureComponentTestBed(TestBed, Component) {
  TestBed.configureTestingModule({
    declarations: [
      Component
    ],
    providers: [
      AuthService,
      UserService,
      LobbyService,
      NgbActiveModal
    ],
    imports: [
      FormsModule,
      HttpClientModule,
      RouterModule.forRoot(
        [],
        { enableTracing: false } // <-- debugging purposes only
      ),
      AsyncLocalStorageModule,
      ColorPickerModule,
      ClipboardModule,
      AngularFontAwesomeModule,
      NgbModule.forRoot()
    ]
  })
  .compileComponents();
}

export function configurePageComponentTestBed(TestBed, Component) {
  TestBed.configureTestingModule({
    declarations: [
      HeaderComponent,
      FooterComponent,
      CanvasComponent,
      ChatComponent,
      StreamEmbedComponent,
      LobbyPopupComponent,
      CreateLobbyPopupComponent,
      EditAccountPopupComponent,
      DeleteAccountPopupComponent,
      Component,
      InRoomSincePipe
    ],
    providers: [
      AuthService,
      UserService,
      LobbyService,
      NgbActiveModal
    ],
    imports: [
      FormsModule,
      HttpClientModule,
      RouterModule.forRoot(
        [],
        { enableTracing: false } // <-- debugging purposes only
      ),
      AsyncLocalStorageModule,
      ColorPickerModule,
      ClipboardModule,
      AngularFontAwesomeModule,
      NgbModule.forRoot()
    ]
  })
  .compileComponents();
}

export function configureServiceTestBed(TestBed, Service) {
  TestBed.configureTestingModule({
    providers: [
      AuthService,
      Service
    ],
    imports: [
      HttpClientModule,
      RouterModule.forRoot(
        [],
        { enableTracing: false } // <-- debugging purposes only
      ),
      AsyncLocalStorageModule
    ]
  });
}

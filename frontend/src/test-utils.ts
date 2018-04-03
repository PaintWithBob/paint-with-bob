// Native Angular Modules
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Services used by components
import { AuthService } from './app/providers/auth-service/auth.service';
import { UserService } from './app/providers/user-service/user.service';

// 3P Modules used in component syntax
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import { ColorPickerModule } from 'ngx-color-picker';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';

// 3P Services
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


export function configureComponentTestBed(TestBed, Component) {
  TestBed.configureTestingModule({
    declarations: [
      Component 
    ],
    providers: [ AuthService,
      UserService,
      NgbActiveModal
    ],
    imports: [
      AsyncLocalStorageModule,
      ColorPickerModule,
      ClipboardModule,
      AngularFontAwesomeModule,
      NgbModule.forRoot(),
      HttpClientModule,
      RouterModule.forRoot(
        [],
        { enableTracing: false } // <-- debugging purposes only
      ),
    ]
  })
  .compileComponents();
}

export function configureServiceTestBed(TestBed, Service) {
  TestBed.configureTestingModule({
    providers: [Service],
    imports: [
      AsyncLocalStorageModule
    ]
  });
}

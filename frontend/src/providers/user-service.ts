import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { environment } from '../environments/environment';

// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class UserService {

  constructor(public http: Http) { }

}
import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthService} from "../../shared/services/auth.service";
import {Router} from '@angular/router';
import {Http, Headers, Response} from '@angular/http';
import {environment} from "../../../environments/environment";

@Injectable()
export class CompGetService {
  constructor(private auth:AuthService, private http:Http, private router:Router) {
  }

  getToken():string {
    return environment.token;
  }

  getHeaders():Headers {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    if (this.getToken()) {
      headers.append('Authorization', 'Bearer ' + this.getToken());
    }
    return headers;
  }

  canActivate() {
    if (this.auth.isLoggedIn()) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  getCompositions(operator, sport) {
    sport = sport.toUpperCase();
    return this.http.get(environment.api_end_point + 'api/compositions?operator=' + operator + '&sport=' + sport, {headers: this.getHeaders()});
  }
};

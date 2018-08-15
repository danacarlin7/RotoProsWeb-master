import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthService} from "../../shared/services/auth.service";
import {Router} from '@angular/router';
import {Http, Headers, Response} from '@angular/http';
import {environment} from "../../../environments/environment";

@Injectable()
export class PlayerGetService {
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

  getPlayers(operator, sport, slate) {
    return this.http.get(environment.api_end_point + 'api/players?operator=' + operator + '&sport=' + sport + '&date_exact=2017-07-09&slate_id=' + slate, {headers: this.getHeaders()});
  }

  getGames(operator, sport, slate) {
    return this.http.get(environment.api_end_point + 'api/games?operator=' + operator + '&sport=' + sport + '&date_exact=2017-07-09&slate_id=' + slate, {headers: this.getHeaders()});
  }

  getSlates(operator, sport) {
    return this.http.get(environment.api_end_point + 'api/slates?date_exact=2017-07-09&operator=' + operator + '&sport=' + sport, {headers: this.getHeaders()});
  }

  getScores(operator, sport, slate) {
    return this.http.get(environment.api_end_point + 'api/scores?operator=' + operator + '&sport=' + sport + '&date_exact=2017-07-09&slate_id=' + slate, {headers: this.getHeaders()});
  }
};

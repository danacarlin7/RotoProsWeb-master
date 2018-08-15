import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthService} from "../../shared/services/auth.service";
import {Router} from '@angular/router';
import {Http, Headers, Response, RequestOptions } from '@angular/http';
import {environment} from "../../../environments/environment";

@Injectable()
export class LineupPostService {
  constructor(private auth:AuthService, private http:Http, private router:Router) {
  }

  getHeaders():Headers {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    if (this.getToken()) {
      headers.append('Authorization', 'Bearer ' + this.getToken());
    }
    return headers;
  }

  getToken():string {
    return environment.token;
  }

  canActivate() {
    if (this.auth.isLoggedIn()) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
    }
  }

   createLineup(lineup) {
      return this.http.post(environment.api_end_point + 'api/lineup', JSON.stringify(lineup), {headers: this.getHeaders()});
    }

    getProviders(operator, sport, slate) {
      return this.http.get(environment.api_end_point + 'api/providers?operator=' + operator + '&sport=' + sport + '&slate_id=' + slate, {headers: this.getHeaders()});
    }

    getLineups(operator, sport) {
      return this.http.get(environment.api_end_point + 'api/lineup?operator=' + operator + '&sport=' + sport, {headers: this.getHeaders()});
    }
    deleteLineup(operator, sport, slate, provider, id) {
      return this.http.delete(environment.api_end_point + 'api/lineup/' + id, {headers: this.getHeaders()});
    }
    updateLineup(operator, sport, slate, provider, id, lineup) {
      return this.http.patch(environment.api_end_point + 'api/lineup/' + operator + '/' + sport + '/' + slate + '/' + provider + '/' + id, JSON.stringify(lineup), {headers: this.getHeaders()});
    }
	
	getHiddenLineups(operator, sport) {
      return this.http.get(environment.api_end_point + 'api/lineups?operator=' + operator + '&sport=' + sport, {headers: this.getHeaders()});
	}
};

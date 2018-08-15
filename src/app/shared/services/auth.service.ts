import { Injectable, EventEmitter, Output } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { environment } from "../../../environments/environment";
import { LoggedUser } from "../models/logged-user.model";
import { ArticleService } from "../../front/services/article.service";
/**
 * Created by Hiren on 05-06-2017.
 */

@Injectable()
export class AuthService {

  private _loggedUser: LoggedUser;

  get loggedUser(): LoggedUser {
    return this._loggedUser;
  }

  set loggedUser(value: LoggedUser) {
    this._loggedUser = value;
    if (this._loggedUser) {
      this.loggedUserChangeEvent.emit(this._loggedUser);
    }
  }

  isLoggedInEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  loggedUserChangeEvent: EventEmitter<LoggedUser> = new EventEmitter<LoggedUser>();

  partialUser: any;

  constructor(private http: Http, private articleService: ArticleService) {

  }

  getToken(): string {
    return environment.token;
  }

  getHeaders(): Headers {
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    if (this.getToken()) {
      headers.append('Authorization', 'Bearer ' + (this.getToken()));
    }
    return headers;
  }

  checkArticle(id, callback) {
    this.articleService.fetchPost(id).subscribe(
      response => {
        // this.article = response;
        // console.log(response.categories[0]);
        this.articleService.fetchFreeCategory().subscribe(
          responses => {
            let cat_cnt = 0;
            let isFree = false;

            for (let value of response.categories) {
              console.log(value, responses);
              cat_cnt++;

              if (value === responses[0].id) {
                isFree = true;
              }

              if (response.categories.length == cat_cnt)
                callback(isFree);
            }

          }
        );

      }
    );
  }

  checkArticleVisibility(id, callback){
    if (this.isLoggedIn()) {
      callback(this.isSubscriber(true) ? true : false);
    } else {
      console.log("else here", id);
      let status;
      this.checkArticle(id, function(resp) {
        console.log("check article", resp);
        if (resp) {
          status = true;
        } else {
          status = false;
        }
        callback(status);
      });
    }
  }

  isSubscriber(calledByGuard = false): boolean | Observable<any> {
    if (this.loggedUser) {
      return this.loggedUser.is_subscribe;
    } else if (calledByGuard && environment.token) {
      return this.http.get(environment.api_end_point + "api/memberinfo", { headers: this.getHeaders() })
        .map(response => response.json().data.is_subscribe)
        .catch(error => Observable.throw(error.json()));
      //.catch(error => this.showSubscriptionAlert());
    } else {
      console.log("not a subscriber");
    }
  }

  // isSubscriber():boolean {
  //   let isSubscribe = false;
  //   if (this.loggedUser) {
  //     if (this.loggedUser.is_subscribe) {
  //       isSubscribe = true;
  //     }
  //   }
  //   return isSubscribe;
  // }

  subscriptionAlertEvent: EventEmitter<any> = new EventEmitter<any>();

  showSubscriptionAlert() {
    this.subscriptionAlertEvent.emit(true);
  }

  isLoggedIn(): boolean {
    let login: boolean;
    if (environment.token && environment.token.length) {
      login = true;
    } else if (localStorage.getItem('token') && localStorage.getItem('token').length) {
      login = true;
    }
    console.log("isLogin", login);
    return login;
  }

  getUserRole(): string {
    let role: string;
    if (environment.role) {
      role = environment.role;
    } else if (localStorage.getItem('data') && JSON.parse(localStorage.getItem('data')).role.length) {
      role = JSON.parse(localStorage.getItem('data')).role;
    }
    return role;
  }

  login(data: string): Observable<any> {
    return this.http.post(environment.api_end_point + 'authenticate', data, { headers: this.getHeaders() })
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()));
  }

  @Output() userLoggedInEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  loginWP(data: string): Observable<any> {
    return this.http.post('http://13.56.129.231/dfsauth/nglogin/', data)
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()));
  }


  logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '';
    //this.userLoggedInEvent.emit(false);
  }

  retrieveLoggedUserInfo(): Observable<any> {
    return this.http.get(environment.api_end_point + 'api/memberinfo', { headers: this.getHeaders() })
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()));
  }

  registerNewUser(data: any): Observable<any> {
    return this.http.post(environment.api_end_point + 'signup', data)
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()))
  }

  signUPStepOne(data: any): Observable<any> {
    return this.http.post(environment.api_end_point + 'signupOne', data)
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()))
  }

  verifyEmail(data: any) {
    return this.http.post(environment.api_end_point + 'getToken', data)
      .map(res => res.json())
      .catch(error => Observable.throw(error.json()));
  }

  verifyToken(token): Observable<any> {
    return this.http.post(environment.api_end_point + 'verifyToken', { token: token })
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()));
  }

  changePassword(data) {
    return this.http.post(environment.api_end_point + 'verifyToken', data)
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()));
  }

  updatePasswordFromSettings(data) {
    return this.http.post(environment.api_end_point + "api/changePassword", data, { headers: this.getHeaders() })
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()));
  }

  userInfo() {
    return this.http.get(environment.api_end_point + 'api/memberinfo', { headers: this.getHeaders() })
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()));
  }

  registerWP(data: string): Observable<any> {
    return this.http.post('http://13.56.129.231/dfsauth/register/', data)
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()));
  }

  uploadProfile(fileList) {
    let file: File = fileList[0];
    let formData: FormData = new FormData();
    formData.append('uploadFile', file, file.name);
    return this.http.post(environment.api_end_point + 'api/uploadImage', formData, {
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.getToken()
      })
    })
      .map(res => res.json())
      .catch(error => Observable.throw(error.json()));
  }

}

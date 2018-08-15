import {Component, Output, EventEmitter} from "@angular/core";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {environment} from "../../../../environments/environment";
// import { AuthService } from 'ng2-social-login/src/app/cuppaOAuth/auth.service';
/**
 * Created by Hiren on 07-06-2017.
 */

@Component({
  selector: 'rp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm:FormGroup;
  redirectUrl:string;
  msg:string;

  isError:boolean;
  errorMsg:string;
  showVerifyLink:boolean;


  private authServerBaseUrl = 'http://localhost:4000';
  private config = {
    "loginRoute": "login",
    "linkedin": {
      "authEndpoint": this.authServerBaseUrl + "/auth/linkedin",
      "clientId": "8176r44lz2ewos",
      "redirectURI": this.authServerBaseUrl + "/user"
    },
    "facebook": {
      "authEndpoint": this.authServerBaseUrl + "/auth/facebook",
      "clientId": "302642623492507",
      "redirectURI": this.authServerBaseUrl + "/user"
    },
    "google": {
      "authEndpoint": this.authServerBaseUrl + "/auth/google",
      "clientId": "15581973506-rgbi7mbph0jad1hbqnoln05i8c0k29cn.apps.googleusercontent.com",
      "redirectURI": this.authServerBaseUrl + "/user"
    }
  };

  constructor(private activatedRoute:ActivatedRoute, private authService:AuthService, private router:Router) {
    console.log('in Login constructor');
    this.activatedRoute.queryParams.subscribe(
      (param:Params) => {
        this.redirectUrl = param['redirect'];
        if (param.hasOwnProperty('info')) {
          if (param['info'] == 'pc') {
            this.msg = 'Your password has successfully been updated.'
          }
          else if (param['info'] == 'verify') {
            this.msg = 'Your account has successfully been verified.'
          }
          else if (param['info'] == 'signup_success') {
            this.msg = 'Your account has successfully been created. We have sent you an email with an account verification link. Please verify your account.'
          }
        }
      }
    )
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl()
    })
  }

  createCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; domain=rotopros.com; path=/";
  }

  readCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  removeCookie(name) {
    document.cookie = name + "=; expires=" + new Date(0).toUTCString() + "; domain=rotopros.com; path=/";
  }


  onSignInBtnClick() {
    let data = {
      email: this.loginForm.value.email.toLowerCase(),
      password: this.loginForm.value.password
    };
    this.authService.login(JSON.stringify(data)).subscribe(
      response => {
        if (response.statusCode == 200) {
          if(response.data.is_partial){
            this.authService.partialUser = response.data;
            this.router.navigate(['/subscribe']);
            return;
          }
          console.log("login successful => ", response);
          if (this.loginForm.value.rememberMe) {
            localStorage.setItem('remember', '1');
          }
          localStorage.setItem('data', JSON.stringify(response.data));
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.role);

          environment.token = response.data.token;
          environment.role = response.data.role;
          // this.authService.userLoggedInEvent.emit(true);
          // localStorage.setItem('token', JSON.stringify(response.data));
          this.authService.userInfo().subscribe(
            user => {
              console.log("user details => ", user);
              //     localStorage.setItem('user', JSON.stringify(user.data));
              this.authService.loginWP(JSON.stringify(data)).subscribe(
                response => {
                  if (response.uid) {
                    let uid = response.uid;
                    this.removeCookie('dfs_wp_logout');
                    this.createCookie('dfs_wp_user', uid, 1);
                    this.createCookie('dfs_wp_email', user.data.email, 1);
                  } else {
                    console.log(response);
                  }
                }
              );
            }
          );

          this.authService.retrieveLoggedUserInfo()
            .subscribe(
              response => {
                if (response.statusCode == 200) {
                  this.authService.loggedUser = response.data;
                }
                else {

                }
              },
              error => {
                console.log("http error => ", error);
              }
            );

          console.log('this.redirectUrl => ', this.redirectUrl);
          this.authService.isLoggedInEvent.emit(true);
          if (this.redirectUrl && this.redirectUrl.length) {
            this.router.navigateByUrl(this.redirectUrl);
            this.redirectUrl = "";
          }
          else if (response.data.role == 'admin') {
            this.router.navigate(['/admin']);
          } else if (response.data.role == 'user' || response.data.role == 'provider') {
            this.router.navigate(['/']);
          }
        } else
          {
          console.log("login error from response => ", response);
        }
      },
      error => {
        console.log("login error => ", error);
        this.msg = '';
        if (error.data == 'userNotFound') {
          this.isError = true;
          this.errorMsg = "Invalid email or password. Please check your account details"
        }
        else if (error.data == 'userIsNotVerifiedWithNullPWD' || error.data == 'userIsNotVerified') {
          this.isError = true;
          this.errorMsg = "Your account has not been verified. Please check your email for verification link or get a new link.";
          this.showVerifyLink = true;
        } else {
          this.isError = true;
          this.errorMsg = error.message;
        }
      });
  }
}

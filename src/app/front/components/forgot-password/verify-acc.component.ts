import {Component} from "@angular/core";
import {AuthService} from "../../../shared/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
/**
 * Created by Hiren on 24-07-2017.
 */


@Component({
  selector: 'rp-verify-acc',
  templateUrl: './verify-acc.component.html'
})
export class VerifyAccComponent {

  token: string;
  isError: boolean;
  errorMsg: string;
  isMailSent: boolean;
  reSendToken: boolean;
  isLoading: boolean;

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private authService:AuthService) {

  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.activatedRoute.params.subscribe(
      param => {
        this.token = param['token'];
        if (this.token) {
          this.isLoading = true;
          let checkNoPassword = this.token.split('_');
          if (checkNoPassword[0] == 'pass') {
            this.isLoading = false;
            this.router.navigate([checkNoPassword[1] + '/change-password']);
          } else {
            this.authService.verifyToken(this.token).subscribe(
              success => {
                this.isLoading = false;
                this.router.navigate(['/login'], {queryParams: {info: 'verify'}});
              },
              error => {
                this.isLoading = false;
                console.log("http error => ", error);
                this.isError = true;
                this.errorMsg = 'Verification link is expired or invalid. Please enter your email below to get new verification link.';
              }
            )
          }
        }
      }
    )
  }

  onBtnSubmitClick(email: string) {
    this.errorMsg = "";
    this.isError = false;
    if (email && this.isValidEMail(email)) {
      this.sendResetPwdLink(email);
    }
  }

  sendResetPwdLink(email: string) {
    let data = {
      email: email,
      is_excel: false,
      is_forgot: false
    };
    this.authService.verifyEmail(data).subscribe(
      response => {
        this.isMailSent = true;
        this.isError = false;
        this.errorMsg = "";
        console.log("response => ", response);
      },
      error => {
        this.errorMsg = error.message;
        this.isError = true;
        console.log("error => ", error);
      }
    )
  }

  isValidEMail(email: string) {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return !(email != "" && (email.length <= 5 || !EMAIL_REGEXP.test(email)));
  }

}

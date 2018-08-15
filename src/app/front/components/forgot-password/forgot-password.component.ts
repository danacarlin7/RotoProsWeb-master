import {Component} from "@angular/core";
import {AuthService} from "../../../shared/services/auth.service";
/**
 * Created by Hiren on 06-07-2017.
 */


@Component({
  selector: 'rp-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  isError:boolean;
  errorMsg:string;
  isMailSent:boolean;

  constructor(private authService:AuthService) {

  }

  onBtnSubmitClick(email:string) {
    this.errorMsg = "";
    this.isError = false;
    if (email && this.isValidEMail(email)) {
      this.sendResetPwdLink(email);
    }
  }

  sendResetPwdLink(email:string) {
    let data = {
      email: email,
      is_excel: false,
      is_forgot: true
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

  isValidEMail(email:string) {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return !(email != "" && (email.length <= 5 || !EMAIL_REGEXP.test(email)));
  }

}

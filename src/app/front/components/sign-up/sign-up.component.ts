import {Component, ViewChild, ElementRef, Renderer2} from "@angular/core";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {FormGroup, FormControl, Validators, AbstractControl} from "@angular/forms";
import {UserDashboardServices} from "../../../user/services/user-dashboard.service";
import {environment} from "../../../../environments/environment";
import {FrontService} from "../../services/front.service";

/**
 * Created by Hiren on 07-06-2017.
 */

@Component({
  selector: "rp-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"]
})
export class SignUpComponent {

  signUpForm: FormGroup;
  signUpErrors: string;
  username = "";
  username_error = 0;
  isUserExist: number = 0;
  checkingUserName: boolean;

  plans: Array<any> = [];
  plans2: Array<any>=[];


  @ViewChild("signUpError") signUpErrorRef: ElementRef;

  constructor(private authService: AuthService,
              private router: Router,
              private renderer: Renderer2,
              private dashboardService: UserDashboardServices,
              private frontService: FrontService) {
    this.signUpForm = new FormGroup({
      userName: new FormControl("", Validators.required),
      fName: new FormControl("", Validators.required),
      lName: new FormControl("", Validators.required),
      phone: new FormControl(""),
      email: new FormControl("", [Validators.required, this.mailFormat]),
      password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      confirmPassword: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      tnc: new FormControl("")
    }, this.passwordValidator)
  }

  ngOnInit() {
    this.plans = this.frontService.getDummyPlans();
    this.plans2 = this.frontService.getDummyPlans2();
  }


  onTxtUserNameBlur() {
    if (this.username == this.signUpForm.value["userName"]) {
      return;
    }
    this.username = this.signUpForm.value["userName"];
    if (this.username && this.username.trim().length) {
      this.checkUserName(this.username);
    } else {
      this.isUserExist = 0;
    }
  }

  checkUserName(name: string) {
    this.checkingUserName = true;
    this.dashboardService.checkUserName(name)
      .subscribe(
        response => {
          this.checkingUserName = false;
          if (response.statusCode == 200) {
            if (response.data) {
              this.isUserExist = 2;
            } else {
              this.isUserExist = 1;
            }
          }
        },
        error => {
          this.checkingUserName = false;
          console.log("username check error => ", error);
        }
      )
  }

  mailFormat(control: AbstractControl) {

    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return {"incorrectMailFormat": true};
    }

    return null;
  }

  passwordValidator(fc: AbstractControl) {
    const pwd1: AbstractControl = fc.get("password");
    const pwd2: AbstractControl = fc.get("confirmPassword");
    if (pwd1.dirty && pwd2.dirty && (pwd1.value != pwd2.value)) {
      return {
        passwordValidator: {
          isValid: false
        }
      }
    }
    return null;
  }

  onBtnSignUpClicked() {
    const formValue = this.signUpForm.value;
    const data = {
      user_name: formValue.userName,
      email: formValue.email.toLowerCase(),
      password: formValue.password,
      first_name: formValue.fName,
      last_name: formValue.lName
    };
    this.authService.signUPStepOne(data)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            console.log("sign up successful => ", response);
            /*this.authService.registerWP(JSON.stringify(data)).subscribe(
              success => {
                console.log('WP user registered.');
              },
              error => {
                console.log('WP Error => ', error);
              }
            );*/

            // FB Pixel : Lead
            let script = document.createElement('script');
            script.innerHTML = `!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
            fbq('track', 'CompleteRegistration', {
              content_name: '`+response.data.email+`',
              content_category: 'Registration'
            });`;

            document.head.appendChild(script);

            let noscript = document.createElement('noscript');
            noscript.innerHTML = `<img height="1" width="1"
                 src="https://www.facebook.com/tr?id=863624127129002&ev=CompleteRegistration&noscript=1"/>`;
            document.head.appendChild(noscript);

            this.authService.partialUser = response.data;
            this.router.navigate(["/subscribe"]);
          }
        },
        error => {
          this.signUpErrors = error.message;
          this.signUpErrorRef.nativeElement.scrollIntoView();
          console.log("sign up error => ", error);
        })
  }
}

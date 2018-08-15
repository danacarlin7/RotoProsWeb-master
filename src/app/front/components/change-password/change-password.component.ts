import {Component} from "@angular/core";
import {FormGroup, Validators, FormControl, AbstractControl} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
/**
 * Created by Hiren on 15-07-2017.
 */

@Component({
  selector: 'rp-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  changePasswordForm:FormGroup;
  token:string;
  isError:boolean;
  errorMsg:string;

  constructor(private authService:AuthService, private activatedRoute:ActivatedRoute, private router:Router) {
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)])
    }, this.passwordValidator)
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      params => {
        this.token = params['token'];
        console.log("TOKEN => ", this.token);
      }
    )
  }

  passwordValidator(fc:AbstractControl) {
    let pwd1:AbstractControl = fc.get('password');
    let pwd2:AbstractControl = fc.get('confirmPassword');
    if (pwd1.dirty && pwd2.dirty && (pwd1.value != pwd2.value)) {
      return {
        passwordValidator: {
          isValid: false
        }
      }
    }
    return null;
  }

  onBtnSubmitClick() {
    let data = {
      token: this.token,
      password: this.changePasswordForm.value['password'],
      is_tool: true
    };
    this.isError = false;
    this.authService.changePassword(data)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.router.navigate(['/login'], {queryParams: {info: 'pc'}});
          }
        },
        error => {
          this.isError = true;
          this.errorMsg = error.message;
          console.log("http error => ", error);
        }
      )
  }

}

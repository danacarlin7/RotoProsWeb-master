import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../../shared/services/auth.service";
import { Router } from "@angular/router";
/**
 * Created by Hiren on 27-07-2017.
 */

@Component({
  selector: "rp-update-pwd",
  templateUrl: "./update-password.component.html",
  styleUrls: ["./update-password.component.css"]
})
export class UpdatePasswordComponent {
  isSuccess: boolean;
  responseMessage: string;

  constructor(private authService: AuthService) {}

  onNewPasswordSubmit(form) {
    const values = form.value;

    const passwordData = {
      old_password: values.oldPassword,
      new_password: values.newPassword
    };

    this.authService.updatePasswordFromSettings(passwordData).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.responseMessage = response.message;
          this.isSuccess = true;
        }
      },
      error => {
        this.isSuccess = false;
        this.responseMessage = error.message
      }
    );
  }
}

import {ErrorHandler} from '@angular/core';
import {AuthService} from "./shared/services/auth.service";

export class RPErrorHandler implements ErrorHandler {
  handleError(error) {
    console.log("********************");
    console.error(error);
    console.log("********************");
  }
}

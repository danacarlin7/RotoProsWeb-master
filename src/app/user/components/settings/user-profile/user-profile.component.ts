import {
  Component,
  OnInit,
  ViewContainerRef,
  Compiler,
  Injector,
  TemplateRef,
  ViewChild,
  NgModuleRef
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Overlay} from 'angular2-modal';
import {overlayConfigFactory} from "angular2-modal";
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import 'rxjs/Rx';
import {AuthService} from "../../../../shared/services/auth.service";
import {LoggedUser} from "../../../../shared/models/logged-user.model";
import {UserDashboardServices} from "../../../services/user-dashboard.service";
import {Router} from "@angular/router";
import {environment} from "../../../../../environments/environment";
/**
 * Created by Hiren on 27-07-2017.
 */

@Component({
  selector:'rp-user-profile',
  templateUrl:'./user-profile.component.html',
  styleUrls:['./user-profile.component.css']
})
export class UserProfileComponent{
  userData: LoggedUser;
  user_name = '';

  constructor(private authService:AuthService, private router:Router, overlay:Overlay, vcRef:ViewContainerRef, public modal:Modal, private dashboardService:UserDashboardServices) {
    this.userData = this.authService.loggedUser;
    this.authService.loggedUserChangeEvent.subscribe(user => {
      this.userData = user;
      this.user_name = this.userData.user_name;
      overlay.defaultViewContainer = vcRef;
    });
    if (this.userData) {
      this.user_name = this.userData.user_name;
      overlay.defaultViewContainer = vcRef;
    }
  }
}

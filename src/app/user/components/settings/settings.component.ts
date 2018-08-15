import {
  Component,
  OnInit,
  ViewContainerRef,
  Compiler,
  Injector,
  TemplateRef,
  ViewChild,
  NgModuleRef
} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Overlay} from "angular2-modal";
import {overlayConfigFactory} from "angular2-modal";
import {Modal, BSModalContext} from "angular2-modal/plugins/bootstrap";
import "rxjs/Rx";
import {AuthService} from "../../../shared/services/auth.service";
import {LoggedUser} from "../../../shared/models/logged-user.model";
import {UserDashboardServices} from "../../services/user-dashboard.service";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"]
})
export class SettingsComponent implements OnInit {

  tabs = [
    {
      id: "profile-picture",
      name: "Profile Image"
    },
    {
      id: "profile",
      name: "Your Profile"
    },
    {
      id: "change-password",
      name: "Change Password"
    },
    {
      id: "subscriptions",
      name: "Subscriptions"
    },
    {
      id: "saved-cards",
      name: "Saved Cards"
    }
  ];
/* {
 id: "saved-cards",
 name: "Saved Cards"
 },*/
  isLoading: boolean;



  constructor(private authService: AuthService,
              private router: Router,
              overlay: Overlay,
              vcRef: ViewContainerRef,
              public modal: Modal,
              private dashboardService: UserDashboardServices) {}


  ngOnInit() {
  }




}

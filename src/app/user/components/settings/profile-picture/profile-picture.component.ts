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
 * Created by Hiren on 30-07-2017.
 */

@Component({
  selector: 'rp-profile-pic',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.css']
})
export class ProfilePictureComponent {

  filename;
  configUpload = {
    // Change this to your upload POST address:
    server: 'https://api.dfsportgod.com/api/uploadImage',
    maxFilesize: 50,
    acceptedFiles: 'image/*',
    paramName: 'file',
    autoReset: 500,
    headers: {'Authorization': 'Bearer ' + environment.token}
  };

  constructor(private authService:AuthService, private router:Router, overlay:Overlay, vcRef:ViewContainerRef, public modal:Modal, private dashboardService:UserDashboardServices) {

  }

  fileUploadEvent(event) {
    let fileList:FileList = event.target.files;
    if (fileList.length > 0) {
      this.authService.uploadProfile(fileList).subscribe(
        data => console.log('success'),
        error => console.log(error)
      );
    }
  }

  onUploadError(event) {
    console.log('no, baby');
    console.log(event);
  }

  onUploadSuccess(event) {
    console.log("Profile Pic updated");
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
  }

  onSending(file) {
    console.log('sending');
    this.filename = file[0].name.split('-');
    this.filename = this.filename[0];
  }

}

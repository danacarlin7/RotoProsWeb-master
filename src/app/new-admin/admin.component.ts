import { Component, ViewEncapsulation } from "@angular/core";

declare var $:any;

@Component({
  selector: "app-root",
  templateUrl: "./admin.component.html",
  styleUrls: [
    // "../proAdmin/assets/css/paper-dashboard.css",
    "../../assets/newAdmin/css/paper-dashboard.css",
    "../../assets/newAdmin/css/themify-icons.css",
    "./admin.component.css"
  ],
  encapsulation: ViewEncapsulation.None
})

export class AdminComponent {}

import {Component, ViewChild, ElementRef, HostListener} from "@angular/core";
import {AuthService} from "../../../shared/services/auth.service";
import {LoggedUser} from "../../../shared/models/logged-user.model";
import {Router} from "@angular/router";

/**
 * Created by Hiren on 05-06-2017.
 */

declare var jQuery: any;

@Component({
  selector: "rp-front-header",
  templateUrl: "./front-header.component.html",
  styleUrls: ["./front-header.component.css"]
})
export class FrontHeaderComponent {
  @ViewChild("profilePic") profilePic: ElementRef;

  isLoggedIn: boolean;
  profileImagePath: string;
  role: string;
  loggedUser: LoggedUser;
  headerIsStacked: boolean;
  headerStackThreshold = 1150;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.role = this.authService.getUserRole();
    this.loggedUser = this.authService.loggedUser;

    if (this.loggedUser) {
      this.profileImagePath = this.loggedUser.profile_image;
    }
    this.authService.loggedUserChangeEvent.subscribe(
      user => {
        this.loggedUser = user;
        this.profileImagePath = this.loggedUser.profile_image;
        if (this.profileImagePath) {
          jQuery(this.profilePic.nativeElement).attr("src", "https://api.dfsportgod.com/images/" + this.profileImagePath);
        }
      }
    );
    this.authService.isLoggedInEvent.subscribe(
      data => {
        this.isLoggedIn = data;
        this.role = this.authService.getUserRole();
      }
    );
  }

  ngAfterViewInit() {
    jQuery(".menuToggle").click(function () {
      jQuery(".mainMenu").addClass("tglMnu");
    });

    jQuery(".closeBtn").click(function (e) {
      e.preventDefault();
      jQuery(this).parent().removeClass("tglMnu");
    });
  }

  closeMobileMenu() {
    console.log("closeMobileMenu");
    if (jQuery(".mainMenu").hasClass("tglMnu")) {
      jQuery(".mainMenu").removeClass("tglMnu");
    }
  }

  btnLogoutClicked() {
    this.authService.logout();
  }

  ngOnInit() {
    window.innerWidth <= this.headerStackThreshold ? this.headerIsStacked = true : this.headerIsStacked = false;

    if (this.authService.isLoggedIn()) {
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
        )
    }
  }

  logoutUser() {
    this.authService.logout();
    this.removeCookie("dfs_wp_user");
    this.removeCookie("dfs_wp_email");
    this.createCookie("dfs_wp_logout", 1, 1);
  }

  removeCookie(name) {
    document.cookie = name + "=; expires=" + new Date(0).toUTCString() + "; domain=rotopros.com; path=/";
  }

  createCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; domain=rotopros.com; path=/";
  }

  onResize(event) {
    if (event.target.innerWidth > this.headerStackThreshold && this.headerIsStacked) {
      this.headerIsStacked = false;
    } else if (event.target.innerWidth <= this.headerStackThreshold && !this.headerIsStacked) {
      this.headerIsStacked = true;
    }
  }

  onPlansClick() {
    if (this.isLoggedIn && this.authService.partialUser) {
      this.router.navigate(["/subscribe"]);
    } else {
      this.router.navigate(["/plans"]);
    }
  }
}

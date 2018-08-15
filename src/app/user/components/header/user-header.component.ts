import {Component, ElementRef, ViewChild} from "@angular/core";
import {AuthService} from "../../../shared/services/auth.service";
import {LoggedUser} from "../../../shared/models/logged-user.model";
/**
 * Created by Hiren on 11-06-2017.
 */

declare var jQuery:any;
@Component({
  selector: 'rp-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent {
  @ViewChild('profilePic') profilePic: ElementRef;
  loggedUser: LoggedUser;
  profileImagePath: string;
  role: string;

  constructor(private authService: AuthService) {
    console.log('user header rendered');

    this.loggedUser = this.authService.loggedUser;
    if (this.loggedUser) {
      this.profileImagePath = this.loggedUser.profile_image;
    }
    this.role = this.authService.getUserRole();
    this.authService.loggedUserChangeEvent.subscribe(
      user => {
        this.loggedUser = user;
        this.profileImagePath = this.loggedUser.profile_image;
        console.log("profileImagePath => ", this.profileImagePath);
        if (this.profileImagePath) {
          jQuery(this.profilePic.nativeElement).attr("src", 'https://api.dfsportgod.com/images/' + this.profileImagePath);
        }
      }
    );
  }

  ngAfterViewInit(){
    jQuery('.menuToggle').click(function(){
      jQuery(".mainMenu").addClass("tglMnu");
    });

    jQuery(".closeBtn").click(function(e){
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

  createCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; domain=rotopros.com; path=/";
  }

  // readCookie(name) {
  //   var nameEQ = name + "=";
  //   var ca = document.cookie.split(';');
  //   for(var i=0;i < ca.length;i++) {
  //     var c = ca[i];
  //     while (c.charAt(0)==' ') c = c.substring(1,c.length);
  //     if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  //   }
  //   return null;
  // }

  removeCookie(name) {
    document.cookie = name + "=; expires=" + new Date(0).toUTCString() + "; domain=rotopros.com; path=/";
  }


  logoutUser() {
    this.authService.logout();
    this.removeCookie('dfs_wp_user');
    this.removeCookie('dfs_wp_email');
    this.createCookie('dfs_wp_logout', 1, 1);
  }

}

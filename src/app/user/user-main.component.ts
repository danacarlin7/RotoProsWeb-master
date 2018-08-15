import {Component} from "@angular/core";
import {AuthService} from "../shared/services/auth.service";
import {Router, NavigationEnd} from "@angular/router";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
/**
 * Created by Hiren on 04-06-2017.
 */

@Component({
  selector: 'rp-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent {

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit() {
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

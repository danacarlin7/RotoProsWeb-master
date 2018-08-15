/**
 * Created by Hiren on 30-08-2017.
 */
import {Injectable} from "@angular/core";
import {
  CanActivate, Route, Router, ActivatedRouteSnapshot, ActivatedRoute, RouterStateSnapshot,
  CanActivateChild
} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable()
export class SubscriptionGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isSubscriber(true);

    // if (this.authService.isSubscriber(true)) {
    //   return true;
    // }
    // this.authService.showSubscriptionAlert();
    // return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }


  // canActivateSubscriber(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   this.router.navigate(['/login']});
  //   return false;
  // }
}

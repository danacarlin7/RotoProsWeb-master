import {Injectable} from "@angular/core";
import {CanActivate, Route, Router, ActivatedRouteSnapshot, ActivatedRoute, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login'], {queryParams: {redirect: state.url}});
    return false;
  }
}

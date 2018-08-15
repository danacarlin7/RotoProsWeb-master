import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {FrontService} from "../../services/front.service";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: "rp-plan-component",
  templateUrl: "./plan.component.html",
  styleUrls: ["./plan.component.css"]
})
export class PlanComponent {
  plans;
  plans1;
  plans2;

  isLogin: boolean;

  constructor(private router: Router, private frontService: FrontService, private authService: AuthService) {
    this.plans = this.frontService.getDummyPlans();
    this.plans1 = this.frontService.getDummyPlans1();
    this.plans2 = this.frontService.getDummyPlans2();
    this.isLogin = this.authService.isLoggedIn();
  }

  onBtnSubscribeClick() {
    this.router.navigate(["/signup"]);
  }
  onBtnFreeOfferClick() {
    this.router.navigate(["/FreeOffer"]);
  }
}

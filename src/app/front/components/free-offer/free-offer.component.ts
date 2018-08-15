import {Component} from "@angular/core";
import {Router} from "@angular/router";
@Component({
  selector: 'app-free-offer',
  templateUrl: './free-offer.component.html',
  styleUrls: ['./free-offer.component.css']
})
export class FreeOfferComponent {

  constructor(private router: Router) { }

  onBtnSubscribeClick() {
    this.router.navigate(["/signup"]);
  }

}

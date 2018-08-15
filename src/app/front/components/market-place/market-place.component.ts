import {Component} from "@angular/core";
import {FrontService} from "../../services/front.service";
/**
 * Created by Hiren on 07-07-2017.
 */

@Component({
  selector: 'rp-market-place',
  templateUrl: './market-place.component.html'
})
export class MarketPlaceComponent {

  isLoading:boolean;
  isError:boolean;
  errorMsg:string;
  providers:any[];
  currentPage:number;

  constructor(private frontService:FrontService) {

  }

  ngOnInit() {
    this.getProviders();
  }

  getProviders() {
    this.isLoading = true;
    this.frontService.retrieveProvider()
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.providers = response.data;
            this.isLoading = false;
          }
        },
        error => {
          this.isLoading = false;
          this.isError = true;
          this.errorMsg = error.message;
        }
      )
  }

  btnCheckoutProviderClicked(provider) {
    console.log("provider => ", provider);
  }
}

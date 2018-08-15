import {Component} from "@angular/core";
import {FacebookPixelEventConstants} from "../../constants/facebook-pixel-event.constants";
/**
 * Created by Hiren on 26-07-2017.
 */

declare var fbq:any;

@Component({
  selector: 'rp-extensions',
  templateUrl: './extensions.component.html',
  styleUrls: ['./extensions.component.css']
})
export class ExtensionsComponent {

  constructor() {

  }

  onChromeExtensionDownloadBtnClick(){
      fbq('trackCustom', FacebookPixelEventConstants.CHROME_EXTENSION_DOWNLOAD_EVENT);
  }

}

import {Component} from "@angular/core";
/**
 * Created by Hiren on 07-07-2017.
 */

declare var jQuery:any;

@Component({
  selector: 'rp-faq',
  templateUrl: './faq.component.html'
})
export class FAQComponent {
  activeFAQ:string;

  constructor() {

  }

  ngAfterViewInit() {
    function toggleIcon(e) {
      jQuery(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('glyphicon-plus glyphicon-minus');
    }

    jQuery('.panel-group').on('hidden.bs.collapse', toggleIcon);
    jQuery('.panel-group').on('shown.bs.collapse', toggleIcon);
  }

}

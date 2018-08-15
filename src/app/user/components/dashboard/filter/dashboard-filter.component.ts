import {Component, Output, EventEmitter} from "@angular/core";
import {DashboardFilter} from "../../../models/dashboard-filter.model";
import * as moment from "moment";
/**
 * Created by Hiren on 13-06-2017.
 */

declare var jQuery:any;

@Component({
  selector: 'rp-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.css']
})
export class DashboardFilterComponent {

  @Output() filterChanged:EventEmitter<DashboardFilter> = new EventEmitter<DashboardFilter>();

  maxDate:Date = new Date();
  selectedDate:Date;
  filterType:'week'|'month'|'year';
  sportType:'Golf'|'NBA'|'NFL'|'NHL'|'Soccer';
  siteType:'DraftKings';
  category:{label:string,value:string};
  categoryTypes = [
    {label: 'Double Up (50/50)', value: 'doubleUp'},
    {label: 'Winner Take All', value: 'winnerTakeAll'},
    {label: 'Satellite', value: 'satellite'},
    {label: 'League', value: 'league'},
    {label: 'Qualifier', value: 'qualifier'},
    {label: 'GPP', value: 'gpp'}];

  constructor() {
    this.selectedDate = moment().toDate();
    this.filterType = "year";
  }

  ngOnInit() {
    //this.dispatchFilterChangeEvent();
  }

  ngAfterViewInit():void {
    jQuery('.datepicker').datepicker({
      changeMonth: true,
      changeYear: true,
      beforeShow: function (textbox, instance) {
        instance.dpDiv.css({
          marginLeft: textbox.offsetWidth + (-228) + 'px'
        });
      },
      onSelect: (event) => {
        this.onDateChanged(event);
      },
      setDate: moment().format('MM/DD/YYYY')
    })
    ;
    jQuery('.datepicker').datepicker("setDate", moment(this.selectedDate).format('MM/DD/YYYY'));

    jQuery(window).click(function (e) {
      jQuery(".dropdownSelect > .dropdownSelectMenu").hide();
    });

    jQuery(".dropdownSelect > .dropdownSelectClick").click(function (e) {
      e.stopPropagation();
      if (jQuery(".dropdownSelect > .dropdownSelectMenu").hasClass("activeSelectMenu")) {
        jQuery(".dropdownSelect > .dropdownSelectMenu").hide();
        jQuery(".dropdownSelect > .dropdownSelectMenu").removeClass("activeSelectMenu");
      }
      if (jQuery(this).next().hasClass("activeSelectMenu")) {
        jQuery(this).next().removeClass("activeSelectMenu");
        jQuery(this).next().hide();
      }
      else {

        jQuery(this).next().show();
        jQuery(this).next().addClass("activeSelectMenu");
      }

    });

    jQuery(".dropdownSelect > .dropdownSelectMenu > li > a").click(function () {

      var slctTxt = jQuery(this).text();
      jQuery(this).parents(".dropdownSelectMenu").siblings(".dropdownSelectClick").text(slctTxt);
    });

  }

  onDateChanged(event) {
    this.selectedDate = moment(event, 'MM/DD/YYYY').toDate();
    this.dispatchFilterChangeEvent();
  }

  filterTimePeriodChanged(timePeriod:'week'|'month'|'year') {
    this.filterType = timePeriod;
    this.dispatchFilterChangeEvent();
  }


  onBtnPreviousClicked() {
    this.selectedDate = moment(this.selectedDate).subtract(1, this.filterType).toDate();
    jQuery('.datepicker').datepicker("setDate", moment(this.selectedDate).format('MM/DD/YYYY'));
    this.dispatchFilterChangeEvent();
  }

  onBtnNextClicked() {
    let newDate = moment(this.selectedDate).add(1, this.filterType).toDate();
    this.selectedDate = moment(newDate).isAfter(moment()) ? moment().toDate() : newDate;
    jQuery('.datepicker').datepicker("setDate", moment(this.selectedDate).format('MM/DD/YYYY'));
    this.dispatchFilterChangeEvent();
  }

  onBtnTodayClicked() {
    this.selectedDate = moment().toDate();
    jQuery('.datepicker').datepicker("setDate", moment(this.selectedDate).format('MM/DD/YYYY'));
    this.dispatchFilterChangeEvent();
  }

  isTodayDate():boolean {
    return moment(this.selectedDate).isSame(moment(), 'day');
  }

  dispatchFilterChangeEvent() {
    console.log("dashboard filter changed");
    let startDate = moment(this.selectedDate).startOf(this.filterType).toDate();
    let endDate = moment(this.selectedDate).endOf(this.filterType).toDate();
    endDate = moment(endDate).isAfter(moment()) ? moment().toDate() : endDate;
    let data = {
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      site: this.siteType ? this.siteType : '',
      sport: this.sportType ? this.sportType : '',
      category: this.category ? this.category.value : '',
      time_period: this.filterType
    };
    this.filterChanged.emit(data);
  }
}

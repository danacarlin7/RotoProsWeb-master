import {Component} from '@angular/core';
import {FilterCriteria} from '../../models/filter-criteria.model';
import {CohortData} from '../../models/cohort-data.model';
import {FilterService} from '../../services/filter.service';
import {UserDashboardServices} from '../../services/user-dashboard.service';
import {CohortTabConstants, CohortTabs} from "../../constants/menu.constants";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'rp-cohort',
  templateUrl: './cohort.component.html',
  styleUrls: ['./cohort.component.css']
})
export class CohortComponent{

  cohortTabs = CohortTabs;
  cohortTabConstants = CohortTabConstants;

  activeTab:string = this.cohortTabConstants.SITE;

  records:CohortData[] = [];
  filters:FilterCriteria[];
  filterSettings:any;
  isLoading:boolean;
  filterEventSubscription:any;

  constructor(private router:Router, private activeRoute:ActivatedRoute, private filterService:FilterService, private dashboardService:UserDashboardServices) {
    this.filterEventSubscription = this.filterService.filtersChangedEvent.subscribe(
      filters => {
        this.getData(this.filterService.activeCohortTab, filters);
        this.filters = filters;
      }
    );
    this.filters = this.filterService.filters;
    this.filterService.getFilterSettings()
      .subscribe(settings => {this.filterSettings = settings});
  }

  ngOnInit() {
    this.filterService.activeCohortTab = CohortTabConstants.SITE;
    this.activeTab = this.filterService.activeCohortTab;
    this.activeRoute.queryParams.subscribe(
      params => {
        if (params.hasOwnProperty('tab')) {
          this.getData(params['tab'], this.filterService.filters);
          this.activeTab = this.filterService.activeCohortTab = params['tab'];
        }
        else {
          this.router.navigate(['/user/cohort'], {queryParams: {tab: this.activeTab}})
        }
      }
    )
  }

  getData(tabName, filters:FilterCriteria[] = null) {
    this.isLoading = true;
    this.dashboardService.retrieveCohortData(tabName, filters)
      .subscribe(
        data => {
          if (data.statusCode == 200) {
            this.filterService.activeCohortTab = tabName;
            if (data.data && Array.isArray(data.data)) {
              this.records = data.data;
            }
            this.isLoading = false;
          }
        });
  }

  onCohortTabChanged(tabName:{value:string,label:string}) {
    this.activeTab = tabName.value;
    this.router.navigate(['/user/cohort'], {queryParams: {tab: tabName.value}})
  }

  onAddFilterEventHandler(filter:FilterCriteria) {
    this.filterService.addFilter(filter);
  }

  onRemoveFilterEvent(filter:FilterCriteria) {
    this.filterService.removeFilter(filter);
  }

  onRemoveAllFiltersEvent(filters:FilterCriteria[]) {
    this.filterService.clearFilter();
  }

  ngOnDestroy() {
    this.filterEventSubscription.unsubscribe();
  }

}

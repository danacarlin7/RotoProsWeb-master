import {Component} from "@angular/core";
import {ContestTabs, ContestTabConstants} from "../../constants/menu.constants";
import {ContestData} from "../../models/contest";
import {FilterCriteria} from "../../models/filter-criteria.model";
import {Router, ActivatedRoute} from "@angular/router";
import {FilterService} from "../../services/filter.service";
import {UserDashboardServices} from "../../services/user-dashboard.service";
/**
 * Created by Hiren on 11-06-2017.
 */

@Component({
  selector: 'rp-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent {
  display:boolean;
  contestTabs = ContestTabs;
  contestTabConstants = ContestTabConstants;

  activeTab:string = this.contestTabConstants.CONTESTS;

  records:ContestData[] = [];
  filters:FilterCriteria[];
  filterSettings:any;
  isLoading:boolean;
  filterEventSubscription:any;

  constructor(private router:Router,
              private dashboardService:UserDashboardServices,
              private activeRoute:ActivatedRoute,
              private filterService:FilterService) {
    this.filterEventSubscription = this.filterService.filtersChangedEvent.subscribe(
      filters => {
        this.getData(this.filterService.activeContestTab, filters);
        this.filters = filters;
      }
    );
    this.filters = this.filterService.filters;
    this.filterService.getFilterSettings()
      .subscribe(settings => {
        this.filterSettings = settings
      });
  }

  ngOnInit() {
    this.filterService.activeCohortTab = ContestTabConstants.CONTESTS;
    this.activeTab = this.filterService.activeContestTab;
    this.activeRoute.queryParams.subscribe(
      params => {
        if (params.hasOwnProperty('tab')) {
          this.getData(params['tab'], this.filterService.filters);
          this.activeTab = this.filterService.activeContestTab = params['tab'];
        }
        else {
          this.router.navigate(['/user/contests'], {queryParams: {tab: this.activeTab}})
        }
      }
    )
  }

  getData(tabName, filters:FilterCriteria[] = null) {
    this.isLoading = true;
    this.dashboardService.retrieveContestData(tabName, filters)
      .subscribe(
        data => {
          if (data.statusCode == 200) {
            this.filterService.activeCohortTab = tabName;
            this.records = data.data;
            this.isLoading = false;
          }
        });
  }

  onContestTabChanged(tabName:{value:string,label:string}) {
    this.activeTab = tabName.value;
    this.router.navigate(['/user/contests'], {queryParams: {tab: tabName.value}})
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

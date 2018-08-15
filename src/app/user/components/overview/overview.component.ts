import {Component} from "@angular/core";
import {FilterCriteria} from "../../models/filter-criteria.model";
import {OverviewData} from "../../models/overview-data.model";
import {FilterService} from "../../services/filter.service";
import {UserDashboardServices} from "../../services/user-dashboard.service";
/**
 * Created by Hiren on 11-06-2017.
 */


@Component({
  selector: 'rp-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {

  records:OverviewData[];
  filters:FilterCriteria[];
  filterSettings:any;
  isLoading:boolean;
  filterEventSubscription:any;

  constructor(private filterService:FilterService, private dashboardService:UserDashboardServices) {
    this.filterEventSubscription = this.filterService.filtersChangedEvent.subscribe(
      filters => {
        this.getData(filters);
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
    this.getData(this.filters);
  }

  getData(filters:FilterCriteria[] = null) {
    this.isLoading = true;
    this.dashboardService.retrieveOverviewData(filters)
      .subscribe(
        data => {
          if (data.statusCode == 200) {
            if (data.data && Array.isArray(data.data)) {
              this.records = data.data as OverviewData[];
            }
            this.isLoading = false;
          }
          else {
            this.isLoading = false;
          }
        },
        error => {
          this.isLoading = false;
        });
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

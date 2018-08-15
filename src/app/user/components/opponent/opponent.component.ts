import {Component} from "@angular/core";
import {OpponentData} from "../../models/opponent-data.model";
import {FilterCriteria} from "../../models/filter-criteria.model";
import {AuthService} from "../../../shared/services/auth.service";
import {FilterService} from "../../services/filter.service";
import {UserDashboardServices} from "../../services/user-dashboard.service";
/**
 * Created by Hiren on 12-06-2017.
 */

@Component({
  selector: 'rp-opponent',
  templateUrl: './opponent.component.html',
  styleUrls: ['./opponent.component.css']
})
export class OpponentComponent {
  records:OpponentData[];
  isLoading:boolean;
  filters:FilterCriteria[];
  filterSettings:any;
  filterEventSubscription:any;

  constructor(private authService:AuthService, private filterService:FilterService, private dashboardService:UserDashboardServices) {
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
    console.log("Opponent Init");
    this.getData(this.filters);
  }

  getData(filters:FilterCriteria[] = null) {
    console.log("onInit Opponent");
    this.isLoading = true;
    this.dashboardService.retrieveOpponentsData(filters)
      .subscribe(
        data => {
          if (data.statusCode == 200) {
            if (data.data) {
              this.records = data.data as OpponentData[];
            }
            this.isLoading = false;
          }
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
}

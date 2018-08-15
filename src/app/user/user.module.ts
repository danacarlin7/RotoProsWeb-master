import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {UserMainComponent} from "./user-main.component";
import {UserRoutingModule} from "./user-routing.module";
import {UserHeaderComponent} from "./components/header/user-header.component";
import {UserFooterComponent} from "./components/footer/user-footer.component";
import {UserDashboardComponent} from "./components/dashboard/user-dashboard.component";
import {OverviewComponent} from "./components/overview/overview.component";
import {FilterComponent} from "./components/filters/filter.component";
import {AppliedFiltersComponent} from "./components/filters/applied-filters/applied-filter.component";
import {UserDashboardServices} from "./services/user-dashboard.service";
import {FilterService} from "./services/filter.service";
import {OverviewlistComponent} from "./components/overview/overview-list/overview-list.component";
import {AuthService} from "../shared/services/auth.service";
import {CohortComponent} from './components/cohort/cohort.component';
import {GraphComponent} from './components/graph/graph.component';
import {CohortListComponent} from './components/cohort/cohort-list/cohort-list.component';
import {ContestComponent} from "./components/contest/contest.component";
import {ContestListComponent} from "./components/contest/contest-list/contest-list.component";
import {OpponentComponent} from "./components/opponent/opponent.component";
import {OpponentListComponent} from "./components/opponent/opponents-list/opponents-list.component";
import {DashboardFilterComponent} from "./components/dashboard/filter/dashboard-filter.component";
import {DashboardStaticsComponent} from "./components/dashboard/dashboard-statics/dashboard-statics.component";
import {DashboardTopWinsComponent} from "./components/dashboard/dashboard-top-wins/dashboard-top-wins.component";
import {UploadsService} from "./services/uploads.service";
import {UploadsComponent} from "./components/uploads/uploads.component";
import {ModalModule} from 'angular2-modal';
import {BootstrapModalModule} from 'angular2-modal/plugins/bootstrap';
import {DropzoneModule} from "ngx-dropzone-wrapper/dist/index";
import {SettingsComponent} from "./components/settings/settings.component";
import {UpdatePasswordComponent} from "./components/settings/update-password/update-password.component";
import {UserProfileComponent} from "./components/settings/user-profile/user-profile.component";
import {SubscriptionsComponent} from "./components/settings/subscriptions/subscriptions.component";
import {ProfilePictureComponent} from "./components/settings/profile-picture/profile-picture.component";
import {SavedCardsComponent} from "./components/settings/saved-cards/saved-cards.component";
/**
 * Created by Hiren on 04-06-2017.
 */

@NgModule({
  imports: [
    UserRoutingModule,
    BootstrapModalModule,
    SharedModule
  ],
  declarations: [
    UserMainComponent,
    UserHeaderComponent,
    UserFooterComponent,
    UserDashboardComponent,
    OverviewComponent,
    FilterComponent,
    AppliedFiltersComponent,
    OverviewlistComponent,
    OverviewlistComponent,
    CohortComponent,
    CohortListComponent,
    ContestComponent,
    ContestListComponent,
    OpponentComponent,
    OpponentListComponent,
    DashboardFilterComponent,
    DashboardStaticsComponent,
    DashboardTopWinsComponent,
    GraphComponent,
    UploadsComponent,
    SettingsComponent,
    UpdatePasswordComponent,
    UserProfileComponent,
    SubscriptionsComponent,
    ProfilePictureComponent,
    SavedCardsComponent
  ],
  exports: [
    UserMainComponent
  ],
  providers: [UserDashboardServices, FilterService, UploadsService]
})
export class UserModule {

}

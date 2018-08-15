import {NgModule} from "@angular/core";
import {RouterModule, Routes, Route} from "@angular/router";
import {UserMainComponent} from "./user-main.component";
import {UserDashboardComponent} from "./components/dashboard/user-dashboard.component";
import {OverviewComponent} from "./components/overview/overview.component";
import {CohortComponent} from "./components/cohort/cohort.component";
import {ContestComponent} from "./components/contest/contest.component";
import {OpponentComponent} from "./components/opponent/opponent.component";
import {AuthGuard} from "../shared/services/auth.guard";
import {GraphComponent} from "./components/graph/graph.component";
import {UploadsComponent} from "./components/uploads/uploads.component";
import {SettingsComponent} from "./components/settings/settings.component";
import {UpdatePasswordComponent} from "./components/settings/update-password/update-password.component";
import {UserProfileComponent} from "./components/settings/user-profile/user-profile.component";
import {SubscriptionsComponent} from "./components/settings/subscriptions/subscriptions.component";
import {SavedCardsComponent} from "./components/settings/saved-cards/saved-cards.component";
import {ProfilePictureComponent} from "./components/settings/profile-picture/profile-picture.component";

/**
 * Created by Hiren on 05-06-2017.
 */

const routes:Routes = [
  <Route>{
    path: '',
    canActivate: [AuthGuard],
    component: UserMainComponent,
    data: {title: 'RotoPose - Dashboard'},
    children: [
      <Route>{
        path: '',
        component: UserDashboardComponent
      },
      <Route>{
        path: 'overview',
        component: OverviewComponent
      },
      <Route>{
        path: 'cohort',
        component: CohortComponent
      },
      <Route>{
        path: 'contests',
        component: ContestComponent
      },
      <Route>{
        path: 'opponent',
        component: OpponentComponent
      },
      <Route>{
        path: 'graphs',
        component: GraphComponent
      },
      <Route>{
        path: 'uploads',
        component: UploadsComponent
      },
      <Route>{
        path: 'settings',
        component: SettingsComponent,
        children: [
          <Route>{
            path: '',
            pathMatch: 'full',
            redirectTo: 'profile-picture'
          },
          <Route>{
            path: 'change-password',
            component: UpdatePasswordComponent
          },
          <Route>{
            path: 'profile',
            component: UserProfileComponent
          },
          <Route>{
            path: 'subscriptions',
            component: SubscriptionsComponent
          },
          <Route>{
            path: 'saved-cards',
            component: SavedCardsComponent
          },
          <Route>{
            path: 'profile-picture',
            component: ProfilePictureComponent
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class UserRoutingModule {

}

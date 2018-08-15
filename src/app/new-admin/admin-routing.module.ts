import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent }   from "./components/dashboard/dashboard.component";
import { NgModule } from "@angular/core";
import { AdminComponent } from "./admin.component";
import { MembersAdminComponent } from "./members-admin/members-admin.component";
import { MembersDetailComponent } from "./members-detail/members-detail.component";
import { MembersLoadedResolver } from "./services/members-loaded-resolver.service";
import { PromotionsComponent } from "./promotions/promotions.component";

export const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "members",
        children: [
          {
            path: "",
            component: MembersAdminComponent
          },
          {
            path: ":id",
            component: MembersDetailComponent,
            resolve: { member: MembersLoadedResolver }
          }
        ]
      },
      {
        path: "promotions",
        component: PromotionsComponent
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
export class AdminRoutingModule {}


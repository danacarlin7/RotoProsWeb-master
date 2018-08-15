import { NgModule } from "@angular/core";

import { AdminComponent } from "./admin.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { SidebarModule } from "./components/sidebar/sidebar.module";
import { FooterModule } from "./components/shared/footer/footer.module";
import { NavbarModule} from "./components/shared/navbar/navbar.module";
import { FixedPluginModule} from "./components/shared/fixedplugin/fixedplugin.module";
import { NguiMapModule} from "@ngui/map";

import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { UserComponent } from "./components/user/user.component";
import { TableComponent } from "./components/table/table.component";
import { TypographyComponent } from "./components/typography/typography.component";
import { IconsComponent } from "./components/icons/icons.component";
import { MapsComponent } from "./components/maps/maps.component";
import { NotificationsComponent } from "./components/notifications/notifications.component";
import { UpgradeComponent } from "./components/upgrade/upgrade.component";
import { SharedModule } from "../shared/shared.module";
import { MembersAdminComponent } from "./members-admin/members-admin.component";
import { AdminDashboardService } from "./services/admin-dashboard.service";
import { MembershipPlanService } from "./services/membership-plan.service";
import { MembersDetailComponent } from "./members-detail/members-detail.component";
import { MembersLoadedResolver } from "./services/members-loaded-resolver.service";
import { PromotionsComponent } from "./promotions/promotions.component";

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    UserComponent,
    TableComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    MembersAdminComponent,
    MembersDetailComponent,
    PromotionsComponent
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    FixedPluginModule,
    NguiMapModule.forRoot({apiUrl: "https://maps.google.com/maps/api/js?key=AIzaSyBr-tgUtpm8cyjYVQDrjs8YpZH7zBNWPuY"}),
  ],
  exports: [
    AdminComponent
  ],
  providers: [
    AdminDashboardService,
    MembershipPlanService,
    MembersLoadedResolver
  ],
})
export class AdminModule { }

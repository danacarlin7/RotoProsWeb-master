import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/first";
import { AdminDashboardService } from "./admin-dashboard.service";
import { Injectable } from "@angular/core";

@Injectable()
export class MembersLoadedResolver implements Resolve<Object> {
  constructor(private adminDashboardService: AdminDashboardService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Object> | Promise<Object> | Object {
    const id = route.params["id"];
    const allMembers = this.adminDashboardService.allMembers;

    if (Object.keys(allMembers).length !== 0) {
      return allMembers[id];
    } else {
      return this.adminDashboardService.allMembersUpdated
        .map(
          (membersUpdated) => {
            return allMembers[id];
          }
        ).first();
    }
  }
}

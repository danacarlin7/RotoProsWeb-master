import { Component, OnInit, ViewEncapsulation } from "@angular/core";

declare var $:any;

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: "dashboard", title: "Dashboard",  icon: "ti-panel", class: "" },
    { path: "members", title: "Members",  icon: "ti-user", class: "" },
    { path: "promotions", title: "Promotions", icon: "ti-gift", class: ""}
];

@Component({
    moduleId: module.id,
    selector: "sidebar-cmp",
    templateUrl: "./sidebar.component.html"
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
    isNotMobileMenu(){
        if($(window).width() > 991){
            return false;
        }
        return true;
    }

}

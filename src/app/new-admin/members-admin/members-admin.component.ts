import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { AdminDashboardService } from "../services/admin-dashboard.service";
import { Overlay } from "angular2-modal";
import { overlayConfigFactory } from "angular2-modal";
import { Modal, BSModalContext } from "angular2-modal/plugins/bootstrap";
import { MembershipPlanService } from "../services/membership-plan.service";
import * as moment from "moment";
import { Subscription } from "rxjs/Subscription";
import "../../../assets/newAdmin/js/datetime-moment.js";

declare var $: any;

@Component({
  selector: "app-members-admin",
  templateUrl: "./members-admin.component.html",
  styleUrls: ["./members-admin.component.css"]
})
export class MembersAdminComponent implements OnInit {
  @ViewChild("subscribeTemplateRef") private subscribeTemplateRef: TemplateRef<any>;
  @ViewChild("unsubscribeTemplateRef") private unsubscribeTemplateRef: TemplateRef<any>;
  @ViewChild("deleteTemplateRef") private deleteTemplateRef: TemplateRef<any>;

  public headerRow = ["Name", "Email", "Is Subscribed", "Created On", "Last Subscription", "Actions"];
  public footerRow = ["Name", "Email", "Is Subscribed", "Created On", "Last Subscription", "Actions"];
  public allMembers: Object[];
  private membersSubscription: Subscription;

  private modalData;
  private dialogRef;
  private table;
  private subscriptionPlans: Object[];

  constructor(
    private adminDashboardService: AdminDashboardService,
    private membershipPlanService: MembershipPlanService,
    private modal: Modal,
    private vcRef: ViewContainerRef,
    private overlay: Overlay
  ) {
    modal.overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    if (Object.keys(this.adminDashboardService.allMembers).length !== 0) {
      this.setUpData();
    } else {
      this.membersSubscription = this.adminDashboardService.allMembersUpdated
        .subscribe(
          (membersUpdated: boolean) => {
            this.setUpData();
          }
        );
    }

    this.membershipPlanService.retrieveMembershipPlans().subscribe(
      plans => {
        this.subscriptionPlans = [plans.data[1], plans.data[2]];
      }
    );
  }

  setUpData() {
    const allMembers = this.adminDashboardService.allMembers;

    // Get all values from allMembers in an array
    this.allMembers = Object.keys(allMembers).map(key => allMembers[key]).map(member => {
      return {
        name: member.full_name,
        email: member.email,
        isSubscribe: member.is_subscribe,
        createdAt: member.created_at,
        lastSubscription: member.last_active,
        id: member._id,
        subscriptions: member.subscriptions.filter(subscription => subscription.is_plan_active === true)
      };
    });

    setTimeout(() => this.setUpDatatable(), 0);
  }

  setUpDatatable() {
    if (this.table) {
      this.table.destroy();
    }

    $.fn.dataTable.moment("MMM D YYYY");

    this.table = $("#datatables").DataTable({
      "pagingType": "full_numbers",
      "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
      responsive: true,
      language: {
      search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
      "order": [[ 3, "desc" ]]
    });

    const table = this.table;

    for (let i = 0; i < 4; i++) {
      $(`#column${i}_search`).on( "keyup", function() {
        table.columns(i).search(this.value).draw();
      });
    }
  }

  openModal(data: Object, templateRef: TemplateRef<any>) {
    this.modalData = data;
    this.modal.open(templateRef, overlayConfigFactory({isBlocking: false}, BSModalContext)).then(
      dialog => this.dialogRef = dialog
    );
  }

  subscribeMember(form) {
    console.log(form.value.planID);
    console.log(this.modalData.id);
    console.log(typeof this.modalData.createdAt);
  }

  unsubscribeMember(form) {
    this.adminDashboardService.unsubscribePlan(form.value.planID, false, this.modalData.id).subscribe(
      response => {
        console.log(response);
          alert(response.message);
          this.dialogRef.close(true);
      }
    );
  }

  deleteUser(id: String) {
    this.adminDashboardService.deleteMember(id).subscribe(
      response => {
        console.log(response);
        alert(response.message);
        this.dialogRef.close(true);

        const $tr = $(`#${id}`);
        this.table.row($tr).remove().draw();
      },
      error => {
        console.log(error);
        alert(error.message);
      }
    );
  }

  downloadMembers() {
    if (!this.allMembers) {
      alert("Wait for members to load");
      return;
    }

    this.adminDashboardService.downloadCSV(this.allMembers, "allMembers.csv");
  }

}

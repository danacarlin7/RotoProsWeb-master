import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { Subscription } from 'rxjs/Subscription';
import * as moment from "moment";

@Component({
  selector: 'app-members-detail',
  templateUrl: './members-detail.component.html',
  styleUrls: ['./members-detail.component.css']
})
export class MembersDetailComponent implements OnInit {
  private id: string;
  public member;
  public memberKeys;
  public stripeCharges;

  constructor(private route: ActivatedRoute, private adminDashboardService: AdminDashboardService) { }

  ngOnInit() {
    this.route.data.subscribe((data: Data) => {
      const member = data.member;

      this.member = {
        id: member._id,
        customer_id: member.customer_id,
        name: member.full_name,
        email: member.email,
        created_at: member.created_at,
        isSubscribe: member.is_subscribe,
        lastSubscription: member.last_active,
        subscriptions: member.subscriptions
      };

      this.member.subscriptions.forEach((subscription) => {
        subscription.current_period_start = moment(subscription.current_period_start).format("MMM D YYYY");
        subscription.current_period_end = moment(subscription.current_period_end).format("MMM D YYYY");
      });

      this.memberKeys = Object.keys(this.member);

      this.adminDashboardService.getChargesByMember(this.member.customer_id).subscribe(stripeData => {
        this.stripeCharges = stripeData.charges.data;

        this.stripeCharges.forEach(charge => {
          charge.created = moment.unix(charge.created).format("MMM D YYYY");

          const amount = charge.amount.toString();
          charge.amount = `$${amount.slice(0, amount.length - 2)}.${amount.slice(-2)}`;
        });

        console.log(this.stripeCharges);
      });
    });
  }
}

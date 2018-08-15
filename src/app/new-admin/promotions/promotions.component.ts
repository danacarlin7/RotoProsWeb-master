import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Coupon } from "../models/coupon.model";
import { NgForm } from "@angular/forms";
import { AdminDashboardService } from "../services/admin-dashboard.service";

@Component({
  selector: "app-promotions",
  templateUrl: "./promotions.component.html",
  styleUrls: ["./promotions.component.css"]
})
export class PromotionsComponent implements OnInit {
  @ViewChild("f") couponForm: NgForm;
  couponType = "percentage";
  duration = "once";
  endCriteria = "redeem-by";
  url = "";
  testUrl = "";

  constructor(private adminDashboardService: AdminDashboardService) { }

  ngOnInit() {
  }

  onSubmit() {
    const values = this.couponForm.value;
    let coupon = { id: values["id"], duration: values["duration"]};

    if (this.duration === "repeating") coupon["duration_in_months"] = values["durationInMonths"];
    this.couponType === "flat"
      ? coupon["amount_off"] = values["discountRate"]
      : coupon["percent_off"] = values["discountRate"];
    this.endCriteria === "redeem-by"
      ? coupon["redeem_by"] = values["endDate"]
      : coupon["max_redemptions"] = values["MaxRedemptions"];

    coupon = new Coupon(coupon);

    this.adminDashboardService.createCoupon(coupon).subscribe(
      response => {
        console.log(response);
        this.url = `https://www.rotopros.com/subscribe;id=${coupon.id};discount_type=${this.couponType};discount_rate=${values["discountRate"]}`;
        this.testUrl = `13.57.84.196/subscribe;id=${coupon.id};discount_type=${this.couponType};discount_rate=${values["discountRate"]}`;
      }
    );
  }

}

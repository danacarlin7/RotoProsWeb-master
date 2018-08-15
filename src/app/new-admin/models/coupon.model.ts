export class Coupon {
  public id: string;
  public duration: string;
  public duration_in_months?: number;
  public amount_off?: number;
  public percent_off?: number;
  public redeem_by?: Date;
  public max_redemptions?: number;

  constructor(coupon: Object) {
    this.id = coupon["id"];
    this.duration = coupon["duration"];
    if (coupon["duration_in_months"]) this.duration_in_months = coupon["duration_in_months"];
    if (coupon["amount_off"]) this.amount_off = coupon["amount_off"];
    if (coupon["percent_off"]) this.percent_off = coupon["percent_off"];
    if (coupon["max_redemptions"]) this.max_redemptions = coupon["max_redemptions"];
    if (coupon["redeem_by"]) this.redeem_by = coupon["redeem_by"];
  }
}

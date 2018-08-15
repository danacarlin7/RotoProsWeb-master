/**
 * Created by Hiren on 11-08-2017.
 */


export interface PaymentCard {
  card_id:string;
  brand:string;
  country:string;
  last4:string;
  _id:string;
  exp_month : number;
  exp_year : number;
}

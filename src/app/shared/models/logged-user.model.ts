/**
 * Created by hirenparekh on 22/06/17.
 */


export interface LoggedUser{
  created_at: Date;
  first_name: string;
  last_name: string;
  email: string;
  user_name: string;
  updated_at: Date;
  created_short_date: string;
  subscriptions: Subscription[];
  mobile: string;
  is_subscribe: boolean;
  is_memberspace: boolean;
  is_active: boolean;
  profile_image: string;
  role:string;
}


export interface Subscription {
  customer_id: string;
  description: string;
  subscription_id: string;
  plan_id: string;
  plan_name: string;
  plan_amount: number;
  current_period_end: Date;
  current_period_start: Date;
  status: string;
  is_plan_active: boolean;
  _id: string;
}

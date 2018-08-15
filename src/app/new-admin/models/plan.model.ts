export interface MembershipPlan {

  _id?:string;
  livemode?:boolean;
  created?:string;
  statement_descriptor?:any;
  plan_type:{id:number,value:string};
  amount:number;
  interval:string;
  interval_count:number;
  exp_type:any;
  exp_value:any;
  trial_period_days:number;
  name:string;
  category:string;
  currency:string;
  plan_id:string;
  is_active:boolean;
  is_public:boolean;
}

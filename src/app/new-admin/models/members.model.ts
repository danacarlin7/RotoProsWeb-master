export interface Member {
  _id: string;
  created_at: Date;
  created_short_date: string;
  first_name: string;
  last_name: string;
  email: string;
  user_name: string;
  analyst_info: MemberInfo;
  mobile: string;
  is_subscribe: boolean;
  is_memberspace: boolean;
  is_active: boolean;
  is_verified: boolean;
  role: string;
}

export interface MemberInfo {
  subscription_fee?: any;
  biodata?: any;
}

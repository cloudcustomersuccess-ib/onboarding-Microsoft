// User types
export interface User {
  UserId: string;
  Email: string;
  OrganizationId?: string;
  FullName?: string;
  Name?: string;
  Surname?: string;
  Role?: string;
  IsActive?: boolean;
  PreferredLanguage?: string;
}

// Session
export interface Session {
  token: string;
  user: User;
}

// Onboarding
export interface Onboarding {
  ClienteID: string;
  Manufacturer?: string;
  Status?: string;
  Language?: string;
  OrganizationId?: string;
  PrimaryContactEmail?: string;
  PartnerName?: string;
  UpdatedAt?: string;
  CreatedAt?: string;
  LastSource?: string;
  [key: string]: any;
}

// Mirror (checklist fields)
export interface Mirror {
  ClienteID: string;
  LastSyncAt?: string;
  [key: string]: any;
}

// Note
export interface Note {
  NoteId?: string;
  ClienteID: string;
  ScopeType?: string; // "GENERAL" | "SUBSTEP"
  SubstepKey?: string;
  Visibility?: string;
  AuthorUserId?: string;
  Body: string;
  CreatedAt?: string;
}

// API Responses
export interface OnboardingListResponse {
  items: Onboarding[];
}

export interface OnboardingDetailResponse {
  onboarding: Onboarding;
  mirror: Mirror | null;
  notes: Note[];
}

export interface VerifyOtpResponse {
  token: string;
  user: User;
}

export interface ApiErrorResponse {
  error: string;
}

// ION Subscription types
export interface IonSubscription {
  subscriptionId: string;
  customerId: string;
  subscriptionStatus: string;
  cloudProviderName: string;
  subscriptionName: string;
  billingCycle: string;
  startDate?: string;
  endDate?: string;
  totalLicense: number;
  customerName: string;
  resellerName?: string;
  providerProductId?: string;
}

export interface IonSubscriptionPagination {
  limit: number;
  offset: number;
  total: number;
}

export interface IonSubscriptionsResponse {
  ok: boolean;
  orgId?: string;
  count?: number;
  data?: {
    items: IonSubscription[];
    pagination: IonSubscriptionPagination;
  };
  error?: string;
}

// ION Order types
export type IonOrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "ON_HOLD"
  | "COMPLETED"
  | "ERROR"
  | "CANCELED"
  | "IN_PROGRESS";

export interface IonOrderError {
  code?: string;
  message?: string;
}

export interface IonOrderAttribute {
  name: string;
  value: string;
}

export interface IonOrderAddOn {
  id?: string;
  addOnId?: string;
  planId?: string;
  action?: string;
  quantity?: number;
}

export interface IonOrderItem {
  name?: string;
  referenceId?: string;
  action?: string;
  resourceId?: string;
  productId?: string;
  skuId?: string;
  planId?: string;
  quantity?: number;
  providerName?: string;
  price?: number;
  endCustomerPO?: string;
  resellerPO?: string;
  addOns?: IonOrderAddOn[];
  attributes?: IonOrderAttribute[];
  catalogAttributes?: IonOrderAttribute[];
  cartItemId?: string;
  status?: string;
  errors?: IonOrderError[];
  additionalInformation?: string;
}

export interface IonProvisioningInfo {
  status?: string;
  message?: string;
}

export interface IonOrder {
  name?: string;
  accountId?: string;
  customerId?: string;
  orderId?: string;
  referenceId?: string;
  displayName?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  status?: IonOrderStatus | string;
  currencyCode?: string;
  total?: number;
  cartId?: string;
  errors?: IonOrderError[];
  orderItems?: IonOrderItem[];
  provisioningInfo?: IonProvisioningInfo;
  createTime?: string;
  updateTime?: string;
}

export interface IonOrdersResponse {
  ok: boolean;
  orgId?: string;
  count?: number;
  data?: {
    orders: IonOrder[];
    nextPageToken?: string | null;
  };
  error?: string;
}

export interface IonOrderDetailResponse {
  ok: boolean;
  orgId?: string;
  order?: IonOrder;
  error?: string;
}

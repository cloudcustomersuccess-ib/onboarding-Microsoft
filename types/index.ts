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

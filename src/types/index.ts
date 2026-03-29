/**
 * Aksel Temizlik - Nihai Tip Tanımlamaları ve Şema Modelleri (Faz 2)
 */

export type UserRole = "ADMIN" | "CLEANER" | "CUSTOMER";

export type BookingStatus = 
  | "DRAFT" 
  | "SUBMITTED" 
  | "PENDING_REVIEW" 
  | "AWAITING_ASSIGNMENT" 
  | "ASSIGNED" 
  | "CONFIRMED" 
  | "IN_PROGRESS" 
  | "COMPLETED" 
  | "CANCELED" 
  | "RESCHEDULED";

export type ApplicationStatus = 
  | "SUBMITTED" 
  | "UNDER_REVIEW" 
  | "DOCUMENT_APPROVED" 
  | "INTERVIEW_PENDING" 
  | "APPROVED" 
  | "REJECTED";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  createdAt: Date;
}

export interface CleanerProfile {
  id: string;
  userId: string;
  tcknEncrypted: string;
  districts: string[]; // İstanbul ilçeleri
  services: string[];  // Hangi kategorilerde hizmet verebilir?
  rating: number;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  availabilityConfig: any; // JSON Config for weekly schedule
}

export interface CleanerApplication {
  id: string;
  fullName: string;
  tcknEncrypted: string;
  phone: string;
  email: string;
  districts: string[];
  serviceIds: string[];
  documentUrl: string; // Private S3 Path
  status: ApplicationStatus;
  adminNotes?: string;
  createdAt: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  cleanerId?: string; // Nullable until assigned
  status: BookingStatus;
  serviceId: string;
  districtId: string;
  address: string;
  notes?: string;
  appointmentStart: Date;
  appointmentEnd: Date;
  isOverride: boolean; // Admin müdahalesi var mı?
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  actorId: string; // Admin or User who performed the action
  action: string;  // e.g., "VIEW_TCKN", "ASSIGN_CLEANER"
  targetId?: string; // Resource ID
  payload?: any;   // Custom metadata (IP, changes, etc.)
  timestamp: Date;
}

import { apiClient } from './client';

// ===== TYPES =====

export interface Feature {
  id?: number;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
}

export interface PlanPricing {
  id?: number;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'SEMI_YEARLY' | 'YEARLY';
  price: number;
  currency: string;
}

export interface Plan {
  id?: number;
  name: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  features: Feature[];
  pricings: PlanPricing[];
}

export interface Subscription {
  id: number;
  plan: Plan;
  billingCycle: string;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'REJECTED';
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

export interface PaymentRequest {
  id: number;
  user: { firstName: string; lastName: string; userName: string };
  subscription: Subscription;
  amount: number;
  currency: string;
  receiptUrl: string;
  notes: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ===== ADMIN: FEATURES =====

export async function getFeatures(): Promise<Feature[]> {
  const response = await apiClient.get<Feature[]>('/admin/subscription/features');
  return response.data;
}

export async function createFeature(feature: Omit<Feature, 'id'>): Promise<Feature> {
  const response = await apiClient.post<Feature>('/admin/subscription/features', feature);
  return response.data;
}

export async function updateFeature(id: number, feature: Feature): Promise<Feature> {
  const response = await apiClient.put<Feature>(`/admin/subscription/features/${id}`, feature);
  return response.data;
}

export async function deleteFeature(id: number): Promise<void> {
  await apiClient.delete(`/admin/subscription/features/${id}`);
}

// ===== ADMIN: PLANS =====

export async function getAdminPlans(): Promise<Plan[]> {
  const response = await apiClient.get<Plan[]>('/admin/subscription/plans');
  return response.data;
}

export async function createPlan(plan: Partial<Plan>): Promise<Plan> {
  const response = await apiClient.post<Plan>('/admin/subscription/plans', plan);
  return response.data;
}

export async function updatePlan(id: number, plan: Partial<Plan>): Promise<Plan> {
  const response = await apiClient.put<Plan>(`/admin/subscription/plans/${id}`, plan);
  return response.data;
}

// ===== ADMIN: PLAN PRICING =====

export async function getPlanPricings(planId: number): Promise<PlanPricing[]> {
  const response = await apiClient.get<PlanPricing[]>(`/admin/subscription/plans/${planId}/pricing`);
  return response.data;
}

export async function setPlanPricing(planId: number, pricing: Omit<PlanPricing, 'id'>): Promise<PlanPricing> {
  const response = await apiClient.post<PlanPricing>(`/admin/subscription/plans/${planId}/pricing`, pricing);
  return response.data;
}

export async function getPlanPricingById(pricingId: number): Promise<PlanPricing> {
  const response = await apiClient.get<PlanPricing>(`/admin/subscription/pricing/${pricingId}`);
  return response.data;
}

export async function updatePlanPricing(pricingId: number, pricing: Partial<PlanPricing>): Promise<PlanPricing> {
  const response = await apiClient.put<PlanPricing>(`/admin/subscription/pricing/${pricingId}`, pricing);
  return response.data;
}

export async function deletePlanPricing(pricingId: number): Promise<void> {
  await apiClient.delete(`/admin/subscription/pricing/${pricingId}`);
}

// ===== ADMIN: PAYMENTS =====

export async function getAllPayments(page = 0, size = 20): Promise<PageResponse<PaymentRequest>> {
  const response = await apiClient.get<PageResponse<PaymentRequest>>('/admin/subscription/payments', { params: { page, size } });
  return response.data;
}

export async function getPendingPayments(page = 0, size = 20): Promise<PageResponse<PaymentRequest>> {
  const response = await apiClient.get<PageResponse<PaymentRequest>>('/admin/subscription/payments/pending', { params: { page, size } });
  return response.data;
}

export async function approvePayment(id: number, notes?: string): Promise<PaymentRequest> {
  const response = await apiClient.post<PaymentRequest>(`/admin/subscription/payments/${id}/approve`, { notes });
  return response.data;
}

export async function rejectPayment(id: number, notes?: string): Promise<PaymentRequest> {
  const response = await apiClient.post<PaymentRequest>(`/admin/subscription/payments/${id}/reject`, { notes });
  return response.data;
}

// ===== USER: PLANS =====

export async function getActivePlans(): Promise<Plan[]> {
  const response = await apiClient.get<Plan[]>('/subscription/plans');
  return response.data;
}

export async function getPlanDetails(id: number): Promise<Plan> {
  const response = await apiClient.get<Plan>(`/subscription/plans/${id}`);
  return response.data;
}

// ===== USER: SUBSCRIPTION =====

export async function getMySubscription(): Promise<Subscription | null> {
  try {
    const response = await apiClient.get<Subscription>('/subscription/my');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 204) return null;
    throw error;
  }
}

export async function getMySubscriptionHistory(): Promise<Subscription[]> {
  const response = await apiClient.get<Subscription[]>('/subscription/my/history');
  return response.data;
}

export async function subscribe(planId: number, billingCycle: string, receiptUrl: string, notes?: string): Promise<Subscription> {
  const response = await apiClient.post<Subscription>('/subscription/subscribe', {
    planId,
    billingCycle,
    receiptUrl,
    notes,
  });
  return response.data;
}

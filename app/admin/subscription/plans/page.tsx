'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import Modal from '@/components/ui/Modal';
import {
  getAdminPlans, createPlan, updatePlan, getFeatures, setPlanPricing,
  updatePlanPricing, deletePlanPricing,
  Plan, Feature, PlanPricing
} from '@/lib/api/subscription';

const BILLING_CYCLES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'SEMI_YEARLY', label: 'Semi-Yearly' },
  { value: 'YEARLY', label: 'Yearly' },
];

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [selectedPlanForPricing, setSelectedPlanForPricing] = useState<Plan | null>(null);
  const [editingPricing, setEditingPricing] = useState<PlanPricing | null>(null);
  const [deletingPricing, setDeletingPricing] = useState<PlanPricing | null>(null);
  const [planForm, setPlanForm] = useState({ name: '', description: '', isActive: true, sortOrder: 0, featureIds: [] as number[] });
  const [pricingForm, setPricingForm] = useState({ billingCycle: 'MONTHLY', price: '', currency: 'ETB' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (status === 'authenticated' && session) {
      if (session.accessToken) localStorage.setItem('token', session.accessToken);
      if (session.user?.pid) localStorage.setItem('pid', session.user.pid);
      loadData();
    }
  }, [status, session]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [plansData, featuresData] = await Promise.all([getAdminPlans(), getFeatures()]);
      setPlans(plansData);
      setFeatures(featuresData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = async () => {
    try {
      const payload = {
        name: planForm.name,
        description: planForm.description,
        isActive: planForm.isActive,
        sortOrder: planForm.sortOrder,
        features: features.filter(f => planForm.featureIds.includes(f.id!)),
      };
      if (editingPlan?.id) {
        await updatePlan(editingPlan.id, payload);
      } else {
        await createPlan(payload);
      }
      setShowPlanModal(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to save plan');
    }
  };

  const handleSavePricing = async () => {
    if (!selectedPlanForPricing?.id) return;
    try {
      setError('');
      const pricingData = {
        billingCycle: pricingForm.billingCycle as any,
        price: parseFloat(pricingForm.price),
        currency: pricingForm.currency,
      };
      
      if (editingPricing?.id) {
        // Update existing pricing
        await updatePlanPricing(editingPricing.id, pricingData);
        setSuccessMessage('Pricing updated successfully!');
      } else {
        // Create new pricing
        await setPlanPricing(selectedPlanForPricing.id, pricingData);
        setSuccessMessage('Pricing added successfully!');
      }
      
      setShowPricingModal(false);
      setEditingPricing(null);
      loadData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save pricing');
    }
  };

  const handleDeletePricing = async () => {
    if (!deletingPricing?.id) return;
    try {
      setError('');
      await deletePlanPricing(deletingPricing.id);
      setShowDeleteConfirm(false);
      setDeletingPricing(null);
      setSuccessMessage('Pricing deleted successfully!');
      loadData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete pricing');
      setShowDeleteConfirm(false);
      setDeletingPricing(null);
    }
  };

  const openEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      description: plan.description,
      isActive: plan.isActive,
      sortOrder: plan.sortOrder,
      featureIds: plan.features?.map(f => f.id!) || [],
    });
    setShowPlanModal(true);
  };

  const openPricing = (plan: Plan) => {
    setSelectedPlanForPricing(plan);
    setEditingPricing(null);
    setPricingForm({ billingCycle: 'MONTHLY', price: '', currency: 'ETB' });
    setShowPricingModal(true);
  };

  const openEditPricing = (plan: Plan, pricing: PlanPricing) => {
    setSelectedPlanForPricing(plan);
    setEditingPricing(pricing);
    setPricingForm({
      billingCycle: pricing.billingCycle,
      price: pricing.price.toString(),
      currency: pricing.currency,
    });
    setShowPricingModal(true);
  };

  const openDeletePricing = (pricing: PlanPricing) => {
    setDeletingPricing(pricing);
    setShowDeleteConfirm(true);
  };

  if (status === 'loading' || isLoading) {
    return (<><Header /><Container><div className="flex justify-center items-center min-h-[400px]"><Loading size="lg" /></div></Container></>);
  }

  return (
    <>
      <Header />
      <Container>
        <div className="max-w-5xl mx-auto py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Manage Plans</h1>
              <p className="text-text-secondary">Create plans, assign features, and set pricing</p>
            </div>
            <Button variant="primary" onClick={() => { setEditingPlan(null); setPlanForm({ name: '', description: '', isActive: true, sortOrder: 0, featureIds: [] }); setShowPlanModal(true); }}>
              Add Plan
            </Button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-6">{error}</div>}
          {successMessage && <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm mb-6">{successMessage}</div>}

          <div className="space-y-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-semibold text-text-primary">{plan.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{plan.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openPricing(plan)}>Add Pricing</Button>
                    <Button variant="outline" size="sm" onClick={() => openEditPlan(plan)}>Edit</Button>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-text-secondary mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.features?.map(f => (
                      <span key={f.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{f.name}</span>
                    ))}
                    {(!plan.features || plan.features.length === 0) && <span className="text-xs text-gray-400">No features assigned</span>}
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-2">Pricing:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {plan.pricings?.map(p => (
                      <div key={p.id} className="bg-gray-50 rounded-lg p-3 border hover:shadow-sm transition-shadow">
                        <div className="text-center mb-2">
                          <p className="text-xs text-text-secondary">{p.billingCycle.replace('_', ' ')}</p>
                          <p className="text-lg font-bold text-text-primary">{p.price} {p.currency}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditPricing(plan, p)}
                            className="flex-1 text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeletePricing(p)}
                            className="flex-1 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(!plan.pricings || plan.pricings.length === 0) && (
                      <span className="text-xs text-gray-400 col-span-full">No pricing set</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            {plans.length === 0 && <div className="text-center py-12 text-text-secondary">No plans yet.</div>}
          </div>
        </div>

        {/* Plan Modal */}
        <Modal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} title={editingPlan ? 'Edit Plan' : 'Add Plan'}>
          <div className="space-y-4">
            <Input label="Plan Name" value={planForm.name} onChange={(e) => setPlanForm(prev => ({ ...prev, name: e.target.value }))} required />
            <Input label="Description" value={planForm.description} onChange={(e) => setPlanForm(prev => ({ ...prev, description: e.target.value }))} />
            <Input label="Sort Order" type="number" value={String(planForm.sortOrder)} onChange={(e) => setPlanForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))} />
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={planForm.isActive} onChange={(e) => setPlanForm(prev => ({ ...prev, isActive: e.target.checked }))} className="rounded" />
              <span className="text-sm">Active</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Features</label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                {features.filter(f => f.isActive).map(f => (
                  <label key={f.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={planForm.featureIds.includes(f.id!)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPlanForm(prev => ({ ...prev, featureIds: [...prev.featureIds, f.id!] }));
                        } else {
                          setPlanForm(prev => ({ ...prev, featureIds: prev.featureIds.filter(id => id !== f.id) }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{f.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <Button variant="ghost" onClick={() => setShowPlanModal(false)} className="flex-1">Cancel</Button>
              <Button variant="primary" onClick={handleSavePlan} className="flex-1">{editingPlan ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </Modal>

        {/* Pricing Modal */}
        <Modal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} title={`${editingPricing ? 'Edit' : 'Add'} Pricing: ${selectedPlanForPricing?.name}`}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Billing Cycle</label>
              <select
                value={pricingForm.billingCycle}
                onChange={(e) => setPricingForm(prev => ({ ...prev, billingCycle: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
              >
                {BILLING_CYCLES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <Input label="Price" type="number" value={pricingForm.price} onChange={(e) => setPricingForm(prev => ({ ...prev, price: e.target.value }))} placeholder="0.00" required />
            <Input label="Currency" value={pricingForm.currency} onChange={(e) => setPricingForm(prev => ({ ...prev, currency: e.target.value }))} />
            <div className="flex space-x-3 pt-4">
              <Button variant="ghost" onClick={() => setShowPricingModal(false)} className="flex-1">Cancel</Button>
              <Button variant="primary" onClick={handleSavePricing} className="flex-1">{editingPricing ? 'Update' : 'Save'} Pricing</Button>
            </div>
          </div>
        </Modal>

        {/* Delete Pricing Confirmation Modal */}
        <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Pricing">
          <div className="space-y-4">
            <p className="text-text-secondary">
              Are you sure you want to delete the {deletingPricing?.billingCycle.replace('_', ' ').toLowerCase()} pricing 
              of {deletingPricing?.price} {deletingPricing?.currency}?
            </p>
            <p className="text-sm text-red-600">
              This action cannot be undone. If there are active subscriptions using this pricing, the deletion will be prevented.
            </p>
            <div className="flex space-x-3 pt-4">
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} className="flex-1">Cancel</Button>
              <Button variant="danger" onClick={handleDeletePricing} className="flex-1">Delete</Button>
            </div>
          </div>
        </Modal>
      </Container>
    </>
  );
}

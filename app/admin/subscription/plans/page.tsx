'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import {
  getAdminPlans, createPlan, updatePlan, getFeatures,
  getPlanPricings, setPlanPricing, deletePlanPricing,
  Plan, Feature, PlanPricing
} from '@/lib/api/subscription';

export default function AdminPlansPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Plan form
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState({ name: '', description: '', isActive: true, sortOrder: 0, featureIds: [] as number[] });

  // Pricing management
  const [pricingPlanId, setPricingPlanId] = useState<number | null>(null);
  const [pricings, setPricings] = useState<PlanPricing[]>([]);
  const [pricingForm, setPricingForm] = useState({ billingCycle: 'MONTHLY' as string, price: '', currency: 'ETB' });

  useEffect(() => {
    if (status === 'authenticated' && session) {
      if (session.accessToken) localStorage.setItem('token', session.accessToken);
      if (session.user?.pid) localStorage.setItem('pid', session.user.pid);
      loadData();
    }
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, session]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, featuresData] = await Promise.all([getAdminPlans(), getFeatures()]);
      setPlans(plansData);
      setFeatures(featuresData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name) return;
    try {
      setSaving(true);
      const planData = {
        name: form.name,
        description: form.description,
        isActive: form.isActive,
        sortOrder: form.sortOrder,
        features: form.featureIds.map(id => ({ id } as Feature)),
      };
      if (editing) {
        await updatePlan(editing.id!, planData);
      } else {
        await createPlan(planData);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', isActive: true, sortOrder: 0, featureIds: [] });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setEditing(plan);
    setForm({
      name: plan.name,
      description: plan.description || '',
      isActive: plan.isActive,
      sortOrder: plan.sortOrder || 0,
      featureIds: plan.features?.map(f => f.id!) || [],
    });
    setShowForm(true);
  };

  const handleManagePricing = async (planId: number) => {
    setPricingPlanId(planId);
    try {
      const data = await getPlanPricings(planId);
      setPricings(data);
    } catch (err) {
      console.error('Failed to load pricings:', err);
    }
  };

  const handleAddPricing = async () => {
    if (!pricingPlanId || !pricingForm.price) return;
    try {
      await setPlanPricing(pricingPlanId, {
        billingCycle: pricingForm.billingCycle as PlanPricing['billingCycle'],
        price: parseFloat(pricingForm.price),
        currency: pricingForm.currency,
      });
      const data = await getPlanPricings(pricingPlanId);
      setPricings(data);
      setPricingForm({ billingCycle: 'MONTHLY', price: '', currency: 'ETB' });
    } catch (err: any) {
      alert(err.message || 'Failed to set pricing');
    }
  };

  const handleDeletePricing = async (pricingId: number) => {
    if (!pricingPlanId || !confirm('Delete this pricing?')) return;
    try {
      await deletePlanPricing(pricingId);
      const data = await getPlanPricings(pricingPlanId);
      setPricings(data);
    } catch (err: any) {
      alert(err.message || 'Failed to delete pricing');
    }
  };

  const formatBillingCycle = (cycle: string) => {
    return cycle.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <Container>
          <div className="flex justify-center items-center min-h-[400px]">
            <Loading size="lg" />
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <div className="py-8 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <button onClick={() => router.push('/admin-dashboard')} className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Admin
              </button>
              <h1 className="text-2xl font-bold text-text-primary">Manage Plans</h1>
            </div>
            <button
              onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', isActive: true, sortOrder: 0, featureIds: [] }); }}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Plan
            </button>
          </div>

          {/* Plan Form */}
          {showForm && (
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit' : 'New'} Plan</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Basic, Standard, Premium" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                    <input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Plan description" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  {features.length === 0 ? (
                    <p className="text-sm text-gray-500">No features available. Create features first.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {features.filter(f => f.isActive).map(f => (
                        <label key={f.id} className="flex items-center gap-2 text-sm p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={form.featureIds.includes(f.id!)}
                            onChange={e => {
                              if (e.target.checked) setForm({...form, featureIds: [...form.featureIds, f.id!]});
                              else setForm({...form, featureIds: form.featureIds.filter(id => id !== f.id!)});
                            }}
                            className="rounded"
                          />
                          {f.name}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="rounded" />
                  Active (visible to users)
                </label>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleSubmit} disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </Card>
          )}

          {/* Pricing Management */}
          {pricingPlanId && (
            <Card className="p-6 mb-6 border-blue-200 bg-blue-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-blue-900">Pricing — {plans.find(p => p.id === pricingPlanId)?.name}</h2>
                <button onClick={() => setPricingPlanId(null)} className="text-gray-500 hover:text-gray-700 text-xl leading-none">&times;</button>
              </div>

              {/* Add pricing form */}
              <div className="flex flex-wrap gap-3 mb-4">
                <select
                  value={pricingForm.billingCycle}
                  onChange={e => setPricingForm({...pricingForm, billingCycle: e.target.value})}
                  className="border border-gray-300 rounded-lg p-2 text-sm"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="SEMI_YEARLY">Semi-Yearly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
                <input
                  type="number"
                  value={pricingForm.price}
                  onChange={e => setPricingForm({...pricingForm, price: e.target.value})}
                  placeholder="Price (ETB)"
                  className="border border-gray-300 rounded-lg p-2 w-32 text-sm"
                />
                <button onClick={handleAddPricing} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition-colors">
                  Add Pricing
                </button>
              </div>

              {/* Existing pricings */}
              {pricings.length === 0 ? (
                <p className="text-sm text-gray-500">No pricing set yet.</p>
              ) : (
                <div className="space-y-2">
                  {pricings.map(p => (
                    <div key={p.id} className="flex justify-between items-center bg-white p-3 rounded-lg border">
                      <span className="text-sm font-medium">{formatBillingCycle(p.billingCycle)} — <span className="text-primary-600">{p.price} {p.currency}</span></span>
                      <button onClick={() => handleDeletePricing(p.id!)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Plans List */}
          {plans.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              No plans yet. Click &quot;Add Plan&quot; to create one.
            </Card>
          ) : (
            <div className="space-y-4">
              {plans.map(plan => (
                <Card key={plan.id} className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{plan.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{plan.description}</p>
                      {plan.features && plan.features.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {plan.features.map(f => (
                            <span key={f.id} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{f.name}</span>
                          ))}
                        </div>
                      )}
                      {plan.pricings && plan.pricings.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {plan.pricings.map(p => (
                            <span key={p.id} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {formatBillingCycle(p.billingCycle)}: {p.price} {p.currency}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 ml-4">
                      <button onClick={() => handleManagePricing(plan.id!)} className="text-purple-600 hover:text-purple-800 text-sm font-medium">Pricing</button>
                      <button onClick={() => handleEditPlan(plan)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}

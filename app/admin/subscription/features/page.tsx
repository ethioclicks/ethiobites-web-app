'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import { getFeatures, createFeature, updateFeature, deleteFeature, Feature } from '@/lib/api/subscription';

export default function AdminFeaturesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Feature | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', code: '', isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      if (session.accessToken) localStorage.setItem('token', session.accessToken);
      if (session.user?.pid) localStorage.setItem('pid', session.user.pid);
      loadFeatures();
    }
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, session]);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const data = await getFeatures();
      setFeatures(data);
    } catch (err) {
      console.error('Failed to load features:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.code) return;
    try {
      setSaving(true);
      if (editing) {
        await updateFeature(editing.id!, { ...form, id: editing.id });
      } else {
        await createFeature(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', code: '', isActive: true });
      await loadFeatures();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (feature: Feature) => {
    setEditing(feature);
    setForm({ name: feature.name, description: feature.description, code: feature.code, isActive: feature.isActive });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;
    try {
      await deleteFeature(id);
      await loadFeatures();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
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
        <div className="py-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <button onClick={() => router.push('/admin-dashboard')} className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Admin
              </button>
              <h1 className="text-2xl font-bold text-text-primary">Manage Features</h1>
            </div>
            <button
              onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', code: '', isActive: true }); }}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Feature
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit' : 'New'} Feature</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="e.g. Unlimited Orders"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    value={form.code}
                    onChange={e => setForm({...form, code: e.target.value.toUpperCase().replace(/\s/g, '_')})}
                    placeholder="e.g. UNLIMITED_ORDERS"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    placeholder="Brief description of this feature"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => setForm({...form, isActive: e.target.checked})}
                      className="rounded"
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleSubmit} disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </Card>
          )}

          {/* Features List */}
          {features.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              No features yet. Click &quot;Add Feature&quot; to create one.
            </Card>
          ) : (
            <div className="space-y-3">
              {features.map(feature => (
                <Card key={feature.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-text-primary">{feature.name}</p>
                        <span className={`px-2 py-0.5 rounded text-xs ${feature.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {feature.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{feature.code} — {feature.description}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(feature)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                      <button onClick={() => handleDelete(feature.id!)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
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

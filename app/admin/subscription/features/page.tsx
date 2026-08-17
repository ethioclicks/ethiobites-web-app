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
import { getFeatures, createFeature, updateFeature, deleteFeature, Feature } from '@/lib/api/subscription';

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', code: '', isActive: true });
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (status === 'authenticated' && session) {
      if (session.accessToken) localStorage.setItem('token', session.accessToken);
      if (session.user?.pid) localStorage.setItem('pid', session.user.pid);
      loadFeatures();
    }
  }, [status, session]);

  const loadFeatures = async () => {
    try {
      setIsLoading(true);
      const data = await getFeatures();
      setFeatures(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load features');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingFeature?.id) {
        await updateFeature(editingFeature.id, { ...formData, id: editingFeature.id });
      } else {
        await createFeature(formData);
      }
      setShowModal(false);
      setEditingFeature(null);
      setFormData({ name: '', description: '', code: '', isActive: true });
      loadFeatures();
    } catch (err: any) {
      setError(err.message || 'Failed to save feature');
    }
  };

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setFormData({ name: feature.name, description: feature.description, code: feature.code, isActive: feature.isActive });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;
    try {
      await deleteFeature(id);
      loadFeatures();
    } catch (err: any) {
      setError(err.message || 'Failed to delete feature');
    }
  };

  if (status === 'loading' || isLoading) {
    return (<><Header /><Container><div className="flex justify-center items-center min-h-[400px]"><Loading size="lg" /></div></Container></>);
  }

  return (
    <>
      <Header />
      <Container>
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Manage Features</h1>
              <p className="text-text-secondary">Create and manage subscription features</p>
            </div>
            <Button variant="primary" onClick={() => { setEditingFeature(null); setFormData({ name: '', description: '', code: '', isActive: true }); setShowModal(true); }}>
              Add Feature
            </Button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-6">{error}</div>}

          <div className="space-y-4">
            {features.map((feature) => (
              <Card key={feature.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-text-primary">{feature.name}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">{feature.code}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${feature.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {feature.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{feature.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(feature)}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(feature.id!)}>Delete</Button>
                  </div>
                </div>
              </Card>
            ))}
            {features.length === 0 && (
              <div className="text-center py-12 text-text-secondary">No features yet. Add your first feature.</div>
            )}
          </div>
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingFeature ? 'Edit Feature' : 'Add Feature'}>
          <div className="space-y-4">
            <Input label="Name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
            <Input label="Code" value={formData.code} onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase().replace(/\s/g, '_') }))} placeholder="e.g. ONLINE_ORDERING" required />
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
                rows={3}
                placeholder="Describe this feature..."
              />
            </div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="rounded" />
              <span className="text-sm">Active</span>
            </label>
            <div className="flex space-x-3 pt-4">
              <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} className="flex-1">{editingFeature ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </Modal>
      </Container>
    </>
  );
}

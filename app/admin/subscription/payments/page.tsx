'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import { getAllPayments, approvePayment, rejectPayment, deletePayment, PaymentRequest } from '@/lib/api/subscription';

export default function AdminPaymentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      if (session.accessToken) localStorage.setItem('token', session.accessToken);
      if (session.user?.pid) localStorage.setItem('pid', session.user.pid);
      loadPayments();
    }
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, session]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await getAllPayments(0, 50);
      setPayments(data.content);
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setProcessing(id);
      await approvePayment(id);
      await loadPayments();
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: number) => {
    const notes = prompt('Rejection reason (optional):');
    try {
      setProcessing(id);
      await rejectPayment(id, notes || undefined);
      await loadPayments();
    } catch (err: any) {
      alert(err.message || 'Rejection failed');
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this payment request? This cannot be undone.')) return;
    try {
      await deletePayment(id);
      await loadPayments();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
          <div className="mb-6">
            <button onClick={() => router.push('/admin-dashboard')} className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Admin
            </button>
            <h1 className="text-2xl font-bold text-text-primary">Payment Approvals</h1>
            <p className="text-text-secondary mt-1">Review and approve restaurant subscription payments</p>
          </div>

          {payments.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              No payment requests found.
            </Card>
          ) : (
            <div className="space-y-4">
              {payments.map(payment => (
                <Card key={payment.id} className="p-5">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          payment.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>{payment.status}</span>
                        <span className="text-sm text-gray-500">{formatDate(payment.createdAt)}</span>
                      </div>

                      <p className="font-medium text-text-primary">
                        {payment.user.firstName} {payment.user.lastName}
                        <span className="text-gray-400 font-normal ml-1">@{payment.user.userName}</span>
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Restaurant:</span> {payment.subscription.restaurant.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Plan:</span> {payment.subscription.plan.name} ({formatBillingCycle(payment.subscription.billingCycle)})
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Amount:</span> <span className="text-primary-600 font-semibold">{payment.amount} {payment.currency}</span>
                      </p>

                      {payment.notes && (
                        <p className="text-sm text-gray-500 italic mt-2">Note: {payment.notes}</p>
                      )}
                      {payment.adminNotes && (
                        <p className="text-sm text-blue-600 mt-1">Admin: {payment.adminNotes}</p>
                      )}

                      {payment.receiptUrl && (
                        <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                          View Receipt →
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {payment.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(payment.id)}
                            disabled={processing === payment.id}
                            className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                          >
                            {processing === payment.id ? '...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(payment.id)}
                            disabled={processing === payment.id}
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import Modal from '@/components/ui/Modal';
import { getAllPayments, approvePayment, rejectPayment, deletePayment, PaymentRequest, PageResponse } from '@/lib/api/subscription';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<PaymentRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending'>('pending');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (status === 'authenticated' && session) {
      if (session.accessToken) localStorage.setItem('token', session.accessToken);
      if (session.user?.pid) localStorage.setItem('pid', session.user.pid);
      loadPayments();
    }
  }, [status, session, currentPage, filter]);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const data = await getAllPayments(currentPage, 20);
      setPayments(data.content);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedPayment) return;
    try {
      await approvePayment(selectedPayment.id, adminNotes);
      setShowReviewModal(false);
      setSelectedPayment(null);
      setAdminNotes('');
      loadPayments();
    } catch (err: any) {
      setError(err.message || 'Failed to approve payment');
    }
  };

  const handleReject = async () => {
    if (!selectedPayment) return;
    try {
      await rejectPayment(selectedPayment.id, adminNotes);
      setShowReviewModal(false);
      setSelectedPayment(null);
      setAdminNotes('');
      loadPayments();
    } catch (err: any) {
      setError(err.message || 'Failed to reject payment');
    }
  };

  const handleDelete = async () => {
    if (!paymentToDelete) return;
    try {
      setIsDeleting(true);
      await deletePayment(paymentToDelete.id);
      setShowDeleteModal(false);
      setPaymentToDelete(null);
      loadPayments();
    } catch (err: any) {
      // Handle 404 specifically for missing endpoint
      if (err.response?.status === 404) {
        setError('Delete functionality not available - backend endpoint missing');
      } else {
        setError(err.message || 'Failed to delete payment');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteConfirm = (payment: PaymentRequest) => {
    setPaymentToDelete(payment);
    setShowDeleteModal(true);
  };

  const openReview = (payment: PaymentRequest) => {
    setSelectedPayment(payment);
    setAdminNotes('');
    setShowReviewModal(true);
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'APPROVED': return 'bg-green-100 text-green-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
              <h1 className="text-3xl font-bold text-text-primary">Payment Approvals</h1>
              <p className="text-text-secondary">Review and approve subscription payments</p>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-6">{error}</div>}

          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-semibold text-text-primary">
                        {payment.user?.firstName} {payment.user?.lastName}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Plan: {payment.subscription?.plan?.name} | {payment.subscription?.billingCycle?.replace('_', ' ')} | {payment.amount} {payment.currency}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted: {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">View Receipt</Button>
                    </a>
                    {payment.status === 'PENDING' && (
                      <Button variant="primary" size="sm" onClick={() => openReview(payment)}>Review</Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openDeleteConfirm(payment)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {payments.length === 0 && <div className="text-center py-12 text-text-secondary">No payments to review.</div>}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>Previous</Button>
              <span className="text-sm text-text-secondary py-2">Page {currentPage + 1} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1}>Next</Button>
            </div>
          )}
        </div>

        <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Review Payment">
          {selectedPayment && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><strong>User:</strong> {selectedPayment.user?.firstName} {selectedPayment.user?.lastName}</p>
                <p><strong>Plan:</strong> {selectedPayment.subscription?.plan?.name}</p>
                <p><strong>Cycle:</strong> {selectedPayment.subscription?.billingCycle?.replace('_', ' ')}</p>
                <p><strong>Amount:</strong> {selectedPayment.amount} {selectedPayment.currency}</p>
                {selectedPayment.notes && <p><strong>User Notes:</strong> {selectedPayment.notes}</p>}
                <a href={selectedPayment.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-sm">View Receipt Image</a>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Admin Notes (optional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary-500 outline-none resize-none"
                  rows={3}
                  placeholder="Add notes about this decision..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button variant="ghost" onClick={handleReject} className="flex-1 text-red-600 border-red-200 hover:bg-red-50">Reject</Button>
                <Button variant="primary" onClick={handleApprove} className="flex-1">Approve</Button>
              </div>
            </div>
          )}
        </Modal>

        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Payment">
          {paymentToDelete && (
            <div className="space-y-4">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Delete Payment Record</h3>
                    <p className="text-sm text-red-700 mt-1">This action cannot be undone. The payment record will be permanently deleted.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><strong>User:</strong> {paymentToDelete.user?.firstName} {paymentToDelete.user?.lastName}</p>
                <p><strong>Plan:</strong> {paymentToDelete.subscription?.plan?.name}</p>
                <p><strong>Amount:</strong> {paymentToDelete.amount} {paymentToDelete.currency}</p>
                <p><strong>Status:</strong> {paymentToDelete.status}</p>
                <p><strong>Submitted:</strong> {new Date(paymentToDelete.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleDelete}
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  loading={isDeleting}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Payment'}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </Container>
    </>
  );
}

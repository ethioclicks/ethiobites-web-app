'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Modal, { ConfirmModal } from '@/components/ui/Modal';
import Loading, { LoadingOverlay, PageSkeleton } from '@/components/ui/Loading';
import Container from '@/components/layout/Container';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ComponentsShowcase() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-surface-warm">
      <Header showAuth={false} />
      
      <Container className="py-12">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-heading font-bold gradient-text mb-4">
              Component Showcase
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Explore the design system components built with Ethiopian-inspired colors and modern web patterns.
            </p>
          </div>

          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small Button</Button>
                <Button size="md">Medium Button</Button>
                <Button size="lg">Large Button</Button>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button loading>Loading Button</Button>
                <Button disabled>Disabled Button</Button>
              </div>
            </CardContent>
          </Card>

          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Form Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                label="Default Input"
                placeholder="Enter some text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              
              <Input 
                label="Required Input"
                placeholder="This field is required"
                required
                helperText="This is helper text"
              />
              
              <Input 
                label="Input with Error"
                placeholder="This has an error"
                error="This field is required"
              />
              
              <Input 
                label="Disabled Input"
                placeholder="This is disabled"
                disabled
                value="Disabled value"
              />
              
              <Input 
                label="Filled Variant"
                placeholder="Filled input style"
                variant="filled"
              />
            </CardContent>
          </Card>

          {/* Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Card Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Default Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary">Default card with subtle shadow.</p>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Elevated Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary">Elevated card with hover effects.</p>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle>Outlined Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary">Card with prominent border.</p>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>Glass Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary">Glassmorphism effect card.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Loading States */}
          <Card>
            <CardHeader>
              <CardTitle>Loading Indicators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <h4 className="font-medium mb-4">Spinner</h4>
                  <Loading variant="spinner" size="lg" />
                </div>
                <div>
                  <h4 className="font-medium mb-4">Dots</h4>
                  <Loading variant="dots" size="lg" />
                </div>
                <div>
                  <h4 className="font-medium mb-4">Pulse</h4>
                  <Loading variant="pulse" size="lg" />
                </div>
              </div>
              
              <div className="text-center">
                <Loading text="Loading with text..." />
              </div>
            </CardContent>
          </Card>

          {/* Interactive Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => setShowModal(true)}>
                  Open Modal
                </Button>
                <Button onClick={() => setShowConfirmModal(true)}>
                  Open Confirm Modal
                </Button>
                <Button onClick={() => setShowLoading(true)}>
                  Show Loading Overlay
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card>
            <CardHeader>
              <CardTitle>Ethiopian-Inspired Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Primary Colors (Berbere Red)</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {[500, 400, 300, 200, 100].map((shade) => (
                      <div key={shade} className="text-center">
                        <div 
                          className={`w-full h-16 rounded-lg mb-2 bg-primary-${shade}`}
                        />
                        <span className="text-xs text-text-secondary">{shade}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Secondary Colors (Turmeric Yellow)</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {[400, 300, 200, 100, 50].map((shade) => (
                      <div key={shade} className="text-center">
                        <div 
                          className={`w-full h-16 rounded-lg mb-2 bg-secondary-${shade}`}
                        />
                        <span className="text-xs text-text-secondary">{shade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>

      <Footer />

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Example Modal"
        description="This is an example modal with Ethiopian-inspired styling."
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            This modal demonstrates the glass effect and gradient styling that matches 
            our Ethiopian-inspired design system.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => setShowConfirmModal(false)}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action? This cannot be undone."
        confirmText="Yes, Proceed"
        cancelText="Cancel"
        variant="danger"
      />

      <LoadingOverlay 
        isLoading={showLoading} 
        text="Processing your request..." 
      />
      
      {showLoading && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button variant="danger" onClick={() => setShowLoading(false)}>
            Hide Loading
          </Button>
        </div>
      )}
    </div>
  );
}
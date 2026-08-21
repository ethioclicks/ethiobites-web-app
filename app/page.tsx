import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-warm via-white to-secondary-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 gradient-primary rounded-full blur-2xl"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-secondary-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-accent-green rounded-full blur-2xl"></div>
        </div>

        <Container>
          <div className="relative py-24 text-center">
            {/* Logo/Brand */}
            <h1 className="text-5xl font-heading font-bold gradient-text mb-6">
              EthioBites
            </h1>
            
            {/* Tagline */}
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto text-balance">
              Your Gateway to Ethiopian Excellence - Connect, Discover, and Grow with Ethiopia's Premier Business Platform
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/auth/register" className="button-primary min-w-[200px] text-center">
                Create Account
              </Link>
              <Link href="/auth/login" className="button-secondary min-w-[200px] text-center">
                Sign In
              </Link>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="card-hover text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                <p className="text-text-secondary">Build meaningful relationships with Ethiopian businesses and professionals worldwide.</p>
              </div>

              <div className="card-hover text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary-400 to-accent-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Discover</h3>
                <p className="text-text-secondary">Explore opportunities, services, and products that celebrate Ethiopian excellence.</p>
              </div>

              <div className="card-hover text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent-green to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Grow</h3>
                <p className="text-text-secondary">Expand your reach and grow your business with our comprehensive platform tools.</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Footer />
    </div>
  );
}
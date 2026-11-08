import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'About Us | EthioBite',
  description:
    'Learn about EthioBite — the platform built to digitise and grow Ethiopian restaurants worldwide through smart tools, QR menus, and seamless ordering.',
};

// ─── Data ────────────────────────────────────────────────────────────────────

const stats = [
  { value: '500+', label: 'Restaurants' },
  { value: '50K+', label: 'Menu Scans' },
  { value: '15+', label: 'Countries' },
  { value: '99%', label: 'Uptime' },
];

const values = [
  {
    gradient: 'from-primary-500 to-primary-700',
    title: 'Trust',
    description:
      'We build reliable tools that restaurant owners can depend on every day — from QR menus to real-time orders.',
    icon: (
      <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    gradient: 'from-accent-orange to-yellow-500',
    title: 'Innovation',
    description:
      'We bring modern technology to traditional Ethiopian hospitality, making digital menus and ordering accessible for every restaurant.',
    icon: (
      <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    gradient: 'from-accent-green to-green-600',
    title: 'Community',
    description:
      'EthioBite is built for and by Ethiopians. Every feature supports the growth of local and diaspora restaurant businesses.',
    icon: (
      <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    gradient: 'from-secondary-400 to-secondary-600',
    title: 'Excellence',
    description:
      'We celebrate the richness of Ethiopian cuisine and culture by giving it the world-class digital presence it deserves.',
    icon: (
      <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
  },
];

const regions = [
  { flag: '🇪🇹', country: 'Ethiopia', cities: 'Addis Ababa, Dire Dawa, Bahir Dar' },
  { flag: '🇺🇸', country: 'United States', cities: 'Washington D.C., Minneapolis, Los Angeles' },
  { flag: '🇬🇧', country: 'United Kingdom', cities: 'London, Manchester, Birmingham' },
  { flag: '🇸🇦', country: 'Saudi Arabia', cities: 'Riyadh, Jeddah, Dammam' },
  { flag: '🇦🇪', country: 'UAE', cities: 'Dubai, Abu Dhabi' },
  { flag: '🇨🇦', country: 'Canada', cities: 'Toronto, Ottawa, Calgary' },
  { flag: '🇸🇪', country: 'Sweden', cities: 'Stockholm, Gothenburg' },
  { flag: '🇩🇪', country: 'Germany', cities: 'Berlin, Frankfurt, Hamburg' },
];

const steps = [
  {
    number: '01',
    title: 'Create your account',
    description:
      'Sign up from anywhere in the world in under two minutes. No physical presence required — just your restaurant details and an email address.',
  },
  {
    number: '02',
    title: 'Build your digital menu',
    description:
      'Add your dishes, prices, photos, and descriptions in English and Amharic. Your menu is live the moment you save it.',
  },
  {
    number: '03',
    title: 'Print and share your QR code',
    description:
      'Download a branded QR table card from your dashboard. Place it on every table, at the counter, or share it on social media.',
  },
  {
    number: '04',
    title: 'Receive orders and grow',
    description:
      'Customers scan, browse, and order — no app download needed on their side. You manage everything from the EthioBite app on your phone.',
  },
];

const testimonials = [
  {
    name: 'Selamawit Tesfaye',
    role: 'Owner, Tsion Café',
    location: 'Washington D.C., USA 🇺🇸',
    text: 'Our customers love scanning the QR code and browsing the menu in Amharic. It feels like home for the diaspora community here — and managing it from my phone is effortless.',
    initial: 'S',
    gradient: 'from-primary-500 to-primary-700',
  },
  {
    name: 'Yonas Bekele',
    role: 'Manager, Habesha Kitchen',
    location: 'London, UK 🇬🇧',
    text: "We were using paper menus that we reprinted every week. With EthioBite we update prices in seconds. The QR card looks professional and our customers always comment on it.",
    initial: 'Y',
    gradient: 'from-accent-orange to-yellow-500',
  },
  {
    name: 'Tigist Alemu',
    role: 'Owner, Injera House',
    location: 'Stockholm, Sweden 🇸🇪',
    text: 'Setup took less than an hour. I added all our dishes with photos, generated the QR, and by dinner service our tables had the new menus. The order management feature alone saves us from so much confusion.',
    initial: 'T',
    gradient: 'from-accent-green to-green-600',
  },
  {
    name: 'Dawit Girma',
    role: 'Co-founder, Addis Taste',
    location: 'Dubai, UAE 🇦🇪',
    text: 'Running a restaurant in Dubai for Ethiopian expats means our customers expect top-tier service. EthioBite gives us a digital experience that matches that expectation, at a price that makes sense for us.',
    initial: 'D',
    gradient: 'from-secondary-400 to-secondary-600',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-warm via-white to-secondary-50">
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute left-10 top-20 h-48 w-48 rounded-full bg-primary-400 blur-3xl" />
          <div className="absolute right-16 top-32 h-56 w-56 rounded-full bg-accent-orange blur-3xl" />
          <div className="absolute bottom-16 left-1/3 h-40 w-40 rounded-full bg-accent-green blur-2xl" />
        </div>
        <Container>
          <div className="relative text-center">
            <span className="mb-4 inline-block rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-600">
              Our Story
            </span>
            <h1 className="mx-auto mb-6 max-w-3xl text-5xl font-heading font-bold gradient-text leading-tight">
              Digitising Ethiopian Hospitality — Worldwide
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-text-secondary text-balance">
              EthioBite was born from a simple belief: every Ethiopian restaurant —
              from a neighbourhood injera house in Addis Ababa to a diaspora coffee
              bar in Washington D.C. — deserves modern, affordable digital tools to
              serve their customers better.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/register" className="button-primary min-w-[180px] text-center">
                Get Started Free
              </Link>
              <Link href="/contact" className="button-secondary min-w-[180px] text-center">
                Talk to Us
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-gray-100 bg-white py-14">
        <Container>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-heading font-bold gradient-text">{s.value}</div>
                <div className="mt-1 text-sm text-text-secondary">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Mission ── */}
      <section className="py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
            <div>
              <span className="mb-3 inline-block rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-600">
                Our Mission
              </span>
              <h2 className="mb-4 text-3xl font-heading font-bold text-text-primary">
                Empowering restaurants with tools that just work
              </h2>
              <p className="mb-4 text-text-secondary">
                We set out to solve a problem we saw firsthand: Ethiopian restaurants had
                incredible food and warm service, but no easy way to show it to the world.
                Paper menus got lost, phone orders got mixed up, and there was no simple
                way for a restaurant owner to manage their menu from their phone.
              </p>
              <p className="text-text-secondary">
                EthioBite changes that. With a QR digital menu, real-time order management,
                and a customer-facing app all in one platform, restaurant owners can focus
                on cooking great food — and let us handle the rest.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { bg: 'bg-primary-50', icon_bg: 'gradient-primary', label: 'QR Digital Menus', desc: 'Live, scannable menus customers can browse instantly.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5a.5.5 0 11-1 0 .5.5 0 011 0z" /> },
                { bg: 'bg-accent-orange/10', icon_bg: 'bg-gradient-to-br from-accent-orange to-yellow-500', label: 'Order Management', desc: 'Real-time orders from table to kitchen, zero confusion.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> },
                { bg: 'bg-accent-green/10', icon_bg: 'bg-gradient-to-br from-accent-green to-green-600', label: 'Analytics', desc: 'Understand your best sellers and peak hours at a glance.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
                { bg: 'bg-secondary-50', icon_bg: 'bg-gradient-to-br from-secondary-400 to-secondary-600', label: 'Mobile App', desc: 'Manage your restaurant on the go from your smartphone.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /> },
              ].map((item) => (
                <div key={item.label} className={`card-hover flex flex-col gap-3 rounded-2xl ${item.bg} p-5`}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.icon_bg}`}>
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                  </div>
                  <div className="text-sm font-semibold text-text-primary">{item.label}</div>
                  <div className="text-xs text-text-secondary">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Values ── */}
      <section className="bg-white py-20">
        <Container>
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-600">
              What drives us
            </span>
            <h2 className="text-3xl font-heading font-bold text-text-primary">Our Values</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="card-hover flex flex-col gap-4 rounded-2xl p-6">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${v.gradient}`}>
                  {v.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary">{v.title}</h3>
                <p className="text-sm text-text-secondary">{v.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── International Reach ── */}
      <section className="py-20">
        <Container>
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-600">
              Global Presence
            </span>
            <h2 className="text-3xl font-heading font-bold text-text-primary">
              Serving Ethiopian restaurants worldwide
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              Whether your restaurant is in the heart of Addis Ababa or a thriving
              diaspora neighbourhood in Europe or North America, EthioBite works
              exactly the same — reliable, fast, and built for Ethiopian hospitality.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {regions.map((r) => (
              <div
                key={r.country}
                className="card-hover flex flex-col gap-1 rounded-2xl bg-white p-5 shadow-sm"
              >
                <span className="text-3xl">{r.flag}</span>
                <div className="mt-2 font-semibold text-text-primary">{r.country}</div>
                <div className="text-xs text-text-secondary">{r.cities}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-primary-50 p-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-heading font-bold gradient-text">15+</div>
                <div className="mt-1 text-sm font-medium text-text-primary">Countries</div>
                <div className="mt-1 text-xs text-text-secondary">Restaurants active across 4 continents</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold gradient-text">2</div>
                <div className="mt-1 text-sm font-medium text-text-primary">Languages</div>
                <div className="mt-1 text-xs text-text-secondary">Menus available in English and Amharic</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold gradient-text">24/7</div>
                <div className="mt-1 text-sm font-medium text-text-primary">Always On</div>
                <div className="mt-1 text-xs text-text-secondary">Your menu is live around the clock, every time zone</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white py-20">
        <Container>
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-600">
              Simple setup, anywhere in the world
            </span>
            <h2 className="text-3xl font-heading font-bold text-text-primary">
              How it works for international restaurant owners
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-text-secondary">
              No technical knowledge needed. No waiting for installation. Go from signup
              to your first live QR menu in under an hour — from any country.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="relative">
              {/* Connecting line — visible on md+ */}
              <div className="absolute left-9 top-0 hidden h-full w-0.5 bg-gradient-to-b from-primary-200 via-accent-orange/30 to-transparent md:block" />

              <div className="space-y-10">
                {steps.map((step, i) => (
                  <div key={step.number} className="relative flex gap-6">
                    <div className={`relative flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-heading font-bold text-white shadow-lg ${
                      i === 0 ? 'from-primary-500 to-primary-700'
                      : i === 1 ? 'from-accent-orange to-yellow-500'
                      : i === 2 ? 'from-accent-green to-green-600'
                      : 'from-secondary-400 to-secondary-600'
                    }`}>
                      {step.number}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-text-secondary">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 text-center">
            <Link href="/auth/register" className="button-primary inline-block">
              Start your free account →
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20">
        <Container>
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-600">
              From restaurant owners
            </span>
            <h2 className="text-3xl font-heading font-bold text-text-primary">
              Trusted by the global Ethiopian restaurant community
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="card-hover flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm"
              >
                {/* Quote mark */}
                <svg className="h-6 w-6 text-primary-200" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="flex-1 text-sm leading-relaxed text-text-secondary">
                  {t.text}
                </p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${t.gradient}`}>
                    {t.initial}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-text-primary">
                      {t.name}
                    </div>
                    <div className="truncate text-xs text-text-secondary">{t.role}</div>
                    <div className="truncate text-xs text-primary-500">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── App Download ── */}
      <section className="bg-white py-20">
        <Container>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1220] to-[#1b2d4f] shadow-2xl">
            <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
              <div>
                <span className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80">
                  Available now
                </span>
                <h2 className="mb-4 text-3xl font-heading font-bold text-white">
                  Manage your restaurant from your pocket
                </h2>
                <p className="mb-8 text-sm text-gray-300">
                  The EthioBite mobile app lets you update your menu, receive orders,
                  and track your restaurant in real time — from anywhere in the world.
                  Download it free for iOS and Android.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {/* App Store */}
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow transition hover:bg-gray-50"
                    aria-label="Download on the App Store"
                  >
                    <svg className="h-7 w-7 flex-shrink-0 text-gray-900" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <div>
                      <div className="text-[10px] font-medium text-gray-500">Download on the</div>
                      <div className="text-sm font-bold text-gray-900">App Store</div>
                    </div>
                  </a>

                  {/* Google Play */}
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow transition hover:bg-gray-50"
                    aria-label="Get it on Google Play"
                  >
                    <svg className="h-7 w-7 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l15 8.5-15 8.5c-.5.33-1.5.33-1.5-.5z" fill="#EA4335" />
                      <path d="M3 3.5l9.5 9.5L3 20.5V3.5z" fill="#FBBC04" />
                      <path d="M3 3.5l9.5 9.5 5-5L3 3.5z" fill="#34A853" />
                      <path d="M12.5 13L3 20.5l14.5-4-5-3.5z" fill="#4285F4" />
                    </svg>
                    <div>
                      <div className="text-[10px] font-medium text-gray-500">Get it on</div>
                      <div className="text-sm font-bold text-gray-900">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Phone mockup */}
              <div className="flex justify-center">
                <div className="relative flex h-64 w-36 items-center justify-center rounded-3xl border-4 border-white/20 bg-[#0B1220] shadow-2xl md:h-72 md:w-40">
                  <div className="absolute inset-x-0 top-0 mx-auto mt-2 h-2 w-12 rounded-full bg-white/20" />
                  <div className="flex flex-col items-center gap-2 px-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-orange to-primary-600 shadow-lg">
                      <span className="text-2xl font-heading font-bold text-white">EB</span>
                    </div>
                    <span className="text-xs font-semibold text-white">EthioBite</span>
                    <span className="text-[10px] text-gray-400">Restaurant Manager</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 mx-auto mb-2 h-4 w-12 rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl gradient-primary p-10 text-center text-white shadow-xl">
            <h2 className="mb-3 text-3xl font-heading font-bold">
              Ready to go digital?
            </h2>
            <p className="mb-8 text-primary-100">
              Join hundreds of Ethiopian restaurants already using EthioBite to serve their customers better — wherever they are in the world.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/register"
                className="rounded-full bg-white px-8 py-3 font-semibold text-primary-700 shadow transition hover:bg-primary-50"
              >
                Create Free Account
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/40 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}

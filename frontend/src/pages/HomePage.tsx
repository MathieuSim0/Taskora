import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function HomePage() {
  const { isAuthenticated } = useAuth()
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const { t } = useTranslation()

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 opacity-70"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(203 213 225 / 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        
        <div className="relative text-center py-20 md:py-28 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-teal-200 text-teal-700 rounded-full text-sm font-medium mb-8 animate-fadeIn shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('home.badge')}
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight animate-slideUp">
              {t('home.title1')}
              <br />
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent">
                {t('home.title2')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto animate-slideUp leading-relaxed" style={{ animationDelay: '100ms' }}>
              {t('home.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideUp mb-12" style={{ animationDelay: '200ms' }}>
              {isAuthenticated ? (
                <>
                  <Link to="/tasks" className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {t('home.goToTasks')}
                  </Link>
                  <Link to="/projects" className="btn btn-secondary btn-lg transform hover:-translate-y-0.5 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    {t('home.viewProjects')}
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t('home.startFree')}
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-lg transform hover:-translate-y-0.5 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {t('home.signIn')}
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-slate-600 animate-slideUp" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{t('home.trust.noCredit')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{t('home.trust.freePlan')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{t('home.trust.setup')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">10K+</div>
              <div className="text-slate-600 font-medium">{t('home.stats.users')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-cyan-600 mb-2">50K+</div>
              <div className="text-slate-600 font-medium">{t('home.stats.tasks')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-sky-600 mb-2">99.9%</div>
              <div className="text-slate-600 font-medium">{t('home.stats.uptime')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">4.9/5</div>
              <div className="text-slate-600 font-medium">{t('home.stats.rating')}</div>
            </div>
          </div>
        </div>
      </div>


      {/* Features Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card card-hover group bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('home.features.task.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.features.task.description')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card card-hover group bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('home.features.team.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.features.team.description')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card card-hover group bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('home.features.project.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.features.project.description')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card card-hover group bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('home.features.analytics.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.features.analytics.description')}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card card-hover group bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('home.features.files.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.features.files.description')}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card card-hover group bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('home.features.workflow.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.features.workflow.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line - hidden on mobile */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-teal-200 via-cyan-200 to-sky-200" style={{ top: '4rem', left: '16.666%', right: '16.666%' }}></div>

            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('home.howItWorks.step1.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.howItWorks.step1.description')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('home.howItWorks.step2.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.howItWorks.step2.description')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('home.howItWorks.step3.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('home.howItWorks.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {t('home.benefits.title')}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('home.benefits.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Benefit 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t('home.benefits.fast.title')}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {t('home.benefits.fast.description')}
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t('home.benefits.secure.title')}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {t('home.benefits.secure.description')}
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t('home.benefits.design.title')}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {t('home.benefits.design.description')}
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t('home.benefits.available.title')}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {t('home.benefits.available.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {t('home.faq.title')}
            </h2>
            <p className="text-xl text-slate-600">
              {t('home.faq.subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-900">{t('home.faq.q1.question')}</span>
                <svg
                  className={`w-5 h-5 text-slate-500 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  {t('home.faq.q1.answer')}
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-900">{t('home.faq.q2.question')}</span>
                <svg
                  className={`w-5 h-5 text-slate-500 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  {t('home.faq.q2.answer')}
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-900">{t('home.faq.q3.question')}</span>
                <svg
                  className={`w-5 h-5 text-slate-500 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  {t('home.faq.q3.answer')}
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-900">{t('home.faq.q4.question')}</span>
                <svg
                  className={`w-5 h-5 text-slate-500 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  {t('home.faq.q4.answer')}
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-900">{t('home.faq.q5.question')}</span>
                <svg
                  className={`w-5 h-5 text-slate-500 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  {t('home.faq.q5.answer')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Final CTA Section */}
      {!isAuthenticated && (
        <div className="py-20 px-4 bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-600 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }}></div>
          
          <div className="max-w-4xl mx-auto text-center text-white relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-teal-50 leading-relaxed">
              {t('home.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="btn btn-lg bg-white text-teal-700 hover:bg-gray-50 shadow-2xl hover:shadow-3xl font-semibold px-8 py-4 transform hover:-translate-y-1 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('home.cta.startAccount')}
              </Link>
              <Link to="/login" className="btn btn-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-700 font-semibold px-8 py-4 transform hover:-translate-y-1 transition-all">
                {t('home.cta.signInstead')}
              </Link>
            </div>
            <p className="mt-8 text-teal-100 text-sm">
              {t('home.cta.footer')}
            </p>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className="py-12 px-4 bg-slate-900 text-slate-400">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <svg className="w-7 h-7 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Taskora
              </h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                {t('home.footer.description')}
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">{t('home.footer.product')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-teal-400 transition-colors">{t('home.footer.features')}</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">{t('home.footer.roadmap')}</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">{t('home.footer.integrations')}</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">{t('home.footer.changelog')}</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">{t('home.footer.company')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-teal-400 transition-colors">{t('home.footer.about')}</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">{t('home.footer.blog')}</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">{t('home.footer.careers')}</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">{t('home.footer.contact')}</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              {t('home.footer.copyright')}
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-teal-400 transition-colors">{t('home.footer.privacy')}</a>
              <a href="#" className="hover:text-teal-400 transition-colors">{t('home.footer.terms')}</a>
              <a href="#" className="hover:text-teal-400 transition-colors">{t('home.footer.cookies')}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

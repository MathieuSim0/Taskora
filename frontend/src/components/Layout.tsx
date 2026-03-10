import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const { t } = useTranslation()

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'text-primary-600 border-primary-600'
      : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Modern Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-br from-teal-600 to-cyan-600 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Taskora
                </h1>
              </Link>
              
              {/* Navigation Links */}
              <div className="hidden md:ml-10 md:flex md:space-x-2">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/') === 'text-primary-600 border-primary-600'
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {t('nav.home')}
                  </span>
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      to="/tasks"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive('/tasks') === 'text-primary-600 border-primary-600'
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        {t('nav.tasks')}
                      </span>
                    </Link>
                    <Link
                      to="/projects"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive('/projects') === 'text-primary-600 border-primary-600'
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        {t('nav.projects')}
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            {/* Right side - User menu */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-slate-700 font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary btn-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="btn btn-secondary btn-sm">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    {t('nav.getStarted')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`flex-1 w-full ${location.pathname === '/' ? '' : 'max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'}`}>
        {children}
      </main>

      {/* Footer - Only show on non-home pages */}
      {location.pathname !== '/' && (
        <footer className="bg-white border-t border-gray-200 mt-auto flex-shrink-0">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © 2025 Taskora. Made with ❤️ for productivity lovers.
            </p>
          </div>
        </footer>
      )}
    </div>
  )
}

export default Layout

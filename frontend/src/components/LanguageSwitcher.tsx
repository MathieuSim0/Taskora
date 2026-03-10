import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
        <span className="text-xl">
          {languages.find(lang => lang.code === i18n.language)?.flag || '🌐'}
        </span>
        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 ${
              i18n.language === language.code ? 'bg-teal-50 text-teal-700' : 'text-slate-700'
            }`}
          >
            <span className="text-xl">{language.flag}</span>
            <span className="font-medium">{language.name}</span>
            {i18n.language === language.code && (
              <svg className="w-4 h-4 ml-auto text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageSwitcher

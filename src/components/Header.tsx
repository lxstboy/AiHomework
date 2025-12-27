import { useLanguage } from '../contexts/LanguageContext'
import './Header.css'

export default function Header() {
  const { t } = useLanguage()

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">{t('app.title')}</h1>
        <p className="header-subtitle">{t('app.subtitle')}</p>
      </div>
    </header>
  )
}


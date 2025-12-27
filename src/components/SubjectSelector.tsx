import { useLanguage } from '../contexts/LanguageContext'
import './SubjectSelector.css'

interface SubjectSelectorProps {
  selectedSubject: string
  onSelect: (subject: string) => void
}

export default function SubjectSelector({ selectedSubject, onSelect }: SubjectSelectorProps) {
  const { t, language } = useLanguage()

  const subjects = [
    { key: 'math', zh: '数学', en: 'Math' },
    { key: 'physics', zh: '物理', en: 'Physics' },
    { key: 'chemistry', zh: '化学', en: 'Chemistry' },
    { key: 'biology', zh: '生物', en: 'Biology' },
    { key: 'chinese', zh: '语文', en: 'Chinese' },
    { key: 'english', zh: '英语', en: 'English' },
    { key: 'history', zh: '历史', en: 'History' },
    { key: 'geography', zh: '地理', en: 'Geography' },
    { key: 'politics', zh: '政治', en: 'Politics' },
    { key: 'computer', zh: '计算机', en: 'Computer' },
    { key: 'other', zh: '其他', en: 'Other' },
  ]

  return (
    <div className="subject-selector">
      <label className="subject-label">{t('subject.label')}</label>
      <div className="subject-grid">
        {subjects.map(subject => {
          const displayName = language === 'zh' ? subject.zh : subject.en
          return (
            <button
              key={subject.key}
              className={`subject-button ${selectedSubject === displayName ? 'active' : ''}`}
              onClick={() => onSelect(displayName)}
            >
              {displayName}
            </button>
          )
        })}
      </div>
    </div>
  )
}


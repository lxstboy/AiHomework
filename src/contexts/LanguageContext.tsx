import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { detectUserLanguage } from '../services/ipService'

type Language = 'zh' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 翻译文本
const translations = {
  zh: {
    'app.title': 'AI作业求解器',
    'app.subtitle': '智能识别，精准解答',
    'subject.label': '选择科目',
    'upload.text': '点击或拖拽图片到这里上传',
    'upload.hint': '支持批量上传多张图片',
    'images.title': '已上传图片',
    'batch.solve': '批量求解',
    'batch.solving': '批量求解中...',
    'solve': '求解',
    'solving': '求解中',
    'solved': '已解答',
    'panel.title': 'AI解答面板',
    'panel.empty': '选择一张图片开始求解',
    'panel.thinking': '思考过程',
    'panel.solution': '解答',
    'panel.download': '下载',
    'panel.analyzing': 'AI正在分析题目...',
    'panel.start': '点击"求解"按钮开始分析',
    'subjects.math': '数学',
    'subjects.physics': '物理',
    'subjects.chemistry': '化学',
    'subjects.biology': '生物',
    'subjects.chinese': '语文',
    'subjects.english': '英语',
    'subjects.history': '历史',
    'subjects.geography': '地理',
    'subjects.politics': '政治',
    'subjects.computer': '计算机',
    'subjects.other': '其他',
  },
  en: {
    'app.title': 'AI Homework Solver',
    'app.subtitle': 'Smart Recognition, Accurate Solutions',
    'subject.label': 'Select Subject',
    'upload.text': 'Click or drag images here to upload',
    'upload.hint': 'Supports batch upload of multiple images',
    'images.title': 'Uploaded Images',
    'batch.solve': 'Batch Solve',
    'batch.solving': 'Solving...',
    'solve': 'Solve',
    'solving': 'Solving',
    'solved': 'Solved',
    'panel.title': 'AI Solution Panel',
    'panel.empty': 'Select an image to start solving',
    'panel.thinking': 'Thinking Process',
    'panel.solution': 'Solution',
    'panel.download': 'Download',
    'panel.analyzing': 'AI is analyzing the problem...',
    'panel.start': 'Click "Solve" button to start analysis',
    'subjects.math': 'Math',
    'subjects.physics': 'Physics',
    'subjects.chemistry': 'Chemistry',
    'subjects.biology': 'Biology',
    'subjects.chinese': 'Chinese',
    'subjects.english': 'English',
    'subjects.history': 'History',
    'subjects.geography': 'Geography',
    'subjects.politics': 'Politics',
    'subjects.computer': 'Computer',
    'subjects.other': 'Other',
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检测用户语言
    detectUserLanguage().then(lang => {
      setLanguage(lang)
      setLoading(false)
    }).catch(() => {
      setLanguage('zh')
      setLoading(false)
    })
  }, [])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.zh] || key
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}


import { Download, Sparkles } from 'lucide-react'
import { HomeworkImage } from '../App'
import { useLanguage } from '../contexts/LanguageContext'
import './AISolutionPanel.css'

interface AISolutionPanelProps {
  image: HomeworkImage | undefined
  isProcessing: boolean
  onDownload: (id: string) => void
}

export default function AISolutionPanel({ image, isProcessing, onDownload }: AISolutionPanelProps) {
  const { t } = useLanguage()

  if (!image) {
    return (
      <div className="solution-panel">
        <div className="panel-header">
          <Sparkles size={20} />
          <h3>{t('panel.title')}</h3>
        </div>
        <div className="panel-empty">
          <p>{t('panel.empty')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="solution-panel">
      <div className="panel-header">
        <Sparkles size={20} />
        <h3>{t('panel.title')}</h3>
        {image.solution && (
          <button
            className="download-button"
            onClick={() => onDownload(image.id)}
          >
            <Download size={16} />
            {t('panel.download')}
          </button>
        )}
      </div>
      
      <div className="panel-content">
        <div className="image-preview-small">
          <img src={image.preview} alt={image.file.name} />
          <p className="image-name-small">{image.file.name}</p>
        </div>

        {isProcessing && !image.solution && (
          <div className="processing">
            <div className="processing-spinner"></div>
            <p>{t('panel.analyzing')}</p>
          </div>
        )}

        {image.thinking && (
          <div className="thinking-section">
            <h4 className="section-title">{t('panel.thinking')}</h4>
            <div className="thinking-content">
              {image.thinking.split('\n').map((line, i) => (
                <p key={i}>{line || '\u00A0'}</p>
              ))}
            </div>
          </div>
        )}

        {image.solution && (
          <div className="solution-section">
            <h4 className="section-title">{t('panel.solution')}</h4>
            <div className="solution-content">
              {image.solution.split('\n').map((line, i) => (
                <p key={i}>{line || '\u00A0'}</p>
              ))}
            </div>
          </div>
        )}

        {!image.solution && !isProcessing && (
          <div className="no-solution">
            <p>{t('panel.start')}</p>
          </div>
        )}
      </div>
    </div>
  )
}


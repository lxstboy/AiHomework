import { useRef, useState } from 'react'
import { Upload, X, Play, Loader } from 'lucide-react'
import { HomeworkImage } from '../App'
import { useLanguage } from '../contexts/LanguageContext'
import './UploadArea.css'

interface UploadAreaProps {
  images: HomeworkImage[]
  onUpload: (files: FileList) => void
  onRemove: (id: string) => void
  onSolve: (id: string) => void
  onBatchSolve: () => void
  isProcessing: boolean
}

export default function UploadArea({
  images,
  onUpload,
  onRemove,
  onSolve,
  onBatchSolve,
  isProcessing
}: UploadAreaProps) {
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      onUpload(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onUpload(e.target.files)
    }
  }

  const hasUnsolved = images.some(img => !img.solution)

  return (
    <div className="upload-area">
      <div
        className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={48} className="upload-icon" />
        <p className="upload-text">{t('upload.text')}</p>
        <p className="upload-hint">{t('upload.hint')}</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
        />
      </div>

      {images.length > 0 && (
        <div className="images-section">
          <div className="images-header">
            <h3 className="images-title">{t('images.title')} ({images.length})</h3>
            {hasUnsolved && (
              <button
                className="batch-solve-button"
                onClick={onBatchSolve}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader className="spinner" size={16} />
                    {t('batch.solving')}
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    {t('batch.solve')}
                  </>
                )}
              </button>
            )}
          </div>
          <div className="images-grid">
            {images.map(image => (
              <div key={image.id} className="image-card">
                <div className="image-preview">
                  <img src={image.preview} alt={image.file.name} />
                  <button
                    className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(image.id)
                    }}
                  >
                    <X size={18} />
                  </button>
                  {image.solution && (
                    <div className="solved-badge">{t('solved')}</div>
                  )}
                </div>
                <div className="image-info">
                  <p className="image-name" title={image.file.name}>
                    {image.file.name}
                  </p>
                  {!image.solution && (
                    <button
                      className="solve-button"
                      onClick={() => onSolve(image.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader className="spinner" size={14} />
                          {t('solving')}
                        </>
                      ) : (
                        t('solve')
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


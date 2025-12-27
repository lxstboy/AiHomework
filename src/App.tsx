import { useState } from 'react'
import Header from './components/Header'
import UploadArea from './components/UploadArea'
import SubjectSelector from './components/SubjectSelector'
import AISolutionPanel from './components/AISolutionPanel'
import { solveHomework } from './services/aiService'
import { useLanguage } from './contexts/LanguageContext'
import './App.css'

export interface HomeworkImage {
  id: string
  file: File
  preview: string
  solution?: string
  thinking?: string
}

function App() {
  const {language } = useLanguage()
  const [images, setImages] = useState<HomeworkImage[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>(language === 'zh' ? '数学' : 'Math')
  const [currentImageId, setCurrentImageId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImageUpload = (files: FileList) => {
    const newImages: HomeworkImage[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      preview: URL.createObjectURL(file)
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
    if (currentImageId === id) {
      setCurrentImageId(null)
    }
  }

  const handleSolve = async (imageId: string) => {
    const image = images.find(img => img.id === imageId)
    if (!image) return

    setIsProcessing(true)
    setCurrentImageId(imageId)

    try {
      const result = await solveHomework(image.file, selectedSubject)
      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, solution: result.solution, thinking: result.thinking }
          : img
      ))
    } catch (error) {
      console.error('求解失败:', error)
      alert(language === 'zh' ? '求解失败，请检查网络连接和API配置' : 'Solving failed, please check network connection and API configuration')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBatchSolve = async () => {
    for (const image of images) {
      if (!image.solution) {
        await handleSolve(image.id)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  const handleDownload = (imageId: string) => {
    const image = images.find(img => img.id === imageId)
    if (!image || !image.solution) return

    const isZh = language === 'zh'
    const content = isZh 
      ? `题目：${image.file.name}\n\n思考过程：\n${image.thinking || '无'}\n\n解答：\n${image.solution}`
      : `Problem: ${image.file.name}\n\nThinking Process:\n${image.thinking || 'None'}\n\nSolution:\n${image.solution}`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${image.file.name.replace(/\.[^/.]+$/, '')}_${isZh ? '解答' : 'Solution'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <div className="main-content">
          <SubjectSelector 
            selectedSubject={selectedSubject}
            onSelect={setSelectedSubject}
          />
          <UploadArea 
            images={images}
            onUpload={handleImageUpload}
            onRemove={handleRemoveImage}
            onSolve={handleSolve}
            onBatchSolve={handleBatchSolve}
            isProcessing={isProcessing}
          />
        </div>
        <AISolutionPanel 
          image={images.find(img => img.id === currentImageId)}
          isProcessing={isProcessing}
          onDownload={handleDownload}
        />
      </div>
    </div>
  )
}

export default App


// AI服务配置 - 统一使用国内API

import { detectUserLanguage } from './ipService'

// 国内API配置
// 优先使用环境变量，如果没有配置则使用默认值
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.suanli.cn/v1'
const API_KEY = import.meta.env.VITE_API_KEY || 'sk-W0rpStc95T7JVYVwDYc29IyirjtpPPby6SozFMQr17m8KWeo'

// 将图片转换为base64
function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 模拟AI响应（用于测试）
async function mockAIResponse(subject: string, language: 'zh' | 'en'): Promise<{ thinking: string; solution: string }> {
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  if (language === 'en') {
    const mockThinking = `Let me analyze this ${subject} problem:

1. First, I need to understand the requirements
2. Identify key information and known conditions
3. Determine the problem-solving approach
4. Step-by-step derivation and calculation`

    const mockSolution = `Solution:

Based on the problem analysis, we can use the following method:

Step 1: List known conditions
- Condition A: ...
- Condition B: ...

Step 2: Apply relevant formulas/theorems
Using basic principles in ${subject}...

Step 3: Calculation process
Detailed calculation steps...

Step 4: Final answer
The answer is: ...

Note: This is a mock answer. Please configure the real AI API for actual use.`

    return {
      thinking: mockThinking,
      solution: mockSolution
    }
  }

  // 中文版本
  const mockThinking = `让我分析一下这道${subject}题目：

1. 首先，我需要理解题目的要求
2. 识别题目中的关键信息和已知条件
3. 确定解题思路和方法
4. 逐步推导和计算`

  const mockSolution = `解答：

根据题目分析，我们可以采用以下方法：

步骤1：列出已知条件
- 条件A：...
- 条件B：...

步骤2：应用相关公式/定理
使用${subject}中的基本原理...

步骤3：计算过程
详细计算步骤...

步骤4：得出答案
最终答案为：...

注意：这是模拟答案，实际使用时需要配置真实的AI API。`

  return {
    thinking: mockThinking,
    solution: mockSolution
  }
}

// 调用AI API
async function callAI(base64Image: string, subject: string, language: 'zh' | 'en'): Promise<{ thinking: string; solution: string }> {
  // 根据语言生成提示词
  const systemPrompt = language === 'en' 
    ? `You are a professional ${subject} teacher, skilled at solving ${subject} problems. Please carefully analyze the problem in the image, first show your thinking process, then provide detailed solution steps.`
    : `你是一位专业的${subject}老师，擅长解答${subject}题目。请仔细分析图片中的题目，先展示你的思考过程，然后给出详细的解答步骤。`

  const userPrompt = language === 'en'
    ? `Please analyze this ${subject} homework image, first show your thinking process, then provide a detailed solution.`
    : `请分析这张${subject}作业图片，先展示你的思考过程，然后给出详细的解答。`

  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API错误: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''
    
    // 根据语言分离思考过程和解答
    if (language === 'en') {
      const thinkingMatch = content.match(/thinking[：:]?([\s\S]*?)(?=solution|answer|$)/i)
      const solutionMatch = content.match(/(solution|answer)[：:]?([\s\S]*)/i)
      
      return {
        thinking: thinkingMatch ? thinkingMatch[1].trim() : 'Analyzing the problem...',
        solution: solutionMatch ? solutionMatch[2].trim() : content
      }
    } else {
      const thinkingMatch = content.match(/思考[：:]([\s\S]*?)(?=解答|答案|$)/i)
      const solutionMatch = content.match(/(解答|答案)[：:]([\s\S]*)/i)
      
      return {
        thinking: thinkingMatch ? thinkingMatch[1].trim() : '正在分析题目...',
        solution: solutionMatch ? solutionMatch[2].trim() : content
      }
    }
  } catch (error) {
    console.error('AI API调用失败:', error)
    throw error
  }
}

// 主函数：求解作业
export async function solveHomework(
  imageFile: File,
  subject: string
): Promise<{ thinking: string; solution: string }> {
  // 检测用户语言
  const language = await detectUserLanguage()

  try {
    const base64Image = await imageToBase64(imageFile)
    return await callAI(base64Image, subject, language)
  } catch (error) {
    console.error('求解失败:', error)
    // 如果API调用失败，返回模拟数据作为降级方案
    return mockAIResponse(subject, language)
  }
}

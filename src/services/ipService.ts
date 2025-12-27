// IP地理位置检测服务 - 用于确定界面语言

let cachedLanguage: 'zh' | 'en' | null = null

// 检测用户语言（基于IP地理位置）
export async function detectUserLanguage(): Promise<'zh' | 'en'> {
  // 如果已经缓存，直接返回
  if (cachedLanguage) {
    return cachedLanguage
  }

  try {
    // 使用免费的IP地理位置API
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('IP检测失败')
    }

    const data = await response.json()
    const countryCode = data.country_code || ''
    
    // 中文地区：中国大陆、台湾、香港、澳门、新加坡等
    const chineseRegions = ['CN', 'TW', 'HK', 'MO', 'SG']
    
    // 缓存结果
    cachedLanguage = chineseRegions.includes(countryCode) ? 'zh' : 'en'
    return cachedLanguage
  } catch (error) {
    console.warn('IP检测失败，使用默认语言（中文）:', error)
    // 如果检测失败，默认使用中文
    cachedLanguage = 'zh'
    return cachedLanguage
  }
}

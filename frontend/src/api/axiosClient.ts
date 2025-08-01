// File: src/api/apiClient.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://140.114.80.195:5353/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 3000000 // 30秒超時，因為音頻轉錄可能需要較長時間
})

// 請求攔截器
apiClient.interceptors.request.use(
  (config) => {
    // 在這裡可以添加通用的請求處理邏輯
    // 例如：添加認證 token、記錄請求等
    console.log(`API 請求: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 響應攔截器
apiClient.interceptors.response.use(
  (response) => {
    // 統一處理成功響應
    return response
  },
  (error) => {
    // 統一處理錯誤響應
    if (error.response) {
      // 伺服器回應了錯誤狀態碼
      console.error(`API 錯誤 ${error.response.status}:`, error.response.data)
    } else if (error.request) {
      // 請求已發出但沒有收到響應
      console.error('API 請求超時或網路錯誤:', error.request)
    } else {
      // 其他錯誤
      console.error('API 請求設定錯誤:', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient
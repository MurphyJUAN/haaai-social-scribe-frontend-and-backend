// File: src/api/audioService.ts
// 音頻處理相關的 API 服務模組

import apiClient from './apiClient'

// 定義 API 回應的類型
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

interface TranscriptData {
  original_transcript: string
  corrected_transcript: string
  final_transcript: string
}

interface HealthStatus {
  status: string
  message: string
  openai_configured?: boolean
  details?: string
}

class AudioService {
  /**
   * 轉錄音頻文件
   * @param file 音頻文件
   * @returns Promise<TranscriptData>
   */
  async transcribeAudio(file: File): Promise<TranscriptData> {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await apiClient.post<ApiResponse<TranscriptData>>(
        '/audio/transcribe', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.error || '轉錄失敗')
      }

      if (!response.data.data) {
        throw new Error('轉錄回應數據為空')
      }

      return response.data.data

    } catch (error: any) {
      // 處理 axios 錯誤
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('轉錄請求超時，請檢查網路連接')
      } else {
        throw new Error(error.message || '轉錄過程中發生未知錯誤')
      }
    }
  }

  /**
   * 校正文本
   * @param transcript 需要校正的文本
   * @returns Promise<TranscriptData>
   */
  async correctTranscript(transcript: string): Promise<TranscriptData> {
    try {
      const response = await apiClient.post<ApiResponse<TranscriptData>>(
        '/audio/correct',
        { transcript }
      )

      if (!response.data.success) {
        throw new Error(response.data.error || '文本校正失敗')
      }

      if (!response.data.data) {
        throw new Error('校正回應數據為空')
      }

      return response.data.data

    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      } else {
        throw new Error(error.message || '文本校正過程中發生未知錯誤')
      }
    }
  }

  /**
   * 檢查音頻服務健康狀態
   * @returns Promise<HealthStatus>
   */
  async checkHealth(): Promise<HealthStatus> {
    try {
      const response = await apiClient.get<HealthStatus>('/audio/health')
      return response.data
    } catch (error: any) {
      return {
        status: 'error',
        message: '無法連接到音頻處理服務',
        details: error.response?.data?.error || error.message
      }
    }
  }
}

// 創建單例實例
const audioService = new AudioService()

export default audioService
export type { TranscriptData, HealthStatus }
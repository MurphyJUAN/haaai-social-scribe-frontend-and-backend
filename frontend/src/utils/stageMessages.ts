export const transcriptStageMessageMap: Record<
  'idle' | 'transcribing' | 'correcting' | 'done' | 'error',
  string
> = {
  idle: '',
  transcribing: '語音轉逐字稿中，請稍候…',
  correcting: '正在校正逐字稿內容…',
  done: '逐字稿完成！',
  error: '逐字稿生成失敗！請稍後再試或聯繫管理員。'
}

export const reportStageMessageMap: Record<string, string> = {
  init: '請輸入逐字稿內容開始生成',
  generating: '報告生成中...',
  completed: '報告生成完成'
}

export const templateMessageMap: Record<string, Array<string>> = {
  '司法社工家庭訪視模板': ['主訴議題', '家庭狀況', '子女狀況', '法律議題', '社工評估(AI生成)'],
  '士林地院家事服務中心格式(ChatGPT)': ['主述議題', '家庭狀況', '子女狀況', '法律議題', '補充說明', '社工評估'],
  '士林地院家事服務中心格式(Claude)': ['主述議題', '家庭狀況', '子女狀況', '法律議題', '補充說明', '社工評估'],
  '珍珠社會福利協會格式(ChatGPT)': ['個案個人身心狀況', '家庭關係', '子女狀況', '困難與法律議題', '社工協助需求', '綜合評估', '專業建議', '服務方向'],
  '珍珠社會福利協會格式(Claude)': ['個案個人身心狀況', '家庭關係', '子女狀況', '困難與法律議題', '社工協助需求', '綜合評估', '專業建議', '服務方向']
}

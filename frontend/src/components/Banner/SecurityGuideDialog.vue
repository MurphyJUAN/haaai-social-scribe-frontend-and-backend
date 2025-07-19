<template>
  <Dialog 
    :visible="modelValue"
    @update:visible="$emit('update:modelValue', $event)"
    header="🛡️ Claude API 安全性說明" 
    :style="{ width: '95vw', maxWidth: '800px', height: '90vh' }"
    modal
    :draggable="false"
  >
    <div class="h-full overflow-y-auto pr-2" style="max-height: calc(90vh - 120px);">
      
      <!-- 安全認證等級 -->
      <div class="mb-6 p-4 border-l-4 border-l-blue-500 bg-blue-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-blue-700 flex items-center">
          <i class="pi pi-verified mr-2"></i>安全認證等級
        </h3>
        <p class="text-sm text-blue-600 mb-4">Claude API 擁有業界最高等級的安全認證組合</p>
        
        <div class="grid grid-cols-1 gap-4">
          <div class="bg-white p-4 rounded-lg border border-blue-200">
            <div class="flex items-center mb-2">
              <i class="pi pi-hospital text-red-600 mr-2 text-lg"></i>
              <span class="font-semibold text-base text-blue-700">HIPAA 認證</span>
              <span class="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">最重要</span>
            </div>
            <p class="text-sm text-gray-700 mb-3">
              <strong>HIPAA 是什麼：</strong>美國健康保險可攜性和責任法案（Health Insurance Portability and Accountability Act），是全球最嚴格的健康資料隱私保護法規
            </p>
            <p class="text-sm text-blue-700 mb-3 bg-blue-50 p-2 rounded">
              <strong>🏥 涵蓋範圍：</strong>不只是醫療資料，還包括心理健康、家庭狀況、社會服務等所有與健康相關的個人資訊
            </p>
            <p class="text-sm text-gray-700 mb-3">
              <strong>對社工的意義：</strong>社工處理的案主資料經常涉及健康、心理、家庭、兒童保護等敏感資訊，HIPAA 確保這些資料受到醫療等級的最高保護
            </p>
            <p class="text-sm text-green-700 mb-2 bg-green-50 p-2 rounded">
              <strong>🛡️ 具體保護措施：</strong>
              <br>• 最低必要原則：只能存取完成工作所需的最少資料
              <br>• 技術防護：加密、存取控制、使用者驗證
              <br>• 實體防護：安全的資料中心、環境控制
              <br>• 管理防護：員工訓練、政策制定、事件回應
            </p>

            <p class="text-sm text-green-700">
              <strong>具體保障：</strong>醫療級傳輸加密、嚴格存取控制、完整稽核追蹤
            </p>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-blue-200">
            <div class="flex items-center mb-2">
              <i class="pi pi-shield text-green-600 mr-2"></i>
              <span class="font-semibold text-base text-blue-700">SOC 2 Type 2</span>
            </div>
            <p class="text-sm text-gray-700 mb-2">
              <strong>這是什麼：</strong>獨立第三方持續一年以上的安全性稽核認證
            </p>
            <p class="text-sm text-gray-700">
              <strong>保障內容：</strong>安全性、可用性、處理完整性、機密性、隱私保護五大面向
            </p>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-blue-200">
            <div class="flex items-center mb-2">
              <i class="pi pi-globe text-green-600 mr-2"></i>
              <span class="font-semibold text-base text-blue-700">ISO 27001</span>
            </div>
            <p class="text-sm text-gray-700 mb-2">
              <strong>這是什麼：</strong>國際標準組織制定的資訊安全管理標準
            </p>
            <p class="text-sm text-gray-700">
              <strong>保障內容：</strong>全面的安全政策、風險管理、事件回應、員工訓練
            </p>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-blue-200">
            <div class="flex items-center mb-2">
              <i class="pi pi-cog text-green-600 mr-2"></i>
              <span class="font-semibold text-base text-blue-700">ISO 42001</span>
            </div>
            <p class="text-sm text-gray-700 mb-2">
              <strong>這是什麼：</strong>專門針對 AI 系統的管理認證（2023年新標準）
            </p>
            <p class="text-sm text-gray-700">
              <strong>保障內容：</strong>AI 系統的負責任開發、部署、監控和改進
            </p>
          </div>
        </div>
      </div>

      <!-- 核心安全承諾 -->
      <div class="mb-6 p-4 border-l-4 border-l-green-500 bg-green-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-green-700 flex items-center">
          <i class="pi pi-lock mr-2"></i>核心安全承諾
        </h3>
        
        <div class="space-y-3">
          <div class="flex items-start space-x-3 bg-white p-3 rounded-lg">
            <i class="pi pi-shield text-blue-500 mt-1 flex-shrink-0"></i>
            <div>
              <div class="font-semibold text-sm text-green-700">醫療級資料保護</div>
              <p class="text-xs text-gray-600 mt-1">
                提供醫療等級的資料安全保護，符合最嚴格的隱私標準
              </p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3 bg-white p-3 rounded-lg">
            <i class="pi pi-eye-slash text-purple-500 mt-1 flex-shrink-0"></i>
            <div>
              <div class="font-semibold text-sm text-green-700">員工存取控制</div>
              <p class="text-xs text-gray-600 mt-1">
                未經授權的員工無法讀取您的對話內容，僅信任與安全團隊按需審查
              </p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3 bg-white p-3 rounded-lg">
            <i class="pi pi-clock text-blue-500 mt-1 flex-shrink-0"></i>
            <div>
              <div class="font-semibold text-sm text-green-700">即時處理</div>
              <p class="text-xs text-gray-600 mt-1">
                資料僅在處理期間存在於記憶體中，處理完成後立即清除
              </p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3 bg-white p-3 rounded-lg">
            <i class="pi pi-shield text-purple-500 mt-1 flex-shrink-0"></i>
            <div>
              <div class="font-semibold text-sm text-green-700">端到端加密</div>
              <p class="text-xs text-gray-600 mt-1">
                所有資料傳輸都經過 TLS 1.3 加密，確保傳輸過程完全安全
              </p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3 bg-white p-3 rounded-lg">
            <i class="pi pi-shield text-orange-500 mt-1 flex-shrink-0"></i>
            <div>
              <div class="font-semibold text-sm text-green-700">完整稽核追蹤</div>
              <p class="text-xs text-gray-600 mt-1">
                所有資料處理活動都有完整的稽核記錄，確保符合法規要求
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 與其他 AI 服務比較 -->
      <div class="mb-6 p-4 border-l-4 border-l-purple-500 bg-purple-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-purple-700 flex items-center">
          <i class="pi pi-chart-bar mr-2"></i>安全性比較
        </h3>
        
        <div class="overflow-x-auto">
          <table class="w-full text-xs border border-gray-200 rounded-lg bg-white">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left">服務</th>
                <th class="px-3 py-2 text-center">HIPAA</th>
                <th class="px-3 py-2 text-center">SOC 2</th>
                <th class="px-3 py-2 text-center">ISO 27001</th>
                <th class="px-3 py-2 text-center">推薦程度</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr class="bg-purple-50">
                <td class="px-3 py-2 font-semibold">Claude API</td>
                <td class="px-3 py-2 text-center text-green-600">✅</td>
                <td class="px-3 py-2 text-center text-green-600">✅</td>
                <td class="px-3 py-2 text-center text-green-600">✅</td>
                <td class="px-3 py-2 text-center">⭐⭐⭐⭐⭐</td>
              </tr>
              <tr>
                <td class="px-3 py-2">Claude Enterprise</td>
                <td class="px-3 py-2 text-center text-red-600">❌</td>
                <td class="px-3 py-2 text-center text-green-600">✅</td>
                <td class="px-3 py-2 text-center text-green-600">✅</td>
                <td class="px-3 py-2 text-center">⭐⭐⭐</td>
              </tr>
              <tr>
                <td class="px-3 py-2">OpenAI ChatGPT</td>
                <td class="px-3 py-2 text-center text-red-600">❌</td>
                <td class="px-3 py-2 text-center text-green-600">✅</td>
                <td class="px-3 py-2 text-center text-green-600">✅</td>
                <td class="px-3 py-2 text-center">⭐⭐</td>
              </tr>
              <tr>
                <td class="px-3 py-2">Google Bard</td>
                <td class="px-3 py-2 text-center text-red-600">❌</td>
                <td class="px-3 py-2 text-center text-green-600">✅</td>
                <td class="px-3 py-2 text-center text-green-600">✅</td>
                <td class="px-3 py-2 text-center">⭐⭐</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-3 p-3 bg-purple-100 rounded-lg">
          <p class="text-sm font-semibold text-purple-700">
            💡 結論：Claude API 是目前唯一同時擁有 HIPAA 醫療級認證 + 完整安全認證的 AI 服務
          </p>
          <p class="text-xs text-purple-600 mt-2">
            HIPAA 認證意味著符合美國醫療資料保護的最高標準，對處理敏感個案資料的社工來說是最重要的安全保障
          </p>
        </div>
      </div>

      <!-- 社工專業使用原則 -->
      <div class="mb-6 p-4 border-l-4 border-l-orange-500 bg-orange-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-orange-700 flex items-center">
          <i class="pi pi-users mr-2"></i>社工專業使用原則
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 可以安全使用 -->
          <div class="bg-white p-4 rounded-lg border border-green-200">
            <h4 class="font-semibold text-sm text-green-700 mb-2 flex items-center">
              <i class="pi pi-check-circle text-green-600 mr-2"></i>可以安全使用
            </h4>
            <ul class="text-xs text-gray-700 space-y-1">
              <li>• 已適度去識別化的案例資訊</li>
              <li>• 報告撰寫和專業諮詢</li>
              <li>• 一般個案工作協助</li>
              <li>• 政策研究和文獻整理</li>
              <li>• 專業技能培訓內容</li>
            </ul>
          </div>
          
          <!-- 需要謹慎使用 -->
          <div class="bg-white p-4 rounded-lg border border-yellow-200">
            <h4 class="font-semibold text-sm text-yellow-700 mb-2 flex items-center">
              <i class="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>需要謹慎使用
            </h4>
            <ul class="text-xs text-gray-700 space-y-1">
              <li>• 包含健康資訊的案例（需去識別化）</li>
              <li>• 兒童保護相關案件</li>
              <li>• 家庭暴力敏感案件</li>
              <li>• 法院程序相關內容</li>
              <li>• 涉及多個專業的複雜案例</li>
            </ul>
          </div>
          
          <!-- 絕對禁止 -->
          <div class="bg-white p-4 rounded-lg border border-red-200">
            <h4 class="font-semibold text-sm text-red-700 mb-2 flex items-center">
              <i class="pi pi-times-circle text-red-600 mr-2"></i>絕對禁止
            </h4>
            <ul class="text-xs text-gray-700 space-y-1">
              <li>• 完整個案記錄直接複製</li>
              <li>• 包含真實姓名、地址、電話</li>
              <li>• 緊急危機處理決策</li>
              <li>• 替代專業督導判斷</li>
              <li>• 醫療診斷和治療建議</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 資料去識別化指南 -->
      <div class="mb-6 p-4 border-l-4 border-l-teal-500 bg-teal-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-teal-700 flex items-center">
          <i class="pi pi-eye-slash mr-2"></i>資料去識別化指南
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-lg">
            <h4 class="font-semibold text-sm text-teal-600 mb-3">🔄 簡單替換法（2分鐘）</h4>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between p-2 bg-gray-50 rounded">
                <span class="text-red-600">王小明</span>
                <span>→</span>
                <span class="text-green-600">案主A</span>
              </div>
              <div class="flex justify-between p-2 bg-gray-50 rounded">
                <span class="text-red-600">台北市信義區</span>
                <span>→</span>
                <span class="text-green-600">都會區</span>
              </div>
              <div class="flex justify-between p-2 bg-gray-50 rounded">
                <span class="text-red-600">0912-345-678</span>
                <span>→</span>
                <span class="text-green-600">[電話]</span>
              </div>
              <div class="flex justify-between p-2 bg-gray-50 rounded">
                <span class="text-red-600">台大醫院</span>
                <span>→</span>
                <span class="text-green-600">醫學中心</span>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg">
            <h4 class="font-semibold text-sm text-teal-600 mb-3">📝 直接描述法（最安全）</h4>
            <div class="text-xs text-gray-700 space-y-2">
              <p class="p-2 bg-gray-50 rounded">
                <strong>原則：</strong>不複製原始記錄，直接用一般性語言描述情況
              </p>
              <p class="p-2 bg-gray-50 rounded">
                <strong>範例：</strong>「案主為40歲男性，與配偶及兩名子女同住，近期因工作壓力導致家庭關係緊張」
              </p>
              <p class="p-2 bg-gray-50 rounded">
                <strong>優點：</strong>完全避免個人識別資訊外洩風險
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 專業倫理合規 -->
      <div class="mb-6 p-4 border-l-4 border-l-indigo-500 bg-indigo-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-indigo-700 flex items-center">
          <i class="pi pi-balance-scale mr-2"></i>專業倫理與合規
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-lg">
            <h4 class="font-semibold text-sm text-indigo-600 mb-3">✅ 符合社工倫理</h4>
            <ul class="text-xs text-gray-700 space-y-2">
              <li class="flex items-start">
                <i class="pi pi-heart text-red-500 mr-2 mt-0.5 flex-shrink-0"></i>
                <div>
                  <strong>案主最佳利益</strong><br>
                  AI協助提升服務品質，讓社工有更多時間專注於直接服務
                </div>
              </li>
              <li class="flex items-start">
                <i class="pi pi-lock text-blue-500 mr-2 mt-0.5 flex-shrink-0"></i>
                <div>
                  <strong>隱私保護</strong><br>
                  HIPAA級別的資料安全保障，超越一般隱私要求
                </div>
              </li>
              <li class="flex items-start">
                <i class="pi pi-user text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                <div>
                  <strong>專業責任</strong><br>
                  AI為輔助工具，最終專業判斷仍在社工本身
                </div>
              </li>
            </ul>
          </div>
          
          <div class="bg-white p-4 rounded-lg">
            <h4 class="font-semibold text-sm text-indigo-600 mb-3">📋 法規合規保障</h4>
            <ul class="text-xs text-gray-700 space-y-2">
              <li class="flex items-start">
                <i class="pi pi-shield text-purple-500 mr-2 mt-0.5 flex-shrink-0"></i>
                <div>
                  <strong>個人資料保護法</strong><br>
                  符合最高安全標準，超越法律最低要求
                </div>
              </li>
              <li class="flex items-start">
                <i class="pi pi-hospital text-cyan-500 mr-2 mt-0.5 flex-shrink-0"></i>
                <div>
                  <strong>醫療法規</strong><br>
                  HIPAA認證確保符合醫療級隱私保護
                </div>
              </li>
              <li class="flex items-start">
                <i class="pi pi-globe text-orange-500 mr-2 mt-0.5 flex-shrink-0"></i>
                <div>
                  <strong>國際標準</strong><br>
                  ISO認證確保符合國際資訊安全標準
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 與日常工具安全性對比 -->
      <div class="mb-6 p-4 border-l-4 border-l-cyan-500 bg-cyan-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-cyan-700 flex items-center">
          <i class="pi pi-chart-bar mr-2"></i>與日常工具安全性對比
        </h3>
        <p class="text-sm text-cyan-600 mb-4">讓您更容易理解 Claude 的安全等級</p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm border border-gray-200 rounded-lg bg-white">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left">工具</th>
                <th class="px-4 py-3 text-center">加密等級</th>
                <th class="px-4 py-3 text-center">資料儲存</th>
                <th class="px-4 py-3 text-center">隱私保護</th>
                <th class="px-4 py-3 text-center">安全等級</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr class="bg-cyan-50">
                <td class="px-4 py-3 font-semibold text-cyan-700">Claude API</td>
                <td class="px-4 py-3 text-center">
                  <span class="text-green-600 font-semibold">TLS 1.2/1.3</span>
                  <div class="text-xs text-gray-500">傳輸與靜態加密</div>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="text-green-600 font-semibold">醫療級保護</span>
                  <div class="text-xs text-gray-500">嚴格資料管控</div>
                  <div class="text-xs text-blue-600">去識別化處理</div>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="text-green-600 font-semibold">高等級</span>
                  <div class="text-xs text-gray-500">員工無法讀取</div>
                  <div class="text-xs text-blue-600">HIPAA 醫療級保護</div>
                </td>
                <td class="px-4 py-3 text-center">⭐⭐⭐⭐</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">LINE</td>
                <td class="px-4 py-3 text-center">
                  <span class="text-green-600">Letter Sealing</span>
                  <div class="text-xs text-gray-500">端到端加密</div>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="text-red-600">永久存儲</span>
                  <div class="text-xs text-gray-500">LINE 伺服器保存</div>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="text-orange-600">中等</span>
                  <div class="text-xs text-gray-500">LINE 可存取</div>
                </td>
                <td class="px-4 py-3 text-center">⭐⭐⭐</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">Gmail</td>
                <td class="px-4 py-3 text-center">
                  <span class="text-yellow-600">TLS</span>
                  <div class="text-xs text-gray-500">傳輸加密</div>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="text-red-600">永久存儲</span>
                  <div class="text-xs text-gray-500">Google 伺服器</div>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="text-red-600">較低</span>
                  <div class="text-xs text-gray-500">自動掃描分析</div>
                </td>
                <td class="px-4 py-3 text-center">⭐⭐</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">雲端硬碟</td>
                <td class="px-4 py-3 text-center">
                  <span class="text-yellow-600">標準</span>
                  <div class="text-xs text-gray-500">傳輸與靜態加密</div>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="text-red-600">永久存儲</span>
                  <div class="text-xs text-gray-500">供應商伺服器</div>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="text-orange-600">中等</span>
                  <div class="text-xs text-gray-500">可能被掃描</div>
                </td>
                <td class="px-4 py-3 text-center">⭐⭐</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-4 p-4 bg-blue-100 rounded-lg border border-blue-300">
          <h4 class="font-semibold text-sm text-blue-700 mb-3 flex items-center">
            <i class="pi pi-info-circle mr-2"></i>重要澄清說明
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
               <h5 class="font-semibold text-xs text-blue-600 mb-2">🔐 Claude API 醫療級安全</h5>
               <ul class="text-xs text-blue-700 space-y-1">
                 <li>• 提供醫療等級的資料安全保護</li>
                 <li>• 具備 <strong>HIPAA 認證</strong>，達到醫療等級保護</li>
                 <li>• 員工無法讀取您的對話內容</li>
                 <li>• 符合最嚴格的醫療隱私標準</li>
               </ul>
             </div>
            
            <div>
              <h5 class="font-semibold text-xs text-blue-600 mb-2">📋 其他工具比較</h5>
              <ul class="text-xs text-blue-700 space-y-1">
                <li>• LINE 端到端加密很好，但伺服器永久保存</li>
                <li>• Gmail 會主動掃描內容用於廣告</li>
                <li>• 雲端硬碟較安全但仍可能被政策掃描</li>
                <li>• 整體而言 Claude 仍是相對最安全的選擇</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-green-100 rounded-lg">
          <div class="flex items-center text-sm text-green-700">
            <i class="pi pi-check-circle mr-2"></i>
            <span><strong>結論：</strong>即使考量到這些限制，Claude 仍是目前處理敏感資料相對最安全的 AI 工具</span>
          </div>
        </div>
      </div>

      <!-- 常見安全疑問 -->
      <div class="mb-6 p-4 border-l-4 border-l-pink-500 bg-pink-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-pink-700 flex items-center">
          <i class="pi pi-question-circle mr-2"></i>常見安全疑問
        </h3>
        
        <div class="space-y-4">
          <div class="bg-white p-4 rounded-lg border border-pink-200">
            <h4 class="font-semibold text-sm text-pink-600 mb-2">❓ 資料會被洩露嗎？</h4>
            <p class="text-xs text-gray-700">
              <strong>答：</strong>不會。HIPAA 醫療級認證 + 端到端加密 + 嚴格存取控制，安全等級比 email 和雲端硬碟都高。
            </p>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-pink-200">
            <h4 class="font-semibold text-sm text-pink-600 mb-2">❓ 會被用來訓練AI嗎？</h4>
            <p class="text-xs text-gray-700">
              <strong>答：</strong>Claude 有嚴格的資料使用限制，提供醫療級的隱私保護，資料處理符合最高安全標準。
            </p>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-pink-200">
            <h4 class="font-semibold text-sm text-pink-600 mb-2">❓ 比其他AI安全嗎？</h4>
            <p class="text-xs text-gray-700">
              <strong>答：</strong>是的。Claude API是唯一有HIPAA認證的主流AI服務，安全等級最高。
            </p>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-pink-200">
            <h4 class="font-semibold text-sm text-pink-600 mb-2">❓ 機構會接受嗎？</h4>
            <p class="text-xs text-gray-700">
              <strong>答：</strong>很可能。HIPAA認證意味著符合醫療機構的安全標準，可提供給IT部門評估。
            </p>
          </div>
          

        </div>
      </div>

      <!-- 最終建議 -->
      <div class="p-4 border-l-4 border-l-emerald-500 bg-emerald-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-emerald-700 flex items-center">
          <i class="pi pi-thumbs-up mr-2"></i>使用建議總結
        </h3>
        
        <div class="bg-white p-4 rounded-lg border border-emerald-200">
          <div class="flex items-start space-x-3 mb-3">
            <i class="pi pi-star-fill text-yellow-500 text-lg mt-1"></i>
            <div>
              <h4 class="font-bold text-emerald-700">Claude API 安全等級：⭐⭐⭐⭐⭐</h4>
              <p class="text-sm text-gray-700 mt-1">
                提供目前可取得的最高AI安全保護，完全適合社工專業安全使用
              </p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h5 class="font-semibold text-sm text-emerald-600 mb-2">🚀 立即可用</h5>
              <ul class="text-xs text-gray-700 space-y-1">
                <li>• 適度去識別化後安全使用</li>
                <li>• 從簡單報告開始嘗試</li>
                <li>• 保持專業判斷優先</li>
                <li>• 與督導討論重要案件</li>
              </ul>
            </div>
            
            <div>
              <h5 class="font-semibold text-sm text-emerald-600 mb-2">📋 核心原則</h5>
              <ul class="text-xs text-gray-700 space-y-1">
                <li>• 技術上：比現有工具都安全</li>
                <li>• 法規上：符合最嚴格標準</li>
                <li>• 專業上：輔助不取代判斷</li>
                <li>• 實務上：簡單易用高效</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    
    <template #footer>
      <div class="flex justify-end space-x-2">
        <Button label="我了解了" icon="pi pi-check" @click="$emit('update:modelValue', false)" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
<template>
  <Dialog 
    :visible="modelValue"
    @update:visible="$emit('update:modelValue', $event)"
    header="📖 AI 社工報告系統使用說明" 
    :style="{ width: '95vw', maxWidth: '900px', height: '90vh' }"
    modal
    :draggable="false"
  >
    <div class="h-full overflow-y-auto pr-2" style="max-height: calc(90vh - 120px);">
      
      <!-- 系統概覽 -->
      <div class="mb-6 p-4 border-l-4 border-l-blue-500 bg-blue-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-blue-700 flex items-center">
          <i class="pi pi-star mr-2"></i>這是什麼系統？
        </h3>
        <p class="text-gray-700 leading-relaxed mb-4">
          這是一個<strong>專為社工設計的 AI 助手系統</strong>，可以幫您快速完成文書工作。無論是錄音檔案、會談記錄，還是直接輸入的文字，系統都能幫您整理成專業的社工報告，讓您有更多時間專注在案主服務上。
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
          <div class="text-center p-3 bg-white rounded-lg shadow-sm">
            <i class="pi pi-upload text-2xl text-purple-600 mb-2 block"></i>
            <div class="font-medium text-sm">1. 上傳資料</div>
            <div class="text-xs text-gray-500">錄音檔或文字</div>
          </div>
          <div class="text-center p-3 bg-white rounded-lg shadow-sm">
            <i class="pi pi-file-edit text-2xl text-green-600 mb-2 block"></i>
            <div class="font-medium text-sm">2. 檢查內容</div>
            <div class="text-xs text-gray-500">確認資料正確</div>
          </div>
          <div class="text-center p-3 bg-white rounded-lg shadow-sm">
            <i class="pi pi-robot text-2xl text-red-600 mb-2 block"></i>
            <div class="font-medium text-sm">3. 生成報告</div>
            <div class="text-xs text-gray-500">AI 自動整理</div>
          </div>
          <div class="text-center p-3 bg-white rounded-lg shadow-sm">
            <i class="pi pi-sitemap text-2xl text-cyan-600 mb-2 block"></i>
            <div class="font-medium text-sm">4. 關係分析</div>
            <div class="text-xs text-gray-500">圖像化呈現</div>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-blue-100 rounded-lg">
          <div class="flex items-center text-sm text-blue-700">
            <i class="pi pi-shield mr-2"></i>
            <span><strong>安全保證：</strong>使用 Claude API，具備 HIPAA 醫療級隱私保護認證，您的案主資料完全安全</span>
          </div>
        </div>
      </div>

      <!-- 具體怎麼使用 -->
      <div class="mb-6 p-4 border-l-4 border-l-green-500 bg-green-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-green-700 flex items-center">
          <i class="pi pi-list mr-2"></i>具體怎麼使用？
        </h3>
        
        <!-- 步驟1：準備資料 -->
        <div class="mb-4 bg-white p-4 rounded-lg border border-green-200">
          <div class="flex items-center mb-3">
            <span class="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
            <h4 class="font-bold text-lg text-green-700">準備您的會談資料</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <i class="pi pi-microphone text-green-600 text-2xl mb-2 block"></i>
              <h5 class="font-semibold text-sm text-green-700">錄音檔案</h5>
              <p class="text-xs text-gray-600 mt-1">
                訪談錄音、電話會談記錄<br>
                支援 MP3、WAV 等格式
              </p>
            </div>
            
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <i class="pi pi-file-edit text-green-600 text-2xl mb-2 block"></i>
              <h5 class="font-semibold text-sm text-green-700">文字檔案</h5>
              <p class="text-xs text-gray-600 mt-1">
                已整理的會談記錄<br>
                支援 TXT 文字檔案
              </p>
            </div>
            
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <i class="pi pi-pencil text-green-600 text-2xl mb-2 block"></i>
              <h5 class="font-semibold text-sm text-green-700">直接輸入</h5>
              <p class="text-xs text-gray-600 mt-1">
                手寫筆記、會談重點<br>
                直接複製貼上到系統
              </p>
            </div>
          </div>
        </div>

        <!-- 步驟2：檢查內容 -->
        <div class="mb-4 bg-white p-4 rounded-lg border border-green-200">
          <div class="flex items-center mb-3">
            <span class="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
            <h4 class="font-bold text-lg text-green-700">檢查和編輯內容</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 class="font-semibold text-sm text-green-600 mb-2">📝 如果是錄音檔</h5>
              <ul class="text-xs text-gray-700 space-y-1">
                <li>• 系統會自動將語音轉成文字</li>
                <li>• 可以播放音檔對照檢查</li>
                <li>• 修正錯誤的文字或標點符號</li>
                <li>• 調整段落分隔，讓內容更清楚</li>
              </ul>
            </div>
            
            <div>
              <h5 class="font-semibold text-sm text-green-600 mb-2">💾 資料保護</h5>
              <ul class="text-xs text-gray-700 space-y-1">
                <li>• 系統會自動儲存您的編輯</li>
                <li>• 所有資料都在您的電腦上處理</li>
                <li>• 建議先去除個人識別資訊</li>
                <li>• 可以隨時匯出備份</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 步驟3：生成報告 -->
        <div class="mb-4 bg-white p-4 rounded-lg border border-green-200">
          <div class="flex items-center mb-3">
            <span class="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
            <h4 class="font-bold text-lg text-green-700">AI 幫您生成專業報告</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 class="font-semibold text-sm text-green-600 mb-2">🤖 系統會自動整理</h5>
              <ul class="text-xs text-gray-700 space-y-1">
                <li>• <strong>主述議題：</strong>案主的求助問題</li>
                <li>• <strong>個案概況：</strong>家庭狀況、子女情形</li>
                <li>• <strong>各項評估：</strong>法律、經濟、安全等面向</li>
                <li>• <strong>需求評估：</strong>專業判斷和建議</li>
              </ul>
            </div>
            
            <div>
              <h5 class="font-semibold text-sm text-green-600 mb-2">✏️ 您可以調整</h5>
              <ul class="text-xs text-gray-700 space-y-1">
                <li>• 選擇需要的報告區段</li>
                <li>• 編輯 AI 生成的內容</li>
                <li>• 調整專業用詞和表達</li>
                <li>• 複製到您的正式文件</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 步驟4：關係圖分析 -->
        <div class="mb-4 bg-white p-4 rounded-lg border border-green-200">
          <div class="flex items-center mb-3">
            <span class="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
            <h4 class="font-bold text-lg text-green-700">視覺化人物關係</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 class="font-semibold text-sm text-green-600 mb-2">🌐 社會網絡圖</h5>
              <ul class="text-xs text-gray-700 space-y-1">
                <li>• 顯示案主的重要關係人</li>
                <li>• 用線條表示關係強弱</li>
                <li>• 可以拖拽調整位置</li>
                <li>• 一目了然的支持系統</li>
              </ul>
            </div>
            
            <div>
              <h5 class="font-semibold text-sm text-green-600 mb-2">👨‍👩‍👧‍👦 家庭關係圖</h5>
              <ul class="text-xs text-gray-700 space-y-1">
                <li>• 清楚的家庭結構圖</li>
                <li>• 世代關係一目了然</li>
                <li>• 婚姻狀態標示</li>
                <li>• 適合家事案件分析</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-3 p-2 bg-green-100 rounded">
            <h5 class="font-semibold text-sm text-green-600 mb-1">💬 智能對話編輯</h5>
            <p class="text-xs text-gray-700">
              可以用自然語言修改關係圖，例如說：「新增案主的姊姊，年齡30歲」、「刪除前配偶」
            </p>
          </div>
        </div>
      </div>

      <!-- 處遇計畫功能 -->
      <div class="mb-6 p-4 border-l-4 border-l-orange-500 bg-orange-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-orange-700 flex items-center">
          <i class="pi pi-calendar mr-2"></i>處遇計畫建議
        </h3>
        
        <div class="bg-white p-4 rounded-lg border border-orange-200">
          <p class="text-sm text-gray-700 mb-3">
            根據前面的報告內容，AI 會幫您生成專業的處遇計畫建議，包含：
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold text-sm text-orange-600 mb-2">📋 計畫內容</h4>
              <ul class="text-xs text-gray-700 space-y-1">
                <li>• <strong>處遇目標：</strong>要達成什麼成果</li>
                <li>• <strong>處遇策略：</strong>用什麼方法介入</li>
                <li>• <strong>實施步驟：</strong>具體的行動計畫</li>
                <li>• <strong>預期成效：</strong>如何評估成果</li>
              </ul>
            </div>
            
            <div>
              <h4 class="font-semibold text-sm text-orange-600 mb-2">💡 智能特色</h4>
              <ul class="text-xs text-gray-700 space-y-1">
                <li>• 自動分析案主需求</li>
                <li>• 考量現有資源狀況</li>
                <li>• 提供具體可行建議</li>
                <li>• 可以編輯調整內容</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 為什麼選擇 Claude -->
      <div class="mb-6 p-4 border-l-4 border-l-purple-500 bg-purple-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-purple-700 flex items-center">
          <i class="pi pi-shield mr-2"></i>為什麼選擇 Claude AI？
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-lg border border-purple-200">
            <h4 class="font-semibold text-sm text-purple-600 mb-2 flex items-center">
              <i class="pi pi-verified text-green-500 mr-2"></i>安全等級最高
            </h4>
            <ul class="text-xs text-gray-700 space-y-1">
              <li>• <strong>HIPAA 認證：</strong>醫療級隱私保護</li>
                             <li>• <strong>醫療級保護：</strong>符合最嚴格隱私標準</li>
                              <li>• <strong>隱私保護：</strong>嚴格限制資料使用</li>
              <li>• <strong>端到端加密：</strong>傳輸過程完全安全</li>
            </ul>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-purple-200">
            <h4 class="font-semibold text-sm text-purple-600 mb-2 flex items-center">
              <i class="pi pi-heart text-red-500 mr-2"></i>專業表現優秀
            </h4>
            <ul class="text-xs text-gray-700 space-y-1">
              <li>• 理解社工專業脈絡</li>
              <li>• 生成高品質報告</li>
              <li>• 符合倫理要求</li>
              <li>• 持續優化改進</li>
            </ul>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-purple-100 rounded-lg">
          <div class="flex items-center text-sm text-purple-700">
            <i class="pi pi-info-circle mr-2"></i>
            <span>目前 Claude 是唯一同時擁有 HIPAA 認證和優秀表現的 AI 服務，最適合社工專業使用</span>
          </div>
        </div>
      </div>

      <!-- 使用小提醒 -->
      <div class="mb-6 p-4 border-l-4 border-l-amber-500 bg-amber-50 rounded-r-lg">
        <h3 class="text-xl font-bold mb-3 text-amber-700 flex items-center">
          <i class="pi pi-lightbulb mr-2"></i>使用小提醒
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-lg border border-amber-200">
            <h4 class="font-semibold text-sm text-amber-600 mb-2">💡 提升效果</h4>
            <ul class="text-xs text-gray-700 space-y-1">
              <li class="flex items-start">
                <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                錄音環境盡量安靜，說話清楚
              </li>
              <li class="flex items-start">
                <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                適當去除個人識別資訊（姓名、地址等）
              </li>
              <li class="flex items-start">
                <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                檢查轉換的文字是否正確
              </li>
            </ul>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-amber-200">
            <h4 class="font-semibold text-sm text-amber-600 mb-2">🎯 專業原則</h4>
            <ul class="text-xs text-gray-700 space-y-1">
              <li class="flex items-start">
                <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                AI 是輔助工具，專業判斷仍由您決定
              </li>
              <li class="flex items-start">
                <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                重要決策請與督導討論
              </li>
              <li class="flex items-start">
                <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                生成的報告請再次檢視編輯
              </li>
            </ul>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-amber-100 rounded-lg">
          <div class="flex items-center text-sm text-amber-700">
            <i class="pi pi-info-circle mr-2"></i>
            <span>有任何問題或建議，歡迎隨時反映，我們會持續改進系統功能</span>
          </div>
        </div>
      </div>
      
    </div>
    
    <template #footer>
      <div class="flex justify-end space-x-2">
        <Button label="我知道了" icon="pi pi-check" @click="$emit('update:modelValue', false)" />
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
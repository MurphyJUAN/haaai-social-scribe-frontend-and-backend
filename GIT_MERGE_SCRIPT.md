# Git 合併執行腳本

## 執行前確認
1. 確保所有frontend和backend的變更都已經commit和push
2. 備份整個專案資料夾（建議）

## 步驟一：檢查當前狀態
```bash
# 檢查frontend git狀態
cd /Users/leoluonew/Documents/GitHub/haaai-social-scribe-frontend-and-backend/frontend
git status
git log --oneline -5  # 查看最近5次commit

# 檢查backend git狀態  
cd /Users/leoluonew/Documents/GitHub/haaai-social-scribe-frontend-and-backend/backend
git status
git log --oneline -5  # 查看最近5次commit
```

## 步驟二：在根目錄建立新的git倉庫
```bash
# 回到根目錄
cd /Users/leoluonew/Documents/GitHub/haaai-social-scribe-frontend-and-backend

# 初始化新的git倉庫
git init

# 設定基本配置（如果需要）
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## 步驟三：使用git subtree合併子專案
```bash
# 添加frontend為subtree（保留歷史）
git subtree add --prefix=frontend ./frontend main --squash

# 添加backend為subtree（保留歷史）
git subtree add --prefix=backend ./backend main --squash
```

## 步驟四：添加專案根目錄檔案
```bash
# 添加根目錄的檔案
git add CLAUDE.md DEVELOPER_GUIDE.md

# 如果有其他檔案也一起添加
git add .

# 提交所有變更
git commit -m "feat: Merge frontend and backend into unified repository

- Add frontend as subtree with preserved git history
- Add backend as subtree with preserved git history  
- Include project documentation (CLAUDE.md, DEVELOPER_GUIDE.md)
- Unified repository structure for better project management

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 步驟五：推送到新的遠端倉庫
```bash
# 添加新的遠端倉庫（替換成您的實際URL）
git remote add origin https://github.com/yourusername/haaai-social-scribe.git

# 推送到遠端
git branch -M main
git push -u origin main
```

## 驗證結果
```bash
# 檢查合併後的結構
ls -la

# 檢查git歷史
git log --oneline --graph -10

# 檢查subtree歷史（可選）
git log --oneline frontend/ | head -5
git log --oneline backend/ | head -5
```

## 後續清理（可選）
如果一切正常，您可以選擇：
```bash
# 重命名原有的.git目錄為備份
mv frontend/.git frontend/.git.backup
mv backend/.git backend/.git.backup
```

## 注意事項
1. **備份重要**：執行前建議備份整個專案資料夾
2. **歷史保留**：所有commit歷史都會保留在新倉庫中
3. **原倉庫不變**：原有的frontend和backend倉庫不會被破壞
4. **新的工作流程**：之後所有git操作都在根目錄進行

## 如果遇到問題
- 停止操作，檢查錯誤訊息
- 恢復備份
- 尋求協助解決問題後再重試
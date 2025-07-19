#!/bin/bash

# Git 合併執行腳本
# 創建時間: $(date)

echo "=== 開始執行 Git 合併流程 ==="

# 步驟一：備份專案
echo "步驟一：創建備份..."
BACKUP_NAME="haaai-social-scribe-frontend-and-backend-backup-$(date +%Y%m%d-%H%M%S)"
cp -r /Users/leoluonew/Documents/GitHub/haaai-social-scribe-frontend-and-backend /Users/leoluonew/Documents/GitHub/$BACKUP_NAME
echo "✅ 備份完成: $BACKUP_NAME"

# 步驟二：檢查當前git狀態
echo "步驟二：檢查當前git狀態..."
cd /Users/leoluonew/Documents/GitHub/haaai-social-scribe-frontend-and-backend

echo "Frontend git狀態:"
cd frontend
git status
echo "Frontend 最近5次commit:"
git log --oneline -5

echo "Backend git狀態:"
cd ../backend  
git status
echo "Backend 最近5次commit:"
git log --oneline -5

# 步驟三：回到根目錄並初始化新倉庫
echo "步驟三：在根目錄建立新的git倉庫..."
cd /Users/leoluonew/Documents/GitHub/haaai-social-scribe-frontend-and-backend

# 檢查是否已有.git目錄
if [ -d ".git" ]; then
    echo "警告: 根目錄已有.git目錄，將其重命名為備份"
    mv .git .git.backup.$(date +%Y%m%d-%H%M%S)
fi

git init
echo "✅ 新git倉庫已初始化"

# 步驟四：使用git subtree添加子專案
echo "步驟四：使用git subtree合併子專案..."

echo "添加frontend為subtree..."
git subtree add --prefix=frontend ./frontend main --squash
echo "✅ Frontend subtree 添加完成"

echo "添加backend為subtree..."  
git subtree add --prefix=backend ./backend main --squash
echo "✅ Backend subtree 添加完成"

# 步驟五：添加根目錄檔案並提交
echo "步驟五：添加根目錄檔案並提交..."
git add CLAUDE.md DEVELOPER_GUIDE.md GIT_MERGE_SCRIPT.md EXECUTE_GIT_MERGE.sh

# 添加其他可能的根目錄檔案
git add .gitignore README.md 2>/dev/null || true

git commit -m "feat: Merge frontend and backend into unified repository

- Add frontend as subtree with preserved git history
- Add backend as subtree with preserved git history  
- Include project documentation (CLAUDE.md, DEVELOPER_GUIDE.md)
- Unified repository structure for better project management

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

echo "✅ 所有變更已提交"

# 步驟六：顯示結果
echo "步驟六：驗證結果..."
echo "當前目錄結構:"
ls -la

echo "Git 歷史記錄 (最近10次):"
git log --oneline --graph -10

echo "Frontend 相關的commit:"
git log --oneline frontend/ | head -5

echo "Backend 相關的commit:"
git log --oneline backend/ | head -5

echo ""
echo "=== Git 合併完成！ ==="
echo ""
echo "下一步:"
echo "1. 檢查合併結果是否正確"
echo "2. 創建新的GitHub倉庫"
echo "3. 執行以下命令推送到遠端:"
echo "   git remote add origin <your-new-repo-url>"
echo "   git branch -M main" 
echo "   git push -u origin main"
echo ""
echo "備份位置: /Users/leoluonew/Documents/GitHub/$BACKUP_NAME"
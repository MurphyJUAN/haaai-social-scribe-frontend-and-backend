#!/bin/bash

# ----------------------------
# CONFIG
# ----------------------------
BACKEND_DIR=/home/leoluo/hssai-social-scribe/backend
FRONTEND_DIR=/home/leoluo/hssai-social-scribe/frontend
FRONTEND_PORT=5174
BACKEND_PORT=5353

echo "============================"
echo "🔧 啟動後端服務"
echo "============================"
cd "$BACKEND_DIR" || { echo "❌ 找不到後端目錄：$BACKEND_DIR"; exit 1; }

# 檢查 venv 是否存在
if [ ! -f "$BACKEND_DIR/venv/bin/activate" ]; then
  echo "❌ 找不到虛擬環境 venv，請先建立 venv 並安裝依賴"
else
  source venv/bin/activate
  echo "✅ 虛擬環境已啟動"

  if lsof -i :$BACKEND_PORT > /dev/null; then
    echo "✅ Flask (port $BACKEND_PORT) 已在執行中"
  else
    echo "🚀 啟動 Flask 服務 (port $BACKEND_PORT)..."
    nohup python3 "$BACKEND_DIR/app.py" > "$BACKEND_DIR/backend.log" 2>&1 &
    sleep 2
    if curl -s --head http://127.0.0.1:$BACKEND_PORT | grep "200 OK" > /dev/null; then
      echo "✅ Flask 啟動成功"
    else
      echo "❌ Flask 未啟動成功，請檢查 backend.log"
    fi
  fi

  deactivate
fi

echo ""
echo "============================"
echo "🎨 啟動前端服務"
echo "============================"
cd "$FRONTEND_DIR" || { echo "❌ 找不到前端目錄：$FRONTEND_DIR"; exit 1; }

if lsof -i :$FRONTEND_PORT > /dev/null; then
  echo "✅ 前端 (port $FRONTEND_PORT) 已在執行中"
else
  echo "🚀 啟動前端 Vite (port $FRONTEND_PORT)..."
  nohup npm run dev -- --host=0.0.0.0 --port=$FRONTEND_PORT > frontend.log 2>&1 &
  sleep 2
  if lsof -i :$FRONTEND_PORT > /dev/null; then
    echo "✅ 前端啟動成功"
  else
    echo "❌ 前端未啟動成功，請檢查 frontend.log"
  fi
fi

echo ""
echo "🎉 所有服務已嘗試啟動完畢"
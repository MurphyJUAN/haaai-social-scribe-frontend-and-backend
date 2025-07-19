#!/bin/bash

echo "============================"
echo "🛑 停止後端 Flask (port 5353)"
echo "============================"
pkill -u leoluo -f "python app.py"

sleep 1
if lsof -i :5353 > /dev/null; then
  echo "❌ Flask 仍在執行中，請手動檢查"
else
  echo "✅ Flask 已成功停止"
fi

echo ""
echo "============================"
echo "🛑 停止前端 Vite (port 5174)"
echo "============================"
pkill -u leoluo -f "vite"

sleep 1
if lsof -i :5174 > /dev/null; then
  echo "❌ Vite 仍在執行中，請手動檢查"
else
  echo "✅ Vite 已成功停止"
fi

echo ""
echo "✅ 所有服務已嘗試停止完畢"
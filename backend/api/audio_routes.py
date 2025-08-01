"""
音頻處理相關的API路由
包含音頻轉錄和文本校正功能，支援大文件自動切分
"""

from flask import Blueprint, request, jsonify
import requests
import os
from werkzeug.utils import secure_filename
import tempfile
import math
from pydub import AudioSegment
from pydub.utils import make_chunks

# 創建藍圖
audio_bp = Blueprint('audio', __name__, url_prefix='/api/audio')

# 配置常數
MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE_MB', 15)) * 1024 * 1024  # 預設 15MB
CHUNK_DURATION_MS = int(os.getenv('CHUNK_DURATION_MINUTES', 10)) * 60 * 1000  # 預設 10分鐘

# 獲取 OpenAI API 金鑰
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if not OPENAI_API_KEY:
    raise ValueError("請設置 OPENAI_API_KEY 環境變量")

@audio_bp.route('/transcribe', methods=['POST'])
def transcribe_audio():
    """
    音頻轉錄端點
    接收音頻文件並使用 OpenAI Whisper 進行轉錄，然後自動校正
    支援大文件自動切分（超過15MB）
    """
    temp_files = []  # 記錄所有創建的臨時文件，用於清理
    
    try:
        # 檢查是否有文件上傳
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': '沒有上傳文件'
            }), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': '沒有選擇文件'
            }), 400
        
        # 創建臨時文件來儲存上傳的音頻
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.split('.')[-1]}") as temp_file:
            file.save(temp_file.name)
            temp_files.append(temp_file.name)
            
            # 檢查文件大小
            file_size = os.path.getsize(temp_file.name)
            print(f"上傳文件大小: {file_size / (1024*1024):.2f} MB")
            
            # 從 form data 中獲取語言參數
            language = request.form.get('language')
            
            if file_size <= MAX_FILE_SIZE:
                # 小文件直接處理
                transcript = transcribe_single_file(temp_file.name, file.filename, file.content_type, language)
            else:
                # 大文件需要切分處理
                print(f"文件超過 {MAX_FILE_SIZE/(1024*1024)} MB，開始切分處理...")
                transcript = transcribe_large_file(temp_file.name, temp_files, language)
        
        if not transcript:
            return jsonify({
                'success': False,
                'error': '轉錄結果為空'
            }), 400
        
        # 自動執行文本校正
        corrected_transcript = await_correct_transcript(transcript)
        
        return jsonify({
            'success': True,
            'data': {
                'original_transcript': transcript,
                'corrected_transcript': corrected_transcript,
                'final_transcript': corrected_transcript if corrected_transcript else transcript,
                'was_chunked': file_size > MAX_FILE_SIZE,
                'file_size_mb': round(file_size / (1024*1024), 2)
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'服務器內部錯誤: {str(e)}'
        }), 500
        
    finally:
        # 清理所有臨時文件
        for temp_file_path in temp_files:
            try:
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
            except Exception as e:
                print(f"清理臨時文件失敗: {temp_file_path}, 錯誤: {e}")

def transcribe_single_file(file_path, original_filename, content_type, language=None):
    """
    轉錄單個文件
    """
    try:
        with open(file_path, 'rb') as audio_file:
            files = {
                'file': (original_filename, audio_file, content_type)
            }
            data = {
                'model': 'whisper-1',
                'response_format': 'text'
            }
            
            # 如果指定了語言，加入參數
            if language:
                data['language'] = language
            
            headers = {
                'Authorization': f'Bearer {OPENAI_API_KEY}'
            }
            
            response = requests.post(
                'https://api.openai.com/v1/audio/transcriptions',
                files=files,
                data=data,
                headers=headers,
                timeout=120
            )
            
            if not response.ok:
                raise Exception(f'OpenAI API 請求失敗: {response.status_code} {response.text}')
            
            return response.text.strip()
            
    except Exception as e:
        raise Exception(f'單文件轉錄失敗: {str(e)}')

def transcribe_large_file(file_path, temp_files, language=None):
    """
    處理大文件：切分成小段後逐個轉錄
    """
    try:
        # 載入音頻文件
        print("正在載入音頻文件...")
        audio = AudioSegment.from_file(file_path)
        
        # 計算需要的切片數量
        total_duration = len(audio)  # 毫秒
        chunk_count = math.ceil(total_duration / CHUNK_DURATION_MS)
        
        print(f"音頻總長度: {total_duration/1000/60:.1f} 分鐘")
        print(f"將切分為 {chunk_count} 個片段進行處理")
        
        # 切分音頻
        chunks = make_chunks(audio, CHUNK_DURATION_MS)
        transcripts = []
        
        for i, chunk in enumerate(chunks):
            print(f"正在處理第 {i+1}/{len(chunks)} 個片段...")
            
            # 為每個片段創建臨時文件
            chunk_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
            temp_files.append(chunk_file.name)
            
            # 導出片段到臨時文件
            chunk.export(chunk_file.name, format="mp3")
            chunk_file.close()
            
            # 轉錄這個片段
            try:
                chunk_transcript = transcribe_single_file(
                    chunk_file.name, 
                    f"chunk_{i+1}.mp3", 
                    "audio/mpeg",
                    language  # 傳遞語言參數
                )
                
                if chunk_transcript:
                    transcripts.append(chunk_transcript)
                    print(f"片段 {i+1} 轉錄完成: {len(chunk_transcript)} 字符")
                else:
                    print(f"片段 {i+1} 轉錄結果為空")
                    
            except Exception as e:
                print(f"片段 {i+1} 轉錄失敗: {str(e)}")
                # 繼續處理下一個片段，不中斷整個流程
                transcripts.append(f"[片段 {i+1} 轉錄失敗]")
        
        # 合併所有轉錄結果
        if transcripts:
            full_transcript = "\n\n".join(transcripts)
            print(f"轉錄完成，總計 {len(full_transcript)} 字符")
            return full_transcript
        else:
            raise Exception("所有片段轉錄都失敗了")
            
    except Exception as e:
        raise Exception(f'大文件處理失敗: {str(e)}')

@audio_bp.route('/correct', methods=['POST'])
def correct_transcript():
    """
    文本校正端點
    使用 GPT 校正語音識別的逐字稿
    """
    try:
        data = request.get_json()
        
        if not data or 'transcript' not in data:
            return jsonify({
                'success': False,
                'error': '請提供要校正的文本'
            }), 400
        
        transcript = data['transcript']
        system_prompt = data.get('systemPrompt', '你是一位中文逐字稿校對助手，請幫我修正語音辨識轉換的逐字稿中可能錯誤的字詞。不要改變語意，只做錯字修正，並在適當的時候加上換行符號增加可讀性。')
        model = data.get('model', 'gpt-4o-mini-2024-07-18')
        temperature = data.get('temperature', 0.2)
        
        if not transcript.strip():
            return jsonify({
                'success': False,
                'error': '文本內容不能為空'
            }), 400
        
        corrected_text = await_correct_transcript(transcript, system_prompt, model, temperature)
        
        return jsonify({
            'success': True,
            'data': {
                'original_transcript': transcript,
                'corrected_transcript': corrected_text,
                'final_transcript': corrected_text if corrected_text else transcript
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'文本校正失敗: {str(e)}'
        }), 500

def await_correct_transcript(transcript, system_prompt=None, model=None, temperature=None):
    """
    使用 OpenAI GPT 校正逐字稿
    """
    try:
        if system_prompt is None:
            system_prompt = """你是一位中文逐字稿校對助手，請幫我修正語音辨識轉換的逐字稿中可能錯誤的字詞。不要改變語意，只做錯字修正，並在適當的時候加上換行符號增加可讀性。"""
        
        if model is None:
            model = 'gpt-4o-mini-2024-07-18'
            
        if temperature is None:
            temperature = 0.2
        
        headers = {
            'Authorization': f'Bearer {OPENAI_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': model,
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': transcript}
            ],
            'temperature': temperature
        }
        
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if not response.ok:
            print(f"GPT API 請求失敗: {response.status_code} {response.text}")
            return None
        
        data = response.json()
        corrected_text = data.get('choices', [{}])[0].get('message', {}).get('content', '').strip()
        
        if corrected_text:
            return corrected_text
        else:
            print("GPT 回傳內容為空，保留原始逐字稿")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"GPT API 請求錯誤: {str(e)}")
        return None
    except Exception as e:
        print(f"文本校正錯誤: {str(e)}")
        return None

@audio_bp.route('/health', methods=['GET'])
def audio_health_check():
    """音頻模組健康檢查"""
    return jsonify({
        'status': 'healthy',
        'message': '音頻處理模組運行正常',
        'openai_configured': bool(OPENAI_API_KEY)
    })
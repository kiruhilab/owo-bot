#!/usr/bin/env python3
"""
OWO Bot Local Server
--------------------
Bu script bilgisayarınızda çalışır ve telefondan gelen komutları Discord'a yazar.

Kullanım:
1. pip install flask pyautogui
2. python server.py
3. Telefondan uygulamayı açın ve bilgisayarın IP adresini girin
4. Discord penceresini açık tutun
"""

import time
import random
import threading
import socket
from flask import Flask, request, jsonify
from flask_cors import CORS

try:
    import pyautogui
    PYAUTOGUI_AVAILABLE = True
except ImportError:
    PYAUTOGUI_AVAILABLE = False
    print("⚠️ pyautogui yüklü değil! 'pip install pyautogui' komutunu çalıştırın.")

app = Flask(__name__)
CORS(app)  # React Native'den bağlantıya izin ver

# Bot durumu
bot_state = {
    "is_running": False,
    "command_count": 0,
    "last_command": None,
    "authorized": False,
    "pending_auth": False,
}

# Ayarlar
settings = {
    "commands": [
        {"id": "hunt", "command": "owo h", "enabled": True, "delay_base": 2.0, "delay_spread": 1.0},
        {"id": "battle", "command": "owo b", "enabled": True, "delay_base": 2.5, "delay_spread": 1.5},
        {"id": "pray", "command": "owo pray", "enabled": False, "delay_base": 300, "delay_spread": 60},
        {"id": "daily", "command": "owo daily", "enabled": False, "delay_base": 86400, "delay_spread": 3600},
    ],
    "loop_delay": 15.0,
    "loop_spread": 5.0,
}

bot_thread = None
stop_event = threading.Event()


def get_local_ip():
    """Yerel IP adresini al"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"


def type_command(command: str):
    """Komutu Discord'a yaz"""
    if not PYAUTOGUI_AVAILABLE:
        print(f"[SIM] Yazılacak: {command}")
        return True
    
    try:
        # Komutu yaz ve Enter'a bas
        pyautogui.typewrite(command, interval=0.05)
        pyautogui.press('enter')
        return True
    except Exception as e:
        print(f"❌ Yazma hatası: {e}")
        return False


def bot_loop():
    """Ana bot döngüsü"""
    global bot_state
    
    print("🤖 Bot döngüsü başladı")
    
    while not stop_event.is_set():
        if not bot_state["is_running"]:
            time.sleep(0.5)
            continue
        
        enabled_commands = [c for c in settings["commands"] if c["enabled"]]
        
        if not enabled_commands:
            print("⚠️ Aktif komut yok")
            bot_state["is_running"] = False
            continue
        
        for cmd in enabled_commands:
            if stop_event.is_set() or not bot_state["is_running"]:
                break
            
            command = cmd["command"]
            print(f"📤 Gönderiliyor: {command}")
            
            if type_command(command):
                bot_state["command_count"] += 1
                bot_state["last_command"] = command
                print(f"✅ Gönderildi: {command} (Toplam: {bot_state['command_count']})")
            
            # Komut arası bekleme
            delay = cmd["delay_base"] + random.random() * cmd["delay_spread"]
            print(f"⏰ {delay:.1f}s bekleniyor...")
            
            # Beklerken stop_event'i kontrol et
            for _ in range(int(delay * 10)):
                if stop_event.is_set() or not bot_state["is_running"]:
                    break
                time.sleep(0.1)
        
        # Döngü arası bekleme
        if bot_state["is_running"] and not stop_event.is_set():
            loop_delay = settings["loop_delay"] + random.random() * settings["loop_spread"]
            print(f"🔄 Döngü tamamlandı. {loop_delay:.1f}s sonra tekrar...")
            
            for _ in range(int(loop_delay * 10)):
                if stop_event.is_set() or not bot_state["is_running"]:
                    break
                time.sleep(0.1)
    
    print("🛑 Bot döngüsü durduruldu")


# API Endpoints

@app.route('/api/status', methods=['GET'])
def get_status():
    """Bot durumunu al"""
    return jsonify({
        "success": True,
        "state": bot_state,
        "settings": settings,
        "pyautogui_available": PYAUTOGUI_AVAILABLE,
    })


@app.route('/api/auth/request', methods=['POST'])
def request_auth():
    """Yetkilendirme isteği"""
    data = request.json
    device_name = data.get("device_name", "Bilinmeyen Cihaz")
    
    bot_state["pending_auth"] = True
    print(f"\n{'='*50}")
    print(f"📱 YETKİLENDİRME İSTEĞİ: {device_name}")
    print(f"{'='*50}")
    print("Bu cihazın bağlanmasına izin vermek istiyor musunuz?")
    print("Konsola 'evet' veya 'hayir' yazın...")
    
    return jsonify({
        "success": True,
        "message": "Yetkilendirme isteği gönderildi. Bilgisayardan onay bekleniyor.",
        "pending": True,
    })


@app.route('/api/auth/check', methods=['GET'])
def check_auth():
    """Yetkilendirme durumunu kontrol et"""
    return jsonify({
        "success": True,
        "authorized": bot_state["authorized"],
        "pending": bot_state["pending_auth"],
    })


@app.route('/api/auth/approve', methods=['POST'])
def approve_auth():
    """Yetkilendirmeyi onayla (bilgisayardan)"""
    bot_state["authorized"] = True
    bot_state["pending_auth"] = False
    print("✅ Yetkilendirme onaylandı!")
    return jsonify({"success": True, "authorized": True})


@app.route('/api/auth/deny', methods=['POST'])
def deny_auth():
    """Yetkilendirmeyi reddet"""
    bot_state["authorized"] = False
    bot_state["pending_auth"] = False
    print("❌ Yetkilendirme reddedildi!")
    return jsonify({"success": True, "authorized": False})


@app.route('/api/bot/start', methods=['POST'])
def start_bot():
    """Botu başlat"""
    if not bot_state["authorized"]:
        return jsonify({"success": False, "error": "Yetkilendirme gerekli"}), 401
    
    if bot_state["is_running"]:
        return jsonify({"success": False, "error": "Bot zaten çalışıyor"})
    
    bot_state["is_running"] = True
    bot_state["command_count"] = 0
    print("🚀 Bot başlatıldı!")
    
    return jsonify({
        "success": True,
        "message": "Bot başlatıldı",
        "state": bot_state,
    })


@app.route('/api/bot/stop', methods=['POST'])
def stop_bot():
    """Botu durdur"""
    bot_state["is_running"] = False
    print(f"⏹️ Bot durduruldu. Toplam {bot_state['command_count']} komut gönderildi.")
    
    return jsonify({
        "success": True,
        "message": f"Bot durduruldu. {bot_state['command_count']} komut gönderildi.",
        "state": bot_state,
    })


@app.route('/api/bot/send', methods=['POST'])
def send_command():
    """Tek komut gönder"""
    if not bot_state["authorized"]:
        return jsonify({"success": False, "error": "Yetkilendirme gerekli"}), 401
    
    data = request.json
    command = data.get("command", "")
    
    if not command:
        return jsonify({"success": False, "error": "Komut boş"})
    
    print(f"📤 Manuel komut: {command}")
    success = type_command(command)
    
    if success:
        bot_state["command_count"] += 1
        bot_state["last_command"] = command
    
    return jsonify({
        "success": success,
        "command": command,
        "state": bot_state,
    })


@app.route('/api/settings', methods=['GET'])
def get_settings():
    """Ayarları al"""
    return jsonify({"success": True, "settings": settings})


@app.route('/api/settings', methods=['POST'])
def update_settings():
    """Ayarları güncelle"""
    if not bot_state["authorized"]:
        return jsonify({"success": False, "error": "Yetkilendirme gerekli"}), 401
    
    data = request.json
    
    if "commands" in data:
        settings["commands"] = data["commands"]
    if "loop_delay" in data:
        settings["loop_delay"] = data["loop_delay"]
    if "loop_spread" in data:
        settings["loop_spread"] = data["loop_spread"]
    
    print("⚙️ Ayarlar güncellendi")
    return jsonify({"success": True, "settings": settings})


@app.route('/api/commands/toggle', methods=['POST'])
def toggle_command():
    """Komut durumunu değiştir"""
    if not bot_state["authorized"]:
        return jsonify({"success": False, "error": "Yetkilendirme gerekli"}), 401
    
    data = request.json
    command_id = data.get("id")
    
    for cmd in settings["commands"]:
        if cmd["id"] == command_id:
            cmd["enabled"] = not cmd["enabled"]
            print(f"🔄 {cmd['command']}: {'Açık' if cmd['enabled'] else 'Kapalı'}")
            return jsonify({"success": True, "command": cmd})
    
    return jsonify({"success": False, "error": "Komut bulunamadı"})


def auth_input_thread():
    """Konsol girişi ile yetkilendirme"""
    global bot_state
    
    while True:
        try:
            user_input = input().strip().lower()
            
            if user_input in ["evet", "yes", "e", "y"]:
                bot_state["authorized"] = True
                bot_state["pending_auth"] = False
                print("✅ Yetkilendirme onaylandı!")
            elif user_input in ["hayir", "no", "h", "n"]:
                bot_state["authorized"] = False
                bot_state["pending_auth"] = False
                print("❌ Yetkilendirme reddedildi!")
        except:
            pass


if __name__ == '__main__':
    local_ip = get_local_ip()
    port = 5000
    
    print("=" * 60)
    print("🤖 OWO Bot Local Server")
    print("=" * 60)
    print(f"\n📍 Sunucu Adresi: http://{local_ip}:{port}")
    print(f"📱 Telefon Uygulamasında Bu Adresi Girin!")
    print("\n⚠️  Gereklilikler:")
    print("   - Discord penceresi açık ve odaklanmış olmalı")
    print("   - Telefon ve bilgisayar aynı WiFi'da olmalı")
    print("\n" + "=" * 60)
    
    if not PYAUTOGUI_AVAILABLE:
        print("\n⚠️  UYARI: pyautogui yüklü değil!")
        print("   Yüklemek için: pip install pyautogui")
        print("   Simülasyon modunda çalışıyor...\n")
    
    # Bot döngüsünü başlat
    stop_event.clear()
    bot_thread = threading.Thread(target=bot_loop, daemon=True)
    bot_thread.start()
    
    # Konsol girişi thread'i
    auth_thread = threading.Thread(target=auth_input_thread, daemon=True)
    auth_thread.start()
    
    # Flask sunucusunu başlat
    print("\n🚀 Sunucu başlatılıyor...\n")
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)

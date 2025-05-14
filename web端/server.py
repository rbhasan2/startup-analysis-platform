#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Web前端服务器启动脚本

import http.server
import socketserver
import os
import sys
import webbrowser
from threading import Timer

# 确保使用UTF-8编码输出
if sys.platform.startswith('win'):
    import ctypes
    kernel32 = ctypes.windll.kernel32
    kernel32.SetConsoleCP(65001)
    kernel32.SetConsoleOutputCP(65001)
    
# 输出带颜色的文本
def print_color(text, color_code):
    colors = {
        'green': '\033[92m',
        'yellow': '\033[93m',
        'blue': '\033[94m',
        'red': '\033[91m',
        'end': '\033[0m'
    }
    print(f"{colors.get(color_code, '')}{text}{colors['end']}")

# 定义端口
PORT = 3000

# 切换到脚本所在目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# 创建HTTP服务器
Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print_color("===== 创业分析平台 Web前端服务 =====", "blue")
print_color(f"正在启动Web前端服务器...", "green")
print_color(f"请访问: http://localhost:{PORT}", "yellow")
print_color("按下 Ctrl+C 可停止服务器", "yellow")

# 自动打开浏览器
def open_browser():
    webbrowser.open(f'http://localhost:{PORT}')
    
Timer(1, open_browser).start()

# 开始服务
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print_color("\n服务已停止", "red")
    httpd.server_close()

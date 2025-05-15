#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Web前端服务器启动脚本 - 增强版

import http.server
import socketserver
import os
import sys
import webbrowser
import time
import mimetypes
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
PORT = 3000  # 打开前记得关闭之前打开的窗口，释放端口

# 切换到脚本所在目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# 增强型HTTP请求处理器，用于更好地处理图片和缓存
class EnhancedHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):    
    def end_headers(self):
        # 添加跨域头 - 允许所有来源访问
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        
        # 处理图片的缓存控制
        if self.path.endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico')):
            # 禁用缓存，确保每次都获取最新图片
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            
            # 添加内容类型检测（防止MIME类型问题）
            ext = os.path.splitext(self.path)[1]
            if ext in mimetypes.types_map:
                self.send_header('Content-Type', mimetypes.types_map[ext])
        
        # 调用父类方法完成头部发送
        super().end_headers()
    
    def log_message(self, format, *args):
        # 根据请求类型使用颜色输出
        if len(args) > 0:
            req = args[0].split()
            if len(req) > 1:
                method = req[0]
                path = req[1]
                status = args[1]
                
                # 日志格式美化
                if path.endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp')):
                    print_color(f"{method} 图片请求: {path} - {status}", "yellow")
                elif path.endswith(('.html')):
                    print_color(f"{method} 页面请求: {path} - {status}", "blue")
                elif path.endswith(('.css', '.js')):
                    print_color(f"{method} 资源请求: {path} - {status}", "green")
                else:
                    # 使用原始日志格式
                    super().log_message(format, *args)
            else:
                super().log_message(format, *args)
        else:
            super().log_message(format, *args)
            
    def do_GET(self):
        # 为图片请求添加特殊处理
        try:
            # 检查文件是否存在
            if self.path.endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg')):
                file_path = self.translate_path(self.path)
                
                if not os.path.exists(file_path):
                    print_color(f"警告: 图片不存在 {self.path}", "red")
                    
                    # 尝试查找替代格式
                    base_path = os.path.splitext(file_path)[0]
                    for ext in ['.png', '.jpg', '.svg', '.gif']:
                        alt_path = base_path + ext
                        if os.path.exists(alt_path):
                            print_color(f"找到替代图片格式: {alt_path}", "green")
                            # 修改路径为替代格式
                            self.path = self.path.rsplit('.', 1)[0] + ext
                            break
            
            # 继续正常处理
            return super().do_GET()
        except Exception as e:
            print_color(f"请求处理错误: {e}", "red")
            return super().do_GET()

# 创建HTTP服务器
Handler = EnhancedHTTPRequestHandler
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
    # 检查图片文件
    print_color("检查图片资源完整性...", "blue")
    image_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
    
    if os.path.exists(image_dir):
        # 检查必要的图片文件
        required_images = [
            "logo.png", "logo.svg", "logo-white.png", 
            "avatar-default.png", "avatar-default.svg", 
            "banner-illustration.png", "empty-data.svg", 
            "ai-avatar.png", "ai-avatar.svg"
        ]
        
        missing_images = []
        for img in required_images:
            if not os.path.exists(os.path.join(image_dir, img)):
                missing_images.append(img)
        
        if missing_images:
            print_color(f"警告: 缺少 {len(missing_images)} 个图片文件:", "red")
            for img in missing_images:
                print_color(f"  - {img}", "red")
            
            print_color("尝试从其他格式复制...", "yellow")
            for img in missing_images:
                base_name = os.path.splitext(img)[0]
                alt_formats = [".png", ".svg"]
                
                for fmt in alt_formats:
                    alt_img = base_name + fmt
                    if alt_img != img and os.path.exists(os.path.join(image_dir, alt_img)):
                        src_path = os.path.join(image_dir, alt_img)
                        dst_path = os.path.join(image_dir, img)
                        try:
                            with open(src_path, 'rb') as src_file:
                                with open(dst_path, 'wb') as dst_file:
                                    dst_file.write(src_file.read())
                            print_color(f"  已创建: {img} (从 {alt_img} 复制)", "green")
                            break
                        except:
                            print_color(f"  无法复制 {alt_img} 到 {img}", "red")
        else:
            print_color("所有必要图片文件都存在", "green")
    else:
        print_color("警告: 未找到images目录!", "red")
    
    print_color("服务器启动中...", "green")
    httpd.serve_forever()
except KeyboardInterrupt:
    print_color("\n服务已停止", "red")
    httpd.server_close()
except Exception as e:
    print_color(f"\n服务器错误: {str(e)}", "red")
    print_color("如果端口被占用，请尝试关闭占用的程序后重试", "yellow")

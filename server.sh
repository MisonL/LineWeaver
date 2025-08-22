#!/bin/bash

# TextFlow 在线体验环境管理脚本
# 用于启动、停止和管理本地开发服务器

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="TextFlow"
PORT=8080
PID_FILE=".server.pid"

# 函数：打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 函数：检查端口是否被占用
check_port() {
    if lsof -i :$PORT > /dev/null 2>&1; then
        return 0  # 端口被占用
    else
        return 1  # 端口空闲
    fi
}

# 函数：启动服务器
start_server() {
    print_message $BLUE "🌊 启动 $PROJECT_NAME 在线体验环境..."
    
    if check_port; then
        print_message $YELLOW "⚠️  端口 $PORT 已被占用，正在检查是否为本项目服务..."
        if [ -f "$PID_FILE" ]; then
            local pid=$(cat $PID_FILE)
            if ps -p $pid > /dev/null 2>&1; then
                print_message $GREEN "✅ $PROJECT_NAME 服务已在运行 (PID: $pid)"
                show_status
                return 0
            else
                print_message $YELLOW "🔄 清理无效的PID文件..."
                rm -f $PID_FILE
            fi
        fi
        print_message $RED "❌ 端口 $PORT 被其他服务占用，请先释放该端口"
        return 1
    fi
    
    # 启动Python HTTP服务器
    python3 -m http.server $PORT > /dev/null 2>&1 &
    local server_pid=$!
    echo $server_pid > $PID_FILE
    
    # 等待服务器启动
    sleep 2
    
    # 验证服务器是否成功启动
    if curl -s http://localhost:$PORT > /dev/null; then
        print_message $GREEN "🎉 $PROJECT_NAME 在线体验环境启动成功！"
        show_status
    else
        print_message $RED "❌ 服务器启动失败"
        cleanup
        return 1
    fi
}

# 函数：停止服务器
stop_server() {
    print_message $BLUE "🛑 停止 $PROJECT_NAME 在线体验环境..."
    
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat $PID_FILE)
        if ps -p $pid > /dev/null 2>&1; then
            kill $pid
            print_message $GREEN "✅ 服务已停止 (PID: $pid)"
        else
            print_message $YELLOW "⚠️  服务进程不存在"
        fi
        rm -f $PID_FILE
    else
        print_message $YELLOW "⚠️  未找到PID文件，尝试通过端口停止服务..."
        if check_port; then
            pkill -f "python3 -m http.server $PORT" || true
            print_message $GREEN "✅ 已尝试停止端口 $PORT 上的服务"
        else
            print_message $YELLOW "ℹ️  端口 $PORT 上没有运行的服务"
        fi
    fi
}

# 函数：重启服务器
restart_server() {
    print_message $BLUE "🔄 重启 $PROJECT_NAME 在线体验环境..."
    stop_server
    sleep 1
    start_server
}

# 函数：显示服务状态
show_status() {
    print_message $PURPLE "📊 $PROJECT_NAME 在线体验状态"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if check_port; then
        print_message $GREEN "🟢 服务状态：运行中"
        print_message $BLUE "🌐 访问地址：http://localhost:$PORT"
        print_message $BLUE "📱 主应用：http://localhost:$PORT/"
        print_message $BLUE "🧪 测试页面：http://localhost:$PORT/test.html"
        print_message $BLUE "📊 状态页面：http://localhost:$PORT/status.html"
        
        if [ -f "$PID_FILE" ]; then
            local pid=$(cat $PID_FILE)
            print_message $BLUE "🔍 进程ID：$pid"
        fi
    else
        print_message $RED "🔴 服务状态：未运行"
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# 函数：清理资源
cleanup() {
    rm -f $PID_FILE
}

# 函数：显示帮助信息
show_help() {
    print_message $PURPLE "🌊 TextFlow 在线体验环境管理器"
    echo
    echo "用法: $0 [命令]"
    echo
    echo "可用命令："
    echo "  start     启动在线体验环境"
    echo "  stop      停止在线体验环境"
    echo "  restart   重启在线体验环境"
    echo "  status    显示服务状态"
    echo "  help      显示此帮助信息"
    echo
    echo "示例："
    echo "  $0 start     # 启动服务"
    echo "  $0 status    # 查看状态"
    echo "  $0 stop      # 停止服务"
}

# 主程序
case "${1:-help}" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_message $RED "❌ 未知命令: $1"
        echo
        show_help
        exit 1
        ;;
esac

# 清理退出
trap cleanup EXIT
#!/bin/bash

# LineWeaver - 一键部署脚本
# 深度清理部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 配置
CONTAINER_NAME="lineweaver"
IMAGE_NAME="lineweaver:latest"
PORT=8080

# 检查Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker未安装，请先安装Docker"
    exit 1
fi

if ! docker info &> /dev/null; then
    print_error "Docker守护进程未运行，请启动Docker"
    exit 1
fi

# 深度清理函数
cleanup_all() {
    print_info "开始深度清理Docker资源..."
    
    # 1. 检查并移除现有容器（强制移除）
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_info "发现现有容器，正在强制移除..."
        docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
        docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
        sleep 2
        print_success "已移除现有容器"
    else
        print_info "未发现现有容器"
    fi
    
    # 2. 移除指定镜像
    if docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}$"; then
        print_info "发现指定镜像，正在移除..."
        docker rmi "$IMAGE_NAME" >/dev/null 2>&1 || true
        print_success "已移除指定镜像"
    fi
    
    # 3. 清理所有历史构建的lineweaver镜像
    old_images=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "^lineweaver:" || true)
    if [ -n "$old_images" ]; then
        print_info "发现历史镜像，正在清理..."
        echo "$old_images" | xargs -r docker rmi >/dev/null 2>&1 || true
        print_success "已清理历史镜像"
    fi
    
    # 4. 清理悬空镜像
    dangling_images=$(docker images -f "dangling=true" -q)
    if [ -n "$dangling_images" ]; then
        print_info "清理悬空镜像..."
        docker image prune -f >/dev/null 2>&1 || true
        print_success "已清理悬空镜像"
    fi
    
    # 5. 清理构建缓存（可选）
    if docker builder prune -f >/dev/null 2>&1; then
        print_success "已清理构建缓存"
    fi
    
    print_success "深度清理完成"
}

# 智能部署函数
deploy() {
    print_info "开始智能部署..."
    
    # 1. 执行深度清理
    cleanup_all
    
    # 2. 构建新镜像
    print_info "构建镜像..."
    docker build --tag "$IMAGE_NAME" --file Dockerfile .
    print_success "镜像构建成功"
    
    # 3. 运行新容器
    print_info "启动新容器..."
    docker run -d \
        --name "$CONTAINER_NAME" \
        -p "$PORT:80" \
        --restart unless-stopped \
        "$IMAGE_NAME"
    
    print_success "部署完成！"
    print_info "访问地址: http://localhost:$PORT"
    print_info "容器名称: $CONTAINER_NAME"
    print_info "镜像名称: $IMAGE_NAME"
}

# 一键部署
deploy

# 显示最终状态
print_info "最终部署状态:"
echo ""
docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
docker images --filter "reference=${IMAGE_NAME}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
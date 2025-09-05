#!/bin/bash

# 统一智能模式LineWeaver Docker部署脚本
# 作者: LineWeaver团队
# 版本: 3.0.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的信息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    cat << EOF
统一智能模式LineWeaver Docker部署脚本

使用方法: $0 [选项]

选项:
    -h, --help          显示帮助信息
    -b, --build         构建Docker镜像
    -r, --run           运行Docker容器
    -s, --stop          停止Docker容器
    -c, --clean         清理Docker资源
    -l, --logs          查看容器日志
    -t, --test          运行测试
    -p, --port PORT     指定端口 (默认: 8080)
    -n, --name NAME     指定容器名称 (默认: lineweaver)
    -d, --detach        后台运行容器
    --dev               开发模式 (挂载卷)

示例:
    $0 --build --run --port 8080
    $0 --test
    $0 --clean
EOF
}

# 默认配置
PORT=8080
CONTAINER_NAME="lineweaver"
IMAGE_NAME="lineweaver:unified"
DETACH=false
DEV_MODE=false

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -b|--build)
            BUILD=true
            shift
            ;;
        -r|--run)
            RUN=true
            shift
            ;;
        -s|--stop)
            STOP=true
            shift
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        -l|--logs)
            LOGS=true
            shift
            ;;
        -t|--test)
            TEST=true
            shift
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -n|--name)
            CONTAINER_NAME="$2"
            shift 2
            ;;
        -d|--detach)
            DETACH=true
            shift
            ;;
        --dev)
            DEV_MODE=true
            shift
            ;;
        *)
            print_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
done

# 检查Docker是否已安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker未安装，请先安装Docker"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker守护进程未运行，请启动Docker"
        exit 1
    fi
}

# 构建Docker镜像
build_image() {
    print_info "构建统一智能模式Docker镜像..."
    
    # 构建参数
    BUILD_ARGS=""
    if [ "$DEV_MODE" = true ]; then
        BUILD_ARGS="--build-arg BUILD_ENV=development"
    fi
    
    docker build \
        --tag "$IMAGE_NAME" \
        --file Dockerfile \
        $BUILD_ARGS \
        .
    
    if [ $? -eq 0 ]; then
        print_success "镜像构建成功: $IMAGE_NAME"
    else
        print_error "镜像构建失败"
        exit 1
    fi
}

# 运行Docker容器
run_container() {
    print_info "运行统一智能模式容器..."
    
    # 检查端口是否被占用
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "端口 $PORT 已被占用，尝试使用其他端口"
        PORT=$((PORT + 1))
        print_info "使用端口: $PORT"
    fi
    
    # 停止已存在的容器
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_info "停止已存在的容器: $CONTAINER_NAME"
        docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
        docker rm "$CONTAINER_NAME" >/dev/null 2>&1 || true
    fi
    
    # 运行参数
    RUN_ARGS=""
    if [ "$DETACH" = true ]; then
        RUN_ARGS="-d"
    else
        RUN_ARGS="-it"
    fi
    
    # 开发模式挂载卷
    VOLUME_ARGS=""
    if [ "$DEV_MODE" = true ]; then
        VOLUME_ARGS="-v $(pwd):/usr/share/nginx/html:ro"
        print_info "开发模式: 挂载当前目录到容器"
    fi
    
    # 运行容器
    docker run \
        $RUN_ARGS \
        --name "$CONTAINER_NAME" \
        -p "$PORT:80" \
        $VOLUME_ARGS \
        --restart unless-stopped \
        "$IMAGE_NAME"
    
    if [ $? -eq 0 ]; then
        print_success "容器启动成功"
        print_info "访问地址: http://localhost:$PORT"
        print_info "容器名称: $CONTAINER_NAME"
    else
        print_error "容器启动失败"
        exit 1
    fi
}

# 停止容器
stop_container() {
    print_info "停止容器: $CONTAINER_NAME"
    
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        docker stop "$CONTAINER_NAME"
        print_success "容器已停止"
    else
        print_warning "容器未运行: $CONTAINER_NAME"
    fi
}

# 清理Docker资源
clean_resources() {
    print_info "清理Docker资源..."
    
    # 停止并删除容器
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
        docker rm "$CONTAINER_NAME" >/dev/null 2>&1 || true
        print_success "已删除容器: $CONTAINER_NAME"
    fi
    
    # 删除镜像
    if docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}$"; then
        docker rmi "$IMAGE_NAME" >/dev/null 2>&1 || true
        print_success "已删除镜像: $IMAGE_NAME"
    fi
    
    # 清理悬空镜像
    docker image prune -f >/dev/null 2>&1 || true
    print_success "已清理悬空镜像"
}

# 查看日志
view_logs() {
    print_info "查看容器日志: $CONTAINER_NAME"
    
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        docker logs -f "$CONTAINER_NAME"
    else
        print_error "容器不存在: $CONTAINER_NAME"
    fi
}

# 运行测试
run_tests() {
    print_info "运行统一智能模式测试..."
    
    # 确保容器正在运行
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_info "启动测试容器..."
        DETACH=true RUN=true $0
    fi
    
    # 运行测试
    print_info "访问应用: http://localhost:$PORT"
    
    # 使用curl测试基本功能
    sleep 3
    if curl -f "http://localhost:$PORT/" >/dev/null 2>&1; then
        print_success "基本功能测试通过"
    else
        print_error "基本功能测试失败"
    fi
}

# 显示容器状态
show_status() {
    print_info "容器状态:"
    echo ""
    
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        docker ps -a --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        print_warning "容器不存在: $CONTAINER_NAME"
    fi
    
    echo ""
    print_info "镜像状态:"
    docker images --filter "reference=${IMAGE_NAME}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
}

# 主逻辑
main() {
    check_docker
    
    if [ "$BUILD" = true ]; then
        build_image
    fi
    
    if [ "$RUN" = true ]; then
        run_container
    fi
    
    if [ "$STOP" = true ]; then
        stop_container
    fi
    
    if [ "$CLEAN" = true ]; then
        clean_resources
    fi
    
    if [ "$LOGS" = true ]; then
        view_logs
    fi
    
    if [ "$TEST" = true ]; then
        run_tests
    fi
    
    # 如果没有指定操作，显示状态
    if [ -z "$BUILD" ] && [ -z "$RUN" ] && [ -z "$STOP" ] && [ -z "$CLEAN" ] && [ -z "$LOGS" ] && [ -z "$TEST" ]; then
        show_status
    fi
}

# 执行主函数
main "$@"
#!/bin/bash

# LineWeaver - 快速部署脚本
# 一键完成Docker构建和部署

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 LineWeaver - Docker 部署脚本${NC}"
echo "======================================"

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker 未安装，请先安装 Docker${NC}"
    exit 1
fi

# 检查Docker是否运行
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker 未运行，请启动 Docker${NC}"
    exit 1
fi

# 检查docker-compose是否可用
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  docker-compose 未找到，尝试使用 docker compose${NC}"
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

echo -e "${GREEN}✅ Docker 环境检查通过${NC}"

# 停止现有服务
echo -e "${YELLOW}🛑 停止现有服务...${NC}"
$COMPOSE_CMD down 2>/dev/null || true

# 构建和启动服务
echo -e "${YELLOW}🔨 构建 Docker 镜像...${NC}"
$COMPOSE_CMD build

echo -e "${YELLOW}🚀 启动服务...${NC}"
$COMPOSE_CMD up -d

# 等待服务启动
echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
sleep 5

# 检查服务状态
echo -e "${YELLOW}🔍 检查服务状态...${NC}"
$COMPOSE_CMD ps

# 获取服务端口
PORT=$(docker-compose ps --format json | grep lineweaver-app | head -1 | sed -n 's/.*"PublishedPort":\([0-9]*\).*/\1/p' 2>/dev/null || echo "8090")

# 健康检查
echo -e "${YELLOW}🏥 执行健康检查...${NC}"
if curl -f http://localhost:${PORT}/health &> /dev/null; then
    echo -e "${GREEN}✅ 健康检查通过${NC}"
else
    echo -e "${RED}❌ 健康检查失败${NC}"
    echo "查看日志："
    $COMPOSE_CMD logs lineweaver
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 部署成功！${NC}"
echo "======================================"
echo -e "📱 应用访问地址: ${BLUE}http://localhost:${PORT}${NC}"
echo -e "🏥 健康检查地址: ${BLUE}http://localhost:${PORT}/health${NC}"
echo ""
echo "常用命令："
echo -e "  查看日志: ${YELLOW}$COMPOSE_CMD logs -f${NC}"
echo -e "  重启服务: ${YELLOW}$COMPOSE_CMD restart${NC}"
echo -e "  停止服务: ${YELLOW}$COMPOSE_CMD down${NC}"
echo ""
echo -e "${GREEN}享受无换行符的纯净文本体验！✨${NC}"
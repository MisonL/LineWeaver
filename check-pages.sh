#!/bin/bash

# GitHub Pages 状态检查脚本
# 用于验证部署状态和诊断问题

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 项目配置
GITHUB_USER="MisonL"
REPO_NAME="LineWeaver"
PAGES_URL="https://${GITHUB_USER}.github.io/${REPO_NAME}"

# 函数：打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_message $BLUE "🔍 GitHub Pages 状态检查"
echo "======================================"

# 检查1：验证URL响应
print_message $YELLOW "📡 检查页面响应状态..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PAGES_URL" || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    print_message $GREEN "✅ 页面正常访问 (HTTP $HTTP_STATUS)"
    print_message $GREEN "🌐 在线体验地址：$PAGES_URL"
elif [ "$HTTP_STATUS" = "404" ]; then
    print_message $RED "❌ 页面未找到 (HTTP $HTTP_STATUS)"
    print_message $YELLOW "⚠️  这可能意味着："
    echo "   - GitHub Actions 工作流还在运行中"
    echo "   - 部署失败或配置错误"
    echo "   - GitHub Pages 尚未激活"
else
    print_message $RED "❌ 页面访问异常 (HTTP $HTTP_STATUS)"
fi

# 检查2：验证GitHub Actions工作流状态
print_message $YELLOW "⚙️  检查工作流配置..."
if [ -f ".github/workflows/pages.yml" ]; then
    print_message $GREEN "✅ GitHub Actions 工作流文件存在"
else
    print_message $RED "❌ 工作流文件缺失"
fi

# 检查3：验证必要文件
print_message $YELLOW "📁 检查必要文件..."
for file in "index.html" "styles/main.css" "scripts/app.js"; do
    if [ -f "$file" ]; then
        print_message $GREEN "✅ $file 存在"
    else
        print_message $RED "❌ $file 缺失"
    fi
done

# 检查4：验证.nojekyll文件
if [ -f ".nojekyll" ]; then
    print_message $GREEN "✅ .nojekyll 文件存在"
else
    print_message $YELLOW "⚠️  .nojekyll 文件缺失，Jekyll可能会干扰部署"
fi

echo ""
print_message $PURPLE "🛠️  下一步操作建议："
echo "======================================"

if [ "$HTTP_STATUS" = "404" ]; then
    echo "1. 访问 GitHub 仓库的 Actions 标签页："
    echo "   https://github.com/${GITHUB_USER}/${REPO_NAME}/actions"
    echo ""
    echo "2. 检查最近的工作流运行状态"
    echo ""
    echo "3. 如果工作流失败，查看错误日志"
    echo ""
    echo "4. 如果工作流成功但页面仍404，等待5-10分钟"
    echo ""
    echo "5. 确认 GitHub Pages 设置："
    echo "   https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages"
    echo "   Source 应该设置为: GitHub Actions"
elif [ "$HTTP_STATUS" = "200" ]; then
    echo "🎉 GitHub Pages 部署成功！"
    echo ""
    echo "📱 立即体验："
    echo "   $PAGES_URL"
    echo ""
    echo "📝 更新 README 链接（如需要）"
else
    echo "🔧 请检查网络连接或稍后重试"
fi

echo ""
print_message $BLUE "📊 状态摘要："
echo "======================================"
echo "🌐 页面地址: $PAGES_URL"
echo "📊 HTTP状态: $HTTP_STATUS"
echo "⏰ 检查时间: $(date)"

# 如果页面正常，尝试获取页面标题
if [ "$HTTP_STATUS" = "200" ]; then
    TITLE=$(curl -s "$PAGES_URL" | grep -o '<title>[^<]*</title>' | sed 's/<\/*title>//g' 2>/dev/null || echo "无法获取")
    echo "📄 页面标题: $TITLE"
fi
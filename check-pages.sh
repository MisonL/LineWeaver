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

# 项目配置 - 从环境变量获取或使用默认值
GITHUB_USER="${GITHUB_USER:-MisonL}"
REPO_NAME="${REPO_NAME:-LineWeaver}"
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
# 跟随重定向获取最终状态码
HTTP_STATUS=$(curl -s -L -o /dev/null -w "%{http_code}" "$PAGES_URL" || echo "000")
# 获取不跟随重定向的状态码
REDIRECT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PAGES_URL" || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    if [ "$REDIRECT_STATUS" = "301" ] || [ "$REDIRECT_STATUS" = "302" ]; then
        print_message $GREEN "✅ 页面正常访问 (最终HTTP $HTTP_STATUS，重定向前 $REDIRECT_STATUS)"
        print_message $GREEN "🌐 在线体验地址：$PAGES_URL"
    else
        print_message $GREEN "✅ 页面正常访问 (HTTP $HTTP_STATUS)"
        print_message $GREEN "🌐 在线体验地址：$PAGES_URL"
    fi
elif [ "$HTTP_STATUS" = "404" ]; then
    print_message $RED "❌ 页面未找到 (HTTP $HTTP_STATUS)"
    print_message $YELLOW "⚠️  这可能意味着："
    echo "   - GitHub Actions 工作流还在运行中"
    echo "   - 部署失败或配置错误"
    echo "   - GitHub Pages 尚未激活"
elif [ "$REDIRECT_STATUS" = "301" ] || [ "$REDIRECT_STATUS" = "302" ]; then
    print_message $YELLOW "⚠️  页面重定向 (HTTP $REDIRECT_STATUS)"
    print_message $YELLOW "   最终页面状态: HTTP $HTTP_STATUS"
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
# 检查核心文件
CORE_FILES=("index.html" "styles/enhanced.css" "scripts/app.js")
for file in "${CORE_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_message $GREEN "✅ $file 存在"
    else
        print_message $RED "❌ $file 缺失"
    fi
done

# 检查额外资源文件
EXTRA_FILES=("favicon.ico" "README.md")
for file in "${EXTRA_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_message $GREEN "✅ $file 存在"
    else
        print_message $YELLOW "⚠️  $file 缺失"
    fi
done

# 检查4：验证.nojekyll文件
if [ -f ".nojekyll" ]; then
    print_message $GREEN "✅ .nojekyll 文件存在"
else
    print_message $YELLOW "⚠️  .nojekyll 文件缺失，Jekyll可能会干扰部署"
fi

# 检查5：测试API接口
print_message $YELLOW "🔌 测试API接口..."
API_DOCS_URL="${PAGES_URL}/api-docs.html"
API_STATUS=$(curl -s -L -o /dev/null -w "%{http_code}" "$API_DOCS_URL" || echo "000")

if [ "$API_STATUS" = "200" ]; then
    print_message $GREEN "✅ API文档页面正常 (HTTP $API_STATUS)"
    print_message $GREEN "📚 API文档地址：$API_DOCS_URL"
elif [ "$API_STATUS" = "404" ]; then
    print_message $RED "❌ API文档页面未找到 (HTTP $API_STATUS)"
    print_message $YELLOW "⚠️  检查GitHub Actions工作流是否包含api-docs.html"
else
    print_message $RED "❌ API文档页面异常 (HTTP $API_STATUS)"
fi

# 检查6：验证API文档文件
if [ -f "api-docs.html" ]; then
    print_message $GREEN "✅ api-docs.html 文件存在"
else
    print_message $RED "❌ api-docs.html 文件缺失"
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
echo "🌐 主页面地址: $PAGES_URL"
echo "📚 API文档地址: $API_DOCS_URL"
echo "📊 主页面状态: $HTTP_STATUS"
echo "📊 API文档状态: $API_STATUS"
echo "📊 重定向前状态: $REDIRECT_STATUS"
echo "⏰ 检查时间: $(date)"

# 如果页面正常，尝试获取页面标题
if [ "$HTTP_STATUS" = "200" ]; then
    TITLE=$(curl -s -L "$PAGES_URL" | grep -o '<title>[^<]*</title>' | sed 's/<\/*title>//g' 2>/dev/null || echo "无法获取")
    echo "📄 页面标题: $TITLE"
fi

# 如果API文档正常，获取API文档标题
if [ "$API_STATUS" = "200" ]; then
    API_TITLE=$(curl -s -L "$API_DOCS_URL" | grep -o '<title>[^<]*</title>' | sed 's/<\/*title>//g' 2>/dev/null || echo "无法获取")
    echo "📚 API文档标题: $API_TITLE"
fi
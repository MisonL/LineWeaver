# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

**LineWeaver** 是一个用于去除文本换行符的静态Web应用程序，特别适用于为AI工具和文案编辑准备多行文本。这是一个纯前端应用程序，使用原生HTML、CSS和JavaScript构建。

## 架构设计

### 核心结构
- **纯前端**: 无后端依赖 - 所有处理都在客户端进行
- **原生JavaScript**: 使用原生浏览器API，无框架或构建工具
- **模块化设计**: 工具函数和应用逻辑分离

### 关键文件
- `index.html` - 主应用页面，响应式UI
- `scripts/app.js` - 主应用逻辑、事件处理和状态管理  
- `scripts/utils.js` - 文本处理工具和辅助函数
- `styles/enhanced.css` - 完整样式文件（在仓库中被引用但未包含）

### 文本处理模式
1. **简单模式**: 基础换行符去除和空格合并
2. **智能模式**（默认）: 保留结构标记如 `[PARA]`、`[LIST]`、`[CODE]...[/CODE]`
3. **自定义模式**: 用户可配置的分隔符

## 开发命令

### 本地开发
```bash
# 本地服务（任何简单HTTP服务器）
python -m http.server 8000
# 或者
npx serve .
```

### Docker开发和部署
```bash
# 快速部署
./deploy.sh

# 手动Docker命令
docker-compose build
docker-compose up -d

# 检查状态
docker-compose ps
docker-compose logs -f
```

### GitHub Pages部署
- 通过 `.github/workflows/pages.yml` 在推送到 `main` 分支时自动部署
- 静态文件复制到 `_site/` 目录
- 无需构建过程（纯静态站点）

## 核心功能实现

### 文本处理管道
1. **输入验证** - 长度限制（50K字符）、空文本检查
2. **模式选择** - 简单/智能/自定义处理，使用不同算法
3. **智能处理** - Markdown感知、保留代码块、处理列表/段落
4. **网页内容获取** - CORS代理集成用于URL内容提取

### 浏览器兼容性功能
- **剪贴板API**: 现代浏览器支持，降级到 `execCommand`
- **Safari处理**: 针对Safari限制的特殊剪贴板访问模式
- **权限请求**: 自动剪贴板权限处理
- **HTTPS检测**: 最佳功能检查和用户指导

### UI/UX功能
- **实时统计**: 字符/单词计数和节省计算
- **Toast通知**: 具有不同严重程度的用户反馈系统
- **键盘快捷键**: `Ctrl/Cmd+Enter`（转换）、`Ctrl/Cmd+D`（复制）、`Escape`（清除）
- **响应式设计**: 移动端/平板/桌面优化

## 开发模式

### 状态管理
- 全局 `AppState` 对象跟踪处理状态和用户输入
- 通过 `Elements` 对象缓存DOM元素
- 事件驱动架构，带防抖输入处理

### 错误处理
- 全面的try-catch块，提供用户友好的错误消息
- 浏览器功能检测，优雅降级
- 网页内容获取的CORS代理回退链

### 性能优化
- 防抖输入处理（300ms延迟）
- 大文本处理的延迟加载
- 使用缓存引用的高效DOM操作

## 配置文件

### Docker配置
- `Dockerfile` - 基于Nginx的静态服务
- `docker-compose.yml` - 带健康检查的容器编排
- `nginx.conf` - Web服务器配置
- `deploy.sh` - 一键部署脚本

### CI/CD
- `.github/workflows/pages.yml` - GitHub Pages部署
- `.nojekyll` - 绕过GitHub Pages的Jekyll处理

## 浏览器限制和解决方案

### 剪贴板访问
- 需要HTTPS上下文才能完整使用Clipboard API
- Safari需要特殊处理，使用 `execCommand` 降级方案
- 优雅处理权限提示，提供用户指导

### CORS限制
- 网页内容获取使用多个代理服务作为降级方案
- 错误处理向用户解释限制
- SPA（单页应用程序）内容检测

## 测试方法

应用程序包含多个内置示例文本，用于测试不同的处理模式和边缘情况。没有正式的测试套件 - 测试主要通过浏览器界面手动进行。
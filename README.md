<div align="center">

# 🌊 LineWeaver

### 一个简单优雅的文本换行符去除工具

*让文本像流水般顺畅连续，无需手动处理换行符*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/MisonL/LineWeaver.svg?style=social&label=Star)](https://github.com/MisonL/LineWeaver)
[![Version](https://img.shields.io/badge/version-v2.2.1-green.svg)](CHANGELOG.md)

[**🚀 在线体验**](https://misonl.github.io/LineWeaver/) | [**📚 使用指南**](#使用指南) | [**📝 变更记录**](CHANGELOG.md) | [**💬 问题反馈**](https://github.com/MisonL/LineWeaver/issues)

---

</div>

## 🎯 项目简介

LineWeaver 是一个用于去除文本换行符的静态Web工具，旨在解决AI工具粘贴多行文本时的格式问题。

### 核心功能
- ✨ **一键去除换行符** - 将多行文本转换为连续文本
- 🚀 **即开即用** - 无需安装，浏览器直接使用
- 📋 **智能复制** - 支持现代剪贴板API，一键复制结果
- 🧠 **多种处理模式** - 简单、智能、自定义模式
- 🌐 **网页内容获取** - 直接获取并转换网页内容为Markdown格式
- 📱 **响应式设计** - 桌面端、平板、手机完美适配

## 🚀 快速开始

### 三步使用法

```
flowchart LR
    A[📝 输入多行文本] --> B[🔄 点击转换按钮]
    B --> C[📋 一键复制结果]
```

### 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + Enter` | 转换文本 |
| `Ctrl/Cmd + D` | 复制结果 |
| `Escape` | 清空内容 |

## 🎯 使用方法

### 处理模式

#### 1. 🔄 简单模式
直接去除所有换行符，用空格连接

#### 2. 🧠 智能模式（默认）
- **统一智能处理** - 自动检测文本类型和上下文
- **PowerShell优化** - 自动识别PowerShell CLI特征并优化转义
- **上下文感知** - 智能识别段落、列表、代码块结构
- **零配置** - 无需手动选择模式，系统自动适配

#### 3. 🎨 自定义模式
用户可自定义分隔符和标识符

### 网页内容获取

1. 在网址输入框中输入URL
2. 点击"获取内容"按钮
3. 系统自动转换为Markdown格式
4. 进一步处理为AI友好文本

## 📁 项目结构

```
LineWeaver/
├── index.html          # 主页面文件
├── styles/
│   └── enhanced.css    # 主样式文件
├── scripts/
│   ├── app.js          # 主应用逻辑
│   └── utils.js        # 工具函数
├── favicon.ico         # 网站图标
├── Dockerfile          # Docker 镜像构建文件
├── docker-compose.yml  # Docker Compose 配置
├── nginx.conf          # Nginx 服务器配置
├── deploy.sh           # 一键部署脚本
├── LICENSE             # MIT 许可证
└── README.md           # 项目说明文档
```

## 🚀 部署方式

### GitHub Pages
```bash
git clone https://github.com/MisonL/LineWeaver.git
cd LineWeaver
git checkout -b gh-pages
git push origin gh-pages
```

### Docker 部署
```bash
git clone https://github.com/MisonL/LineWeaver.git
cd LineWeaver
./deploy.sh
# 或者
docker-compose up -d
```

### Nginx 部署
```bash
# 安装 Nginx
sudo apt install nginx  # Ubuntu/Debian

# 配置 Nginx
sudo cp -r . /var/www/html/LineWeaver/
sudo systemctl start nginx
```

## 🔧 技术实现

### 统一智能处理系统
- **🧠 上下文感知** - 自动检测PowerShell、代码、Markdown等格式
- **⚡ 零配置** - 无需手动选择模式，智能应用优化
- **🔄 向后兼容** - 保留原有API接口，平滑升级

### 核心算法
```javascript
// 统一智能处理器
const SmartMode = {
    process(text) {
        // 自动上下文检测
        const context = this.analyzeContext(text);
        
        // 智能处理
        return this.applyOptimization(text, context);
    }
};
```

### 剪贴板支持
- 现代 Clipboard API（推荐）
- execCommand 降级方案（兼容旧浏览器）

## 🔒 安全性

- **无后端依赖**: 纯前端实现，数据不上传
- **本地处理**: 所有文本处理在客户端完成
- **HTTPS 推荐**: 获得最佳剪贴板 API 支持

## 🌈 浏览器支持

- **Chrome** 66+
- **Firefox** 63+
- **Safari** 13.1+
- **Edge** 79+

## 👥 贡献指南

欢迎您的贡献！

1. **🍴 Fork** 项目
2. **🌱 创建**功能分支
3. **✨ 提交**更改
4. **🚀 推送**到分支
5. **💌 创建** Pull Request

## 📜 许可证

本项目采用 [MIT 许可证](LICENSE) 开源

---

<div align="center">

**享受无换行符的纯净文本体验！** 🌊

</div>
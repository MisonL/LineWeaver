<div align="center">

# 🌊 LineWeaver

### 一个简单优雅的文本换行符去除工具

*让文本像流水般顺畅连续，无需手动处理换行符*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/MisonL/LineWeaver.svg?style=social&label=Star)](https://github.com/MisonL/LineWeaver)

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
- 保留段落边界 `[PARA]`
- 识别列表结构 `[LIST]`
- 保护代码块 `[CODE]...[/CODE]`
- 保留表格结构

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

### 核心算法
```javascript
function removeLineBreaks(text) {
    return text
        .replace(/[\r\n]+/g, ' ')  // 替换换行符为空格
        .replace(/\s+/g, ' ')      // 合并多个空格
        .trim();                   // 去除首尾空白
}
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
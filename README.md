<div align="center">

# 🌊 LineWeaver

### 一个简单优雅的文本换行符去除工具

*让文本像流水般顺畅连续，无需手动处理换行符*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/MisonL/LineWeaver.svg?style=social&label=Star)](https://github.com/MisonL/LineWeaver)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=flat&logo=nginx&logoColor=white)](https://nginx.org/)

[**🚀 在线体验**](https://misonl.github.io/LineWeaver/) | [📚 文档](#-使用指南) | [🐳 Docker](#-docker-部署) | [💬 问题反馈](https://github.com/MisonL/LineWeaver/issues)

---

</div>

## 🎯 项目背景

在日常开发和文本处理过程中，我们经常遇到这样的问题：

- **Qwen Code** 等AI代码助手无法完整粘贴包含换行符的多行文本
- **Gemini CLI** 工具在处理复杂文本格式时存在限制
- 手动去除换行符费时费力，容易出错
- 需要快速将多行文本转换为连续文本用于AI对话

为了解决这些实际问题，使用 [**Qoder IDE**](https://qoder.com) 开发了这个简单实用的静态Web工具。它能够：

✨ **一键去除换行符** - 将多行文本转换为连续文本  
🚀 **即开即用** - 无需安装，浏览器直接使用  
📋 **智能复制** - 支持现代剪贴板API，一键复制结果  
🌐 **随时可用** - 静态部署，访问速度快

## 🎆 亮点特性

<table>
<tr>
<td width="50%">

### 📝 文本处理
- 智能识别所有类型换行符
- 自动合并多余空格
- 保持文本语义的完整性

### 🔥 一键操作
- 现代 Clipboard API 支持
- 智能降级方案
- 键盘快捷键支持

</td>
<td width="50%">

### 📱 响应式设计
- 桌面端、平板、手机完美适配
- 多尺寸断点优化
- 触控友好的交互设计

### 🌈 用户体验
- 实时状态反馈
- Toast 消息提示
- 无障碍访问支持

</td>
</tr>
</table>

## 📚 使用指南

<div align="center">

### 🚀 三步快速上手

</div>

```
flowchart LR
    A[📝 输入多行文本] --> B[🔄 点击转换按钮]
    B --> C[📋 一键复制结果]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
```

<details>
<summary><b>🔑 键盘快捷键</b></summary>

| 快捷键 | 功能 | 描述 |
|---------|------|------|
| `Ctrl/Cmd + Enter` | 🔄 转换文本 | 快速处理输入的文本 |
| `Ctrl/Cmd + D` | 📋 复制结果 | 将结果复制到剪贴板 |
| `Escape` | 🧹 清空内容 | 清除所有输入和输出 |

</details>

## 🎯 使用方法

### 📋 处理模式选择

LineWeaver提供多种处理模式，解决不同场景下的文本处理需求：

#### 1. 🔄 **简单模式**（默认）
- 直接去除所有换行符，用空格连接
- 适用场景：纯文本段落、简单描述
- 示例：`行1\n行2` → `行1 行2`

#### 2. 🧠 **智能模式**（推荐用于AI对话）
- 保留重要的文本结构标识
- 列表项前添加分隔标识 `[LIST]`
- 段落间添加分隔标识 `[PARA]`
- 代码块保持独立 `[CODE]...`
- 适用场景：向AI工具粘贴复杂文档内容

#### 3. 🎨 **自定义模式**
- 用户可自定义分隔符和标识符
- 灵活适应不同AI工具的理解习惯

### 💡 智能模式示例

**输入：**
```
这是第一段文本。
这是同一段的第二行。

这是第二段文本。

1. 第一个列表项
2. 第二个列表项
3. 第三个列表项

```python
code_example = "示例代码"
```
```

**智能模式输出：**
```
这是第一段文本。这是同一段的第二行。[PARA]这是第二段文本。[PARA][LIST]1. 第一个列表项[LIST]2. 第二个列表项[LIST]3. 第三个列表项[PARA][CODE]python\ncode_example = "示例代码"[/CODE]
```

这样AI工具能够：
- 识别段落边界 `[PARA]`
- 理解列表结构 `[LIST]`
- 保持代码完整性 `[CODE]...[/CODE]`

### 基本操作步骤

1. **输入文本**: 在输入框中粘贴或输入包含换行符的多行文本
2. **转换处理**: 点击"转换文本"按钮或使用快捷键 `Ctrl/Cmd + Enter`
3. **复制结果**: 点击"复制到剪贴板"按钮或使用快捷键 `Ctrl/Cmd + D`

### 键盘快捷键

- `Ctrl/Cmd + Enter`: 转换文本
- `Ctrl/Cmd + D`: 复制结果
- `Escape`: 清空所有内容

## 🌐 在线访问

本项目使用 **Nginx** 作为推荐的静态文件服务器。您可以通过以下方式访问应用：

### 推荐方式 - 使用 Nginx

```
# 1. 安装 Nginx（如果未安装）
# macOS
brew install nginx

# Ubuntu/Debian
sudo apt update && sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx

# 2. 配置 Nginx
# 将项目文件复制到 nginx 网站目录
sudo cp -r . /var/www/html/LineWeaver/

# 或者创建自定义配置
sudo nano /etc/nginx/sites-available/LineWeaver

# 3. 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 访问应用
open http://localhost/LineWeaver/
```

### 其他静态文件服务器选择

```
# 使用 Node.js serve 工具
npx serve . -p 8080

# 使用 Python 内置服务器
python3 -m http.server 8080

# 使用 PHP 内置服务器
php -S localhost:8080
```

然后在浏览器中访问 `http://localhost:8080`

## 🐳 Docker 部署

<div align="center">

### ✨ 一键部署，即删即用

</div>

### 🚀 快速开始

```
# 克隆项目
git clone https://github.com/MisonL/LineWeaver.git
cd LineWeaver

# 一键部署
./deploy.sh
# 或者
docker-compose up -d

# 🎉 访问应用
open http://localhost:8090
```

### 🛠️ 单独使用 Docker

```
# 构建镜像
docker build -t lineweaver .

# 运行容器
docker run -d \
  --name lineweaver-app \
  -p 8080:80 \
  --restart unless-stopped \
  lineweaver

# 查看容器状态
docker ps

# 查看应用日志
docker logs lineweaver-app
```

### 生产环境部署

使用带有反向代理的生产配置：

```
# 启动生产环境（包含反向代理）
docker-compose --profile production up -d

# 查看所有服务状态
docker-compose ps
```

### Docker 镜像特性

- **基础镜像**: nginx:1.25-alpine (安全、轻量)
- **镜像大小**: ~15MB (压缩后)
- **安全性**: 非 root 用户运行
- **健康检查**: 内置健康检查机制
- **日志**: 结构化日志输出
- **缓存优化**: 静态资源缓存策略
- **Gzip 压缩**: 自动压缩文本资源

### 常用 Docker 命令

```
# 查看容器日志
docker-compose logs -f lineweaver

# 重启服务
docker-compose restart

# 更新和重新部署
docker-compose down
docker-compose pull
docker-compose up -d

# 清理未使用的资源
docker system prune -a

# 进入容器调试
docker exec -it lineweaver-app /bin/sh
```

### 环境变量配置

可以通过环境变量自定义配置：

```
# .env 文件示例
NGINX_HOST=localhost
NGINX_PORT=80
LOG_LEVEL=warn
```

### 数据持久化

```
# 创建日志目录
mkdir -p ./logs

# 日志将自动挂载到 ./logs 目录
docker-compose up -d
```

## 🛠️ 开发工具

本项目使用 [**Qoder IDE**](https://qoder.com) 进行开发，充分利用了其强大的AI辅助编程功能：

- 🤖 **AI代码生成**: 自动生成高质量HTML/CSS/JavaScript代码
- 📝 **文档编写**: AI辅助编写规范化的README文档
- 🐳 **部署配置**: 自动生成Docker和Nginx配置文件
- ⚙️ **项目管理**: 智能化项目结构和依赖管理

这个项目展示了如何利用现代AI工具快速构建实用的Web应用程序。

## 📁 项目结构

```
LineWeaver/
├── index.html              # 主页面文件
├── test.html               # 功能测试页面
├── styles/
│   ├── main.css            # 主样式文件
│   └── responsive.css      # 响应式样式
├── scripts/
│   ├── app.js              # 主应用逻辑
│   └── utils.js            # 工具函数
├── assets/
│   └── images/             # 图标等资源文件
├── Dockerfile              # Docker 镜像构建文件
├── docker-compose.yml      # Docker Compose 配置
├── nginx.conf              # Nginx 服务器配置
├── .dockerignore           # Docker 构建忽略文件
├── .gitignore              # Git 忽略文件
├── deploy.sh               # 一键部署脚本
├── LICENSE                 # MIT 许可证
└── README.md               # 项目说明文档
```

## 🛠️ 技术实现

### 开发背景

该项目的诞生源于实际需求：在使用**Qwen Code**、**Gemini CLI**等AI工具时，经常遇到无法完整粘贴包含换行符的文本内容的问题。为了解决这个痛点，使用[**Qoder IDE**](https://qoder.com)快速开发了这个纯前端的文本处理工具。

### 服务器架构

**Nginx 配置特性**:
- **高性能**: 异步非阻塞架构，支持高并发访问
- **资源优化**: 静态文件缓存、Gzip压缩、浏览器缓存
- **安全性**: HTTP安全头部、XSS防护、内容类型检测
- **可靠性**: 稳定的生产环境运行，低内存占用
- **灵活性**: 支持反向代理、负载均衡、SSL/TLS

### 核心算法

```
function removeLineBreaks(text) {
    return text
        .replace(/[\r\n]+/g, ' ')  // 替换换行符为空格
        .replace(/\s+/g, ' ')      // 合并多个空格
        .trim();                   // 去除首尾空白
}
```

### 剪贴板实现

支持两种复制方案：

1. **现代 Clipboard API** (推荐)
2. **execCommand 降级方案** (兼容旧浏览器)

### 响应式断点

| 屏幕尺寸 | 断点 | 布局特点 |
|---------|------|---------|
| 桌面端 | > 768px | 固定最大宽度，居中布局 |
| 平板端 | 481px - 768px | 适应屏幕宽度，保持间距 |
| 移动端 | < 481px | 全宽布局，优化触控体验 |
| 超小屏 | < 360px | 紧凑布局，最小化间距 |

## 🎨 设计规范

### 色彩主题

- **主色调**: #2563eb (蓝色)
- **成功色**: #10b981 (绿色)
- **警告色**: #f59e0b (橙色) 
- **错误色**: #ef4444 (红色)
- **背景色**: #f8fafc (浅灰)
- **文本色**: #1f2937 (深灰)

### 组件规范

- **圆角**: 8px
- **阴影**: 0 2px 8px rgba(0, 0, 0, 0.1)
- **间距**: 8px 网格系统
- **字体**: 系统默认字体栈

## 🔧 浏览器支持

### 推荐浏览器

- **Chrome** 66+
- **Firefox** 63+
- **Safari** 13.1+
- **Edge** 79+

### 功能兼容性

| 功能 | 现代浏览器 | 旧版浏览器 | 备注 |
|-----|-----------|-----------|------|
| 文本处理 | ✅ | ✅ | 完全支持 |
| 现代剪贴板 API | ✅ | ❌ | HTTPS 环境下支持 |
| execCommand 复制 | ✅ | ✅ | 降级方案 |
| 响应式设计 | ✅ | ✅ | CSS3 支持 |

## ⚡ 性能优化

### 前端优化
- **防抖处理**: 输入事件使用 300ms 防抖
- **异步处理**: 大文本处理采用异步方式
- **CSS 优化**: 使用 CSS 变量和高效选择器
- **懒加载**: 按需显示状态指示器

### Nginx 服务器优化
- **Gzip 压缩**: 自动压缩 CSS、JS、HTML 文件
- **静态缓存**: 资源文件缓存 1 年，HTML 缓存 1 小时
- **HTTP/2 支持**: 多路复用和服务器推送
- **Keep-Alive**: 连接复用减少延迟
- **并发优化**: 高效的事件驱动模型

## 🧪 测试

项目包含完整的功能测试，访问 `test.html` 查看测试结果：

### 测试用例

- 普通换行文本处理
- 混合换行符处理 (`\n`, `\r\n`, `\r`)
- 多余空格和换行处理
- 边界情况测试（空输入、纯空格等）
- 中文文本处理
- 复杂混合场景

## 🚀 部署方案

### Nginx 本地部署 (推荐)

**优势**:
- 高性能静态文件服务
- 优秀的缓存策略
- Gzip 压缩支持
- 安全性保障
- 稳定可靠

#### 基础配置

```
# 1. 安装 Nginx
brew install nginx  # macOS
# 或 sudo apt install nginx  # Ubuntu

# 2. 创建站点配置
sudo nano /etc/nginx/sites-available/LineWeaver

# 3. 配置内容：
server {
    listen 80;
    server_name localhost;
    root /var/www/html/LineWeaver;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_types text/css application/javascript text/html;
    
    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}

# 4. 启用站点
sudo ln -s /etc/nginx/sites-available/LineWeaver /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置
sudo systemctl reload nginx

# 5. 访问应用
open http://localhost/
```

### Docker 部署 (推荐)

**优势**:
- 环境一致性
- 快速部署
- 容易管理
- 高性能

```
# 快速部署
docker-compose up -d

# 访问应用
http://localhost:8080
```

### 静态托管推荐

1. **GitHub Pages**: 免费，适合开源项目
2. **Netlify**: 提供 CDN 加速和持续部署
3. **Vercel**: 快速部署，良好的开发体验
4. **传统服务器**: Apache、Nginx 等

### 部署优化

```
# 启用 Gzip 压缩 (Nginx 示例)
location ~* \.(css|js|html)$ {
    gzip on;
    gzip_types text/css application/javascript text/html;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🤔 为什么需要智能处理模式？

### 传统方法的问题

单纯去除换行符虽然解决了AI工具的粘贴限制，但可能导致以下问题：

1. **语义丢失**：段落边界消失，AI无法理解文本结构
2. **列表破坏**：有序/无序列表变成连续文本，失去层次性
3. **上下文混乱**：不同主题内容被强制连接

### LineWeaver的解决方案

#### 🧠 智能模式的优势

- **保留结构**：使用 `[PARA]` 标识段落边界
- **列表识别**：自动为列表项添加 `[LIST]` 标识
- **AI友好**：让AI工具能够理解原始文本结构
- **通用性**：适用于 Qwen Code、Gemini CLI、ChatGPT 等各种AI工具

#### 🎯 实际效果对比

**原始文本：**
```
项目介绍：
这是一个很棒的项目。

主要功能：
1. 功能一
2. 功能二
3. 功能三

注意事项：
- 重要提醒
- 使用建议
```

**简单模式输出：**
```
项目介绍： 这是一个很棒的项目。 主要功能： 1. 功能一 2. 功能二 3. 功能三 注意事项： - 重要提醒 - 使用建议
```
*❌ AI可能误解为一个连续的句子*

**智能模式输出：**
```
项目介绍： 这是一个很棒的项目。[PARA]主要功能：[PARA][LIST]1. 功能一 [LIST]2. 功能二 [LIST]3. 功能三[PARA]注意事项：[PARA][LIST]- 重要提醒 [LIST]- 使用建议
```
*✅ AI能够正确理解段落结构和列表层次*

### 🎨 自定义模式的灵活性

不同的AI工具可能有不同的理解习惯，自定义模式允许你：

- 使用 `||` 作为段落分隔符
- 使用 `->` 作为列表标识
- 根据具体AI工具的最佳实践调整标识符

### 📊 使用建议

| 使用场景 | 推荐模式 | 原因 |
|---------|---------|------|
| 纯文本段落 | 🔄 简单模式 | 无结构信息丢失风险 |
| 包含列表的文档 | 🧠 智能模式 | 保持列表结构清晰 |
| 多段落文章 | 🧠 智能模式 | 保留段落逻辑关系 |
| 特定AI工具优化 | 🎨 自定义模式 | 针对性调优 |
| 技术文档、说明书 | 🧠 智能模式 | 结构复杂，需要保留层次 |

---

## 🔒 安全性

- **无后端依赖**: 纯前端实现，数据不上传
- **本地处理**: 所有文本处理在客户端完成
- **HTTPS 推荐**: 获得最佳剪贴板 API 支持

## 👥 贡献指南

欢迎您的贡献！让我们一起让 LineWeaver 变得更好。

<div align="center">

### 🚀 快速参与

[![GitHub issues](https://img.shields.io/github/issues/MisonL/LineWeaver.svg)](https://github.com/MisonL/LineWeaver/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/MisonL/LineWeaver.svg)](https://github.com/MisonL/LineWeaver/pulls)

</div>

### 📝 贡献步骤

1. **🍴 Fork** 项目
2. **🌱 创建**功能分支 (`git checkout -b feature/AmazingFeature`)
3. **✨ 提交**更改 (`git commit -m 'Add some AmazingFeature'`)
4. **🚀 推送**到分支 (`git push origin feature/AmazingFeature`)
5. **💌 创建** Pull Request

### 🐛 报告问题

发现了 Bug？有新想法？[**点击这里创建 Issue**](https://github.com/MisonL/LineWeaver/issues/new)

---

<div align="center">

## 📜 许可证

**LineWeaver** 采用 [MIT 许可证](LICENSE) 开源

您可以自由使用、修改和分发本项目

---

## 🎆 致谢

感谢所有为 LineWeaver 做出贡献的开发者！

### 📚 相关链接

- [MDN Clipboard API](https://developer.mozilla.org/docs/Web/API/Clipboard_API)
- [Nginx 配置指南](https://nginx.org/en/docs/)
- [Docker 最佳实践](https://docs.docker.com/develop/dev-best-practices/)
- [CSS Grid 完整指南](https://css-tricks.com/snippets/css/complete-guide-grid/)

---

### ✨ 支持一下

如果这个项目对您有帮助，请给个 **⭐ Star**！

**享受无换行符的纯净文本体验！** 🌊

</div>
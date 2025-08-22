# 文本换行符去除工具

一个简单实用的静态网页应用，用于去除文本中的所有换行符，将多行文本转换为连续的单行文本，并支持一键复制到剪贴板。

## 🚀 功能特性

- **文本处理**: 智能去除所有类型的换行符（`\n`、`\r\n`、`\r`）
- **空格优化**: 自动合并多个连续空格为单个空格
- **一键复制**: 支持现代浏览器 Clipboard API 和降级方案
- **响应式设计**: 完美适配桌面端、平板端和移动端
- **用户体验**: 实时状态反馈、Toast 消息提示、键盘快捷键支持
- **无障碍支持**: 支持高对比度模式和减少动画偏好

## 🎯 使用方法

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

```bash
# 1. 安装 Nginx（如果未安装）
# macOS
brew install nginx

# Ubuntu/Debian
sudo apt update && sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx

# 2. 配置 Nginx
# 将项目文件复制到 nginx 网站目录
sudo cp -r . /var/www/html/text-line-remover/

# 或者创建自定义配置
sudo nano /etc/nginx/sites-available/text-line-remover

# 3. 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 访问应用
open http://localhost/text-line-remover/
```

### 其他静态文件服务器选择

```bash
# 使用 Node.js serve 工具
npx serve . -p 8080

# 使用 Python 内置服务器
python3 -m http.server 8080

# 使用 PHP 内置服务器
php -S localhost:8080
```

然后在浏览器中访问 `http://localhost:8080`

## 🐳 Docker 部署

### 快速开始

使用 Docker Compose 是最简单的部署方式：

```bash
# 克隆项目
git clone <repository-url>
cd 去除换行符

# 使用 Docker Compose 构建和启动
docker-compose up -d

# 访问应用
open http://localhost:8080
```

### 单独使用 Docker

```bash
# 构建镜像
docker build -t text-line-remover .

# 运行容器
docker run -d \
  --name text-line-remover-app \
  -p 8080:80 \
  --restart unless-stopped \
  text-line-remover

# 查看容器状态
docker ps

# 查看应用日志
docker logs text-line-remover-app
```

### 生产环境部署

使用带有反向代理的生产配置：

```bash
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

```bash
# 查看容器日志
docker-compose logs -f text-line-remover

# 重启服务
docker-compose restart

# 更新和重新部署
docker-compose down
docker-compose pull
docker-compose up -d

# 清理未使用的资源
docker system prune -a

# 进入容器调试
docker exec -it text-line-remover-app /bin/sh
```

### 环境变量配置

可以通过环境变量自定义配置：

```bash
# .env 文件示例
NGINX_HOST=localhost
NGINX_PORT=80
LOG_LEVEL=warn
```

### 数据持久化

```bash
# 创建日志目录
mkdir -p ./logs

# 日志将自动挂载到 ./logs 目录
docker-compose up -d
```

## 📁 项目结构

```
text-line-remover/
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
├── deploy.sh               # 一键部署脚本
└── README.md               # 项目说明文档
```

## 🛠️ 技术实现

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
sudo nano /etc/nginx/sites-available/text-line-remover

# 3. 配置内容：
server {
    listen 80;
    server_name localhost;
    root /var/www/html/text-line-remover;
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
sudo ln -s /etc/nginx/sites-available/text-line-remover /etc/nginx/sites-enabled/
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

## 🔒 安全性

- **无后端依赖**: 纯前端实现，数据不上传
- **本地处理**: 所有文本处理在客户端完成
- **HTTPS 推荐**: 获得最佳剪贴板 API 支持

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [CSS Grid 完整指南](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [响应式设计最佳实践](https://web.dev/responsive-web-design-basics/)

## 📧 联系方式

如有问题或建议，请创建 Issue 或联系开发者。

---

**享受无换行符的纯净文本体验！** ✨
# 🌊 LineWeaver - iFlow CLI 项目文档

## 📋 项目概览

**LineWeaver** 是一个现代化的文本换行符去除工具，专为AI时代设计。通过统一智能处理引擎，自动识别文本类型并应用最优处理策略，无需手动选择模式。

### 🎯 核心特性
- **🧠 统一智能处理** - 自动检测文本类型，零配置体验
- **🎨 完全静态设计** - 无动画、无过渡，纯粹静态界面
- **📱 响应式布局** - 完美适配桌面、平板、手机
- **🚀 一键部署** - 支持GitHub Pages、Docker、Nginx多种部署方式
- **⚡ 终端优化** - 自动识别CLI命令格式并优化转义

## 🏗️ 项目架构

### 技术栈
- **前端**: 纯HTML5 + CSS3 + ES6+ JavaScript
- **样式**: 现代CSS变量系统，Tailwind风格设计
- **部署**: Docker + Nginx + GitHub Actions
- **构建**: 零构建工具，纯静态部署

### 文件结构
```
LineWeaver/
├── 📄 index.html              # 主页面（核心入口）
├── 🎨 styles/
│   └── enhanced.css          # 主样式文件（静态设计）
├── ⚙️ scripts/
│   ├── app.js               # 主应用逻辑
│   ├── smart-mode.js        # 统一智能处理器
│   └── utils.js             # 工具函数库
├── 🐳 Docker配置/
│   ├── Dockerfile           # 容器镜像构建
│   ├── docker-compose.yml   # 容器编排
│   ├── nginx.conf          # Nginx服务器配置
│   └── nginx-proxy.conf    # 反向代理配置
├── 🚀 deploy.sh             # 一键部署脚本
├── 📋 CHANGELOG.md          # 版本更新记录
├── 📖 README.md             # 项目说明文档
└── 🔧 配置文件/
    ├── .gitignore
    ├── .dockerignore
    └── _config.yml
```

## 🚀 快速开始

### 1. 本地开发
```bash
# 克隆项目
git clone https://github.com/MisonL/LineWeaver.git
cd LineWeaver

# 本地预览（推荐方式）
python3 -m http.server 8000
# 或
npx serve .

# 访问 http://localhost:8000
```

### 2. Docker部署
```bash
# 一键部署
./deploy.sh

# 或手动部署
docker build -t lineweaver .
docker run -d -p 8080:80 --name lineweaver lineweaver

# Docker Compose
docker-compose up -d
```

### 3. GitHub Pages部署
```bash
# 推送到gh-pages分支
git checkout -b gh-pages
git push origin gh-pages
# 自动部署到 https://username.github.io/LineWeaver/
```

## 🔧 开发命令

### 本地开发
```bash
# 启动本地服务器
npm run dev      # 使用live-server（需安装）
python -m http.server 8000

# 代码检查
npm run lint     # ESLint检查（如有配置）

# 构建检查
npm run build    # 静态检查（纯前端项目）
```

### Docker命令
```bash
# 构建镜像
docker build -t lineweaver .

# 运行容器
docker run -d -p 8080:80 lineweaver

# 查看日志
docker logs lineweaver

# 停止容器
docker stop lineweaver && docker rm lineweaver
```

## 🎯 核心功能详解

### 统一智能处理器 (smart-mode.js)
```javascript
// 使用示例
const result = SmartMode.process(text, {
    autoDetect: true,
    powerShellOptimization: true,
    maxLineLength: 500
});

// 返回结果包含
{
    text: "处理后的文本",
    originalLength: 原始长度,
    processedLength: 处理后长度,
    compression: "压缩百分比",
    context: { type: "terminal", confidence: 0.85 }
}
```

### 终端优化特性
- **CLI命令检测** - 自动识别终端命令格式
- **特殊字符转义** - 自动处理PowerShell特殊字符
- **单行格式化** - 确保适合终端粘贴
- **上下文感知** - 智能识别文本类型

## 🎨 样式系统

### CSS变量设计
```css
:root {
    /* 色彩系统 */
    --primary-500: #3b82f6;
    --success-500: #22c55e;
    --warning-500: #f59e0b;
    --error-500: #ef4444;
    
    /* 间距系统 */
    --spacing-4: 16px;
    --spacing-6: 24px;
    --spacing-8: 32px;
    
    /* 圆角系统 */
    --radius: 8px;
    --radius-lg: 16px;
    --radius-xl: 24px;
}
```

### 响应式断点
- **桌面端**: >768px (双栏布局)
- **平板端**: 480-768px (单栏布局)
- **手机端**: <480px (紧凑布局)

## 📊 性能优化

### 静态优化策略
- **零构建时间** - 纯静态文件，无需构建
- **CDN友好** - 所有资源相对路径引用
- **缓存优化** - 合理的缓存头设置
- **压缩优化** - 支持gzip/brotli压缩

### 加载优化
- **懒加载** - 按需加载功能模块
- **预加载** - 关键资源预加载
- **缓存策略** - 智能缓存控制

## 🔍 调试指南

### 浏览器调试
```javascript
// 在控制台测试智能处理
SmartMode.process("your text here");

// 性能测试
SmartMode.benchmark("large text", 1000);

// 上下文检测
SmartMode.detectContext("sample text");
```

### Docker调试
```bash
# 进入容器调试
docker exec -it lineweaver sh

# 查看Nginx配置
cat /etc/nginx/nginx.conf

# 检查文件权限
ls -la /usr/share/nginx/html/
```

## 🚨 常见问题

### Q: 剪贴板API不工作？
**A**: 确保使用HTTPS协议，或在localhost环境测试

### Q: 移动端布局异常？
**A**: 检查viewport meta标签和响应式CSS

### Q: Docker容器无法启动？
**A**: 检查端口占用和文件权限

### Q: 如何处理大文本？
**A**: 系统已优化，支持大文本处理，建议分批处理超大文本

## 📈 版本信息

- **当前版本**: v2.4.0
- **发布日期**: 2025-09-05
- **主要更新**: 界面优化、静态设计、统一处理引擎
- **兼容性**: 现代浏览器全支持

## 🤝 贡献指南

### 开发流程
1. **Fork** 项目到个人账户
2. **创建** 功能分支 (`git checkout -b feature/amazing-feature`)
3. **提交** 更改 (`git commit -m 'Add amazing feature'`)
4. **推送** 到分支 (`git push origin feature/amazing-feature`)
5. **创建** Pull Request

### 代码规范
- **HTML**: 语义化标签，无障碍支持
- **CSS**: BEM命名法，CSS变量系统
- **JavaScript**: ES6+语法，模块化设计
- **注释**: 中英文双语注释

## 📞 支持联系

- **GitHub Issues**: [创建Issue](https://github.com/MisonL/LineWeaver/issues)
- **项目主页**: [LineWeaver](https://misonl.github.io/LineWeaver/)
- **许可证**: [MIT License](LICENSE)

---

<div align="center">

**享受无换行符的纯净文本体验！** 🌊

*最后更新: 2025-09-05 | 版本: v2.4.0*

</div>
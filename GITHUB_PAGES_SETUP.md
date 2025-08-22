# 🌎 GitHub Pages 在线体验设置指南

## 🚨 如果遇到保存报错

如果在 GitHub Pages 设置页面出现“无法保存”或自定义域名错误：

### 解决步骤：
1. **清空自定义域名**：
   - 在 **Custom domain** 输入框中删除所有内容
   - 点击 **Remove** 按钮移除配置

2. **重新配置 Source**：
   - 确认 Source 选择：**GitHub Actions**
   - 点击 **Save** 按钮

3. **等待保存成功**：
   - 页面应该显示保存成功的提示

## 📋 正常设置步骤

### 1. 启用GitHub Pages

1. 访问您的GitHub仓库：https://github.com/MisonL/LineWeaver
2. 点击仓库顶部的 **Settings**（设置）标签
3. 在左侧菜单中找到并点击 **Pages**
4. 在 **Source** 部分选择：**GitHub Actions**
5. 点击 **Save**（保存）

### 2. 配置Actions权限（如果需要）

1. 在仓库 Settings 页面，点击左侧的 **Actions**
2. 选择 **General**
3. 确保以下权限已启用：
   - ✅ Allow all actions and reusable workflows
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

### 3. 触发首次部署

第一次推送代码后，GitHub Actions会自动运行：
1. 访问 **Actions** 标签页
2. 查看 **Deploy TextFlow to GitHub Pages** 工作流
3. 等待部署完成（通常需要1-3分钟）

### 4. 访问在线体验

部署完成后，您可以通过以下地址访问：
🌐 **https://misonl.github.io/LineWeaver**

## ✅ 验证清单

- [ ] GitHub Pages 已在仓库设置中启用
- [ ] Actions 权限已正确配置
- [ ] 工作流已成功运行并部署
- [ ] 在线体验地址可以正常访问
- [ ] README 中的"🚀 在线体验"链接工作正常

## 🔧 自动化功能

配置完成后，每次推送到 `main` 分支都会：
1. 自动触发 GitHub Actions 工作流
2. 构建并部署最新版本到 GitHub Pages
3. 更新在线体验环境

## 🎯 在线体验功能

用户可以通过 https://misonl.github.io/LineWeaver 体验：
- ✨ 完整的 TextFlow 功能
- 🔄 文本换行符去除
- 📋 一键复制功能
- 📱 响应式设计
- ⌨️ 键盘快捷键

## 🚨 常见问题

### Q: Actions 工作流失败怎么办？
A: 检查 Actions 标签页的错误信息，通常是权限问题。

### Q: 页面显示404错误？
A: 等待几分钟让 GitHub Pages 完全部署，或检查 Pages 设置。

### Q: 更新代码后在线版本没变化？
A: GitHub Pages 有缓存，可能需要几分钟才能看到更新。

---

**设置完成后，您的 TextFlow 项目将拥有专业的在线体验功能！** 🎉
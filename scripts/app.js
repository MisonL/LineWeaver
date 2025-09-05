/**
 * 文本换行符去除工具 - 主应用逻辑
 * 处理用户交互、事件监听和状态管理
 */

// 应用状态管理
const AppState = {
    isProcessing: false,
    isCopying: false,
    inputText: '',
    outputText: '',
    browserCapabilities: null
};

// DOM 元素引用
const Elements = {
    inputText: null,
    outputText: null,
    convertBtn: null,
    copyBtn: null,
    convertBtnText: null,
    convertBtnLoading: null,
    copyBtnText: null,
    copyBtnSuccess: null
};

/**
 * 初始化应用程序
 */
function initializeApp() {
    // 获取DOM元素引用
    cacheElements();
    
    // 检测浏览器功能
    AppState.browserCapabilities = TextUtils.detectBrowserCapabilities();
    logBrowserCapabilities();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化状态
    updateUIState();
    
    // 初始化模式选择器
    initializeModeSelector();
    
    console.log('LineWeaver 已初始化');
}

/**
 * 初始化模式选择器
 */
function initializeModeSelector() {
    const modeRadios = document.querySelectorAll('input[name="processMode"]');
    const customConfig = document.getElementById('customConfig');
    
    modeRadios.forEach(radio => {
        radio.addEventListener('change', handleModeChange);
    });
    
    // 初始化显示状态
    handleModeChange();
}

/**
 * 处理模式变更
 */
function handleModeChange() {
    const selectedMode = document.querySelector('input[name="processMode"]:checked')?.value;
    const customConfig = document.getElementById('customConfig');
    const powershellConfig = document.getElementById('powershellConfig');
    
    if (customConfig) {
        customConfig.style.display = selectedMode === 'custom' ? 'block' : 'none';
    }
    
    if (powershellConfig) {
        powershellConfig.style.display = selectedMode === 'powershell' ? 'block' : 'none';
    }
    
    // 更新PowerShell复制按钮的显示状态
    if (Elements.powershellCopyBtn) {
        Elements.powershellCopyBtn.style.display = selectedMode === 'powershell' ? 'inline-block' : 'none';
    }
    
    // 更新按钮文本
    updateConvertButtonText(selectedMode);
}

/**
 * 更新转换按钮文本
 */
function updateConvertButtonText(mode) {
    const convertBtnText = Elements.convertBtnText;
    if (!convertBtnText) return;
    
    const modeTexts = {
        'simple': '🔄 简单转换',
        'smart': '🧠 智能转换',
        'powershell': '⚡ PowerShell转换',
        'custom': '🎨 自定义转换'
    };
    
    convertBtnText.textContent = modeTexts[mode] || '转换文本';
}

/**
 * 缓存DOM元素引用
 */
function cacheElements() {
    Elements.inputText = document.getElementById('inputText');
    Elements.outputText = document.getElementById('outputText');
    Elements.convertBtn = document.getElementById('convertBtn');
    Elements.copyBtn = document.getElementById('copyBtn');
    Elements.powershellCopyBtn = document.getElementById('powershellCopyBtn');
    Elements.pasteBtn = document.getElementById('pasteBtn');
    Elements.urlInput = document.getElementById('urlInput');
    Elements.fetchUrlBtn = document.getElementById('fetchUrlBtn');
    Elements.convertBtnText = Elements.convertBtn?.querySelector('.btn-text');
    Elements.convertBtnLoading = Elements.convertBtn?.querySelector('.btn-loading');
    Elements.copyBtnText = Elements.copyBtn?.querySelector('.btn-text');
    Elements.copyBtnSuccess = Elements.copyBtn?.querySelector('.btn-success');
    
    // 验证关键元素是否存在
    const requiredElements = ['inputText', 'outputText', 'convertBtn', 'copyBtn'];
    for (const elementName of requiredElements) {
        if (!Elements[elementName]) {
            console.error(`Required element not found: ${elementName}`);
        }
    }
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    // 转换按钮点击事件
    if (Elements.convertBtn) {
        Elements.convertBtn.addEventListener('click', handleConvert);
    }
    
    // 复制按钮点击事件
    if (Elements.copyBtn) {
        Elements.copyBtn.addEventListener('click', handleCopy);
    }
    
    // PowerShell复制按钮点击事件
    if (Elements.powershellCopyBtn) {
        Elements.powershellCopyBtn.addEventListener('click', handlePowerShellCopy);
    }
    
    // 示例按钮点击事件
    const exampleBtn = document.getElementById('exampleBtn');
    if (exampleBtn) {
        exampleBtn.addEventListener('click', handleLoadExample);
    }
    
    // 粘贴按钮点击事件
    const pasteBtn = document.getElementById('pasteBtn');
    if (pasteBtn) {
        pasteBtn.addEventListener('click', handlePasteFromClipboard);
    }
    
    // 获取URL内容按钮点击事件
    if (Elements.fetchUrlBtn) {
        Elements.fetchUrlBtn.addEventListener('click', handleFetchUrl);
    }
    
    // URL输入框回车事件
    if (Elements.urlInput) {
        Elements.urlInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleFetchUrl();
            }
        });
    }
    
    // 清除错误按钮点击事件
    const clearErrorBtn = document.getElementById('clearErrorBtn');
    if (clearErrorBtn) {
        clearErrorBtn.addEventListener('click', clearAll);
    }
    
    // 输入框变化事件（使用防抖优化性能）
    if (Elements.inputText) {
        const debouncedInputHandler = TextUtils.debounce(handleInputChange, 300);
        Elements.inputText.addEventListener('input', debouncedInputHandler);
        Elements.inputText.addEventListener('paste', handlePaste);
    }
    
    // 输出框点击事件（便于选择文本）
    if (Elements.outputText) {
        Elements.outputText.addEventListener('click', selectOutputText);
    }
    
    // 键盘快捷键支持
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // 页面可见性变化事件
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * 处理转换按钮点击
 */
async function handleConvert() {
    if (AppState.isProcessing) {
        return; // 防止重复处理
    }
    
    const inputText = Elements.inputText?.value || '';
    
    // 输入验证
    const validation = TextUtils.validateInput(inputText);
    if (!validation.isValid) {
        TextUtils.showToast(validation.message, 'warning');
        return;
    }
    
    try {
        // 设置处理状态
        setProcessingState(true);
        
        // 模拟异步处理（对于大文本）
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 获取处理模式和配置
        const mode = document.querySelector('input[name="processMode"]:checked')?.value || 'simple';
        const config = getProcessingConfig(mode);
        
        // 执行文本处理 - 支持超长文本
        let processedText;
        const isLargeText = inputText.length > 50000; // 5万字符以上视为大文本
        
        try {
            if (isLargeText) {
                // 显示进度条
                showProgressIndicator();
                
                // 使用Web Worker或分块处理
                processedText = await TextUtils.processTextWithWorker(
                    inputText, 
                    mode, 
                    config,
                    updateProgress
                );
            } else {
                // 小文本使用原方法
                processedText = TextUtils.processTextByMode(inputText, mode, config);
            }
        } catch (processingError) {
            console.error('文本处理错误:', processingError);
            TextUtils.showToast(`处理文本时出现错误: ${processingError.message || '未知错误'}，请重试`, 'error');
            return;
        } finally {
            if (isLargeText) {
                hideProgressIndicator();
            }
        }
        
        // 检查处理后的文本是否为空
        if (!processedText) {
            TextUtils.showToast('处理后的文本为空，请检查输入', 'warning');
            return;
        }
        
        // 更新输出
        if (Elements.outputText) {
            Elements.outputText.value = processedText;
        }
        
        // 更新应用状态
        AppState.inputText = inputText;
        AppState.outputText = processedText;
        
        // 隐藏错误提示
        hideErrorAlert();
        
        // 更新文本统计
        updateTextStats(inputText, processedText);
        
        // 更新UI状态
        updateUIState();
        
        // 显示成功消息
        const stats = TextUtils.getTextStats(inputText);
        const processedStats = TextUtils.getTextStats(processedText);
        const modeNames = {
            'simple': '简单模式',
            'smart': '智能模式', 
            'custom': '自定义模式'
        };
        const message = `${modeNames[mode]}转换完成！原文本 ${stats.lines} 行，转换后 ${processedStats.lines} 行`;
        TextUtils.showToast(message, 'success');
        
        // 自动聚焦到输出区域
        if (Elements.outputText) {
            Elements.outputText.focus();
            Elements.outputText.select();
        }
        
    } catch (error) {
        console.error('文本处理出错:', error);
        TextUtils.showToast(`处理文本时出现错误: ${error.message || '未知错误'}，请重试`, 'error');
        
        // 清空输出框，避免显示错误结果
        if (Elements.outputText) {
            Elements.outputText.value = '';
        }
        AppState.outputText = '';
        
    } finally {
        setProcessingState(false);
    }
}

/**
 * 处理从剪贴板粘贴按钮点击
 */
async function handlePasteFromClipboard() {
    try {
        if (Elements.inputText) {
            // 清空输入框
            Elements.inputText.value = '';
            
            // 显示加载中提示
            TextUtils.showToast('正在从剪贴板获取内容...', 'info');
            
            // 检查是否运行在安全上下文中（HTTPS或localhost）
            const isSecureContext = window.isSecureContext || 
                                  location.protocol === 'https:' || 
                                  location.hostname === 'localhost' || 
                                  location.hostname === '127.0.0.1';
            
            // 检测是否是Safari浏览器
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            
            // 尝试请求剪贴板权限（仅在安全上下文中）
            if (isSecureContext) {
                await TextUtils.requestClipboardPermission();
            }
            
            let clipboardText = '';
            
            // 尝试使用Clipboard API
            if (navigator.clipboard && navigator.clipboard.readText) {
                try {
                    clipboardText = await navigator.clipboard.readText();
                } catch (apiError) {
                    console.warn('Clipboard API failed:', apiError);
                    // 继续尝试其他方法
                }
            }
            
            // 如果通过API未能获取到文本，尝试通用方法
            if (!clipboardText) {
                clipboardText = await TextUtils.readFromClipboard();
            }
            
            // 对于Safari浏览器特殊处理
            if (!clipboardText && isSafari) {
                // 聚焦到输入框
                Elements.inputText.focus();
                
                // 直接触发粘贴事件
                try {
                    // 使用execCommand尝试粘贴
                    const success = document.execCommand('paste');
                    
                    if (success) {
                        // 给浏览器一点时间处理粘贴
                        await new Promise(resolve => setTimeout(resolve, 50));
                        clipboardText = Elements.inputText.value;
                    }
                } catch (execError) {
                    console.warn('Safari execCommand paste failed:', execError);
                }
            }
            
            // 处理获取到的文本
            if (clipboardText) {
                // 设置到输入框
                Elements.inputText.value = clipboardText;
                Elements.inputText.focus();
                
                // 触发输入事件
                const inputEvent = new Event('input', { bubbles: true });
                Elements.inputText.dispatchEvent(inputEvent);
                
                TextUtils.showToast('已粘贴剪贴板内容', 'success');
                return;
            }
            
            // 针对Safari浏览器的特殊提示
            if (isSafari) {
                TextUtils.showToast('在Safari浏览器中，您可能需要允许网站访问剪贴板。请手动粘贴 (Cmd+V)', 'warning', 5000);
            } else {
                TextUtils.showToast('无法自动读取剪贴板，请手动粘贴 (Ctrl/Cmd+V)', 'warning', 5000);
            }
            
            // 聚焦到输入框便于手动粘贴
            Elements.inputText.focus();
        }
    } catch (error) {
        console.error('尝试粘贴内容时出错:', error);
        TextUtils.showToast('粘贴内容时出错，请手动粘贴 (Ctrl/Cmd+V)', 'error');
        
        if (Elements.inputText) {
            Elements.inputText.focus();
        }
    }
}

/**
 * 处理加载示例按钮点击
 */
function handleLoadExample() {
    const examples = [
        // 简单示例
        `LineWeaver 使用指南：

基础功能：
1. 粘贴多行文本
2. 选择处理模式
3. 点击转换按钮

高级特性：
- 智能模式保留结构
- 自定义分隔符
- 一键复制结果`,
        
        // AI对话示例
        `AI对话优化文本：

问题描述：
如何使用 Qwen Code 进行代码生成？

解决方案：
1. 准备清晰的需求描述
2. 提供具体的代码示例
3. 说明期望的输出格式

注意事项：
- 保持文本结构清晰
- 使用适当的标识符`,
        
        // 技术文档示例
        `项目技术文档：

## 概述
这是一个文本处理工具。

## 功能特性

### 核心功能
1. 换行符去除
2. 空格合并
3. 结构保持

### 高级功能
- 多模式支持
- 自定义配置
- 实时统计`,
        
        // Markdown示例
        `# Markdown 格式示例

## 这是二级标题

这是一段普通文本，包含 *斜体* 和 **粗体** 内容。

### 列表示例

* 无序列表项 1
* 无序列表项 2
  * 嵌套项目
  * 另一个嵌套项目

1. 有序列表项 1
2. 有序列表项 2

### 引用文本

> 这是一段引用文本
> 可以有多行

### 表格

| 名称 | 年龄 | 职业 |
|---------|------|--------|
| 张三 | 25   | 开发者 |
| 李四 | 30   | 设计师 |

---

[这是一个链接](https://example.com)`
    ];
    
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    
    if (Elements.inputText) {
        Elements.inputText.value = randomExample;
        Elements.inputText.focus();
        
        // 触发输入变化事件
        const event = new Event('input', { bubbles: true });
        Elements.inputText.dispatchEvent(event);
        
        TextUtils.showToast('示例文本已加载，可以开始试用了！', 'info');
    }
}

/**
 * 更新文本统计显示
 */
function updateTextStats(originalText, processedText) {
    const textStats = document.getElementById('textStats');
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    const savedChars = document.getElementById('savedChars');
    
    if (!textStats || !charCount || !wordCount || !savedChars) return;
    
    if (processedText) {
        const processedStats = TextUtils.getTextStats(processedText);
        const savedCharCount = originalText.length - processedText.length;
        
        charCount.textContent = processedStats.characters.toLocaleString();
        wordCount.textContent = processedStats.words.toLocaleString();
        savedChars.textContent = savedCharCount > 0 ? savedCharCount.toLocaleString() : '0';
        
        textStats.style.display = 'flex';
    } else {
        textStats.style.display = 'none';
    }
}

/**
 * 获取处理配置
 */
function getProcessingConfig(mode) {
    if (mode === 'custom') {
        return {
            paragraphSeparator: document.getElementById('paragraphSeparator')?.value || '[PARA]',
            listSeparator: document.getElementById('listSeparator')?.value || '[LIST]'
        };
    }
    
    if (mode === 'powershell') {
        const preset = document.getElementById('powershellPreset')?.value || 'ai-cli';
        const validate = document.getElementById('powershellValidate')?.checked || true;
        const escape = document.getElementById('powershellEscape')?.checked || false;
        
        return {
            mode: 'powershell',
            preset: preset,
            validate: validate,
            escapeSpecial: escape
        };
    }
    
    return {}; // 使用默认配置
}

/**
 * 处理复制按钮点击
 */
async function handleCopy() {
    if (AppState.isCopying || !AppState.outputText) {
        return;
    }
    
    try {
        // 设置复制状态
        setCopyingState(true);
        
        // 执行复制操作
        const success = await TextUtils.copyToClipboard(AppState.outputText);
        
        if (success) {
            // 显示成功状态
            showCopySuccess();
            
            const textLength = AppState.outputText.length;
            const message = `已复制 ${textLength} 个字符到剪贴板`;
            TextUtils.showToast(message, 'success');
        } else {
            // 复制失败，提供备选方案
            handleCopyFailure();
        }
        
    } catch (error) {
        console.error('复制操作出错:', error);
        handleCopyFailure();
    } finally {
        setCopyingState(false);
    }
}

/**
 * 处理PowerShell格式复制
 */
async function handlePowerShellCopy() {
    if (AppState.isCopying || !AppState.outputText) {
        return;
    }
    
    try {
        // 设置复制状态
        setCopyingState(true);
        
        // 使用PowerShell格式处理
        const powershellText = PowerShellUtils.processForPowerShellAI(AppState.outputText).text;
        
        // 执行复制操作
        const success = await TextUtils.copyToClipboard(powershellText);
        
        if (success) {
            // 显示成功状态
            showCopySuccess();
            
            const textLength = powershellText.length;
            const message = `已复制PowerShell格式文本（${textLength}字符）到剪贴板`;
            TextUtils.showToast(message, 'success');
        } else {
            // 复制失败，提供备选方案
            handleCopyFailure();
        }
        
    } catch (error) {
        console.error('PowerShell复制操作出错:', error);
        handleCopyFailure();
    } finally {
        setCopyingState(false);
    }
}

/**
 * 处理输入框内容变化
 */
function handleInputChange(event) {
    const inputText = event.target.value;
    AppState.inputText = inputText;
    
    // 清空输出
    if (Elements.outputText) {
        Elements.outputText.value = '';
    }
    AppState.outputText = '';
    
    // 隐藏统计显示
    const textStats = document.getElementById('textStats');
    if (textStats) {
        textStats.style.display = 'none';
    }
    
    // 移除错误检测逻辑，始终隐藏错误提示
    hideErrorAlert();
    
    // 更新UI状态
    updateUIState();
}

/**
 * 处理粘贴事件
 */
function handlePaste(event) {
    // 延迟处理以确保粘贴内容已更新
    setTimeout(() => {
        handleInputChange(event);
    }, 10);
}

/**
 * 选择输出文本
 */
function selectOutputText() {
    if (Elements.outputText && AppState.outputText) {
        Elements.outputText.select();
    }
}

/**
 * 处理键盘快捷键
 */
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + Enter: 转换文本
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleConvert();
        return;
    }
    
    // Ctrl/Cmd + D: 复制结果
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        if (AppState.outputText) {
            handleCopy();
        }
        return;
    }
    
    // Ctrl/Cmd + V: 当非输入区域收到粘贴快捷键时，聚焦到输入框
    // 但是如果当前焦点在 URL 输入框，则不要干预，让其正常粘贴
    if ((event.ctrlKey || event.metaKey) && event.key === 'v' && 
        event.target !== Elements.inputText && 
        event.target !== Elements.outputText && 
        event.target !== Elements.urlInput) {
        // 只聚焦到输入框，不防止默认粘贴行为
        if (Elements.inputText) {
            // 清空输入框
            Elements.inputText.value = '';
            Elements.inputText.focus();
        }
    }
    
    // Escape: 清空内容
    if (event.key === 'Escape') {
        clearAll();
        return;
    }
}

/**
 * 处理页面可见性变化
 */
function handleVisibilityChange() {
    if (document.hidden) {
        // 页面隐藏时的处理
        console.log('页面已隐藏');
    } else {
        // 页面重新可见时的处理
        console.log('页面重新可见');
    }
}

/**
 * 设置处理状态
 */
function setProcessingState(isProcessing) {
    AppState.isProcessing = isProcessing;
    
    if (Elements.convertBtn) {
        Elements.convertBtn.disabled = isProcessing;
    }
    
    if (Elements.convertBtnText && Elements.convertBtnLoading) {
        if (isProcessing) {
            Elements.convertBtnText.style.display = 'none';
            Elements.convertBtnLoading.style.display = 'inline';
        } else {
            Elements.convertBtnText.style.display = 'inline';
            Elements.convertBtnLoading.style.display = 'none';
        }
    }
}

/**
 * 设置复制状态
 */
function setCopyingState(isCopying) {
    AppState.isCopying = isCopying;
    
    if (Elements.copyBtn) {
        Elements.copyBtn.disabled = isCopying;
    }
}

/**
 * 显示复制成功状态
 */
function showCopySuccess() {
    if (Elements.copyBtnText && Elements.copyBtnSuccess) {
        Elements.copyBtnText.style.display = 'none';
        Elements.copyBtnSuccess.style.display = 'inline';
        
        // 2秒后恢复原状
        setTimeout(() => {
            if (Elements.copyBtnText && Elements.copyBtnSuccess) {
                Elements.copyBtnText.style.display = 'inline';
                Elements.copyBtnSuccess.style.display = 'none';
            }
        }, 2000);
    }
}

/**
 * 处理复制失败
 */
function handleCopyFailure() {
    let message = '复制失败。';
    
    // 根据浏览器功能给出具体建议
    if (!AppState.browserCapabilities.clipboardAPI && !AppState.browserCapabilities.execCommand) {
        message += '您的浏览器不支持自动复制，请手动选择文本复制。';
    } else if (!AppState.browserCapabilities.isHttps && !AppState.browserCapabilities.isLocalhost) {
        message += '请在HTTPS环境下使用复制功能。';
    } else {
        message += '请手动选择文本复制。';
    }
    
    TextUtils.showToast(message, 'error', 5000);
    
    // 自动选择输出文本便于手动复制
    selectOutputText();
}

/**
 * 更新UI状态
 */
function updateUIState() {
    const hasInput = Boolean(AppState.inputText.trim());
    const hasOutput = Boolean(AppState.outputText.trim());
    
    // 更新转换按钮状态
    if (Elements.convertBtn) {
        Elements.convertBtn.disabled = !hasInput || AppState.isProcessing;
    }
    
    // 更新复制按钮状态
    if (Elements.copyBtn) {
        Elements.copyBtn.disabled = !hasOutput || AppState.isCopying;
    }
}

/**
 * 检查文本是否包含错误信息
 * @param {string} text - 要检查的文本
 * @returns {boolean} 是否包含错误信息
 */
function hasErrorText(text) {
    if (!text) return false;
    
    // 常见的错误信息模式
    const errorPatterns = [
        /Error on line \d+/i,
        /Parsing \[Files\]/i,
        /ERROR:/i,
        /错误:/i,
        /exception/i,
        /failed/i,
        /invalid/i
    ];
    
    return errorPatterns.some(pattern => pattern.test(text));
}

/**
 * 显示错误提示
 */
function showErrorAlert() {
    const errorAlert = document.getElementById('errorAlert');
    if (errorAlert) {
        errorAlert.classList.add('show');
    }
}

/**
 * 隐藏错误提示
 */
function hideErrorAlert() {
    const errorAlert = document.getElementById('errorAlert');
    if (errorAlert) {
        errorAlert.classList.remove('show');
    }
}

/**
 * 清空所有内容
 */
function clearAll() {
    // 清空输入框
    if (Elements.inputText) {
        Elements.inputText.value = '';
    }
    
    // 清空输出框
    if (Elements.outputText) {
        Elements.outputText.value = '';
    }
    
    // 重置应用状态
    AppState.inputText = '';
    AppState.outputText = '';
    
    // 隐藏统计信息
    const textStats = document.getElementById('textStats');
    if (textStats) {
        textStats.style.display = 'none';
    }
    
    // 更新UI状态
    updateUIState();
    
    // 聚焦到输入框
    if (Elements.inputText) {
        Elements.inputText.focus();
    }
    
    // 显示提示信息
    TextUtils.showToast('已清空所有内容', 'info');
}

/**
 * 处理获取URL内容
 */
async function handleFetchUrl() {
    if (!Elements.urlInput || !Elements.inputText) {
        return;
    }
    
    const url = Elements.urlInput.value.trim();
    if (!url) {
        TextUtils.showToast('请输入有效的网址', 'warning');
        return;
    }
    
    // 检查URL格式
    if (!TextUtils.isValidUrl(url)) {
        TextUtils.showToast('请输入有效的URL格式，包含http://或https://', 'warning');
        return;
    }
    
    // 检查是否试图获取GitHub Pages自身
    const currentHost = window.location.hostname;
    const targetUrl = new URL(url);
    if (targetUrl.hostname === currentHost || 
        (currentHost.includes('github.io') && targetUrl.hostname.includes('github.io'))) {
        TextUtils.showToast('不能获取当前网站自身的内容，请输入其他网站地址', 'warning');
        return;
    }
    
    try {
        // 禁用按钮，显示加载状态
        if (Elements.fetchUrlBtn) {
            Elements.fetchUrlBtn.disabled = true;
            Elements.fetchUrlBtn.textContent = '正在获取...';
        }
        
        // 获取网页内容（移除ITSM特殊处理）
        try {
            const content = await TextUtils.fetchWebContent(url);
            
            if (!content) {
                throw new Error('获取到的内容为空');
            }
            
            // 判断是否是HTML内容
            const isHtml = content.includes('<html') || content.includes('<body') || content.includes('<div');
            
            if (isHtml) {
                console.log('检测到HTML内容，转换为Markdown');
                // 转换为Markdown格式（方便AI理解）
                const markdown = TextUtils.htmlToMarkdown(content, url);
                
                if (!markdown || markdown.length < 50) {
                    // 如果Markdown转换失败或内容太少，尝试使用基本的文本提取
                    const fallbackText = extractTextFromHtml(content);
                    if (!fallbackText || fallbackText.length < 50) {
                        throw new Error('无法提取有效内容，可能需要登录或内容由JavaScript动态加载');
                    }
                    
                    // 使用基本文本提取结果
                    Elements.inputText.value = fallbackText;
                    TextUtils.showToast('已获取网页内容（使用基础提取模式）', 'warning');
                } else {
                    // 清空输入框并填充提取的文本
                    Elements.inputText.value = markdown;
                    
                    // 判断内容质量
                    if (markdown.split('\n').length <= 5 && !markdown.includes('PARA') && markdown.length < 500) {
                        TextUtils.showToast('已获取部分网页内容，但可能不完整。这可能是因为内容需要登录或由JavaScript动态加载', 'warning', 6000);
                    } else {
                        TextUtils.showToast('已获取网页内容并转换为Markdown格式', 'success');
                    }
                }
            } else {
                // 非HTML内容，可能是纯文本或JSON
                console.log('非HTML内容，直接使用');
                Elements.inputText.value = content;
                TextUtils.showToast('已获取网页内容', 'success');
            }
        } catch (error) {
            console.error('获取网页内容失败:', error);
            throw error; // 重新抛出错误，让外层catch处理
        }
        
        // 触发输入事件
        const inputEvent = new Event('input', { bubbles: true });
        Elements.inputText.dispatchEvent(inputEvent);
        
        // 自动聚焦到转换按钮
        if (Elements.convertBtn) {
            Elements.convertBtn.focus();
        }
        
        // 清空URL输入框
        Elements.urlInput.value = '';
    } catch (error) {
        console.error('获取URL内容失败:', error);
        
        // 提供更具体的错误消息
        let errorMessage = '获取内容失败';
        
        if (error.message.includes('权限') || error.message.includes('登录')) {
            errorMessage = '网站需要登录或授权才能访问完整内容';
        } else if (error.message.includes('JavaScript') || error.message.includes('动态')) {
            errorMessage = '内容可能由JavaScript动态加载，无法完全获取';
        } else if (error.message.includes('CORS') || error.message.includes('跨域')) {
            errorMessage = '网站设置了跨域限制，无法获取内容';
        } else if (error.message.includes('代理') || error.message.includes('proxy')) {
            errorMessage = '所有代理服务器都不可用，请稍后再试';
        } else {
            errorMessage = `${error.message || '未知错误'}，请确保URL格式正确且可访问`;
        }
        
        TextUtils.showToast(`获取内容失败: ${errorMessage}`, 'error', 5000);
    } finally {
        // 恢复按钮状态
        if (Elements.fetchUrlBtn) {
            Elements.fetchUrlBtn.disabled = false;
            Elements.fetchUrlBtn.textContent = '🔗 获取内容';
        }
    }
}

/**
 * 从HTML中提取文本内容
 * @param {string} html - HTML字符串
 * @returns {string} 提取的文本内容
 */
function extractTextFromHtml(html) {
    try {
        // 创建DOM解析器
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 移除脚本、样式和其他不需要的元素
        const elementsToRemove = doc.querySelectorAll('script, style, iframe, noscript, svg, canvas, video, audio');
        elementsToRemove.forEach(el => el.remove());
        
        // 尝试获取主要内容（优先级：article > main > body）
        let mainContent = doc.querySelector('article') || 
                        doc.querySelector('main') || 
                        doc.querySelector('.content') || 
                        doc.querySelector('.article') || 
                        doc.querySelector('.main-content') ||
                        doc.querySelector('#content') ||
                        doc.querySelector('.post-content') ||
                        doc.querySelector('.knowledge-content') || // 针对知识分享页面
                        doc.querySelector('.knowledge-detail') ||  // 针对知识详情页面
                        doc.body;
        
        // 提取并处理文本
        let text = mainContent.textContent
            .replace(/\s+/g, ' ')  // 合并空白字符
            .trim();               // 去除首尾空白
        
        // 动态长度限制 - 基于设备性能
        const maxWebLength = Math.floor(getMaxTextLength() * 0.8); // 网页内容使用80%限制
        if (text.length > maxWebLength) {
            const preview = text.substring(0, maxWebLength);
            text = preview + `\n\n... (内容已截断，显示前${Math.floor(maxWebLength/1000)}K字符，完整内容共${Math.floor(text.length/1000)}K字符)`;
        }
        
        return text;
    } catch (error) {
        console.error('提取HTML内容出错:', error);
        return '';
    }
}

/**
 * 记录浏览器功能信息
 */
function logBrowserCapabilities() {
    const caps = AppState.browserCapabilities;
    console.log('浏览器功能检测:', {
        clipboardAPI: caps.clipboardAPI,
        execCommand: caps.execCommand,
        isHttps: caps.isHttps,
        isLocalhost: caps.isLocalhost,
        isSafari: caps.isSafari
    });
    
    // 显示兼容性提示
    if (caps.isSafari) {
        TextUtils.showToast('在Safari浏览器中，点击“清空并粘贴”按钮后请手动粘贴文本', 'info', 6000);
        
        // 更新粘贴按钮的提示文字
        const pasteBtn = document.getElementById('pasteBtn');
        if (pasteBtn) {
            pasteBtn.title = '点击清空输入框并聚焦，然后使用键盘粘贴（Cmd+V）';
        }
    } else if (!caps.clipboardAPI && !caps.execCommand) {
        TextUtils.showToast('您的浏览器可能不支持自动复制功能', 'warning', 5000);
    } else if (!caps.isHttps && !caps.isLocalhost) {
        TextUtils.showToast('建议在HTTPS环境下使用以获得最佳体验', 'info', 4000);
    }
}

/**
 * 错误处理函数
 */
function handleGlobalError(event) {
    console.error('应用程序错误:', event.error);
    TextUtils.showToast('应用程序遇到错误，请刷新页面重试', 'error');
}

// 全局错误处理
window.addEventListener('error', handleGlobalError);
window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
    TextUtils.showToast('操作失败，请重试', 'error');
});

// 页面加载完成后初始化应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

/**
 * 显示进度指示器
 */
function showProgressIndicator() {
    // 创建进度条元素
    if (!document.getElementById('progressIndicator')) {
        const progressHtml = `
            <div id="progressIndicator" class="progress-overlay">
                <div class="progress-container">
                    <div class="progress-header">
                        <h3>🔄 处理超长文本中...</h3>
                        <p>正在使用高性能模式处理您的文本</p>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <div class="progress-info">
                        <span id="progressText">准备中...</span>
                        <span id="progressPercent">0%</span>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', progressHtml);
    }
    
    const indicator = document.getElementById('progressIndicator');
    indicator.style.display = 'flex';
}

/**
 * 隐藏进度指示器
 */
function hideProgressIndicator() {
    const indicator = document.getElementById('progressIndicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

/**
 * 更新进度
 * @param {number} progress - 进度百分比
 * @param {number} current - 当前块
 * @param {number} total - 总块数
 */
function updateProgress(progress, current, total) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressPercent = document.getElementById('progressPercent');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `处理进度: ${current}/${total} 块`;
    }
    
    if (progressPercent) {
        progressPercent.textContent = `${progress}%`;
    }
}

// 导出到全局作用域（用于调试）
window.App = {
    state: AppState,
    elements: Elements,
    handleConvert,
    handleCopy,
    clearAll,
    updateUIState,
    showProgressIndicator,
    hideProgressIndicator,
    updateProgress
};

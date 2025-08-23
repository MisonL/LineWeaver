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
    
    if (customConfig) {
        customConfig.style.display = selectedMode === 'custom' ? 'block' : 'none';
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
    Elements.pasteBtn = document.getElementById('pasteBtn');
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
    
    // 重试按钮点击事件
    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn) {
        retryBtn.addEventListener('click', clearAll);
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
        
        // 检查输入文本是否含有错误信息
        if (inputText.includes('Error on line') || inputText.includes('Parsing [Files]') || inputText.includes('ERROR:')) {
            // 清理错误信息，提示用户
            TextUtils.showToast('检测到输入文本包含错误信息，请清空后重新输入', 'warning');
            return;
        }
        
        // 执行文本处理
        const processedText = TextUtils.processTextByMode(inputText, mode, config);
        
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
    // 直接调用清空并聚焦到输入框
    if (Elements.inputText) {
        // 清空输入框
        Elements.inputText.value = '';
        
        // 聚焦到输入框
        Elements.inputText.focus();
        
        // 显示提示给用户
        TextUtils.showToast('请使用键盘快捷键（Ctrl/Cmd+V）粘贴文本', 'info', 4000);
        
        // 尝试触发系统粘贴事件（兼容性方法）
        try {
            // 模拟粘贴点击事件
            document.execCommand('paste');
        } catch (e) {
            // 如果 execCommand 失败，已经有展示提示，所以这里不需要额外处理
            console.log('浏览器不支持程序化粘贴操作');
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
    if ((event.ctrlKey || event.metaKey) && event.key === 'v' && event.target !== Elements.inputText && event.target !== Elements.outputText) {
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
 * 清空所有内容
 */
function clearAll() {
    try {
        if (Elements.inputText) {
            Elements.inputText.value = '';
        }
        if (Elements.outputText) {
            Elements.outputText.value = '';
        }
        
        AppState.inputText = '';
        AppState.outputText = '';
        
        // 隐藏文本统计
        const textStats = document.getElementById('textStats');
        if (textStats) {
            textStats.style.display = 'none';
        }
        
        updateUIState();
        
        // 聚焦到输入框
        if (Elements.inputText) {
            Elements.inputText.focus();
        }
        
        TextUtils.showToast('已清空所有内容', 'info');
    } catch (error) {
        console.error('清空内容出错:', error);
        TextUtils.showToast('清空内容时出错，请刷新页面重试', 'error');
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

// 导出到全局作用域（用于调试）
window.App = {
    state: AppState,
    elements: Elements,
    handleConvert,
    handleCopy,
    clearAll,
    updateUIState
};
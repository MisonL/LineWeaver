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
    
    console.log('文本换行符去除工具已初始化');
}

/**
 * 缓存DOM元素引用
 */
function cacheElements() {
    Elements.inputText = document.getElementById('inputText');
    Elements.outputText = document.getElementById('outputText');
    Elements.convertBtn = document.getElementById('convertBtn');
    Elements.copyBtn = document.getElementById('copyBtn');
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
        
        // 执行文本处理
        const processedText = TextUtils.removeLineBreaks(inputText);
        
        // 更新输出
        if (Elements.outputText) {
            Elements.outputText.value = processedText;
        }
        
        // 更新应用状态
        AppState.inputText = inputText;
        AppState.outputText = processedText;
        
        // 更新UI状态
        updateUIState();
        
        // 显示成功消息
        const stats = TextUtils.getTextStats(inputText);
        const processedStats = TextUtils.getTextStats(processedText);
        const message = `转换完成！原文本 ${stats.lines} 行，转换后 ${processedStats.lines} 行`;
        TextUtils.showToast(message, 'success');
        
        // 自动聚焦到输出区域
        if (Elements.outputText) {
            Elements.outputText.focus();
            Elements.outputText.select();
        }
        
    } catch (error) {
        console.error('文本处理出错:', error);
        TextUtils.showToast('处理文本时出现错误，请重试', 'error');
    } finally {
        setProcessingState(false);
    }
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
    if (Elements.inputText) {
        Elements.inputText.value = '';
    }
    if (Elements.outputText) {
        Elements.outputText.value = '';
    }
    
    AppState.inputText = '';
    AppState.outputText = '';
    
    updateUIState();
    
    // 聚焦到输入框
    if (Elements.inputText) {
        Elements.inputText.focus();
    }
    
    TextUtils.showToast('已清空所有内容', 'info');
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
        isLocalhost: caps.isLocalhost
    });
    
    // 显示兼容性提示
    if (!caps.clipboardAPI && !caps.execCommand) {
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
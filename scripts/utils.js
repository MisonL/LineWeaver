/**
 * 文本换行符去除工具 - 工具函数库
 * 包含文本处理、剪贴板操作和消息提示功能
 */

/**
 * 去除文本中的换行符
 * @param {string} text - 需要处理的文本
 * @returns {string} 处理后的文本
 */
function removeLineBreaks(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }
    
    // 去除所有类型的换行符：\n, \r\n, \r
    // 将换行符替换为空格，然后合并多个连续空格为单个空格
    return text
        .replace(/[\r\n]+/g, ' ')  // 替换换行符为空格
        .replace(/\s+/g, ' ')      // 合并多个空格为单个空格
        .trim();                   // 去除首尾空白字符
}

/**
 * 输入验证函数
 * @param {string} text - 需要验证的文本
 * @returns {Object} 验证结果 { isValid: boolean, message: string }
 */
function validateInput(text) {
    if (!text || text.trim() === '') {
        return {
            isValid: false,
            message: '请输入需要处理的文本'
        };
    }
    
    if (text.length > 50000) {
        return {
            isValid: false,
            message: '文本长度超过限制，请输入少于50000字符的文本'
        };
    }
    
    return {
        isValid: true,
        message: ''
    };
}

/**
 * 现代浏览器剪贴板API复制函数
 * @param {string} text - 需要复制的文本
 * @returns {Promise<boolean>} 复制是否成功
 */
async function copyToClipboardModern(text) {
    try {
        if (!navigator.clipboard) {
            return false;
        }
        
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.warn('Modern clipboard API failed:', err);
        return false;
    }
}

/**
 * 降级方案：使用 execCommand 复制文本
 * @param {string} text - 需要复制的文本
 * @returns {boolean} 复制是否成功
 */
function fallbackCopyTextToClipboard(text) {
    try {
        // 创建临时textarea元素
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // 设置样式使其不可见
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        textArea.style.opacity = '0';
        textArea.style.pointerEvents = 'none';
        
        document.body.appendChild(textArea);
        
        // 选择文本并复制
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, text.length);
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        return successful;
    } catch (err) {
        console.error('Fallback copy failed:', err);
        return false;
    }
}

/**
 * 主要的复制到剪贴板函数
 * @param {string} text - 需要复制的文本
 * @returns {Promise<boolean>} 复制是否成功
 */
async function copyToClipboard(text) {
    if (!text) {
        return false;
    }
    
    // 首先尝试现代 Clipboard API
    const modernSuccess = await copyToClipboardModern(text);
    if (modernSuccess) {
        return true;
    }
    
    // 降级到 execCommand 方案
    return fallbackCopyTextToClipboard(text);
}

/**
 * 显示Toast消息提示
 * @param {string} message - 提示消息
 * @param {string} type - 消息类型: 'success', 'error', 'warning', 'info'
 * @param {number} duration - 显示时长（毫秒），默认3000ms
 */
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast');
    const messageElement = toast.querySelector('.toast-message');
    
    if (!toast || !messageElement) {
        console.warn('Toast elements not found');
        return;
    }
    
    // 清除之前的类型类
    toast.classList.remove('success', 'error', 'warning', 'info');
    
    // 设置消息内容和类型
    messageElement.textContent = message;
    toast.classList.add(type);
    
    // 显示Toast
    toast.classList.add('show');
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

/**
 * 防抖函数 - 限制函数调用频率
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

/**
 * 节流函数 - 限制函数执行频率
 * @param {Function} func - 需要节流的函数
 * @param {number} limit - 限制时间间隔（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 检测浏览器环境和功能支持
 * @returns {Object} 浏览器功能支持信息
 */
function detectBrowserCapabilities() {
    return {
        clipboardAPI: !!(navigator.clipboard && navigator.clipboard.writeText),
        execCommand: document.queryCommandSupported && document.queryCommandSupported('copy'),
        isHttps: location.protocol === 'https:',
        isLocalhost: location.hostname === 'localhost' || location.hostname === '127.0.0.1',
        userAgent: navigator.userAgent
    };
}

/**
 * 格式化文件大小显示
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小字符串
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 统计文本信息
 * @param {string} text - 需要统计的文本
 * @returns {Object} 文本统计信息
 */
function getTextStats(text) {
    if (!text) {
        return {
            characters: 0,
            charactersNoSpaces: 0,
            words: 0,
            lines: 0,
            paragraphs: 0
        };
    }
    
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split(/\r\n|\r|\n/).length;
    const paragraphs = text.trim() ? text.split(/\r\n\s*\r\n|\r\s*\r|\n\s*\n/).length : 0;
    
    return {
        characters,
        charactersNoSpaces,
        words,
        lines,
        paragraphs
    };
}

// 导出到全局作用域（用于在其他脚本中使用）
window.TextUtils = {
    removeLineBreaks,
    validateInput,
    copyToClipboard,
    showToast,
    debounce,
    throttle,
    detectBrowserCapabilities,
    formatFileSize,
    getTextStats
};
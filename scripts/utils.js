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
 * 智能处理文本 - 保留结构标识
 * @param {string} text - 需要处理的文本
 * @param {Object} options - 处理选项
 * @returns {string} 处理后的文本
 */
function smartProcessText(text, options = {}) {
    if (!text || typeof text !== 'string') {
        return '';
    }
    
    const {
        paragraphSeparator = '[PARA]',
        listSeparator = '[LIST]',
        preserveCode = true,
        detectMarkdown = true // 新增：Markdown 检测选项
    } = options;
    
    // 特殊字符转义函数
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    let result = text;
    
    // 1. 保护代码块
    const codeBlocks = [];
    if (preserveCode) {
        // 匹配```代码块
        result = result.replace(/```[\s\S]*?```/g, (match, index) => {
            const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
            codeBlocks.push(match.replace(/\n/g, '\\n'));
            return placeholder;
        });
        
        // 匹配单行代码
        result = result.replace(/`[^`\n]+`/g, (match) => {
            const placeholder = `__INLINE_CODE_${codeBlocks.length}__`;
            codeBlocks.push(match);
            return placeholder;
        });
    }
    
    // 2. 处理Markdown标题和特殊元素
    if (detectMarkdown) {
        // 保护Markdown标题
        result = result.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, content) => {
            return `${paragraphSeparator}${match}`;
        });
        
        // 保护Markdown水平线
        result = result.replace(/^(\s*[-*_]){3,}\s*$/gm, (match) => {
            return `${paragraphSeparator}${match}${paragraphSeparator}`;
        });
        
        // 保护Markdown表格
        const tableRows = [];
        result = result.replace(/^\|(.+)\|\s*$/gm, (match) => {
            const placeholder = `__TABLE_ROW_${tableRows.length}__`;
            tableRows.push(match);
            return placeholder;
        });
        
        // 保护Markdown引用块
        result = result.replace(/^\s*>\s+(.+)$/gm, (match, content) => {
            return `${listSeparator}${match}`;
        });
        
        // 处理Markdown链接和图片
        result = result.replace(/!?\[([^\]]*)\]\(([^\)]*)\)/g, (match) => {
            return match.replace(/\s+/g, ' ');
        });
    }
    
    // 3. 处理段落（空行分隔）
    result = result.replace(/\n\s*\n/g, ` ${paragraphSeparator} `);
    
    // 4. 处理列表项（数字或项目符号开头）
    const listPatterns = [
        /^\s*\d+[\.\)\uff09]\s+/gm,  // 数字列表：1. 2) 3）
        /^\s*[-\*\+\u2022]\s+/gm,      // 项目符号列表：- * + •
        /^\s*[a-zA-Z][\.\)]\s+/gm,    // 字母列表：a. b)
    ];
    
    listPatterns.forEach(pattern => {
        result = result.replace(pattern, `${listSeparator}$&`);
    });
    
    // 5. 去除剩余的换行符
    result = result.replace(/\n/g, ' ');
    
    // 6. 清理多余空格
    result = result.replace(/\s+/g, ' ');
    
    // 7. 恢复代码块
    if (preserveCode && codeBlocks.length > 0) {
        codeBlocks.forEach((code, index) => {
            if (code.includes('```')) {
                // 多行代码块
                const cleanCode = code.replace(/\\n/g, '\n');
                result = result.replace(`__CODE_BLOCK_${index}__`, `[CODE]${cleanCode}[/CODE]`);
            } else {
                // 单行代码
                result = result.replace(`__INLINE_CODE_${index}__`, code);
            }
        });
    }
    
    // 8. 恢复Markdown表格行
    if (detectMarkdown && tableRows.length > 0) {
        tableRows.forEach((row, index) => {
            result = result.replace(`__TABLE_ROW_${index}__`, row);
        });
    }
    
    // 9. 清理首尾空格
    return result.trim();
}

/**
 * 自定义模式处理文本
 * @param {string} text - 需要处理的文本
 * @param {Object} config - 自定义配置
 * @returns {string} 处理后的文本
 */
function customProcessText(text, config = {}) {
    const {
        paragraphSeparator = '[PARA]',
        listSeparator = '[LIST]',
        detectMarkdown = true
    } = config;
    
    return smartProcessText(text, {
        paragraphSeparator,
        listSeparator,
        preserveCode: true,
        detectMarkdown
    });
}

/**
 * 根据模式处理文本
 * @param {string} text - 输入文本
 * @param {string} mode - 处理模式：'simple', 'smart', 'custom'
 * @param {Object} config - 配置参数
 * @returns {string} 处理后的文本
 */
function processTextByMode(text, mode = 'simple', config = {}) {
    switch (mode) {
        case 'smart':
            return smartProcessText(text, config);
        case 'custom':
            return customProcessText(text, config);
        case 'simple':
        default:
            return removeLineBreaks(text);
    }
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
    const userAgent = navigator.userAgent;
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    
    return {
        clipboardAPI: !!(navigator.clipboard && navigator.clipboard.writeText),
        execCommand: document.queryCommandSupported && document.queryCommandSupported('copy'),
        isHttps: location.protocol === 'https:',
        isLocalhost: location.hostname === 'localhost' || location.hostname === '127.0.0.1',
        userAgent: userAgent,
        isSafari: isSafari
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

/**
 * 从剪贴板读取文本
 * @returns {Promise<string>} 剪贴板文本
 */
async function readFromClipboard() {
    // 先尝试现代Clipboard API
    if (navigator.clipboard && navigator.clipboard.readText) {
        try {
            return await navigator.clipboard.readText();
        } catch (err) {
            console.warn('Modern clipboard read API failed:', err);
        }
    }
    
    // 如果现代API失败，使用降级方案
    try {
        // 创建一个隐藏的textarea
        const textArea = document.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        
        // 聚焦元素
        textArea.focus();
        
        // 执行粘贴命令
        const successful = document.execCommand('paste');
        
        // 获取粘贴的内容
        const text = textArea.value;
        
        // 移除临时元素
        document.body.removeChild(textArea);
        
        if (successful) {
            return text;
        }
    } catch (err) {
        console.error('Fallback clipboard read failed:', err);
    }
    
    // 两种方式都失败时返回空字符串
    return '';
}

// 导出到全局作用域（用于在其他脚本中使用）
window.TextUtils = {
    removeLineBreaks,
    smartProcessText,
    customProcessText, 
    processTextByMode,
    validateInput,
    copyToClipboard,
    readFromClipboard,
    showToast,
    debounce,
    throttle,
    detectBrowserCapabilities,
    formatFileSize,
    getTextStats
};
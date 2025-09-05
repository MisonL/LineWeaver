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
    // 定义tableRows数组，确保它在任何情况下都存在
    const tableRows = [];
    
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
        lineBreakReplacement = ' ',
        spaceHandling = 'preserve',
        indentationHandling = 'remove',
        maxLineLength = 0,
        preserveUrls = false,
        preserveCodeBlocks = false,
        trimEdges = true
    } = config;
    
    let processed = text;
    
    // 1. 处理代码块（如果启用）
    if (preserveCodeBlocks) {
        const codeBlockRegex = /```[\s\S]*?```/g;
        const codeBlocks = [];
        let match;
        
        while ((match = codeBlockRegex.exec(processed)) !== null) {
            codeBlocks.push({
                original: match[0],
                placeholder: `__CODE_BLOCK_${codeBlocks.length}__`
            });
        }
        
        codeBlocks.forEach((block, index) => {
            processed = processed.replace(block.original, block.placeholder);
        });
    }
    
    // 2. 处理URL（如果启用）
    if (preserveUrls) {
        const urlRegex = /https?:\/\/[^\s\n]+/g;
        const urls = [];
        let match;
        
        while ((match = urlRegex.exec(processed)) !== null) {
            urls.push({
                original: match[0],
                placeholder: `__URL_${urls.length}__`
            });
        }
        
        urls.forEach((url, index) => {
            processed = processed.replace(url.original, url.placeholder);
        });
    }
    
    // 3. 处理缩进
    if (indentationHandling === 'remove') {
        processed = processed.replace(/^[ \t]+/gm, '');
    } else if (indentationHandling === 'convert') {
        processed = processed.replace(/^[ \t]+/gm, (match) => ' '.repeat(match.length));
    }
    
    // 4. 处理换行符
    processed = processed.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // 5. 处理段落和列表
    const paragraphs = processed.split(/\n\s*\n/);
    const processedParagraphs = paragraphs.map(paragraph => {
        // 检测列表项
        const lines = paragraph.split('\n');
        const processedLines = lines.map(line => {
            // 检测列表项
            if (/^\s*[-*+]\s/.test(line) || /^\s*\d+\.\s/.test(line)) {
                return line.replace(/^\s*[-*+\d+\.]\s*/, '') + listSeparator;
            }
            return line.trim();
        });
        
        return processedLines.join(' ');
    });
    
    processed = processedParagraphs.join(paragraphSeparator);
    
    // 6. 处理空格
    if (spaceHandling === 'normalize') {
        processed = processed.replace(/\s+/g, ' ');
    } else if (spaceHandling === 'remove') {
        processed = processed.replace(/\s+/g, ' ').trim();
    }
    
    // 7. 处理最大行长
    if (maxLineLength > 0 && processed.length > maxLineLength) {
        // 智能截断或提示
        console.warn(`文本长度超过限制: ${processed.length}/${maxLineLength}`);
    }
    
    // 8. 去除首尾空格
    if (trimEdges) {
        processed = processed.trim();
    }
    
    // 9. 恢复代码块和URL
    if (preserveCodeBlocks) {
        const codeBlockRegex = /__CODE_BLOCK_(\d+)__/g;
        processed = processed.replace(codeBlockRegex, (match, index) => {
            return codeBlocks[parseInt(index)]?.original || match;
        });
    }
    
    if (preserveUrls) {
        const urlRegex = /__URL_(\d+)__/g;
        processed = processed.replace(urlRegex, (match, index) => {
            return urls[parseInt(index)]?.original || match;
        });
    }
    
    return processed;
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
 * 动态计算最大文本长度限制
 * 基于设备性能和可用内存
 * @returns {number} 建议的最大字符长度
 */
function getMaxTextLength() {
    try {
        // 检测设备内存（如果支持）
        const memory = navigator.deviceMemory || 4; // 默认4GB
        
        // 检测CPU核心数
        const cores = navigator.hardwareConcurrency || 4;
        
        // 基础限制（保守估计）
        let baseLimit = 200000; // 20万字符
        
        // 根据设备性能调整
        if (memory >= 8 && cores >= 8) {
            baseLimit = 1000000; // 100万字符 - 高性能设备
        } else if (memory >= 4 && cores >= 4) {
            baseLimit = 500000;  // 50万字符 - 中等性能设备
        } else if (memory >= 2) {
            baseLimit = 300000;  // 30万字符 - 低性能设备
        }
        
        // 检测是否为移动设备
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            baseLimit = Math.floor(baseLimit * 0.6); // 移动设备降低40%
        }
        
        return baseLimit;
    } catch (error) {
        console.warn('无法检测设备性能，使用默认限制');
        return 200000; // 默认20万字符
    }
}

/**
 * 输入验证函数
 * @param {string} text - 需要验证的文本
 * @returns {Object} 验证结果 { isValid: boolean, message: string }
 */
/**
 * 清理输入文本，移除潜在的危险内容
 * @param {string} text - 原始文本
 * @returns {string} 清理后的安全文本
 */
function sanitizeInput(text) {
    if (!text || typeof text !== 'string') return '';
    
    return text
        // 移除潜在的脚本标签
        .replace(/<script[^>]*>.*?<\/script>/gis, '')
        // 移除javascript:协议
        .replace(/javascript:/gi, '')
        // 移除事件处理属性
        .replace(/on\w+\s*=/gi, '')
        // 限制最大长度防止内存攻击
        .substring(0, 2000000); // 200万字符绝对上限
}

function validateInput(text) {
    if (!text || text.trim() === '') {
        return {
            isValid: false,
            message: '请输入需要处理的文本'
        };
    }
    
    // 先清理输入
    const sanitizedText = sanitizeInput(text);
    if (sanitizedText !== text) {
        console.warn('输入文本已被清理，移除了潜在的不安全内容');
    }
    
    // 智能长度检查 - 根据可用内存动态调整
    const maxLength = getMaxTextLength();
    if (text.length > maxLength) {
        return {
            isValid: false,
            message: `文本长度超过建议限制（${Math.floor(maxLength/1000)}K字符），建议分段处理以获得最佳性能`
        };
    }
    
    // 对于超长文本给出警告但不阻止处理
    if (text.length > 100000) {
        console.warn('处理超长文本，可能需要较长时间...');
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
 * 分块处理大文本 - 避免UI阻塞
 * @param {string} text - 要处理的文本
 * @param {string} mode - 处理模式
 * @param {Object} config - 配置对象
 * @param {function} progressCallback - 进度回调函数
 * @returns {Promise<string>} 处理后的文本
 */
async function processLargeText(text, mode, config, progressCallback) {
    const CHUNK_SIZE = 10000; // 每块1万字符
    const chunks = [];
    
    // 分割文本
    for (let i = 0; i < text.length; i += CHUNK_SIZE) {
        chunks.push(text.substring(i, i + CHUNK_SIZE));
    }
    
    const results = [];
    const totalChunks = chunks.length;
    
    // 逐块处理
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        // 处理单个块
        const processed = processTextByMode(chunk, mode, config);
        results.push(processed);
        
        // 更新进度
        if (progressCallback) {
            const progress = Math.round(((i + 1) / totalChunks) * 100);
            progressCallback(progress, i + 1, totalChunks);
        }
        
        // 让出控制权，避免阻塞UI
        if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }
    
    // 合并结果
    return results.join('');
}

/**
 * Web Worker 支持的文本处理（如果支持）
 * @param {string} text - 要处理的文本
 * @param {string} mode - 处理模式
 * @param {Object} config - 配置对象
 * @param {function} progressCallback - 进度回调函数
 * @returns {Promise<string>} 处理后的文本
 */
async function processTextWithWorker(text, mode, config, progressCallback) {
    // 检查是否支持Web Worker
    if (!window.Worker) {
        console.warn('当前环境不支持Web Worker，使用分块处理');
        return processLargeText(text, mode, config, progressCallback);
    }
    
    return new Promise((resolve, reject) => {
        try {
            // 创建内联Worker
            const workerCode = `
                // 导入处理函数（简化版）
                function processTextByMode(text, mode, config) {
                    switch (mode) {
                        case 'simple':
                            return text.replace(/\\n+/g, ' ').replace(/\\s+/g, ' ').trim();
                        case 'smart':
                            // 简化的智能处理
                            return text
                                .replace(/([^\\n])\\n([^\\n])/g, '$1 $2')
                                .replace(/\\n+/g, '\\n')
                                .replace(/\\s+/g, ' ')
                                .trim();
                        case 'custom':
                            const {paragraphSeparator, listSeparator} = config;
                            return text
                                .replace(/\\n\\n+/g, paragraphSeparator || '[PARA]')
                                .replace(/^\\s*[-*+]\\s+/gm, (listSeparator || '[LIST]') + ' ')
                                .replace(/\\n/g, ' ')
                                .replace(/\\s+/g, ' ')
                                .trim();
                        default:
                            return text;
                    }
                }
                
                self.onmessage = function(e) {
                    const {text, mode, config, chunkIndex, totalChunks} = e.data;
                    
                    try {
                        const result = processTextByMode(text, mode, config);
                        self.postMessage({
                            success: true,
                            result,
                            chunkIndex,
                            totalChunks
                        });
                    } catch (error) {
                        self.postMessage({
                            success: false,
                            error: error.message,
                            chunkIndex,
                            totalChunks
                        });
                    }
                };
            `;
            
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const workerUrl = URL.createObjectURL(blob);
            const worker = new Worker(workerUrl);
            
            const CHUNK_SIZE = 50000; // Worker中使用更大的块
            const chunks = [];
            const results = [];
            let completedChunks = 0;
            
            // 分割文本
            for (let i = 0; i < text.length; i += CHUNK_SIZE) {
                chunks.push(text.substring(i, i + CHUNK_SIZE));
            }
            
            worker.onmessage = function(e) {
                const {success, result, error, chunkIndex, totalChunks} = e.data;
                
                if (success) {
                    results[chunkIndex] = result;
                    completedChunks++;
                    
                    // 更新进度
                    if (progressCallback) {
                        const progress = Math.round((completedChunks / totalChunks) * 100);
                        progressCallback(progress, completedChunks, totalChunks);
                    }
                    
                    // 检查是否全部完成
                    if (completedChunks === totalChunks) {
                        worker.terminate();
                        URL.revokeObjectURL(workerUrl);
                        resolve(results.join(''));
                    }
                } else {
                    worker.terminate();
                    URL.revokeObjectURL(workerUrl);
                    reject(new Error(error));
                }
            };
            
            worker.onerror = function(error) {
                worker.terminate();
                URL.revokeObjectURL(workerUrl);
                reject(error);
            };
            
            // 发送所有块进行处理
            chunks.forEach((chunk, index) => {
                worker.postMessage({
                    text: chunk,
                    mode,
                    config,
                    chunkIndex: index,
                    totalChunks: chunks.length
                });
            });
            
        } catch (error) {
            console.warn('Web Worker创建失败，使用分块处理', error);
            resolve(processLargeText(text, mode, config, progressCallback));
        }
    });
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
    // 检查是否运行在安全上下文中（HTTPS或localhost）
    const isSecureContext = window.isSecureContext || 
                           location.protocol === 'https:' || 
                           location.hostname === 'localhost' || 
                           location.hostname === '127.0.0.1';
    
    // 检测是否支持Clipboard API
    const hasClipboardAPI = navigator.clipboard && typeof navigator.clipboard.readText === 'function';
    
    // 在安全上下文中首先尝试现代Clipboard API
    if (isSecureContext && hasClipboardAPI) {
        try {
            return await navigator.clipboard.readText();
        } catch (err) {
            console.warn('Modern clipboard read API failed:', err);
            // 继续尝试其他方法
        }
    }
    
    // 检测是否是Safari浏览器
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Safari浏览器特殊处理
    if (isSafari) {
        try {
            // 创建一个可编辑的div元素
            const editableDiv = document.createElement('div');
            editableDiv.contentEditable = true;
            editableDiv.style.cssText = 'position:fixed;top:0;left:0;opacity:0;height:1px;width:1px;overflow:hidden;';
            document.body.appendChild(editableDiv);
            
            // 聚焦到可编辑元素
            editableDiv.focus();
            
            // 尝试执行粘贴命令
            const successful = document.execCommand('paste');
            
            // 获取粘贴的内容并清理
            const text = editableDiv.innerText || editableDiv.textContent || '';
            document.body.removeChild(editableDiv);
            
            if (successful && text) {
                return text;
            }
        } catch (err) {
            console.warn('Safari clipboard handling failed:', err);
        }
    }
    
    // 通用降级方案
    try {
        // 创建一个隐藏的textarea
        const textArea = document.createElement('textarea');
        textArea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
        document.body.appendChild(textArea);
        
        // 聚焦元素
        textArea.focus();
        
        // 执行粘贴命令
        const successful = document.execCommand('paste');
        
        // 获取粘贴的内容
        const text = textArea.value;
        
        // 移除临时元素
        document.body.removeChild(textArea);
        
        if (successful && text) {
            return text;
        }
    } catch (err) {
        console.error('Fallback clipboard read failed:', err);
    }
    
    // 所有方法都失败时返回空字符串
    return '';
}

/**
 * Safari浏览器剪贴板访问辅助函数
 * @returns {Promise<string>} 剪贴板文本
 */
async function safariClipboardAccess() {
    return new Promise((resolve) => {
        try {
            // 创建一个临时的可编辑元素
            const editableDiv = document.createElement('div');
            editableDiv.contentEditable = true;
            editableDiv.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0.01;padding:0;overflow:hidden;';
            document.body.appendChild(editableDiv);
            
            // 聚焦到可编辑元素
            editableDiv.focus();
            
            // 尝试执行粘贴命令
            let success = false;
            
            // 使用setTimeout给浏览器一点时间来聚焦
            setTimeout(() => {
                try {
                    success = document.execCommand('paste');
                } catch (e) {
                    console.warn('execCommand paste failed', e);
                }
                
                // 获取粘贴的内容
                const text = editableDiv.innerText || editableDiv.textContent || '';
                
                // 清理
                document.body.removeChild(editableDiv);
                
                // 返回结果
                resolve(success && text ? text : '');
            }, 50);
        } catch (error) {
            console.error('Safari clipboard access helper failed:', error);
            resolve('');
        }
    });
}

/**
 * 获取当前选中的文本
 * @returns {string} 选中的文本
 */
function getSelectedText() {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
        return document.selection.createRange().text;
    }
    return '';
}

/**
 * 检测URL是否有效和安全
 * @param {string} url - 要检查的URL  
 * @returns {boolean} 是否是有效且安全的URL
 */
function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        
        // 只允许 HTTP/HTTPS 协议
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return false;
        }
        
        // 阻止访问内网地址和本地地址（安全考虑）
        const hostname = urlObj.hostname.toLowerCase();
        if (hostname === 'localhost' || 
            hostname === '127.0.0.1' ||
            hostname === '0.0.0.0' ||
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./)) {
            return false;
        }
        
        // 阻止访问保留域名
        const reservedDomains = ['localhost', 'test', 'invalid', 'example'];
        if (reservedDomains.some(domain => hostname.includes(domain))) {
            return false;
        }
        
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * 获取网页内容
 * @param {string} url - 要获取的URL
 * @returns {Promise<string>} 获取的内容
 */
async function fetchWebContent(url) {
    // 使用公共代理服务而非付费API，确保GitHub Pages环境下可用
    const proxies = [
        'https://corsproxy.io/?',
        'https://api.allorigins.win/raw?url=',
        'https://api.codetabs.com/v1/proxy?quest=',
        'https://cors-anywhere.herokuapp.com/',
        'https://crossorigin.me/'
    ];
    
    try {
        if (!isValidUrl(url)) {
            throw new Error('无效的URL格式');
        }
        
        // 使用公共代理服务而非付费API，确保GitHub Pages环境下可用
        
        // 存储最后一个错误，以便在所有代理都失败时提供详细信息
        let lastError = null;
        let htmlContent = null;
        
        // 尝试所有代理
        for (const proxy of proxies) {
            try {
                console.log(`尝试使用代理: ${proxy}`);
                const response = await fetch(`${proxy}${encodeURIComponent(url)}`);
                
                if (response.ok) {
                    htmlContent = await response.text();
                    
                    // 检查内容是否足够（至少1KB）
                    if (htmlContent && htmlContent.length > 1000) {
                        // 检查是否是SPA应用
                        if (isLikelySPA(htmlContent)) {
                            console.warn('检测到可能是SPA应用，内容可能需要JavaScript执行才能完全加载');
                        }
                        
                        console.log(`成功使用代理 ${proxy} 获取内容`);
                        return htmlContent;
                    }
                }
            } catch (error) {
                console.warn(`使用代理 ${proxy} 获取内容失败:`, error);
                lastError = error;
            }
        }
        
        // 如果获取到了一些内容，但不完整，仍然返回
        if (htmlContent) {
            return htmlContent;
        }
        
        // 如果所有代理都失败了，抛出最后一个错误
        throw lastError || new Error('所有代理服务器都不可用');
    } catch (error) {
        console.error('获取网页内容失败:', error);
        throw error;
    }
}

/**
 * 从HTML中提取Markdown内容
 * @param {string} html - HTML内容
 * @param {string} url - 原始URL（用于处理相对链接）
 * @returns {string} 提取的Markdown内容
 */
function htmlToMarkdown(html, url = '') {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 获取页面标题
        const title = doc.title || '无标题页面';
        let markdown = `# ${title}\n\n`;
        
        // 移除不需要的元素
        const elementsToRemove = doc.querySelectorAll('script, style, iframe, noscript, svg');
        elementsToRemove.forEach(el => el.remove());
        
        
        // 查找主要内容 - 通用选择器适用于所有网站
        const contentSelectors = [
            'article', 'main', '.content', '.article', '.main-content',
            '#content', '.post-content', '.entry-content', '.post', 
            '.blog-post', '.entry', '.markdown-body',
            '[role="main"]', '#main-content'
        ];
        
        let mainContent = null;
        for (const selector of contentSelectors) {
            const element = doc.querySelector(selector);
            if (element && element.textContent.trim().length > 100) {
                mainContent = element;
                break;
            }
        }
        
        // 如果没有找到主要内容，使用body
        if (!mainContent) {
            mainContent = doc.body;
        }
        
        // 提取Markdown内容
        markdown += extractMarkdownFromElement(mainContent, url);
        return markdown;
    } catch (error) {
        console.error('HTML转Markdown失败:', error);
        return '';
    }
}

/**
 * 从DOM元素中提取Markdown内容
 * @param {Element} element - DOM元素
 * @param {string} baseUrl - 基础URL（用于处理相对链接）
 * @returns {string} 提取的Markdown内容
 */
function extractMarkdownFromElement(element, baseUrl = '') {
    if (!element) return '';
    
    // 创建一个深拷贝以避免修改原始DOM
    const elementClone = element.cloneNode(true);
    
    // 处理标题
    const headings = elementClone.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        const level = parseInt(heading.tagName.substring(1));
        const prefix = '#'.repeat(level);
        heading.textContent = `\n\n${prefix} ${heading.textContent.trim()}\n\n`;
    });
    
    // 处理段落
    const paragraphs = elementClone.querySelectorAll('p');
    paragraphs.forEach(p => {
        // 确保段落前后有空行
        if (p.textContent.trim()) {
            p.textContent = `${p.textContent.trim()}\n\n`;
        }
    });
    
    // 处理列表
    const lists = elementClone.querySelectorAll('ul, ol');
    lists.forEach(list => {
        const items = list.querySelectorAll('li');
        items.forEach(item => {
            const prefix = list.tagName === 'OL' ? '1. ' : '- ';
            item.textContent = `${prefix}${item.textContent.trim()}\n`;
        });
    });
    
    // 处理链接 - 转换相对链接为绝对链接
    const links = elementClone.querySelectorAll('a');
    links.forEach(link => {
        const text = link.textContent.trim();
        let href = link.getAttribute('href');
        
        // 转换相对链接为绝对链接
        if (href && !href.startsWith('http') && baseUrl) {
            try {
                href = new URL(href, baseUrl).href;
            } catch (e) {
                // 如果转换失败，保持原样
            }
        }
        
        if (text && href) {
            link.textContent = `[${text}](${href})`;
        }
    });
    
    // 处理图片 - 转换相对链接为绝对链接
    const images = elementClone.querySelectorAll('img');
    images.forEach(img => {
        const alt = img.getAttribute('alt') || 'image';
        let src = img.getAttribute('src');
        
        // 转换相对链接为绝对链接
        if (src && !src.startsWith('http') && baseUrl) {
            try {
                src = new URL(src, baseUrl).href;
            } catch (e) {
                // 如果转换失败，保持原样
            }
        }
        
        if (src) {
            img.textContent = `![${alt}](${src})`;
        }
    });
    
    // 处理表格
    const tables = elementClone.querySelectorAll('table');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        const markdownTable = [];
        
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('th, td');
            const markdownRow = [];
            
            cells.forEach(cell => {
                markdownRow.push(cell.textContent.trim());
            });
            
            markdownTable.push(`| ${markdownRow.join(' | ')} |`);
            
            // 如果是表头行，添加分隔行
            if (rowIndex === 0) {
                markdownTable.push(`| ${markdownRow.map(() => '---').join(' | ')} |`);
            }
        });
        
        if (markdownTable.length > 0) {
            // 替换表格内容
            table.textContent = `\n\n${markdownTable.join('\n')}\n\n`;
        }
    });
    
    // 处理代码块
    const preElements = elementClone.querySelectorAll('pre');
    preElements.forEach(pre => {
        const code = pre.querySelector('code');
        const codeText = (code || pre).textContent.trim();
        const language = code ? (code.className.match(/language-(\w+)/) || [])[1] || '' : '';
        
        pre.textContent = `\n\n\`\`\`${language}\n${codeText}\n\`\`\`\n\n`;
    });
    
    // 处理内联代码
    const codeElements = elementClone.querySelectorAll('code:not(pre code)');
    codeElements.forEach(code => {
        code.textContent = `\`${code.textContent.trim()}\``;
    });
    
    // 处理引用
    const blockquotes = elementClone.querySelectorAll('blockquote');
    blockquotes.forEach(blockquote => {
        const lines = blockquote.textContent.trim().split('\n');
        const quotedLines = lines.map(line => `> ${line}`).join('\n');
        blockquote.textContent = `\n\n${quotedLines}\n\n`;
    });
    
    // 处理分割线
    const hrs = elementClone.querySelectorAll('hr');
    hrs.forEach(hr => {
        hr.textContent = '\n\n---\n\n';
    });
    
    // 获取处理后的文本内容
    let markdown = elementClone.textContent
        .replace(/\n{3,}/g, '\n\n') // 将多个换行符替换为两个
        .trim();
    
    return markdown;
}

/**
 * 判断是否可能是SPA应用
 * @param {string} html - HTML内容
 * @returns {boolean} 是否可能是SPA
 */
function isLikelySPA(html) {
    // 检查是否有常见的SPA框架特征
    const spaIndicators = [
        /<div id="app"/i,
        /<div id="root"/i,
        /react/i,
        /vue/i,
        /angular/i,
        /id="__next"/i,  // Next.js
        /data-reactroot/i,
        /ng-app/i,  // Angular
        /nuxt/i      // Nuxt.js
    ];
    
    return spaIndicators.some(indicator => indicator.test(html));
}

/**
 * 请求剪贴板权限
 * @returns {Promise<boolean>} 是否获得权限
 */
async function requestClipboardPermission() {
    // 检查是否运行在安全上下文中（HTTPS或localhost）
    const isSecureContext = window.isSecureContext || 
                          location.protocol === 'https:' || 
                          location.hostname === 'localhost' || 
                          location.hostname === '127.0.0.1';
    
    // 如果不在安全上下文中，无法获取权限
    if (!isSecureContext) {
        console.warn('Clipboard API requires secure context (HTTPS or localhost)');
        return false;
    }
    
    // 检查是否支持权限API
    if (navigator.permissions && navigator.permissions.query) {
        try {
            // 请求剪贴板读取权限
            const permissionStatus = await navigator.permissions.query({ name: 'clipboard-read' });
            
            if (permissionStatus.state === 'granted') {
                return true;
            } else if (permissionStatus.state === 'prompt') {
                // 权限状态为提示，尝试触发权限请求
                try {
                    // 尝试读取剪贴板，这会触发权限请求
                    await navigator.clipboard.readText();
                    return true;
                } catch (e) {
                    // 用户可能拒绝了权限请求
                    return false;
                }
            } else {
                // 权限被拒绝
                return false;
            }
        } catch (error) {
            console.warn('Permissions API error:', error);
            // 权限API可能不支持clipboard-read
            return false;
        }
    }
    
    // 不支持权限API，尝试直接读取来测试权限
    try {
        if (navigator.clipboard && navigator.clipboard.readText) {
            await navigator.clipboard.readText();
            return true;
        }
    } catch (error) {
        console.warn('Clipboard permission test failed:', error);
        return false;
    }
    
    return false;
}

// 导出到全局作用域
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
    getTextStats,
    isValidUrl,
    fetchWebContent,
    htmlToMarkdown,
    requestClipboardPermission
};

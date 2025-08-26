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
 * 检测URL是否有效
 * @param {string} url - 要检查的URL
 * @returns {boolean} 是否是有效URL
 */
function isValidUrl(url) {
    try {
        new URL(url);
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
        
        // 针对ITSM系统的特定处理
        if (url.includes('itsm.qdama.cn') && url.includes('knowledgeShare')) {
            // 尝试专门查找知识共享页面的内容
            const knowledgeContent = doc.querySelector('.knowledge-content') || 
                                    doc.querySelector('.knowledge-detail') ||
                                    doc.querySelector('.knowledge-text') || 
                                    doc.querySelector('.knowledge-body');
            
            if (knowledgeContent) {
                console.log('找到ITSM知识内容元素');
                // 提取并格式化ITSM知识内容
                markdown += extractMarkdownFromElement(knowledgeContent, url);
                return markdown;
            }
            
            // 尝试查找有意义的文本内容的div
            const contentDivs = Array.from(doc.querySelectorAll('div')).filter(div => {
                const text = div.textContent.trim();
                return text.length > 200 && !text.includes('script') && !div.querySelector('script');
            });
            
            if (contentDivs.length > 0) {
                // 选择内容最丰富的div
                const richestDiv = contentDivs.sort((a, b) => 
                    b.textContent.trim().length - a.textContent.trim().length
                )[0];
                
                markdown += extractMarkdownFromElement(richestDiv, url);
                return markdown;
            }
        }
        
        // 查找主要内容 - 增强选择器以更好地处理SPA应用
        const contentSelectors = [
            'article', 'main', '.content', '.article', '.main-content',
            '#content', '.post-content', '.knowledge-content', '.knowledge-detail',
            '.entry-content', '.post', '.blog-post', '.entry', '.markdown-body',
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

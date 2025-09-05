/**
 * 统一智能模式 - 完全合并PowerShell功能
 * 将PowerShell文本处理完全集成到智能检测系统中
 * 无需区分模式，自动根据上下文应用PowerShell优化
 */

/**
 * 统一智能配置 - GitHub Pages优化版本
 */
const PRECOMPILED_PATTERNS = {
    powerShell: [
        /^\$\w+/,
        /^\w+-\w+/,
        /\|\s*\w+/,
        />\s*\w+/,
        /`\w+/,
        /@["'].*["']@/
    ],
    textTypes: {
        code: /^(function|def|class|import|const|let|var|public|private|static)\s+/m,
        markdown: /^#{1,6}\s|^```|^[-*+]\s/m,
        list: /^\s*[-*+]\s|^\s*\d+\.\s/m
    }
};

const DEFAULT_CONFIG = Object.freeze({
    autoDetect: true,
    maxLineLength: 500,
    powerShellOptimization: true,
    escapePowerShellChars: true,
    useBacktickForNewlines: true,
    preserveStructure: true,
    preserveIndentation: false,
    compressionLevel: 'balanced',
    semanticAnalysis: true,
    validation: true
});

// 简单LRU缓存（静态部署兼容）
const SIMPLE_CACHE = {
    store: new Map(),
    maxSize: 50,
    
    get(key) { return this.store.get(key); },
    set(key, value) {
        if (this.store.size >= this.maxSize) {
            const firstKey = this.store.keys().next().value;
            this.store.delete(firstKey);
        }
        this.store.set(key, value);
    }
};

/**
 * 统一文本处理器
 */
class UnifiedSmartProcessor {
    constructor(config = {}) {
        this.config = Object.assign({}, DEFAULT_CONFIG, config);
    }
    
    /**
     * 主处理函数 - GitHub Pages优化版本
     */
    process(text, overrideConfig = {}) {
        // 缓存检查
        const cacheKey = text.slice(0, 100) + JSON.stringify(overrideConfig);
        const cached = SIMPLE_CACHE.get(cacheKey);
        if (cached) return cached;
        
        const config = Object.assign({}, this.config, overrideConfig);
        
        if (!text || text.trim() === '') {
            const result = this.createResult('', text, config);
            SIMPLE_CACHE.set(cacheKey, result);
            return result;
        }
        
        let processed = text;
        
        try {
            // 采样优化：限制检测范围
            const context = this.analyzeContext(processed);
            processed = this.preprocess(processed, config, context);
            processed = this.coreProcess(processed, config, context);
            processed = this.postprocess(processed, config, context);
            const validation = this.validate(processed, config, context);
            
            const result = this.createResult(processed, text, config, validation, context);
            SIMPLE_CACHE.set(cacheKey, result);
            return result;
            
        } catch (error) {
            const result = this.createResult(text, text, config, { isValid: false, error: error.message });
            SIMPLE_CACHE.set(cacheKey, result);
            return result;
        }
    }
    
    /**
     * 上下文分析 - 检测是否需要PowerShell优化
     */
    analyzeContext(text) {
        const context = {
            type: 'plain',
            powerShellContext: false,
            confidence: 0,
            features: []
        };
        
        const trimmed = text.trim();
        
        // PowerShell上下文检测
        if (this.config.powerShellOptimization) {
            const powerShellScore = this.calculatePowerShellScore(trimmed);
            if (powerShellScore > 0.3) {
                context.powerShellContext = true;
                context.confidence = powerShellScore;
                context.features.push('powerShellOptimized');
            }
        }
        
        // 通用类型检测
        context.type = this.detectTextType(trimmed);
        
        return context;
    }
    
    /**
     * 计算PowerShell上下文得分 - GitHub Pages优化
     */
    calculatePowerShellScore(text) {
        // 采样优化：限制检测范围到前2000字符
        const sample = text.slice(0, Math.min(text.length, 2000));
        let score = 0;
        
        // 使用预编译的正则表达式
        PRECOMPILED_PATTERNS.powerShell.forEach(pattern => {
            if (pattern.test(sample)) {
                score += 0.2;
            }
        });
        
        // 优化特殊字符检测
        const specialChars = sample.match(/[$|><&"'`]/g);
        if (specialChars) {
            score += Math.min(specialChars.length * 0.05, 0.3);
        }
        
        return Math.min(score, 1.0);
    }
    
    /**
     * 终端命令特征检测
     * 检测是否为终端命令格式
     */
    detectTextType(text) {
        const sample = text.slice(0, Math.min(text.length, 1000));
        
        // 终端命令特征检测
        const terminalIndicators = [
            /^\$\w+/,                    // 变量定义
            /^\w+-\w+/,                 // 命令格式
            /\|\s*\w+/,                 // 管道操作
            />\s*\w+/,                  // 重定向
            /\.sh|\.bat|\.cmd/,         // 脚本文件扩展名
            /get-|set-|write-|read-/i   // 命令动词
        ];
        
        let score = 0;
        terminalIndicators.forEach(pattern => {
            if (pattern.test(sample)) score += 0.25;
        });
        
        return score > 0.3 ? 'terminal' : 'plain';
 }
    
    /**
     * 预处理
     */
    preprocess(text, config, context) {
        let processed = text;
        
        // 标准化换行符
        processed = processed.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // 根据压缩级别处理
        if (config.compressionLevel === 'aggressive') {
            processed = processed.replace(/\s+/g, ' ').trim();
        } else if (config.compressionLevel === 'light') {
            processed = processed.replace(/[ \t]+/g, ' ');
        }
        
        return processed;
    }
    
    /**
     * PowerShell CLI核心处理
     * 专注于将文本转换为适合PowerShell终端粘贴的格式
     */
    coreProcess(text, config, context) {
        let processed = text;
        
        // 始终应用PowerShell优化，确保适合终端粘贴
        if (config.powerShellOptimization) {
            processed = this.applyTerminalOptimization(processed);
        } else {
            // 基础单行处理
            processed = processed.replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/\r/g, ' ');
            processed = processed.replace(/\s+/g, ' ').trim();
        }
        
        return processed;
 }
    
    /**
     * PowerShell CLI粘贴优化 - 核心功能
     * 将任意文本转换为适合PowerShell终端粘贴的单行命令
     */
    applyTerminalOptimization(text) {
        // 1. 移除所有换行符，强制单行
        let processed = text.replace(/\n/g, ' ').replace(/\r/g, ' ');
        
        // 2. 合并多余空格
        processed = processed.replace(/\s+/g, ' ').trim();
        
        // 3. 终端特殊字符转义
        const escapeMap = {
            '"': '""',           // 双引号转义
            "'": "''",           // 单引号转义
            '`': '``',           // 反引号转义
            '$': '`$',           // 变量符号转义
            '|': '`|',           // 管道符转义
            '>': '`>',           // 重定向转义
            '<': '`<',           // 输入重定向转义
            '&': '`&',           // 后台运行转义
            '(': '`(',           // 括号转义
            ')': '`)',           // 括号转义
            '{': '`{',           // 大括号转义
            '}': '`}',           // 大括号转义
            '[': '`[',           // 中括号转义
            ']': '`]',           // 中括号转义
            '#': '`#',           // 注释符号转义
            ';': '`;'            // 分号转义
        };
        
        // 4. 转义特殊字符
        processed = processed.replace(/["'`$|><&(){}[\]#;]/g, char => escapeMap[char] || char);
        
        // 5. 确保适合终端粘贴（去除首尾空格）
        return processed.trim();
    }
    
    /**
     * PowerShell CLI专用处理函数
     * 所有文本统一处理为适合PowerShell终端粘贴的格式
     */
    processCode(text, config) {
        return this.applyTerminalOptimization(text);
    }
    
    processMarkdown(text, config) {
        return this.applyTerminalOptimization(text);
    }
    
    processList(text, config) {
        return this.applyPowerShellOptimization(text);
    }
    
    processPlain(text, config) {
        return this.applyPowerShellOptimization(text);
 }
    
    /**
     * 后处理
     */
    postprocess(text, config, context) {
        return text.trim();
    }
    
    /**
     * 统一验证
     */
    validate(text, config, context) {
        const issues = [];
        
        // 长度检查
        if (config.maxLineLength && text.length > config.maxLineLength) {
            issues.push({
                type: 'warning',
                message: `文本长度超过限制 (${text.length}/${config.maxLineLength})`,
                suggestion: '考虑分段处理'
            });
        }
        
        // PowerShell兼容性检查
        if (context.powerShellContext) {
            const unescaped = text.match(/[^`][$|><&(){}[\]"'`]/g);
            if (unescaped && unescaped.length > 0) {
                issues.push({
                    type: 'info',
                    message: `检测到 ${unescaped.length} 个未转义的PowerShell特殊字符`,
                    suggestion: '已自动应用PowerShell优化'
                });
            }
        }
        
        return {
            isValid: issues.length === 0 || issues.every(i => i.type !== 'error'),
            issues,
            summary: issues.length === 0 ? '处理成功' : `处理完成，${issues.length} 个提示`
        };
    }
    
    /**
     * 创建结果对象
     */
    createResult(processed, original, config, validation, context) {
        return {
            text: processed,
            original: original,
            originalLength: original.length,
            processedLength: processed.length,
            compression: original.length > 0 ? 
                ((original.length - processed.length) / original.length * 100).toFixed(1) + '%' : 
                '0%',
            context: context,
            validation: validation,
            powerShellOptimized: context.powerShellContext,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 统一智能模式API
 */
const SmartMode = {
    processor: new UnifiedSmartProcessor(),
    
    /**
     * 统一处理接口
     */
    process(text, config = {}) {
        return this.processor.process(text, config);
    },
    
    /**
     * 快速终端处理（向后兼容）
     */
    processForTerminal(text) {
        return this.processor.process(text, {
            powerShellOptimization: true,
            escapePowerShellChars: true,
            useBacktickForNewlines: true
        });
    },
    
    /**
     * 检测上下文
     */
    detectContext(text) {
        return this.processor.analyzeContext(text);
    },
    
    /**
     * 性能测试
     */
    benchmark(text, iterations = 100) {
        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            this.processor.process(text);
        }
        const end = performance.now();
        return {
            totalTime: end - start,
            averageTime: (end - start) / iterations,
            iterations,
            textLength: text.length
        };
    }
};

/**
 * 向后兼容API
 */
const TerminalUtils = {
    processForTerminalAI: (text) => SmartMode.processForTerminal(text),
    validateTerminalCompatibility: (text) => {
        const result = SmartMode.process(text);
        return {
            isValid: result.validation.isValid,
            issues: result.validation.issues,
            summary: result.validation.summary
        };
    }
};

// 导出到全局作用域
window.SmartMode = SmartMode;
window.TerminalUtils = TerminalUtils;

// 开发环境自动初始化
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    console.log('🧠 LineWeaver 已加载');
    console.log('使用方式:');
    console.log('- SmartMode.process(text) - 统一智能处理');
    console.log('- SmartMode.processForTerminal(text) - 终端优化');
    console.log('- SmartMode.detectContext(text) - 上下文检测');
    console.log('- SmartMode.benchmark(text) - 性能测试（开发环境）');
    
    // 添加性能测试方法（开发环境）
    SmartMode.benchmark = function(text, iterations = 1000) {
        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            SmartMode.process(text);
        }
        const end = performance.now();
        return {
            totalTime: end - start,
            averageTime: (end - start) / iterations,
            opsPerSecond: Math.round(iterations / ((end - start) / 1000))
        };
    };
}
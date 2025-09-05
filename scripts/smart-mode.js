/**
 * 统一智能模式 - 完全合并PowerShell功能
 * 将PowerShell文本处理完全集成到智能检测系统中
 * 无需区分模式，自动根据上下文应用PowerShell优化
 */

/**
 * 统一智能配置
 */
const UnifiedSmartConfig = {
    // 单一智能模式配置
    defaults: {
        autoDetect: true,
        maxLineLength: 500,
        encoding: 'utf8',
        
        // PowerShell集成参数
        powerShellOptimization: true,
        escapePowerShellChars: true,
        useBacktickForNewlines: true,
        
        // 通用处理参数
        preserveStructure: true,
        preserveIndentation: false,
        compressionLevel: 'balanced',
        semanticAnalysis: true,
        validation: true
    },
    
    // 上下文检测规则
    contextRules: {
        powerShellContext: {
            triggers: ['powershell', 'ps1', 'cli', 'command', 'script'],
            patterns: [
                /^\$\w+/,           // PowerShell变量
                /^\w+-\w+/,        // PowerShell命令格式
                /\|\s*\w+/,        // 管道操作
                />\s*\w+/,         // 重定向
                /`\w+/,            // 反引号转义
                /@["'].*["']@/     // Here-string
            ]
        }
    }
};

/**
 * 统一文本处理器
 */
class UnifiedSmartProcessor {
    constructor(config = {}) {
        this.config = { ...UnifiedSmartConfig.defaults, ...config };
    }
    
    /**
     * 主处理函数 - 完全合并的智能处理
     */
    process(text, overrideConfig = {}) {
        const config = { ...this.config, ...overrideConfig };
        
        if (!text || text.trim() === '') {
            return this.createResult('', text, config);
        }
        
        let processed = text;
        
        try {
            // 1. 上下文分析
            const context = this.analyzeContext(processed);
            
            // 2. 智能预处理
            processed = this.preprocess(processed, config, context);
            
            // 3. 统一核心处理（包含PowerShell优化）
            processed = this.coreProcess(processed, config, context);
            
            // 4. 智能后处理
            processed = this.postprocess(processed, config, context);
            
            // 5. 统一验证
            const validation = this.validate(processed, config, context);
            
            return this.createResult(processed, text, config, validation, context);
            
        } catch (error) {
            return this.createResult(text, text, config, { isValid: false, error: error.message });
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
     * 计算PowerShell上下文得分
     */
    calculatePowerShellScore(text) {
        let score = 0;
        const rules = UnifiedSmartConfig.contextRules.powerShellContext;
        
        // 检查PowerShell特定模式
        rules.patterns.forEach(pattern => {
            if (pattern.test(text)) {
                score += 0.2;
            }
        });
        
        // 检查特殊字符密度
        const specialChars = text.match(/[$|><&"'`]/g);
        if (specialChars) {
            score += Math.min(specialChars.length * 0.05, 0.3);
        }
        
        return Math.min(score, 1.0);
    }
    
    /**
     * 文本类型检测
     */
    detectTextType(text) {
        // 代码检测
        if (/^(function|def|class|import|const|let|var|public|private|static)\s+/m.test(text) ||
            /^(#!\/|#include|using|namespace|package)\s/m.test(text) ||
            /^(\s{4,}|\t).*\w+\s*\(/m.test(text)) {
            return 'code';
        }
        
        // Markdown检测
        if (/^#{1,6}\s/m.test(text) || /^\s*[-*+]\s/m.test(text) || /^```/m.test(text)) {
            return 'markdown';
        }
        
        // 列表检测
        if (/^\s*[-*+]\s/m.test(text) || /^\s*\d+\.\s/m.test(text)) {
            return 'list';
        }
        
        return 'plain';
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
     * 统一核心处理（完全合并PowerShell功能）
     */
    coreProcess(text, config, context) {
        let processed = text;
        
        // 根据上下文自动应用PowerShell优化
        if (context.powerShellContext && config.escapePowerShellChars) {
            processed = this.applyPowerShellOptimization(processed);
        }
        
        // 根据文本类型处理
        switch (context.type) {
            case 'code':
                processed = this.processCode(processed, config);
                break;
            case 'markdown':
                processed = this.processMarkdown(processed, config);
                break;
            case 'list':
                processed = this.processList(processed, config);
                break;
            default:
                processed = this.processPlain(processed, config);
        }
        
        return processed;
    }
    
    /**
     * PowerShell优化处理（完全集成）
     */
    applyPowerShellOptimization(text) {
        let processed = text;
        
        // PowerShell特殊字符转义
        const escapeMap = {
            '$': '`$',
            '|': '`|',
            '>': '`>',
            '<': '`<',
            '&': '`&',
            '(': '`(',
            ')': '`)',
            '{': '`{',
            '}': '`}',
            '[': '`[',
            ']': '`]',
            '"': '""',
            "'": "''",
            '`': '``'
        };
        
        processed = processed.replace(/[$|><&(){}[\]"'`]/g, char => escapeMap[char] || char);
        
        // 换行符处理
        if (UnifiedSmartConfig.defaults.useBacktickForNewlines) {
            processed = processed.replace(/\n/g, '`n');
        }
        
        return processed;
    }
    
    /**
     * 代码处理
     */
    processCode(text, config) {
        let processed = text;
        
        if (config.preserveIndentation) {
            processed = processed.replace(/\t/g, '    ');
        }
        
        return processed;
    }
    
    /**
     * Markdown处理
     */
    processMarkdown(text, config) {
        return text; // 保持Markdown格式
    }
    
    /**
     * 列表处理
     */
    processList(text, config) {
        return text; // 保持列表格式
    }
    
    /**
     * 普通文本处理
     */
    processPlain(text, config) {
        let processed = text;
        
        // 智能分段
        if (config.maxLineLength && processed.length > config.maxLineLength) {
            const sentences = processed.match(/[^.!?。！？]+[.!?。！？]+/g) || [processed];
            processed = sentences.join(' ');
        }
        
        return processed;
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
     * 快速PowerShell处理（向后兼容）
     */
    processForPowerShell(text) {
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
const PowerShellUtils = {
    processForPowerShellAI: (text) => SmartMode.processForPowerShell(text),
    validatePowerShellCompatibility: (text) => {
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
window.PowerShellUtils = PowerShellUtils;

// 开发环境自动初始化
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    console.log('🧠 统一智能模式已加载');
    console.log('使用方式:');
    console.log('- SmartMode.process(text) - 统一智能处理');
    console.log('- SmartMode.processForPowerShell(text) - PowerShell优化');
    console.log('- SmartMode.detectContext(text) - 上下文检测');
}
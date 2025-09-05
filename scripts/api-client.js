/**
 * LineWeaver 纯前端API客户端
 * 提供RESTful API接口模拟，完全兼容GitHub Pages
 */

class LineWeaverAPI {
    constructor() {
        this.version = '1.0.0';
        this.baseURL = 'https://api.lineweaver.dev'; // 模拟API域名
        this.endpoints = {
            process: '/v1/process',
            health: '/v1/health',
            version: '/v1/version',
            docs: '/v1/docs'
        };
    }

    /**
     * 处理文本 - 核心API接口
     * @param {string} text - 要处理的文本
     * @param {Object} options - 处理选项
     * @returns {Promise<Object>} 处理结果
     */
    async processText(text, options = {}) {
        try {
            // 模拟API延迟
            await this.simulateDelay(100);
            
            const result = this.processInBrowser(text, options);
            
            return {
                success: true,
                data: result,
                meta: {
                    timestamp: new Date().toISOString(),
                    version: this.version,
                    processingTime: Date.now()
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    code: 'PROCESSING_ERROR',
                    message: error.message,
                    details: error.stack
                }
            };
        }
    }

    /**
     * 获取API状态
     * @returns {Promise<Object>} 健康检查信息
     */
    async getHealth() {
        await this.simulateDelay(50);
        
        return {
            success: true,
            data: {
                status: 'healthy',
                uptime: this.getUptime(),
                version: this.version,
                environment: 'browser',
                capabilities: {
                    textProcessing: true,
                    customOptions: true,
                    batchProcessing: true,
                    realTime: true
                }
            }
        };
    }

    /**
     * 获取API版本信息
     * @returns {Promise<Object>} 版本信息
     */
    async getVersion() {
        return {
            success: true,
            data: {
                version: this.version,
                build: '2025.09.05',
                features: [
                    'text-processing',
                    'custom-parameters',
                    'batch-processing',
                    'real-time-preview'
                ],
                limits: {
                    maxTextLength: 100000,
                    maxBatchSize: 1000,
                    rateLimit: 'unlimited'
                }
            }
        };
    }

    /**
     * 批量处理文本
     * @param {Array<string>} texts - 文本数组
     * @param {Object} options - 处理选项
     * @returns {Promise<Object>} 批量处理结果
     */
    async batchProcess(texts, options = {}) {
        if (!Array.isArray(texts)) {
            throw new Error('texts must be an array');
        }

        await this.simulateDelay(texts.length * 10);

        const results = texts.map((text, index) => ({
            id: index,
            original: text,
            processed: this.processInBrowser(text, options),
            metadata: {
                originalLength: text.length,
                processedLength: this.processInBrowser(text, options).length,
                compressionRatio: this.calculateCompression(text, this.processInBrowser(text, options))
            }
        }));

        return {
            success: true,
            data: {
                results,
                summary: {
                    total: texts.length,
                    totalOriginalLength: texts.reduce((sum, text) => sum + text.length, 0),
                    totalProcessedLength: results.reduce((sum, r) => sum + r.processed.length, 0)
                }
            }
        };
    }

    /**
     * 浏览器内文本处理核心逻辑
     * @private
     */
    processInBrowser(text, options = {}) {
        const defaultOptions = {
            lineBreakReplacement: 'space',
            spaceHandling: 'normalize',
            indentationHandling: 'remove',
            lineConnector: ' ',
            paragraphSeparator: '\\n\\n',
            preserveUrls: true,
            preserveCodeBlocks: true,
            preserveLists: true,
            compressionLevel: 'balanced',
            maxLineLength: 500,
            escapeSpecialChars: false,
            useSmartSpacing: true
        };

        const opts = { ...defaultOptions, ...options };
        
        let processed = text;

        // 保护特殊内容
        const protectedBlocks = [];
        if (opts.preserveCodeBlocks) {
            processed = processed.replace(/```[\\s\\S]*?```/g, (match) => {
                protectedBlocks.push(match);
                return `__CODE_BLOCK_${protectedBlocks.length - 1}__`;
            });
        }

        if (opts.preserveUrls) {
            processed = processed.replace(/https?:\\/\\/[^\\s\\n]+/g, (match) => {
                protectedBlocks.push(match);
                return `__URL_${protectedBlocks.length - 1}__`;
            });
        }

        // 处理换行符
        const replacements = {
            'space': ' ',
            'empty': '',
            'custom': opts.customLineBreak || ' '
        };

        processed = processed.replace(/\\r\\n|\\r|\\n/g, replacements[opts.lineBreakReplacement] || ' ');

        // 处理空格
        if (opts.spaceHandling === 'normalize') {
            processed = processed.replace(/[ \\t]+/g, ' ');
        } else if (opts.spaceHandling === 'remove') {
            processed = processed.replace(/[ \\t]+/g, ' ').trim();
        }

        // 处理缩进
        if (opts.indentationHandling === 'remove') {
            processed = processed.replace(/^[ \\t]+/gm, '');
        } else if (opts.indentationHandling === 'convert') {
            processed = processed.replace(/^[ \\t]+/gm, (match) => ' '.repeat(match.length));
        }

        // 恢复保护的内容
        protectedBlocks.forEach((block, index) => {
            processed = processed.replace(`__CODE_BLOCK_${index}__`, block);
            processed = processed.replace(`__URL_${index}__`, block);
        });

        return processed.trim();
    }

    /**
     * 计算压缩率
     * @private
     */
    calculateCompression(original, processed) {
        if (!original) return 0;
        return ((original.length - processed.length) / original.length * 100).toFixed(1);
    }

    /**
     * 模拟网络延迟
     * @private
     */
    async simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 获取运行时间（模拟）
     */
    getUptime() {
        const startTime = new Date('2025-09-05T00:00:00Z');
        const now = new Date();
        const diff = now - startTime;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${days}d ${hours}h ${minutes}m`;
    }

    /**
     * 获取API文档
     * @returns {Object} API文档
     */
    getAPIDocs() {
        return {
            version: this.version,
            baseURL: this.baseURL,
            endpoints: this.endpoints,
            authentication: 'None required',
            rateLimit: 'Unlimited',
            formats: ['JSON'],
            examples: {
                basic: {
                    request: 'POST /v1/process',
                    body: { text: 'Hello\\nWorld' },
                    response: { success: true, data: 'Hello World' }
                },
                advanced: {
                    request: 'POST /v1/process',
                    body: {
                        text: 'Multi-line\\ntext\\nhere',
                        options: {
                            lineBreakReplacement: 'space',
                            spaceHandling: 'normalize',
                            preserveUrls: true
                        }
                    }
                }
            }
        };
    }
}

// 创建全局API实例
window.LineWeaverAPI = new LineWeaverAPI();

// 向后兼容
window.TextProcessorAPI = window.LineWeaverAPI;
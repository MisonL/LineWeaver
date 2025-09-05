/**
 * 测试API包装器 - 为test-api.html提供简化的API接口
 * 包装现有的SmartMode和TextUtils功能
 */

// 创建简化的API接口
window.TestAPI = {
    /**
     * 文本转换API
     * @param {string} text - 要转换的文本
     * @param {string} mode - 转换模式
     * @returns {Object} 转换结果
     */
    convertText: function(text, mode = 'smart') {
        try {
            if (typeof SmartMode !== 'undefined') {
                const result = SmartMode.process(text, { mode });
                return {
                    success: true,
                    data: result.text,
                    originalLength: result.originalLength,
                    processedLength: result.processedLength,
                    compression: result.compression
                };
            } else {
                // 备用实现
                const processed = text.replace(/\r\n|\r|\n/g, ' ').replace(/\s+/g, ' ').trim();
                return {
                    success: true,
                    data: processed,
                    originalLength: text.length,
                    processedLength: processed.length,
                    compression: ((text.length - processed.length) / text.length * 100).toFixed(1) + '%'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * 健康检查API
     * @returns {Object} 健康状态
     */
    health: function() {
        return {
            success: true,
            data: {
                status: 'healthy',
                version: '2.4.0',
                uptime: 'running',
                environment: 'browser',
                capabilities: {
                    textProcessing: true,
                    smartMode: typeof SmartMode !== 'undefined',
                    utils: typeof TextUtils !== 'undefined'
                }
            }
        };
    },

    /**
     * 获取版本信息
     * @returns {Object} 版本信息
     */
    getVersion: function() {
        return {
            success: true,
            data: {
                version: '2.4.0',
                build: '2025-09-05',
                features: ['text-processing', 'smart-mode', 'custom-options'],
                environment: 'browser'
            }
        };
    },

    /**
     * 获取API文档
     * @returns {Object} API文档
     */
    getAPIDocs: function() {
        return {
            success: true,
            data: {
                endpoints: [
                    {
                        path: '/convert',
                        method: 'POST',
                        description: '文本转换接口',
                        parameters: ['text', 'mode', 'options']
                    },
                    {
                        path: '/health',
                        method: 'GET',
                        description: '健康检查接口'
                    }
                ],
                baseURL: 'browser://local',
                authentication: 'none',
                rateLimit: 'unlimited'
            }
        };
    },

    /**
     * 获取示例文本
     * @returns {Object} 示例文本
     */
    getExample: function() {
        return {
            success: true,
            data: {
                original: 'Hello\nWorld\nThis is\na test',
                expected: 'Hello World This is a test',
                description: '基本换行符去除示例'
            }
        };
    },

    /**
     * 获取统计信息
     * @returns {Object} 统计信息
     */
    getStats: function() {
        return {
            success: true,
            data: {
                totalTests: 0,
                successRate: 100,
                averageCompression: 15.5,
                features: ['smart-mode', 'custom-options', 'real-time']
            }
        };
    }
};

// 向后兼容的API客户端
window.apiClient = {
    convertText: function(text, mode = 'smart') {
        const result = window.TestAPI.convertText(text, mode);
        if (result.success) {
            return {
                convertedText: result.data,
                originalLength: result.originalLength,
                processedLength: result.processedLength,
                compression: result.compression
            };
        } else {
            throw new Error(result.error);
        }
    },
    
    health: function() {
        const result = window.TestAPI.health();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    },
    
    getStats: function() {
        const result = window.TestAPI.getStats();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    },
    
    getExample: function() {
        const result = window.TestAPI.getExample();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    }
};

// 确保在DOM加载完成后可用
document.addEventListener('DOMContentLoaded', function() {
    console.log('Test API loaded successfully');
});
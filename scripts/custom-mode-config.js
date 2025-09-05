/**
 * 自定义模式配置管理器
 * 提供丰富的可调参数和可视化配置界面
 */

/**
 * 自定义模式参数定义
 */
const CustomModeParameters = {
    // 基础参数
    basic: {
        mode: {
            type: 'select',
            label: '处理模式',
            description: '选择文本处理的基本模式',
            options: [
                { value: 'auto', label: '自动检测', description: '智能识别文本类型' },
                { value: 'powershell', label: 'PowerShell', description: 'PowerShell CLI优化' },
                { value: 'code', label: '代码模式', description: '保持代码格式' },
                { value: 'markdown', label: 'Markdown', description: 'Markdown格式优化' },
                { value: 'safe', label: '安全模式', description: '最大兼容性' },
                { value: 'minimal', label: '极简模式', description: '最小化处理' },
                { value: 'custom', label: '完全自定义', description: '完全自定义配置' }
            ],
            default: 'auto'
        },
        
        maxLineLength: {
            type: 'range',
            label: '最大行长',
            description: '单行文本的最大字符数',
            min: 50,
            max: 2000,
            step: 10,
            default: 500,
            unit: '字符'
        },
        
        encoding: {
            type: 'select',
            label: '字符编码',
            description: '文本编码格式',
            options: [
                { value: 'utf8', label: 'UTF-8' },
                { value: 'utf16', label: 'UTF-16' },
                { value: 'ascii', label: 'ASCII' },
                { value: 'gbk', label: 'GBK' }
            ],
            default: 'utf8'
        }
    },
    
    // 结构保持参数
    structure: {
        preserveStructure: {
            type: 'boolean',
            label: '保持结构',
            description: '保持原始文本的结构和格式',
            default: true
        },
        
        preserveIndentation: {
            type: 'boolean',
            label: '保持缩进',
            description: '保持代码的缩进格式',
            default: false,
            dependsOn: 'preserveStructure'
        },
        
        preserveNewlines: {
            type: 'boolean',
            label: '保持换行',
            description: '保持原始的换行符',
            default: true,
            dependsOn: 'preserveStructure'
        },
        
        preserveLists: {
            type: 'boolean',
            label: '保持列表',
            description: '保持列表格式（Markdown）',
            default: false
        },
        
        preserveCodeBlocks: {
            type: 'boolean',
            label: '保持代码块',
            description: '保持代码块格式（Markdown）',
            default: false
        }
    },
    
    // 字符处理参数
    character: {
        escapeSpecialChars: {
            type: 'boolean',
            label: '转义特殊字符',
            description: '转义可能对目标环境造成问题的字符',
            default: true
        },
        
        escapePatterns: {
            type: 'multiselect',
            label: '转义字符集',
            description: '选择需要转义的特殊字符',
            options: [
                { value: '$', label: '$ (美元符号)' },
                { value: '|', label: '| (管道符)' },
                { value: '>', label: '> (大于号)' },
                { value: '<', label: '< (小于号)' },
                { value: '&', label: '& (与符号)' },
                { value: '"', label: '" (双引号)' },
                { value: "'", label: "' (单引号)" },
                { value: '`', label: '` (反引号)' },
                { value: '(', label: '( (左括号)' },
                { value: ')', label: ') (右括号)' },
                { value: '{', label: '{ (左花括号)' },
                { value: '}', label: '} (右花括号)' },
                { value: '[', label: '[ (左方括号)' },
                { value: ']', label: '] (右方括号)' }
            ],
            default: ['$', '|', '>', '<', '&', '"', "'", '`'],
            dependsOn: 'escapeSpecialChars'
        },
        
        useBacktick: {
            type: 'boolean',
            label: '使用反引号',
            description: '使用反引号(`)处理换行符（PowerShell）',
            default: true
        },
        
        wrapInQuotes: {
            type: 'boolean',
            label: '包裹引号',
            description: '用引号包裹整个文本',
            default: false
        },
        
        quoteType: {
            type: 'select',
            label: '引号类型',
            description: '选择包裹文本的引号类型',
            options: [
                { value: 'double', label: '双引号 "' },
                { value: 'single', label: '单引号 \'' },
                { value: 'backtick', label: '反引号 `' }
            ],
            default: 'double',
            dependsOn: 'wrapInQuotes'
        }
    },
    
    // 高级参数
    advanced: {
        compressionLevel: {
            type: 'select',
            label: '压缩级别',
            description: '文本压缩的激进程度',
            options: [
                { value: 'none', label: '不压缩', description: '保持原始格式' },
                { value: 'light', label: '轻度压缩', description: '仅压缩多余空格' },
                { value: 'balanced', label: '平衡压缩', description: '平衡压缩率和可读性' },
                { value: 'aggressive', label: '激进压缩', description: '最大压缩率' }
            ],
            default: 'balanced'
        },
        
        semanticAnalysis: {
            type: 'boolean',
            label: '语义分析',
            description: '分析文本语义完整性',
            default: true
        },
        
        validation: {
            type: 'boolean',
            label: '结果验证',
            description: '验证处理结果的兼容性',
            default: true
        },
        
        debug: {
            type: 'boolean',
            label: '调试模式',
            description: '输出详细的处理日志',
            default: false
        }
    },
    
    // 自定义替换
    custom: {
        customReplacements: {
            type: 'keyvalue',
            label: '自定义替换',
            description: '自定义文本替换规则',
            placeholder: '输入正则表达式模式 → 替换文本',
            default: {}
        },
        
        hereStringConfig: {
            type: 'group',
            label: 'Here-String配置',
            description: 'PowerShell here-string相关配置',
            fields: {
                useHereString: {
                    type: 'boolean',
                    label: '使用Here-String',
                    description: '使用PowerShell here-string语法',
                    default: false
                },
                delimiter: {
                    type: 'text',
                    label: '分隔符',
                    description: 'Here-string分隔符',
                    default: '@"',
                    dependsOn: 'useHereString'
                }
            }
        }
    }
};

/**
 * 配置验证器
 */
const ConfigValidator = {
    validate(config) {
        const errors = [];
        const warnings = [];
        
        // 验证数值范围
        if (config.maxLineLength && (config.maxLineLength < 50 || config.maxLineLength > 2000)) {
            errors.push('最大行长必须在50-2000字符之间');
        }
        
        // 验证依赖关系
        if (config.wrapInQuotes && config.useHereString) {
            warnings.push('同时使用引号包裹和here-string可能导致冲突');
        }
        
        // 验证转义字符
        if (config.escapeSpecialChars && (!config.escapePatterns || config.escapePatterns.length === 0)) {
            warnings.push('启用了特殊字符转义但未选择转义字符');
        }
        
        return { valid: errors.length === 0, errors, warnings };
    },
    
    sanitize(config) {
        const sanitized = { ...config };
        
        // 确保数值在合理范围内
        if (sanitized.maxLineLength) {
            sanitized.maxLineLength = Math.max(50, Math.min(2000, sanitized.maxLineLength));
        }
        
        // 清理空值
        Object.keys(sanitized).forEach(key => {
            if (sanitized[key] === null || sanitized[key] === undefined) {
                delete sanitized[key];
            }
        });
        
        return sanitized;
    }
};

/**
 * 配置管理器
 */
class CustomModeManager {
    constructor() {
        this.configs = new Map();
        this.currentConfig = {};
        this.presets = new Map();
        this.loadDefaultPresets();
    }
    
    /**
     * 加载默认预设
     */
    loadDefaultPresets() {
        this.presets.set('developer', {
            mode: 'code',
            maxLineLength: 800,
            preserveStructure: true,
            preserveIndentation: true,
            preserveNewlines: true,
            escapeSpecialChars: false,
            compressionLevel: 'none'
        });
        
        this.presets.set('cli-poweruser', {
            mode: 'powershell',
            maxLineLength: 400,
            escapeSpecialChars: true,
            escapePatterns: ['$', '|', '>', '<', '&', '"', "'", '`'],
            useBacktick: true,
            compressionLevel: 'balanced'
        });
        
        this.presets.set('content-creator', {
            mode: 'markdown',
            maxLineLength: 600,
            preserveStructure: true,
            preserveLists: true,
            preserveCodeBlocks: true,
            escapeSpecialChars: false,
            compressionLevel: 'light'
        });
        
        this.presets.set('system-admin', {
            mode: 'safe',
            maxLineLength: 200,
            escapeSpecialChars: true,
            wrapInQuotes: true,
            compressionLevel: 'aggressive'
        });
    }
    
    /**
     * 创建配置界面
     */
    createConfigUI(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        
        container.innerHTML = `
            <div class="custom-mode-config">
                <div class="config-header">
                    <h3>🎛️ 自定义模式配置</h3>
                    <div class="config-actions">
                        <button class="btn-load-preset">加载预设</button>
                        <button class="btn-save-preset">保存预设</button>
                        <button class="btn-export-config">导出配置</button>
                        <button class="btn-import-config">导入配置</button>
                        <button class="btn-reset-config">重置</button>
                    </div>
                </div>
                
                <div class="config-tabs">
                    <button class="tab-btn active" data-tab="basic">基础</button>
                    <button class="tab-btn" data-tab="structure">结构</button>
                    <button class="tab-btn" data-tab="character">字符</button>
                    <button class="tab-btn" data-tab="advanced">高级</button>
                    <button class="tab-btn" data-tab="custom">自定义</button>
                </div>
                
                <div class="config-content">
                    ${this.generateConfigForms()}
                </div>
                
                <div class="config-footer">
                    <div class="config-validation"></div>
                    <div class="config-actions">
                        <button class="btn-apply-config">应用配置</button>
                        <button class="btn-test-config">测试配置</button>
                        <button class="btn-preview-config">预览效果</button>
                    </div>
                </div>
            </div>
        `;
        
        this.attachEventListeners(container);
        return container;
    }
    
    /**
     * 生成配置表单
     */
    generateConfigForms() {
        let html = '';
        
        Object.entries(CustomModeParameters).forEach(([category, params]) => {
            html += `<div class="config-tab-content" data-tab="${category}">`;
            html += `<h4>${this.getCategoryTitle(category)}</h4>`;
            
            Object.entries(params).forEach(([key, param]) => {
                html += this.generateField(key, param);
            });
            
            html += '</div>';
        });
        
        return html;
    }
    
    /**
     * 生成字段HTML
     */
    generateField(key, param) {
        const id = `config-${key}`;
        let html = `<div class="config-field" data-field="${key}">`;
        html += `<label for="${id}">${param.label}</label>`;
        html += `<div class="field-description">${param.description}</div>`;
        
        switch (param.type) {
            case 'select':
                html += `<select id="${id}" data-config="${key}">`;
                param.options.forEach(option => {
                    const selected = option.value === param.default ? 'selected' : '';
                    html += `<option value="${option.value}" ${selected}>${option.label}</option>`;
                });
                html += '</select>';
                break;
                
            case 'range':
                html += `<div class="range-container">`;
                html += `<input type="range" id="${id}" data-config="${key}" `;
                html += `min="${param.min}" max="${param.max}" step="${param.step}" value="${param.default}">`;
                html += `<span class="range-value">${param.default}${param.unit || ''}</span>`;
                html += '</div>';
                break;
                
            case 'boolean':
                html += `<label class="checkbox-container">`;
                html += `<input type="checkbox" id="${id}" data-config="${key}" ${param.default ? 'checked' : ''}>`;
                html += `<span class="checkmark"></span>`;
                html += '</label>';
                break;
                
            case 'multiselect':
                html += `<div class="multiselect-container">`;
                param.options.forEach(option => {
                    const checked = param.default.includes(option.value) ? 'checked' : '';
                    html += `<label class="checkbox-container">`;
                    html += `<input type="checkbox" data-config="${key}" value="${option.value}" ${checked}>`;
                    html += `<span>${option.label}</span>`;
                    html += '</label>';
                });
                html += '</div>';
                break;
                
            case 'text':
                html += `<input type="text" id="${id}" data-config="${key}" value="${param.default}" placeholder="${param.placeholder || ''}">`;
                break;
                
            case 'keyvalue':
                html += `<div class="keyvalue-container" data-config="${key}">`;
                html += `<button type="button" class="btn-add-keyvalue">+ 添加规则</button>`;
                html += '</div>`;
                break;
        }
        
        html += '</div>';
        return html;
    }
    
    /**
     * 获取配置值
     */
    getConfig() {
        const config = {};
        
        // 收集所有配置值
        document.querySelectorAll('[data-config]').forEach(element => {
            const key = element.dataset.config;
            let value;
            
            if (element.type === 'checkbox') {
                value = element.checked;
            } else if (element.type === 'range') {
                value = parseInt(element.value);
            } else if (element.tagName === 'SELECT') {
                value = element.value;
            } else {
                value = element.value;
            }
            
            config[key] = value;
        });
        
        return ConfigValidator.sanitize(config);
    }
    
    /**
     * 应用配置
     */
    applyConfig(config) {
        const validation = ConfigValidator.validate(config);
        
        if (!validation.valid) {
            this.showValidationErrors(validation.errors);
            return false;
        }
        
        this.currentConfig = config;
        this.showValidationErrors([]);
        
        if (validation.warnings.length > 0) {
            this.showValidationWarnings(validation.warnings);
        }
        
        return true;
    }
    
    /**
     * 事件监听器
     */
    attachEventListeners(container) {
        // 标签切换
        container.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab, container);
            });
        });
        
        // 实时验证
        container.querySelectorAll('[data-config]').forEach(element => {
            element.addEventListener('change', () => {
                this.validateCurrentConfig();
            });
        });
        
        // 预设操作
        container.querySelector('.btn-load-preset').addEventListener('click', () => {
            this.showPresetDialog();
        });
        
        container.querySelector('.btn-save-preset').addEventListener('click', () => {
            this.saveCurrentPreset();
        });
        
        container.querySelector('.btn-apply-config').addEventListener('click', () => {
            this.applyCurrentConfig();
        });
    }
    
    /**
     * 工具方法
     */
    getCategoryTitle(category) {
        const titles = {
            basic: '基础设置',
            structure: '结构保持',
            character: '字符处理',
            advanced: '高级选项',
            custom: '自定义规则'
        };
        return titles[category] || category;
    }
    
    switchTab(tab, container) {
        // 切换标签逻辑
        container.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        container.querySelectorAll('.config-tab-content').forEach(content => content.style.display = 'none');
        
        container.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        container.querySelector(`.config-tab-content[data-tab="${tab}"]`).style.display = 'block';
    }
    
    showValidationErrors(errors) {
        const container = document.querySelector('.config-validation');
        if (errors.length > 0) {
            container.innerHTML = `<div class="error-messages">${errors.map(e => `<div>${e}</div>`).join('')}</div>`;
        } else {
            container.innerHTML = '';
        }
    }
    
    showValidationWarnings(warnings) {
        const container = document.querySelector('.config-validation');
        if (warnings.length > 0) {
            container.innerHTML += `<div class="warning-messages">${warnings.map(w => `<div>${w}</div>`).join('')}</div>`;
        }
    }
};

// 创建全局实例
window.CustomModeManager = new CustomModeManager();
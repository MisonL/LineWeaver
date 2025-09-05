# 统一智能模式文本换行符去除工具 - Docker 部署配置
FROM nginx:1.25-alpine

# 设置维护者信息
LABEL maintainer="LineWeaver Team"
LABEL description="文本换行符去除工具"
    LABEL version="v2.2.2"
LABEL unified.smart="true"

# 创建工作目录
WORKDIR /usr/share/nginx/html

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 清理默认的 nginx 网页内容
RUN rm -rf /usr/share/nginx/html/*

# 复制项目文件到 nginx 默认目录
COPY index.html ./
COPY README.md ./
COPY favicon.ico ./
COPY scripts/ ./scripts/
COPY styles/ ./styles/
COPY deploy.sh ./

# 设置正确的文件权限
RUN chmod -R 644 /usr/share/nginx/html/* && \
    find /usr/share/nginx/html -type d -exec chmod 755 {} \; && \
    chmod +x /usr/share/nginx/html/deploy.sh

# 创建日志目录和缓存目录，设置nginx用户权限
RUN mkdir -p /var/log/nginx /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/log/nginx /var/cache/nginx /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
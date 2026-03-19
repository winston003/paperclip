#!/bin/bash

# Paperclip Railway 自动部署脚本
# 使用前请确保已提供正确的 TOKEN 和仓库地址

set -e

# 配置
RAILWAY_TOKEN="a76b6013-b449-48b1-9d3c-31833d8e654e"
GITHUB_REPO="https://github.com/winston003/paperclip.git"
PROJECT_NAME="chaofanhui"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Paperclip Railway 自动部署脚本 ===${NC}"
echo ""

# 检查依赖
echo -e "${YELLOW}[1/8] 检查依赖...${NC}"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: 未安装 Node.js${NC}"
    echo "请安装 Node.js 20+: https://nodejs.org"
    exit 1
fi

# 检查 Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}错误: 未安装 Git${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 依赖检查通过${NC}"

# 安装 Railway CLI
echo -e "${YELLOW}[2/8] 安装 Railway CLI...${NC}"
if ! command -v railway &> /dev/null; then
    npm install -g @railway/cli
    echo -e "${GREEN}✓ Railway CLI 安装完成${NC}"
else
    echo -e "${GREEN}✓ Railway CLI 已安装${NC}"
fi

# 登录 Railway
echo -e "${YELLOW}[3/8] 登录 Railway...${NC}"
export RAILWAY_TOKEN="$RAILWAY_TOKEN"
echo -e "${GREEN}✓ Railway Token 已设置${NC}"

# 检查是否在 Git 仓库中
echo -e "${YELLOW}[4/8] 检查 Git 仓库...${NC}"
if [ ! -d .git ]; then
    echo -e "${RED}错误: 当前目录不是 Git 仓库${NC}"
    echo "请在 paperclip 项目根目录运行此脚本"
    exit 1
fi

# 检查远程仓库
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
if [ "$CURRENT_REMOTE" != "$GITHUB_REPO" ]; then
    echo -e "${YELLOW}设置 Git 远程仓库...${NC}"
    git remote remove origin 2>/dev/null || true
    git remote add origin "$GITHUB_REPO"
fi

echo -e "${GREEN}✓ Git 仓库检查通过${NC}"

# 生成密钥
echo -e "${YELLOW}[5/8] 生成密钥...${NC}"
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}✓ 密钥生成完成${NC}"

# 创建 Railway 项目
echo -e "${YELLOW}[6/8] 创建 Railway 项目...${NC}"
cd "$(git rev-parse --show-toplevel)"

# 初始化项目
railway init --name "$PROJECT_NAME" 2>/dev/null || true

echo -e "${GREEN}✓ Railway 项目创建完成${NC}"

# 添加 PostgreSQL
echo -e "${YELLOW}[7/9] 添加 PostgreSQL 数据库...${NC}"
railway add --database postgres 2>/dev/null || echo -e "${YELLOW}数据库可能已存在，继续...${NC}"
echo -e "${GREEN}✓ PostgreSQL 添加完成${NC}"

# 部署（会创建服务）
echo ""
echo -e "${YELLOW}[8/9] 开始部署（创建服务）...${NC}"
echo -e "${YELLOW}这可能需要 3-5 分钟...${NC}"
railway up
echo -e "${GREEN}✓ 部署完成，服务已创建${NC}"

# 设置环境变量（部署后才能设置）
echo ""
echo -e "${YELLOW}[9/9] 设置环境变量...${NC}"

# 基础变量
railway variables set NODE_ENV=production
railway variables set PAPERCLIP_DEPLOYMENT_MODE=authenticated
railway variables set PAPERCLIP_DEPLOYMENT_EXPOSURE=public
railway variables set PAPERCLIP_PUBLIC_URL='${{RAILWAY_PUBLIC_DOMAIN}}'
railway variables set BETTER_AUTH_URL='https://${{RAILWAY_PUBLIC_DOMAIN}}'

# 密钥（使用生成的值）
railway variables set BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET"
railway variables set JWT_SECRET="$JWT_SECRET"

echo -e "${GREEN}✓ 环境变量设置完成${NC}"

# 重新部署以应用环境变量
echo ""
echo -e "${YELLOW}重新部署以应用环境变量...${NC}"
railway up

echo ""
echo -e "${GREEN}=== 部署完成！===${NC}"
echo ""
echo "请等待 2-3 分钟让服务启动..."
echo ""

# 获取部署 URL
DEPLOY_URL=$(railway domain 2>/dev/null || echo "")
if [ -n "$DEPLOY_URL" ]; then
    echo -e "${GREEN}应用地址: https://$DEPLOY_URL${NC}"
    echo -e "${GREEN}健康检查: https://$DEPLOY_URL/api/health${NC}"
else
    echo -e "${YELLOW}部署 URL 将在 Dashboard 中显示${NC}"
fi

echo ""
echo "下一步:"
echo "1. 访问 Railway Dashboard 查看部署状态"
echo "2. 等待服务启动后访问健康检查 URL"
echo "3. 初始化 Board 管理员账户"
echo "4. 创建你的公司"
echo ""
echo "数据库迁移命令（部署后执行）:"
echo "  railway run -- cd packages/db && pnpm migrate"

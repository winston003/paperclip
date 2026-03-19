# Railway 部署 Paperclip 完整指南

## 概述

Railway 是最适合部署 Paperclip 的平台之一：
- ✅ 原生支持 Node.js + PostgreSQL
- ✅ 支持 WebSocket
- ✅ 长时间运行无限制
- ✅ 文件系统完全支持
- ✅ $5/月免费额度（试用30天）

---

## 成本估算

| 组件 | 配置 | 成本/月 |
|------|------|---------|
| 应用 | 512MB RAM, 1 vCPU | ~$2-3 |
| PostgreSQL | 共享实例 | ~$1-2 |
| **总计** | | **~$5** |

---

## 部署前准备

### 1. 修改代码（适配 Railway）

创建 `server/src/railway.ts`：

```typescript
// Railway 入口文件
import { startServer } from './index.js';

// Railway 提供 PORT 环境变量
const PORT = process.env.PORT || '3100';
process.env.PAPERCLIP_PORT = PORT;

// 启动服务器
startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
```

### 2. 修改 package.json

在 `server/package.json` 中添加：

```json
{
  "scripts": {
    "railway:start": "node dist/railway.js",
    "build:railway": "tsc && cp src/railway.ts dist/railway.js"
  }
}
```

或者更简单的方式 - 修改根目录 `package.json`：

```json
{
  "scripts": {
    "railway:build": "pnpm -r build",
    "railway:start": "cd server && node dist/index.js"
  }
}
```

### 3. 创建 nixpacks.toml

在项目根目录创建 `nixpacks.toml`：

```toml
[phases.build]
cmds = [
  "pnpm install",
  "pnpm -r build"
]

[phases.setup]
nixPkgs = ["nodejs_20"]

[start]
cmd = "cd server && node dist/index.js"
```

### 4. 创建 railway.json（可选）

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "nixpacksConfigPath": "nixpacks.toml"
  },
  "deploy": {
    "startCommand": "cd server && node dist/index.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 60,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 环境变量配置

在 Railway Dashboard 的 Variables 中添加：

### 必需变量

```env
# 基础配置
NODE_ENV=production
PORT=3100

# 数据库 - Railway 会自动提供这些，不需要手动设置
# DATABASE_URL=postgresql://... (Railway 自动生成)

# 部署模式
PAPERCLIP_DEPLOYMENT_MODE=authenticated
PAPERCLIP_DEPLOYMENT_EXPOSURE=public
PAPERCLIP_PUBLIC_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# 认证
PAPERCLIP_AUTH_PUBLIC_BASE_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
BETTER_AUTH_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
BETTER_AUTH_SECRET=${{secrets.BETTER_AUTH_SECRET}}

# 密钥（使用 Railway 的 Secrets 功能）
JWT_SECRET=${{secrets.JWT_SECRET}}
PAPERCLIP_SECRETS_MASTER_KEY_FILE=/app/data/secrets-master.key

# 禁用嵌入式 Postgres（使用 Railway PostgreSQL）
PAPERCLIP_DATABASE_MODE=postgres

# 存储
PAPERCLIP_STORAGE_PROVIDER=local_disk
PAPERCLIP_STORAGE_LOCAL_DIR=/app/data/storage
```

### 生成密钥

在 Railway Dashboard → Secrets 中添加：

1. **BETTER_AUTH_SECRET**
   ```bash
   # 生成长随机字符串
   openssl rand -base64 32
   ```

2. **JWT_SECRET**
   ```bash
   # 生成长随机字符串
   openssl rand -base64 32
   ```

---

## 部署步骤

### 步骤 1：准备 GitHub 仓库

```bash
# 确保代码已推送到 GitHub
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 步骤 2：创建 Railway 项目

1. 访问 https://railway.app
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择你的 Paperclip 仓库

### 步骤 3：添加 PostgreSQL

1. 在项目 Dashboard 点击 "New"
2. 选择 "Database" → "PostgreSQL"
3. Railway 会自动创建数据库并设置 `DATABASE_URL`

### 步骤 4：配置环境变量

1. 点击你的应用服务
2. 进入 "Variables" 标签
3. 添加上述所有环境变量
4. 确保 Secrets 正确配置

### 步骤 5：添加持久化存储

Paperclip 需要存储文件（上传、数据等）：

1. 点击 "New" → "Add Volume"
2. Mount Path: `/app/data`
3. 大小：默认 5GB 足够

### 步骤 6：部署

1. 点击 "Deploy"
2. 等待构建完成（首次约 3-5 分钟）
3. 查看日志确认启动成功

### 步骤 7：数据库迁移

首次部署后，需要运行迁移：

```bash
# 在 Railway Dashboard 中打开应用的 Shell
# 运行：
cd packages/db
pnpm migrate
```

或者在本地运行迁移：

```bash
# 获取 Railway 数据库连接串
# 在 Railway Dashboard → PostgreSQL → Connect 中查看

export DATABASE_URL="postgresql://..."
cd packages/db
pnpm migrate
```

---

## 配置域名（可选）

### 使用 Railway 提供的域名

Railway 会自动提供 `xxx.up.railway.app` 域名，直接使用即可。

### 使用自定义域名

1. 在 Railway Dashboard → Settings → Domains
2. 点击 "Generate Domain" 或 "Custom Domain"
3. 如果使用自定义域名，添加 DNS 记录

---

## 验证部署

### 1. 健康检查

```bash
curl https://your-app.up.railway.app/api/health
```

预期返回：
```json
{
  "status": "ok",
  "version": "0.3.1",
  "deploymentMode": "authenticated",
  "deploymentExposure": "public",
  "authReady": true
}
```

### 2. 初始化 Board 用户

首次访问时，如果看到 Board Claim 页面，按提示创建管理员账户。

### 3. 创建公司

登录后创建你的公司（如 `chaofanhui`）。

---

## 常见问题

### Q: 构建失败

**检查**：
```bash
# 确保所有依赖安装
pnpm install

# 本地测试构建
pnpm -r build
```

### Q: 数据库连接失败

**解决**：
- 确认 `DATABASE_URL` 已正确设置
- 检查 PostgreSQL 服务是否运行
- 查看 Railway 日志中的错误信息

### Q: 文件上传失败

**解决**：
- 确认 Volume 已挂载到 `/app/data`
- 检查目录权限
- 查看日志：`ls -la /app/data`

### Q: WebSocket 连接失败

**解决**：
- Railway 原生支持 WebSocket，无需额外配置
- 确保使用 `wss://` 而非 `ws://`
- 检查防火墙设置

---

## 成本优化

### 免费运行（$0/月）

使用 Railway 的 $5 免费额度：
- 应用：256MB RAM, 共享 CPU
- PostgreSQL：免费层
- 每月约 500 小时运行时间

### 配置方式

1. 在 Railway Dashboard → Settings
2. 调整资源配置为最小
3. 开启 "Auto-sleep"（可选）

---

## 备份策略

### 自动备份（推荐）

Railway PostgreSQL 自动提供备份。

### 手动备份

```bash
# 导出数据
pg_dump $DATABASE_URL > backup.sql

# 导入数据
psql $DATABASE_URL < backup.sql
```

### 文件备份

```bash
# 备份存储卷
tar -czf storage-backup.tar.gz /app/data/storage
```

---

## 升级部署

### 自动部署

Railway 默认开启 Git 集成，每次 push 到 main 分支自动部署。

### 手动部署

```bash
# 在 Railway Dashboard
# 点击 "Redeploy"
```

---

## 监控与日志

### 查看日志

Railway Dashboard → 你的应用 → Logs

### 设置监控

1. 集成第三方监控（如 Sentry）
2. 配置健康检查
3. 设置告警规则

---

## 完整文件清单

部署前确保以下文件已创建/修改：

```
paperclip/
├── nixpacks.toml          # 构建配置
├── railway.json           # Railway 配置（可选）
├── package.json           # 添加 railway 脚本
└── server/
    ├── package.json       # 添加启动脚本
    └── src/
        └── railway.ts     # Railway 入口（可选）
```

---

## 下一步

部署成功后：

1. ✅ 访问你的应用 URL
2. ✅ 创建 Board 管理员账户
3. ✅ 创建公司
4. ✅ 创建 Agent
5. ✅ 开始使用 Paperclip！

需要我帮你生成任何特定的配置文件吗？

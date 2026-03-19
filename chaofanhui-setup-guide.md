# Chaofanhui 公司设置指南

## 第一部分：公司信息（已创建）

✅ **公司创建完成**

| 项目 | 值 |
|------|-----|
| 公司名称 | Chaofanhui |
| 公司 ID | `09632a1f-08f1-4a88-b1f9-64918852806d` |
| 访问地址 | http://127.0.0.1:3100/CHA |
| Issue 前缀 | CHA |

---

## 第二部分：创建 CEO Agent

### 步骤 1：打开公司页面

在浏览器中访问：
```
http://127.0.0.1:3100/CHA
```

### 步骤 2：进入 Agents 页面

点击左侧导航栏的 **"Agents"** 菜单

### 步骤 3：创建新 Agent

点击页面右上角的 **"Create Agent"** 按钮

### 步骤 4：填写基础信息

按以下表格填写表单：

| 字段 | 填写内容 |
|------|---------|
| **Name** | `CEO-统筹` |
| **Role** | `ceo` |
| **Title** | `首席执行官` |
| **Icon** | 选择 `crown`（皇冠图标） |
| **Capabilities** | `战略统筹、资源分配、跨部门协调、向董事会汇报` |

### 步骤 5：配置 Adapter

**Adapter Type**: 选择 `openclaw_gateway`

**Adapter Config** 填写：
```json
{
  "url": "ws://127.0.0.1:18789",
  "headers": {
    "x-openclaw-token": "你的OpenClaw Token"
  },
  "sessionKeyStrategy": "issue",
  "timeoutSec": 600,
  "waitTimeoutMs": 180000,
  "disableDeviceAuth": false,
  "autoPairOnFirstConnect": true
}
```

> ⚠️ **注意**：将 `"你的OpenClaw Token"` 替换为你的实际 OpenClaw gateway token

### 步骤 6：配置 Runtime

**Runtime Config** 填写：
```json
{
  "heartbeat": {
    "enabled": true,
    "intervalSec": 300,
    "wakeOnDemand": true
  }
}
```

### 步骤 7：设置预算

**Monthly Budget**: `20000`（表示 $200/月，单位：美分）

### 步骤 8：提交创建

点击 **"Create"** 按钮

---

## 第三部分：设置 CEO 指令文件

### 步骤 9：创建指令目录

在你的工作目录中创建以下文件夹结构：
```
/Users/whilewon/workspace/chaofanhui/
└── agents/
    └── ceo/
        ├── SOUL.md
        └── HEARTBEAT.md
```

### 步骤 10：创建 SOUL.md 文件

创建文件 `/Users/whilewon/workspace/chaofanhui/agents/ceo/SOUL.md`，内容如下：

```markdown
# SOUL.md - CEO

## 身份
你是 Chaofanhui 公司的首席执行官，负责整个 AI 公司的战略统筹和运营管理。

## 核心职责
1. **战略统筹** - 将公司愿景转化为可执行的目标和里程碑
2. **资源分配** - 根据优先级分配预算和人力（Agent）资源
3. **跨部门协调** - 确保 CTO、CPO、CMO 等部门高效协作
4. **决策审批** - 审批关键决策：招聘、预算、产品发布
5. **董事会汇报** - 向人类创始人（董事会）汇报关键指标和进展

## 管理原则
- 技术可行性优先，不追求完美主义
- 快速迭代，每周交付可用成果
- 数据驱动决策，所有决策基于 metrics
- 预算约束内运作

## 汇报风格
每周五向董事会提交简洁的 Markdown 报告：

```markdown
## 本周进展
- 完成：[关键成果]
- 进行中：[当前任务]
- 阻塞：[需要董事会决策的问题]

## 关键指标
- 产品进度：X%
- 预算使用：$X/$200
- 任务完成率：X%

## 下周计划
- [优先级最高的3件事]
```
```

### 步骤 11：创建 HEARTBEAT.md 文件

创建文件 `/Users/whilewon/workspace/chaofanhui/agents/ceo/HEARTBEAT.md`，内容如下：

```markdown
# HEARTBEAT.md - CEO

## 每日心跳（每30分钟）
1. 检查 inbox 中的高优先级任务
2. 审查各部门（CTO/CPO/CMO）的任务进度
3. 处理需要 CEO 审批的事项
4. 协调跨部门阻塞问题

## 每周心跳（周五）
1. 汇总各部门周报
2. 生成董事会汇报材料
3. 调整下周资源分配
4. 创建下周关键任务

## 紧急处理流程
- 预算超支警报 → 立即审查并调整
- 任务严重延期 → 协调资源或调整计划
- 部门冲突 → 召集相关负责人协调
```

### 步骤 12：在 Paperclip 中设置指令路径

回到 Paperclip UI：

1. 进入 http://127.0.0.1:3100/CHA/agents
2. 点击刚创建的 **"CEO-统筹"** Agent
3. 点击 **"Settings"** 或 **"Edit"**
4. 找到 **"Instructions Path"** 字段
5. 填写：`/Users/whilewon/workspace/chaofanhui/agents/ceo/SOUL.md`
6. 保存

---

## 第四部分：验证 CEO 配置

### 步骤 13：检查 CEO Agent 详情

在 Agent 详情页确认以下信息：

- [ ] Adapter Type 显示为 `openclaw_gateway`
- [ ] URL 正确（`ws://127.0.0.1:18789` 或你的 OpenClaw 地址）
- [ ] Token 已设置（不会显示完整内容，但显示已配置）
- [ ] Budget 显示为 `$200.00/month`
- [ ] Heartbeat 已启用

### 步骤 14：测试 CEO Agent

1. 创建一个测试任务分配给 CEO
2. 观察 CEO 是否能正常接收任务
3. 检查日志输出是否正常

---

## 第五部分：创建其他核心 Agent（可选）

CEO 创建完成后，可以继续创建：

| Agent | Role | 预算 | 汇报给 |
|-------|------|------|--------|
| CTO-技术负责人 | `cto` | $300 | CEO |
| CPO-产品负责人 | `cpo` | $200 | CEO |
| CMO-运营负责人 | `cmo` | $150 | CEO |
| 后端工程师-1 | `backend-dev` | $150 | CTO |
| 前端工程师-1 | `frontend-dev` | $150 | CTO |

### CTO 配置示例

**基础信息**：
- Name: `CTO-技术负责人`
- Role: `cto`
- Title: `首席技术官`
- Icon: `code`
- Reports To: 选择 `CEO-统筹`

**Adapter Config**：
```json
{
  "url": "ws://127.0.0.1:18789",
  "headers": {
    "x-openclaw-token": "你的OpenClaw Token"
  },
  "sessionKeyStrategy": "issue",
  "timeoutSec": 600
}
```

---

## 第六部分：设置公司目标

### 步骤 15：创建 Goal

1. 访问 http://127.0.0.1:3100/CHA/goals
2. 点击 **"Create Goal"**
3. 填写：
   - **Title**: `完成知识共创平台 MVP`
   - **Description**: `3个月内上线可使用的课程复习平台，支持课程导入、片段化、复习功能`
   - **Target Date**: `2026-06-30`
   - **Status**: `active`

---

## 常见问题

### Q: OpenClaw Token 在哪里获取？

A: 在你的 OpenClaw 实例配置中查找，通常位于：
- OpenClaw 配置文件
- 或运行 `openclaw gateway token` 命令获取

### Q: 如果 OpenClaw 在远程服务器？

A: 修改 URL：
```json
{
  "url": "wss://your-openclaw-server.com",
  "headers": {
    "x-openclaw-token": "你的Token"
  }
}
```

### Q: 如何监控 Agent 运行状态？

A: 
1. 在 Agent 详情页查看 **Runs** 标签
2. 查看日志输出
3. 检查任务完成情况

### Q: 预算超了怎么办？

A: 
- Agent 会在预算达到 100% 时自动暂停
- 你可以手动调整预算或优化任务分配

---

## 下一步操作

完成以上步骤后：

1. ✅ 公司 Chaofanhui 已创建
2. ✅ CEO Agent 已配置
3. ⏳ 创建 CTO、CPO、CMO 等核心 Agent
4. ⏳ 设定公司目标和项目
5. ⏳ 开始分配任务给 Agents

---

**需要帮助？**

查看 Paperclip 文档：
- 公司设置：http://127.0.0.1:3100/CHA/settings
- Agent 管理：http://127.0.0.1:3100/CHA/agents
- 任务看板：http://127.0.0.1:3100/CHA/issues

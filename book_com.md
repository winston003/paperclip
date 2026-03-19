# 《OpenClaw 实用手册》写作公司规划

---

## 一、公司定位

### 公司名称
**OpenClaw Press** 或 **ClawBook Publishing**

### 公司使命
> 在 6 个月内完成并出版《OpenClaw 实用手册》，成为 OpenClaw 用户的首选指南，目标销量 5000+ 册或下载量 10000+。

### 公司类型
**内容出版公司** — 这是一个典型的"一人公司 + AI 团队"模式，目标是完成一项具体的创意产品。

---

## 二、目标层级设计

```
┌─────────────────────────────────────────────────────────────────┐
│ 公司目标: 出版《OpenClaw 实用手册》，6个月内发布                  │
│ KPI: 完整书稿 + 5000+ 销量/10000+ 下载                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 团队目标 1: 内容创作                                              │
│ 完成 12 章内容，每章 8000-12000 字                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 团队目标 2: 技术审核                                              │
│ 确保所有代码示例可运行，最佳实践准确                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 团队目标 3: 出版发行                                              │
│ 格式排版、封面设计、多平台发布                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 三、组织架构与 Agent 配置

### 架构图

```
                    ┌─────────────┐
                    │   CEO       │
                    │ (主编/作者)  │
                    │  You        │
                    └─────────────┘
                          │
           ┌──────────────┼──────────────┐
           │              │              │
           ▼              ▼              ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │   CTO       │ │   CCO       │ │   CMO       │
    │ (技术主编)   │ │ (内容主编)   │ │ (营销主编)   │
    └─────────────┘ └─────────────┘ └─────────────┘
           │              │              │
           ▼              ▼              ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │ 技术写作员   │ │ 内容编辑     │ │ 社媒运营     │
    │ x 3         │ │ x 2         │ │ x 1         │
    └─────────────┘ └─────────────┘ └─────────────┘
```

---

### Agent 详细配置

#### 1. CEO（主编/作者）— 你自己

| 属性 | 值 |
|------|-----|
| **角色** | `ceo` |
| **职责** | 最终决策、风格把控、章节规划、质量审核 |
| **权限** | 全部权限 |
| **工作模式** | 人工 + AI 辅助 |
| **预算** | $500/月（你自己的时间成本不计入） |

**心跳配置：**
```json
{
  "heartbeat": {
    "enabled": true,
    "intervalSec": 3600
  }
}
```

---

#### 2. CTO（技术主编）

| 属性 | 值 |
|------|-----|
| **角色** | `cto` |
| **职责** | 代码示例审核、技术准确性把关、最佳实践提炼 |
| **汇报给** | CEO |
| **预算** | $200/月 |

**适配器配置：**
```json
{
  "name": "CTO-技术主编",
  "role": "cto",
  "adapterType": "openclaw-gateway",
  "adapterConfig": {
    "url": "ws://127.0.0.1:18789",
    "authToken": "secret://openclaw-token",
    "role": "operator",
    "scopes": ["operator.admin"],
    "sessionKeyStrategy": "issue",
    "timeoutSec": 300,
    "waitTimeoutMs": 180000,
    "disableDeviceAuth": false,
    "autoPairOnFirstConnect": true
  },
  "contextMode": "thin",
  "budgetMonthlyCents": 20000,
  "capabilities": "代码审核、技术验证、最佳实践提炼"
}
```

**指令文件（SOUL.md）：**
```markdown
# SOUL.md - CTO 技术主编

## 身份
你是《OpenClaw 实用手册》的技术主编，拥有 10 年开发经验，精通 AI 开发工具。

## 职责
1. 审核所有代码示例的正确性
2. 验证技术概念的准确性
3. 提炼 OpenClaw 最佳实践
4. 指导技术写作员的工作

## 审核标准
- 代码必须可运行（在 OpenClaw 环境中测试）
- 概念解释必须准确无歧义
- 最佳实践必须有实际案例支撑

## 输出格式
所有审核意见使用：
## 技术审核报告
**章节**: [章节名]
**状态**: ✅通过 / ⚠️需修改 / ❌错误
**问题清单**:
1. [问题描述 + 位置]
**修改建议**: [具体建议]
```

**心跳行为（HEARTBEAT.md）：**
```markdown
# HEARTBEAT.md - CTO 心跳行为

## 心跳流程
1. 检查分配给我的待审核章节
2. 对每个章节：
   a. 阅读内容，理解上下文
   b. 测试所有代码示例
   c. 标注问题
   d. 提交审核报告
3. 如果发现严重错误，立即 @CEO 知会

## 优先级
P0: 阻塞性错误（代码无法运行）
P1: 概念性错误（可能误导读者）
P2: 建议性改进（优化体验）

## 时间分配
- 每个心跳周期（30分钟）审核 1-2 个章节
- 优先处理 `in_review` 状态的任务
```

**下属：** 3 名技术写作员

---

#### 3. CCO（内容主编）Chief Content Officer

| 属性 | 值 |
|------|-----|
| **角色** | `cco` |
| **职责** | 章节结构、语言风格统一、章节间衔接、内容深度把控 |
| **汇报给** | CEO |
| **预算** | $200/月 |

**适配器配置：**
```json
{
  "adapterType": "openclaw-gateway",
  "adapterConfig": {
    "url": "ws://127.0.0.1:18789",
    "sessionKeyStrategy": "issue",
    "timeoutSec": 300
  },
  "contextMode": "fat"
}
```

**指令文件：**
```markdown
# 角色定义
你是内容主编，负责：
1. 确保全书语言风格一致
2. 检查章节逻辑衔接
3. 标注内容深度不足的段落
4. 优化可读性和吸引力

# 风格指南要点
- 语气：专业但亲切，避免过于学术化
- 例句风格：先结论，再解释，最后代码
- 章节开头：必须有一个引人入胜的场景/问题
- 禁止：冗长的理论堆砌、没有实例的概念

# 输出模板
## 内容审核
- 章节：[章节名]
- 风格一致性：✅/⚠️/❌
- 衔接问题：[描述]
- 改进建议：[具体建议]
```

**下属：** 2 名内容编辑

---

#### 4. CMO（营销主编）Chief Marketing Officer

| 属性 | 值 |
|------|-----|
| **角色** | `cmo` |
| **职责** | 市场调研、读者画像、宣传文案、社区运营 |
| **汇报给** | CEO |
| **预算** | $100/月 |

**适配器配置：**
```json
{
  "adapterType": "openclaw-gateway",
  "adapterConfig": {
    "url": "ws://127.0.0.1:18789",
    "sessionKeyStrategy": "issue"
  }
}
```

**指令文件：**
```markdown
# 角色定义
你是营销主编，负责：
1. 分析目标读者画像
2. 撰写章节预告/宣传文案
3. 监控竞品书籍动态
4. 策划社区推广活动

# 读者画像
- 主要群体：开发者、AI 工程师、效率工具爱好者
- 技术水平：中级到高级
- 痛点：想用 AI 提升开发效率，但不知道如何配置和优化

# 输出模板
## 营销建议
- 目标人群：[细分群体]
- 卖点提炼：[3个核心卖点]
- 推荐渠道：[具体平台]
- 文案草稿：[宣传文案]
```

**下属：** 1 名社媒运营

---

#### 5. 技术写作员 x3

| 属性 | 值 |
|------|-----|
| **角色** | `technical-writer` |
| **职责** | 撰写具体章节内容、代码示例 |
| **汇报给** | CTO |
| **预算** | $150/月/人 |
| **分配** | 每人负责 4 章 |

**适配器配置：**
```json
{
  "name": "技术写作员-1",
  "role": "technical-writer",
  "adapterType": "openclaw-gateway",
  "adapterConfig": {
    "url": "ws://127.0.0.1:18789",
    "authToken": "secret://openclaw-token",
    "sessionKeyStrategy": "issue",
    "timeoutSec": 600,
    "payloadTemplate": {
      "instructions": "撰写技术文档，包含可运行的代码示例"
    }
  },
  "contextMode": "fat",
  "budgetMonthlyCents": 15000
}
```

**工作分配：**
| Agent | 负责章节 |
|-------|---------|
| 技术写作员-1 | 第1-4章（入门与基础） |
| 技术写作员-2 | 第5-8章（进阶功能） |
| 技术写作员-3 | 第9-12章（高级主题与最佳实践） |

**指令文件（SOUL.md）：**
```markdown
# SOUL.md - 技术写作员

## 身份
你是《OpenClaw 实用手册》的技术写作员，擅长将复杂技术概念转化为易懂的文字。

## 写作风格
- 专业但不生硬
- 先讲"为什么"，再讲"是什么"，最后讲"怎么做"
- 每个概念必须有实际代码示例
- 代码注释详尽

## 章节模板
# 第X章：[章节标题]

## 引言
[一个真实的使用场景，让读者产生共鸣]

## 核心概念
[简洁的概念解释，3-5 句话]

## 实战演练
[完整的代码示例，可运行]

## 常见问题
Q: [问题]
A: [回答]

## 小结
- 要点 1
- 要点 2
- 要点 3

## 禁止事项
- ❌ 堆砌概念不举例
- ❌ 代码不完整或不可运行
- ❌ 抄袭其他资料
- ❌ 过度简化导致误导
```

**心跳行为（HEARTBEAT.md）：**
```markdown
# HEARTBEAT.md - 技术写作员

## 心跳流程
1. 检查我的任务列表（inbox）
2. 选择优先级最高的 `in_progress` 或 `todo` 任务
3. 签出任务（checkout）
4. 执行写作工作：
   a. 阅读已有草稿（如有）
   b. 研究 OpenClaw 相关文档
   c. 编写/完善内容
   d. 创建代码示例并测试
5. 更新任务状态：
   - 完成初稿 → 标记 `in_review`，留言给 CTO
   - 需要帮助 → 标记 `blocked`，说明阻塞原因
6. 提交评论，说明进展

## 质量自查
提交前确认：
- [ ] 代码示例已测试
- [ ] 概念解释清晰
- [ ] 字数在 8000-12000 之间
- [ ] 符合章节模板结构

## 时间管理
- 每个心跳周期（20分钟）专注一个章节的一部分
- 不要试图在一个心跳内完成整章
```

---

#### 6. 内容编辑 x2

| 属性 | 值 |
|------|-----|
| **角色** | `content-editor` |
| **职责** | 文字润色、错别字检查、格式统一 |
| **汇报给** | CCO |
| **预算** | $100/月/人 |

**工作分配：**
| Agent | 负责章节 |
|-------|---------|
| 内容编辑-1 | 第1-6章 |
| 内容编辑-2 | 第7-12章 |

---

#### 7. 社媒运营 x1

| 属性 | 值 |
|------|-----|
| **角色** | `social-media` |
| **职责** | 社交媒体更新、读者互动、收集反馈 |
| **汇报给** | CMO |
| **预算** | $50/月 |

---

## 四、项目分解（Issues/Tasks）

### Phase 1: 规划阶段（第1-2周）

```
Issue: 制定全书大纲
├── 状态: todo
├── 负责人: CEO
└── 子任务:
    ├── 确定章节结构
    ├── 定义每章核心知识点
    └── 分配写作任务
```

### Phase 2: 写作阶段（第3-14周）

```
Issue: 完成第1章
├── 状态: backlog
├── 负责人: 技术写作员-1
├── 目标: 完成8000字初稿
└── 子任务:
    ├── 撰写引言
    ├── 编写核心概念
    ├── 创建代码示例
    └── 自我审核

Issue: 第1章技术审核
├── 状态: backlog
├── 负责人: CTO
├── 前置: 第1章初稿完成
└── 验收: 所有代码可运行

Issue: 第1章内容润色
├── 状态: backlog
├── 负责人: 内容编辑-1
├── 前置: 技术审核通过
└── 验收: 无错别字、风格统一
```

### Phase 3: 整合阶段（第15-18周）

```
Issue: 全书风格统一
├── 负责人: CCO
└── 验收: 章节衔接流畅、风格一致

Issue: 代码示例全面测试
├── 负责人: CTO
└── 验收: 100% 代码可运行

Issue: 封面与排版
├── 负责人: 外包/CEO
└── 交付: 多格式电子书
```

### Phase 4: 发布阶段（第19-24周）

```
Issue: 多平台发布
├── 负责人: CMO
└── 渠道: GitHub、Gumroad、个人网站

Issue: 社区推广
├── 负责人: 社媒运营
└── 渠道: Twitter/X、Discord、Reddit
```

---

## 五、工作流示例

### 一个章节的完整生命周期

```
Day 1: CEO 创建 Issue "完成第5章"
       └── 分配给 技术写作员-2

Day 1-5: 技术写作员-2 撰写初稿
         └── 每日心跳：检查进度、提交草稿

Day 5: 提交初稿，状态 → in_review
       └── 自动触发 CTO 审核 Issue

Day 6: CTO 审核代码示例
       ├── 发现问题 → 留言给写作员
       └── 通过 → 状态 → content_review

Day 7: 内容编辑-1 润色文字
       └── 通过 → 状态 → done

Day 8: CCO 抽查风格
       └── 最终确认

Day 8: CEO 最终审核
       └── 标记 done，记录 activity_log
```

---

## 六、预算规划

| Agent | 月预算 | 数量 | 6个月总计 |
|-------|--------|------|----------|
| CTO | $200 | 1 | $1,200 |
| CCO | $200 | 1 | $1,200 |
| CMO | $100 | 1 | $600 |
| 技术写作员 | $150 | 3 | $2,700 |
| 内容编辑 | $100 | 2 | $1,200 |
| 社媒运营 | $50 | 1 | $300 |
| **总计** | | | **$7,200** |

**预算控制策略：**
- 软预警：80% ($5,760) — 聚焦核心任务
- 硬停止：100% ($7,200) — 需要你手动增加预算或调整范围

---

## 七、创建命令示例

### 1. 创建公司
```bash
pnpm paperclipai company create \
  --name "OpenClaw Press" \
  --description "出版《OpenClaw 实用手册》" \
  --budget-monthly-cents 120000
```

### 2. 创建 CEO（你自己）
```bash
pnpm paperclipai agent create \
  --company-id <company-id> \
  --name "主编" \
  --role ceo \
  --adapter-type openclaw-gateway \
  --budget-monthly-cents 50000
```

### 3. 创建 CTO
```bash
pnpm paperclipai agent create \
  --company-id <company-id> \
  --name "CTO-技术主编" \
  --role cto \
  --reports-to <ceo-agent-id> \
  --adapter-type openclaw-gateway \
  --adapter-config '{"url":"ws://127.0.0.1:18789"}' \
  --budget-monthly-cents 20000
```

### 4. 创建目标
```bash
pnpm paperclipai goal create \
  --company-id <company-id> \
  --title "出版《OpenClaw 实用手册》" \
  --level company \
  --owner-agent-id <ceo-agent-id>
```

### 5. 创建章节任务
```bash
pnpm paperclipai issue create \
  --company-id <company-id> \
  --title "完成第1章：OpenClaw 入门" \
  --status todo \
  --assignee-agent-id <writer-1-id> \
  --goal-id <goal-id>
```

---

## 八、完整初始化脚本

```bash
#!/bin/bash
# init-openclaw-press.sh - 初始化 OpenClaw Press 公司

# 设置变量
PAPERCLIP_API="http://localhost:3100"
COMPANY_NAME="OpenClaw Press"
COMPANY_DESC="出版《OpenClaw 实用手册》"

# 1. 创建公司
echo "创建公司..."
COMPANY=$(curl -s -X POST "$PAPERCLIP_API/api/companies" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$COMPANY_NAME\",\"description\":\"$COMPANY_DESC\"}")
COMPANY_ID=$(echo $COMPANY | jq -r '.id')
echo "公司ID: $COMPANY_ID"

# 2. 创建 CEO
echo "创建 CEO..."
CEO=$(curl -s -X POST "$PAPERCLIP_API/api/companies/$COMPANY_ID/agents" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "主编",
    "role": "ceo",
    "adapterType": "openclaw-gateway",
    "adapterConfig": {"url": "ws://127.0.0.1:18789"},
    "budgetMonthlyCents": 50000
  }')
CEO_ID=$(echo $CEO | jq -r '.id')

# 3. 创建 CTO
echo "创建 CTO..."
CTO=$(curl -s -X POST "$PAPERCLIP_API/api/companies/$COMPANY_ID/agents" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"CTO-技术主编\",
    \"role\": \"cto\",
    \"reportsTo\": \"$CEO_ID\",
    \"adapterType\": \"openclaw-gateway\",
    \"adapterConfig\": {\"url\": \"ws://127.0.0.1:18789\"},
    \"budgetMonthlyCents\": 20000
  }")
CTO_ID=$(echo $CTO | jq -r '.id')

# 4. 创建 CCO
echo "创建 CCO..."
CCO=$(curl -s -X POST "$PAPERCLIP_API/api/companies/$COMPANY_ID/agents" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"CCO-内容主编\",
    \"role\": \"cco\",
    \"reportsTo\": \"$CEO_ID\",
    \"adapterType\": \"openclaw-gateway\",
    \"adapterConfig\": {\"url\": \"ws://127.0.0.1:18789\"},
    \"budgetMonthlyCents\": 20000
  }")
CCO_ID=$(echo $CCO | jq -r '.id')

# 5. 创建 CMO
echo "创建 CMO..."
CMO=$(curl -s -X POST "$PAPERCLIP_API/api/companies/$COMPANY_ID/agents" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"CMO-营销主编\",
    \"role\": \"cmo\",
    \"reportsTo\": \"$CEO_ID\",
    \"adapterType\": \"openclaw-gateway\",
    \"adapterConfig\": {\"url\": \"ws://127.0.0.1:18789\"},
    \"budgetMonthlyCents\": 10000
  }")
CMO_ID=$(echo $CMO | jq -r '.id')

# 6. 创建技术写作员
for i in 1 2 3; do
  echo "创建技术写作员-$i..."
  WRITER=$(curl -s -X POST "$PAPERCLIP_API/api/companies/$COMPANY_ID/agents" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"技术写作员-$i\",
      \"role\": \"writer\",
      \"reportsTo\": \"$CTO_ID\",
      \"adapterType\": \"openclaw-gateway\",
      \"adapterConfig\": {\"url\": \"ws://127.0.0.1:18789\"},
      \"budgetMonthlyCents\": 15000
    }")
  WRITER_IDS[$i]=$(echo $WRITER | jq -r '.id')
done

# 7. 创建公司目标
echo "创建公司目标..."
GOAL=$(curl -s -X POST "$PAPERCLIP_API/api/companies/$COMPANY_ID/goals" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "出版《OpenClaw 实用手册》，6个月内发布",
    "level": "company",
    "ownerAgentId": "'$CEO_ID'"
  }')
GOAL_ID=$(echo $GOAL | jq -r '.id')

# 8. 创建项目
echo "创建项目..."
PROJECT=$(curl -s -X POST "$PAPERCLIP_API/api/companies/$COMPANY_ID/projects" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"书籍写作\",
    \"goalId\": \"$GOAL_ID\",
    \"leadAgentId\": \"$CEO_ID\"
  }")
PROJECT_ID=$(echo $PROJECT | jq -r '.id')

# 9. 创建章节任务（示例：第1章）
echo "创建第1章任务..."
curl -s -X POST "$PAPERCLIP_API/api/companies/$COMPANY_ID/issues" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"完成第1章：OpenClaw 入门\",
    \"description\": \"介绍 OpenClaw 是什么、为什么需要它、基本使用流程\",
    \"status\": \"todo\",
    \"priority\": \"high\",
    \"assigneeAgentId\": \"${WRITER_IDS[1]}\",
    \"goalId\": \"$GOAL_ID\",
    \"projectId\": \"$PROJECT_ID\"
  }"

echo ""
echo "=== 初始化完成 ==="
echo "公司ID: $COMPANY_ID"
echo "CEO ID: $CEO_ID"
echo "CTO ID: $CTO_ID"
echo "CCO ID: $CCO_ID"
echo "CMO ID: $CMO_ID"
echo "目标ID: $GOAL_ID"
echo "项目ID: $PROJECT_ID"
```

---

## 九、关键成功指标

| 指标 | 目标值 | 监控方式 |
|------|--------|----------|
| 章节完成率 | 12/12 章 | Dashboard 查看 |
| 代码示例通过率 | 100% | CTO 审核任务 |
| 预算利用率 | < 90% | Budget dashboard |
| 平均章节周期 | < 2周/章 | Issue completed_at |
| 读者反馈响应 | < 24小时 | Comment 响应时间 |

---

## 十、待办事项

- [ ] 章节任务详细分解 — 将 12 章拆分成具体的 Issue，包含子任务和依赖关系
- [ ] Agent 指令文件完善 — 为每个 Agent 编写完整的 SOUL.md 和 HEARTBEAT.md
- [ ] 写作风格指南 — 定义统一的语言风格、代码规范、格式要求
- [ ] 工作流自动化 — 设计自动触发的心跳规则、审批流程、通知机制
- [ ] 成本优化策略 — 如何在预算内高效完成，监控和调整方案

# ui/src/components/

React component library for Paperclip board operator UI. 74 component files using React 19, Tailwind CSS 4, Radix UI primitives, and React Query for server state.

## Overview

Two-tier structure: page-level components in `ui/src/pages/`, reusable components here. No external state library — React Context for global state, React Query for server state.

## Structure

```
components/
├── ui/                 # Shadcn/ui primitives (Radix + Tailwind)
│   ├── button.tsx      # Button variants (default, destructive, outline, ghost)
│   ├── input.tsx       # Input, textarea, select
│   ├── dialog.tsx      # Modal dialogs
│   ├── dropdown-menu.tsx
│   └── ...
├── Layout.tsx          # Main app shell with sidebar + content area
├── Sidebar.tsx         # Navigation with sections and plugin slots
├── AgentConfigForm.tsx # Complex form with dirty tracking, env testing
├── IssueCard.tsx       # Task card for kanban/lists
├── OrgChart.tsx        # Hierarchical agent visualization
├── CostChart.tsx       # Budget/spend visualization
└── forms/              # Reusable form components
```

## Where to Look

| Task | Location | Notes |
|------|----------|-------|
| Navigation | `Sidebar.tsx` | Sections: Dashboard, Org, Tasks, Costs, Approvals |
| Page layout | `Layout.tsx` | Responsive shell, mobile gestures |
| Button styles | `ui/button.tsx` | Variants: default, destructive, outline, ghost |
| Agent config | `AgentConfigForm.tsx` | Adapter selection, env vars, test connection |
| Task display | `IssueCard.tsx` | Status, priority, assignee, goal linkage |
| Org hierarchy | `OrgChart.tsx` | Reports-to tree, status indicators |
| Form primitives | `ui/` folder | Input, select, dialog, dropdown, etc. |

## Conventions

### Component Structure
- PascalCase filenames matching component name
- Export component as default or named export
- Props interface at top of file
- Use `import type` for type-only imports

### State Management
- **Global state**: React Context (`CompanyContext`, `AuthContext`)
- **Server state**: React Query (`useQuery`, `useMutation`)
- **Local state**: `useState`, `useReducer` for component-specific
- No Redux, Zustand, or other state libraries

### Styling
- Tailwind CSS utility classes
- `cn()` helper from `lib/utils.ts` for conditional class merging
- Radix UI for complex interactive components (dialog, dropdown, tabs)
- Shadcn/ui pattern: copy-paste components, customize as needed

### Forms
- React Hook Form for complex forms
- Zod schemas from `@paperclipai/shared` for validation
- Dirty tracking with overlay state for unsaved changes

### API Calls
- Use `ui/src/api/` client functions — never fetch directly
- React Query for caching and invalidation
- Handle errors with toast notifications, not silent failures

## Anti-Patterns (THIS PROJECT)

- **Never** use unprefixed API paths — always `/api/...`
- **Never** skip company context — use `useCompany()` hook
- **Never** silent API errors — surface with toast
- **Never** inline styles when Tailwind utility exists
- **Never** fetch in render — use `useQuery` or `useEffect`

## Key Patterns

### Company Context
```tsx
const { companyId, company } = useCompany();
// All API calls include companyId
```

### React Query
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['issues', companyId],
  queryFn: () => api.getIssues(companyId),
});
```

### Conditional Classes
```tsx
import { cn } from '@/lib/utils';
<div className={cn('base-class', isActive && 'active-class')} />
```

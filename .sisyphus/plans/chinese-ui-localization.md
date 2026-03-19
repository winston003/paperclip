# Chinese UI Localization Work Plan

## TL;DR

> **Quick Summary**: Implement full internationalization (i18n) support for the Paperclip React UI, adding Chinese language capability alongside existing English.
> 
> **Deliverables**:
> - Fully functional i18n system with react-i18next
> - Complete English and Chinese translation packs
> - Language switching functionality
> - All UI components support both languages
> 
> **Estimated Effort**: Medium-High (2-4 weeks)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: i18n setup → core component translation → full UI translation → testing

---

## Context

### Original Request
User wants to develop a Chinese version of the Paperclip UI. No existing internationalization infrastructure exists in the codebase.

### Research Findings
- No i18n libraries installed, no localization files or translation functions present
- All user-facing text is hardcoded in English across 70+ components and pages
- UI uses React 19 + Vite + Tailwind CSS, with Radix UI components
- Navigation, forms, error messages, and all interactive elements need translation
- Approximately 500+ unique strings require extraction and translation

---

## Work Objectives

### Core Objective
Implement a production-grade internationalization system that enables seamless switching between English and Chinese languages, with consistent rendering across all UI components.

### Concrete Deliverables
- `ui/src/i18n.ts` - i18n configuration and initialization
- `ui/src/locales/en.json` - Complete English translation file
- `ui/src/locales/zh.json` - Complete Chinese translation file
- Language switching component in the UI
- All hardcoded English strings replaced with translation keys
- Type safety for translation keys (optional but recommended)

### Definition of Done
- [ ] User can switch between English and Chinese via UI control
- [ ] All UI text displays correctly in both languages
- [ ] No broken layouts or truncated text in Chinese
- [ ] Dynamic content (dates, numbers, interpolation) works correctly
- [ ] `pnpm typecheck` and `pnpm test:run` pass
- [ ] Language preference persists across sessions

### Must Have
- Full i18n infrastructure with react-i18next
- Complete Chinese translation of all UI text
- Language switching functionality
- Persistent language preference
- Backward compatibility with existing English UI

### Must NOT Have (Guardrails)
- No machine translation without human review
- No changes to core business logic or functionality
- No breaking changes to existing UI behavior
- No additional third-party dependencies beyond i18n ecosystem
- No server-side changes required for this phase

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (Vitest already configured)
- **Automated tests**: Tests-after (add tests after implementation)
- **Framework**: Vitest + Playwright for E2E

### QA Policy
Every task MUST include agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
- **Build validation**: Use Bash — Run typecheck and build commands
- **Translation validation**: Use Bash — Check for missing translation keys

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Foundation):
├── Task 1: Install i18n dependencies and configure react-i18next [quick]
├── Task 2: Create translation file structure and base English locale [quick]
├── Task 3: Implement language switching component and persistence [quick]
└── Task 4: Add TypeScript type safety for translation keys [quick]

Wave 2 (After Wave 1 — Core Translation, MAX PARALLEL):
├── Task 5: Translate authentication and onboarding flows [unspecified-high]
├── Task 6: Translate navigation and common UI components [unspecified-high]
├── Task 7: Translate dashboard and main pages [unspecified-high]
├── Task 8: Translate issue management components [unspecified-high]
├── Task 9: Translate goal and project management [unspecified-high]
├── Task 10: Translate agent and organization management [unspecified-high]
└── Task 11: Translate settings and admin pages [unspecified-high]

Wave 3 (After Wave 2 — Integration & Testing):
├── Task 12: Chinese translation review and QA [unspecified-high]
├── Task 13: Add comprehensive E2E tests for i18n functionality [deep]
├── Task 14: Performance optimization and edge case handling [deep]
└── Task 15: Final validation and documentation [quick]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 1 → Task 2 → Tasks 5-11 → Task 12 → Task 13 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 7 (Wave 2)
```

### Dependency Matrix
- **1-4**: — — 5-11, 1
- **5**: 1, 2 — 12, 2
- **6**: 1, 2 — 12, 2
- **7**: 1, 2 — 12, 2
- **8**: 1, 2 — 12, 2
- **9**: 1, 2 — 12, 2
- **10**: 1, 2 — 12, 2
- **11**: 1, 2 — 12, 2
- **12**: 5-11 — 13, 3
- **13**: 12 — 14, 3
- **14**: 13 — 15, 3
- **15**: 14 — FINAL, 4

### Agent Dispatch Summary
- **1**: **4** — T1-T4 → `quick`
- **2**: **7** — T5-T11 → `unspecified-high`
- **3**: **4** — T12 → `unspecified-high`, T13 → `deep`, T14 → `deep`, T15 → `quick`
- **FINAL**: **4** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [ ] 1. Install i18n dependencies and configure react-i18next

  **What to do**:
  - Install required dependencies: `pnpm add react-i18next i18next i18next-http-backend i18next-browser-languagedetector`
  - Create `ui/src/i18n.ts` configuration file with:
    - Language detection (browser preference, localStorage fallback)
    - Backend for loading translation files
    - Default language set to English
    - Fallback language configuration
  - Import and initialize i18n in `ui/src/main.tsx` before rendering the app
  - Wrap App component with I18nextProvider if needed (react-i18next v13+ may not require)

  **Must NOT do**:
  - Do not modify existing app routing or context providers unnecessarily
  - Do not add any UI components in this task
  - Do not extract any strings yet

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple dependency installation and configuration task
  - **Skills**: []
    - No specialized skills needed beyond standard React setup
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not needed for configuration work

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1
  - **Blocks**: All translation tasks (2-11)
  - **Blocked By**: None (can start immediately)

  **References**:
  - Official docs: `https://react.i18next.com/getting-started` - React i18next setup guide
  - Official docs: `https://www.i18next.com/overview/configuration-options` - Configuration options

  **Acceptance Criteria**:
  - [ ] Dependencies installed successfully
  - [ ] `ui/src/i18n.ts` created with proper configuration
  - [ ] i18n imported and initialized in `main.tsx`
  - [ ] App loads without errors after integration

  **QA Scenarios**:
  ```
  Scenario: i18n configuration loads successfully
    Tool: Bash
    Preconditions: Clean install, no existing i18n setup
    Steps:
      1. Run `pnpm install` in ui/ directory
      2. Run `pnpm dev` to start dev server
      3. Navigate to `http://localhost:3100`
      4. Check browser console for i18n initialization errors
    Expected Result: No i18n-related errors in console, app loads normally
    Evidence: .sisyphus/evidence/task-1-i18n-config-console.png

  Scenario: Language detection works
    Tool: Playwright
    Preconditions: Browser language set to English
    Steps:
      1. Clear browser storage
      2. Navigate to app
      3. Check localStorage for i18nextLng value
    Expected Result: localStorage has i18nextLng set to 'en'
    Evidence: .sisyphus/evidence/task-1-language-detection.png
  ```

  **Commit**: YES
  - Message: `feat(ui): add react-i18n configuration and dependencies`
  - Files: `ui/package.json`, `ui/src/i18n.ts`, `ui/src/main.tsx`
  - Pre-commit: `pnpm typecheck` in ui/ directory

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search codebase for forbidden patterns. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `pnpm typecheck` + `pnpm test:run` + `pnpm build` in ui directory. Review all changed files for: proper key naming, no hardcoded strings left, consistent translation patterns, no unused dependencies.
  Output: `Build [PASS/FAIL] | Typecheck [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Test end-to-end flow in both languages: complete authentication, navigate all pages, test all forms, verify language switching persists across sessions. Test edge cases: dynamic content, form validation errors, empty states.
  Output: `Pages tested [N/N] | Language switching [PASS/FAIL] | Translation completeness [%] | Layout issues [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  Verify only i18n-related changes were made, no core functionality altered. Check that all existing features work exactly as before when language is set to English.
  Output: `Scope compliance [PASS/FAIL] | No regression [PASS/FAIL] | VERDICT`

---

## Commit Strategy

- **Task 1**: `feat(ui): add react-i18n configuration and dependencies`
- **Task 2**: `feat(ui): add translation file structure and base English locale`
- **Task 3**: `feat(ui): implement language switching component`
- **Task 4**: `feat(ui): add TypeScript type safety for translation keys`
- **Tasks 5-11**: `i18n(ui): translate [component/page group]` (one commit per component group)
- **Task 12**: `i18n(ui): Chinese translation review and fixes`
- **Task 13**: `test(ui): add E2E tests for i18n functionality`
- **Task 14**: `perf(ui): optimize i18n loading and edge cases`
- **Task 15**: `docs(ui): document i18n implementation and usage`

---

## Success Criteria

### Verification Commands
```bash
pnpm --filter @paperclipai/ui typecheck  # Expected: 0 errors
pnpm --filter @paperclipai/ui test:run   # Expected: All tests pass
pnpm --filter @paperclipai/ui build      # Expected: Build completes successfully
```

### Final Checklist
- [ ] All UI text translatable between English and Chinese
- [ ] Language switching works seamlessly
- [ ] No layout issues or text truncation in Chinese
- [ ] All existing functionality preserved in English mode
- [ ] Translation keys are consistent and maintainable
- [ ] Documentation updated for i18n usage

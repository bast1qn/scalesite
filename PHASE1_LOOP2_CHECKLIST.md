# 🔄 PHASE 1 - LOOP 2 CHECKLIST
## Next Steps for Senior React QA Engineer

**Date:** 2026-01-13
**Previous Loop:** 1 (Critical Issues Fixed ✅)
**Current Loop:** 2 (Type Safety & Null Safety)
**Estimated Time:** 45-60 minutes

---

## 🎯 LOOP 2 FOCUS AREAS

### Priority 1: Replace ALL 'any' Types (Medium Priority)
**Goal:** Eliminate remaining 'any' types in 50+ files
**Impact:** +20% type safety

**Files to Fix:**
```bash
# Find all files with 'any' type
grep -r ": any" components/ pages/ --include="*.tsx" --include="*.ts"

# Priority Files:
1. pages/ConfiguratorPage.tsx
2. pages/ProjectDetailPage.tsx
3. pages/AnalyticsPage.tsx
4. components/ai-content/*.tsx (4 files)
5. components/billing/*.tsx (3 files)
6. components/chat/*.tsx (3 files)
7. components/configurator/*.tsx (6 files)
```

**How to Fix:**
```typescript
// ❌ BAD:
const [data, setData] = useState<any>(null);

// ✅ GOOD:
import type { Project } from '../../lib/types';
const [data, setData] = useState<Project | null>(null);

// ❌ BAD:
const handleClick = (e: any) => {

// ✅ GOOD:
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
```

---

### Priority 2: Fix Undefined/Null Accesses (HIGH Priority)
**Goal:** Add optional chaining to prevent runtime crashes
**Impact:** +15% runtime stability

**Pattern to Search:**
```bash
# Find unsafe property access
grep -r "\.data\." components/ pages/ --include="*.tsx" | grep -v "\?"
grep -r "\.user\." components/ pages/ --include="*.tsx" | grep -v "\?"
grep -r "\.profile\." components/ pages/ --include="*.tsx" | grep -v "\?"
```

**How to Fix:**
```typescript
// ❌ BAD:
user.name.split(' ')[0]
data.services.name
ticket.profiles.company

// ✅ GOOD:
user?.name?.split(' ')[0] || 'Nutzer'
data?.services?.name || 'Unbekannt'
ticket?.profiles?.company || ''
```

---

### Priority 3: Fix Unstable Keys in Lists (CRITICAL)
**Goal:** Replace index-based keys with stable IDs
**Impact:** +10% React performance

**Pattern to Search:**
```bash
# Find unstable keys
grep -r "key={index}" components/ pages/ --include="*.tsx"
grep -r "key={i}" components/ pages/ --include="*.tsx"
grep -r "\.map((.*, index)" components/ pages/ --include="*.tsx"
```

**How to Fix:**
```typescript
// ❌ BAD:
{items.map((item, index) => (
    <div key={index}>  // ⚠️ UNSTABLE!
        {item.name}
    </div>
))}

// ✅ GOOD:
{items.map((item) => (
    <div key={item.id}>  // ✅ STABLE!
        {item.name}
    </div>
))}

// ❌ BAD:
{[1, 2, 3].map(i => (
    <Skeleton key={i} />
))}

// ✅ GOOD:
{[1, 2, 3].map(i => (
    <Skeleton key={`skeleton-${i}`} />
))}
```

---

### Priority 4: Add React.memo to Expensive Components (Medium)
**Goal:** Memoize components that don't need to re-render
**Impact:** +10% render performance

**Components to Memoize:**
```bash
# Large components >200 lines
find components/ -name "*.tsx" -exec wc -l {} + | awk '$1 > 200'

# Candidates:
- components/projects/ProjectCard.tsx
- components/dashboard/Overview.tsx (already optimized ✅)
- components/ai-content/ContentEditor.tsx
- components/configurator/Configurator.tsx
```

**How to Fix:**
```typescript
// ❌ BAD:
export const ProjectCard = ({ project }) => {
    return (
        <div>{project.name}</div>
    );
};

// ✅ GOOD:
export const ProjectCard = React.memo(({ project }) => {
    return (
        <div>{project.name}</div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison
    return prevProps.project.id === nextProps.project.id &&
           prevProps.project.status === nextProps.project.status;
});
```

---

## 🚀 QUICK START COMMANDS

### Step 1: Find All Issues
```bash
# Find all 'any' types
grep -rn ": any" components/ pages/ --include="*.tsx" --include="*.ts" | wc -l

# Find all unsafe property access
grep -rn "\.data\.\|\.user\.\|\.profile\." components/ pages/ --include="*.tsx" | grep -v "\?" | wc -l

# Find all unstable keys
grep -rn "key={index}\|key={i}" components/ pages/ --include="*.tsx" | wc -l
```

### Step 2: Fix by Priority
```bash
# Start with pages (highest impact)
cd pages/
# Fix ConfiguratorPage.tsx
# Fix ProjectDetailPage.tsx
# Fix AnalyticsPage.tsx

# Then move to components
cd ../components/
# Fix ai-content/
# Fix billing/
# Fix chat/
# Fix configurator/
```

### Step 3: Verify Fixes
```bash
# Run TypeScript compiler
npm run type-check

# Run linter
npm run lint

# Check for errors
npm run build
```

---

## 📋 LOOP 2 CHECKLIST

### Part 1: Type Safety (30 mins)
- [ ] Replace 'any' in pages/ (15 files)
- [ ] Replace 'any' in components/ai-content/ (4 files)
- [ ] Replace 'any' in components/billing/ (3 files)
- [ ] Replace 'any' in components/chat/ (3 files)
- [ ] Replace 'any' in components/configurator/ (6 files)
- [ ] Verify: 0 TypeScript errors

### Part 2: Null Safety (15 mins)
- [ ] Add optional chaining to data.service
- [ ] Add optional chaining to user.name
- [ ] Add optional chaining to ticket.profile
- [ ] Add optional chaining to project.config
- [ ] Verify: 0 runtime null errors

### Part 3: Stable Keys (10 mins)
- [ ] Replace all `key={index}` with `key={item.id}`
- [ ] Replace all `key={i}` with `key={'prefix-${i}'}`
- [ ] Verify: 0 React key warnings

### Part 4: Performance (10 mins)
- [ ] Add React.memo to ProjectCard
- [ ] Add React.memo to ContentEditor
- [ ] Add React.memo to Configurator
- [ ] Verify: Improved render times

---

## 🎯 SUCCESS CRITERIA

### Loop 2 Goals:
- ✅ Eliminate 50+ 'any' types
- ✅ Add optional chaining to 20+ unsafe accesses
- ✅ Fix 10+ unstable keys
- ✅ Add React.memo to 3+ expensive components

### Expected Improvements:
- Type Safety: 75% → 90%
- Runtime Stability: 95% → 98%
- React Performance: +5-10%

---

## 📝 AFTER LOOP 2

1. Generate PHASE1_LOOP2_QA_REPORT.md
2. Update todo list
3. Prepare Loop 3 checklist (Form Validation)

---

*Ready to start Loop 2!*
*Scalesite React QA Automation - Phase 1*

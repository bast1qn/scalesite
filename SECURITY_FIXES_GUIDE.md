# 🔒 Security Fixes - Migration Guide
## Replace alert() and confirm() with Secure UI Components

**Phase:** Loop 3/200 | Phase 4
**Date:** 2026-01-17
**Severity:** Medium (UX + Security Consistency)

---

## 📋 Overview

Native `alert()` and `confirm()` are problematic for several reasons:
1. **UX:** They block the entire browser and don't respect app styling
2. **Accessibility:** Poor keyboard navigation and screen reader support
3. **Security:** Can be used in social engineering attacks
4. **Consistency:** Don't integrate with app design system

**Solution:** Use `useToast()` and `ConfirmDialog` components

---

## 🚀 Quick Start

### 1. Toast Notifications (Replacing alert())

```typescript
import { useToast } from '../lib';

function MyComponent() {
    const { showError, showSuccess, showWarning, showInfo } = useToast();

    const handleSubmit = async () => {
        try {
            await api.submitData();
            showSuccess('Data submitted successfully!');
        } catch (err) {
            showError('Failed to submit data. Please try again.');
        }
    };

    return <button onClick={handleSubmit}>Submit</button>;
}
```

**Before (❌ Native alert):**
```typescript
alert('Error: Invalid input');
```

**After (✅ Toast notification):**
```typescript
const { showError } = useToast();
showError('Invalid input');
```

---

### 2. Confirmation Dialog (Replacing confirm())

```typescript
import { useState } from 'react';
import { ConfirmDialog } from '../components';

function MyComponent() {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        // Show confirmation dialog
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setShowConfirm(false);
        // Perform delete action
        await api.deleteItem();
    };

    return (
        <>
            <button onClick={handleDelete}>Delete Item</button>

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete Item?"
                message="This action cannot be undone. Are you sure?"
                type="danger"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}
```

**Before (❌ Native confirm):**
```typescript
if (confirm('Are you sure you want to delete this item?')) {
    await api.deleteItem();
}
```

**After (✅ Confirm dialog):**
```typescript
const [showConfirm, setShowConfirm] = useState(false);

// Trigger
<button onClick={() => setShowConfirm(true)}>Delete</button>

<ConfirmDialog
    isOpen={showConfirm}
    title="Delete Item?"
    message="This action cannot be undone."
    type="danger"
    onConfirm={async () => {
        await api.deleteItem();
        setShowConfirm(false);
    }}
    onCancel={() => setShowConfirm(false)}
/>
```

---

## 📝 Component Files to Update

### Files Using alert() (9 files):

1. **`components/PricingSection.tsx`** (2 occurrences)
   - Line 220: `alert(t('general.error') + ': Invalid input.');`
   - Line 262: `alert(t('general.error'));`

2. **`pages/BlueprintPage.tsx`** (1 occurrence)
   - Line 208: Form onsubmit with alert

3. **`pages/AutomationenPage.tsx`** (2 occurrences)
   - Line 271: Validation error alert
   - Line 313: API error alert

4. **`pages/ChatPage.tsx`** (1 occurrence)
   - Line 89: Delete confirmation

5. **`components/seo/SEOAuditReport.tsx`** (2 occurrences)
   - Line 118: Invalid URL alert
   - Line 136: Audit error alert

6. **`components/seo/TwitterCards.tsx`** (2 occurrences)
   - Line 134: Validation error alert
   - Line 143: File read error alert

7. **`components/newsletter/CampaignBuilder.tsx`** (2 occurrences)
   - Line 103: Draft restore confirmation
   - Line 122: Invalid name alert

### Files Using confirm() (2 files):

8. **`components/team/MemberCard.tsx`** (1 occurrence)
   - Line 95: Delete member confirmation

9. **`components/newsletter/CampaignList.tsx`** (2 occurrences)
   - Line 172: Send campaign confirmation
   - Line 178: Delete campaign confirmation

---

## 🛠️ Step-by-Step Migration

### Example 1: Simple Error Alert

**Before:**
```typescript
// components/PricingSection.tsx:220
const handleSubmit = (data: FormData) => {
    if (!validateInput(data)) {
        alert(t('general.error') + ': Invalid input. Please check your data.');
        return;
    }
    // ...
};
```

**After:**
```typescript
import { useToast } from '../lib';

function PricingSection() {
    const { showError } = useToast();

    const handleSubmit = (data: FormData) => {
        if (!validateInput(data)) {
            showError(t('general.error') + ': Invalid input. Please check your data.');
            return;
        }
        // ...
    };
}
```

---

### Example 2: Confirmation Dialog

**Before:**
```typescript
// pages/ChatPage.tsx:89
const handleDeleteMessage = () => {
    if (confirm('Möchtest du diese Nachricht wirklich löschen?')) {
        deleteMessage(messageId);
    }
};
```

**After:**
```typescript
import { useState } from 'react';
import { ConfirmDialog } from '../components';

function ChatPage() {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteMessage = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        deleteMessage(messageId);
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <button onClick={handleDeleteMessage}>Delete</button>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Nachricht löschen?"
                message="Möchtest du diese Nachricht wirklich löschen?"
                type="danger"
                confirmLabel="Löschen"
                cancelLabel="Abbrechen"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
}
```

---

### Example 3: Multiple Confirmations

**Before:**
```typescript
// components/newsletter/CampaignList.tsx:172,178
const handleSend = () => {
    if (!confirm('Möchtest du diese Kampagne wirklich jetzt senden?')) return;
    sendCampaign(id);
};

const handleDelete = () => {
    if (!confirm('Möchtest du diese Kampagne wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
    deleteCampaign(id);
};
```

**After:**
```typescript
import { useState } from 'react';
import { ConfirmDialog } from '../components';
import { useToast } from '../lib';

function CampaignList() {
    const { showSuccess, showError } = useToast();
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        action: 'send' | 'delete' | null;
        campaignId: string | null;
    }>({ isOpen: false, action: null, campaignId: null });

    const handleSend = (id: string) => {
        setConfirmState({ isOpen: true, action: 'send', campaignId: id });
    };

    const handleDelete = (id: string) => {
        setConfirmState({ isOpen: true, action: 'delete', campaignId: id });
    };

    const handleConfirm = async () => {
        const { action, campaignId } = confirmState;

        if (action === 'send' && campaignId) {
            try {
                await sendCampaign(campaignId);
                showSuccess('Campaign sent successfully!');
            } catch (err) {
                showError('Failed to send campaign');
            }
        } else if (action === 'delete' && campaignId) {
            try {
                await deleteCampaign(campaignId);
                showSuccess('Campaign deleted');
            } catch (err) {
                showError('Failed to delete campaign');
            }
        }

        setConfirmState({ isOpen: false, action: null, campaignId: null });
    };

    return (
        <>
            <button onClick={() => handleSend(campaign.id)}>Send</button>
            <button onClick={() => handleDelete(campaign.id)}>Delete</button>

            <ConfirmDialog
                isOpen={confirmState.isOpen}
                title={
                    confirmState.action === 'send'
                        ? 'Kampagne senden?'
                        : 'Kampagne löschen?'
                }
                message={
                    confirmState.action === 'send'
                        ? 'Möchtest du diese Kampagne wirklich jetzt senden?'
                        : 'Möchtest du diese Kampagne wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.'
                }
                type={confirmState.action === 'delete' ? 'danger' : 'warning'}
                onConfirm={handleConfirm}
                onCancel={() => setConfirmState({ isOpen: false, action: null, campaignId: null })}
            />
        </>
    );
}
```

---

## 🎨 Component Props Reference

### ConfirmDialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | **required** | Whether dialog is visible |
| `title` | `string` | **required** | Dialog title |
| `message` | `string` | **required** | Dialog message |
| `confirmLabel` | `string` | `"Bestätigen"` | Confirm button text |
| `cancelLabel` | `string` | `"Abbrechen"` | Cancel button text |
| `type` | `"danger" \| "warning" \| "info"` | `"warning"` | Dialog style |
| `onConfirm` | `() => void` | **required** | Confirm callback |
| `onCancel` | `() => void` | **required** | Cancel callback |

### useToast Hook

```typescript
const {
    showToast,      // Generic: ({ type, message, duration }) => void
    showSuccess,    // Quick: (message, duration?) => void
    showError,      // Quick: (message, duration?) => void
    showWarning,    // Quick: (message, duration?) => void
    showInfo        // Quick: (message, duration?) => void
} = useToast();
```

---

## ✅ Benefits

1. **Better UX:** Non-blocking, styled, animated
2. **Accessibility:** Keyboard navigation, ARIA labels, screen reader support
3. **Security:** No native dialogs that can be spoofed
4. **Consistency:** Matches app design system
5. **Control:** Custom buttons, icons, styling

---

## 🔒 Security Improvements

| Aspect | Native alert/confirm | ConfirmDialog/Toast |
|--------|---------------------|---------------------|
| **XSS Risk** | Medium (can be triggered by malicious content) | Low (React-sanitized) |
| **Clickjacking** | Vulnerable | Protected |
| **Styling** | None | Full control |
| **Accessibility** | Poor | Excellent (ARIA) |
| **User Experience** | Blocking | Non-blocking |

---

## 📊 Migration Checklist

- [ ] Step 1: Import `useToast` and/or `ConfirmDialog`
- [ ] Step 2: Replace `alert()` with `showError()` or `showSuccess()`
- [ ] Step 3: Replace `confirm()` with `<ConfirmDialog>` component
- [ ] Step 4: Test all error flows
- [ ] Step 5: Test all confirmation flows
- [ ] Step 6: Verify keyboard navigation (Enter, Escape)
- [ ] Step 7: Verify screen reader announcements

---

## 🚦 Testing

### Manual Test Cases:

1. **Toast Notifications:**
   - Trigger error toast → Verify red color and auto-dismiss
   - Trigger success toast → Verify green color
   - Trigger warning → Verify yellow color
   - Trigger multiple toasts → Verify stacking

2. **Confirmation Dialog:**
   - Open dialog → Verify backdrop and modal
   - Press Escape → Verify dialog closes
   - Press Enter → Verify confirm action
   - Click outside → Verify dialog closes
   - Tab through → Verify focus management

3. **Accessibility:**
   - Use screen reader → Verify announcements
   - Use keyboard only → Verify full functionality
   - High contrast mode → Verify visibility

---

**Generated:** 2026-01-17
**Status:** Ready for Migration
**Priority:** Medium (UX + Security)

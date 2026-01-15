# 🔒 SECURITY IMPROVEMENT TODO - Phase 4

## Priority 1: CRITICAL (Fix Immediately)

### 1. Fix Known Vulnerability in jws
```bash
npm audit fix --force
# If that fails, manually update:
npm install jws@latest
```

### 2. Add Subresource Integrity (SRI)
**Files to update:** `index.html`

Generate SRI hashes:
```bash
# For each external resource, generate SHA-384 hash
npx sri-toolbox generate https://cdn.jsdelivr.net/npm/...
```

Add integrity attributes:
```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
  rel="stylesheet"
  integrity="sha384-[HASH]"
  crossorigin="anonymous"
>
```

---

## Priority 2: HIGH (Fix This Week)

### 1. Harden Content Security Policy
**File:** `index.html:127-140`

Create environment-specific CSP:
```typescript
// vite.config.ts - Add nonce generation for production
import crypto from 'crypto';

function generateNonce() {
  return crypto.randomBytes(16).toString('base64');
}
```

Update index.html:
```html
<!-- Production Build -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'nonce-%VITE_CSP_NONCE%' https://cdn.jsdelivr.net;
  style-src 'self' 'nonce-%VITE_CSP_NONCE%' https://fonts.googleapis.com;
  ...
">
```

### 2. Add Missing Security Headers
**File:** `index.html` (add to `<head>`)

```html
<!-- Frame protection -->
<meta http-equiv="X-Frame-Options" content="DENY">

<!-- Permissions policy (restrict browser features) -->
<meta http-equiv="Permissions-Policy" content="
  geolocation=(),
  microphone=(),
  camera=(),
  payment=(self),
  usb=(),
  magnetometer=(),
  gyroscope=()
">

<!-- HSTS (only set if you have HTTPS) -->
<meta http-equiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains">
```

---

## Priority 3: MEDIUM (Fix This Month)

### 1. Implement Zod Schema Validation
**Install:** `npm install zod`

**Example implementation:**
```typescript
// lib/schemas/project.ts
import { z } from 'zod';

export const CreateProjectSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(2000).optional(),
  industry: z.enum(['web', 'ecommerce', 'app', 'other']),
  service_id: z.number().int().positive().optional()
});

// Use in API
export const api = {
  createProject: async (data: unknown) => {
    const validated = CreateProjectSchema.parse(data);
    // ... rest of implementation
  }
};
```

### 2. Add Rate Limiting for Auth Endpoints
**Install:** `npm install @upstash/ratelimit @upstash/redis`

**Implementation:**
```typescript
// lib/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests per minute
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

### 3. Implement Security Logging & Monitoring
**File:** Create `lib/securityLogger.ts`

```typescript
export const securityLog = (event: string, data: Record<string, unknown>) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ...data,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Send to monitoring service (e.g., Sentry, LogRocket)
  console.log('[SECURITY]', logEntry);

  // Store in database for audit trail
  // api.logSecurityEvent(logEntry);
};
```

---

## Priority 4: LOW (Nice to Have)

### 1. Update Outdated Packages
```bash
# Safe updates (minor versions)
npm update @google/genai @types/node @vitejs/plugin-react framer-motion lucide-react

# Major updates (test in branch first)
npm install tailwindcss@4
npm install vite@7
npm install react@19
```

### 2. Add WebAuthn Support (2FA)
**Research:** Supabase Auth supports WebAuthn
**Benefit:** Hardware-based 2FA (YubiKey, Touch ID)

### 3. Implement Content Security Policy Reporting
```html
<meta http-equiv="Content-Security-Policy-Report-Only" content="
  ...
  report-uri /api/csp-violations
">
```

---

## TESTING CHECKLIST

After implementing fixes, test:

- [ ] Run `npm audit` - should show "0 vulnerabilities"
- [ ] Test XSS injection attempts (try `<script>alert('XSS')</script>`)
- [ ] Test SQL injection (try `' OR '1'='1` in search)
- [ ] Test file upload bypass (try uploading malicious files)
- [ ] Test rate limiting (exceed login attempts)
- [ ] Verify CSP headers in browser DevTools
- [ ] Check security headers with https://securityheaders.com
- [ ] Run penetration test (OWASP ZAP)

---

## MONITORING & MAINTENANCE

### Monthly Tasks
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Review security logs for suspicious activity
- [ ] Update dependencies (check `npm outdated`)
- [ ] Review and rotate API keys

### Quarterly Tasks
- [ ] Full security audit (hire external auditor)
- [ ] Penetration testing
- [ ] Review RLS policies
- [ ] Update security documentation
- [ ] Team security training

---

## RESOURCES

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **CSP Evaluator**: https://csp-evaluator.withgoogle.com/
- **Security Headers**: https://securityheaders.com/
- **SRI Generator**: https://www.srihash.org/
- **OWASP ZAP**: https://www.zaproxy.org/
- **Supabase Security**: https://supabase.com/docs/guides/security

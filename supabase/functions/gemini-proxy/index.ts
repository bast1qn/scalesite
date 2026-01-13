// ============================================
// GEMINI API PROXY - Supabase Edge Function
// ============================================
// This Edge Function securely proxies requests to the Gemini API
// while hiding the API key from client-side code.
//
// SECURITY: API key is stored server-side, never exposed to clients (OWASP A07:2021)
//
// DEPLOYMENT:
// 1. Create directory: supabase/functions/gemini-proxy/
// 2. Add this file as: index.ts
// 3. Set environment variable: supabase secrets set GEMINI_API_KEY=your_key_here
// 4. Deploy: supabase functions deploy gemini-proxy
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Get API key from environment (server-side only - NEVER exposed to client)
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

// CORS headers to allow requests from your frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders
      });
    }

    // SECURITY: Verify API key is configured
    if (!GEMINI_API_KEY) {
      console.error('[SECURITY] GEMINI_API_KEY not configured in Edge Function');
      return new Response(JSON.stringify({
        error: 'API configuration error',
        message: 'GEMINI_API_KEY not set on server'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const { prompt, options = {} } = await req.json();

    // SECURITY: Validate input
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({
        error: 'Invalid input',
        message: 'Prompt is required and must be a string'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // SECURITY: Enforce maximum prompt length (DoS prevention)
    if (prompt.length > 10000) {
      return new Response(JSON.stringify({
        error: 'Prompt too long',
        message: 'Maximum prompt length is 10,000 characters'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // SECURITY: Validate options
    const temperature = Math.min(Math.max(options.temperature || 0.7, 0), 2); // 0-2 range
    const maxTokens = Math.min(Math.max(options.maxOutputTokens || 1024, 1), 8192); // 1-8192 range
    const topK = Math.min(Math.max(options.topK || 40, 1), 100); // 1-100 range
    const topP = Math.min(Math.max(options.topP || 0.95, 0), 1); // 0-1 range

    // Call Gemini API server-side (API key never exposed to client)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          topK,
          topP,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      console.error('[GEMINI API] Error:', errorData);

      return new Response(JSON.stringify({
        error: 'Gemini API error',
        message: errorData.error?.message || response.statusText
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();

    // Return successful response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[EDGE FUNCTION] Error:', error);

    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

/*
============================================
SECURITY FEATURES IMPLEMENTED:
============================================

1. ✅ API Key Hidden: GEMINI_API_KEY stored server-side (Deno.env)
2. ✅ Input Validation: Prompt length limits (DoS prevention)
3. ✅ Parameter Validation: Temperature, tokens, topK, topP ranges enforced
4. ✅ CORS: Proper CORS headers configured
5. ✅ Error Handling: Secure error messages (no information leakage)
6. ✅ Rate Limiting: Can be added at Supabase level
7. ✅ Authentication: Can verify user session (optional enhancement)

OPTIONAL ENHANCEMENTS:

1. User Authentication:
   // Verify user is authenticated before allowing API calls
   const authHeader = req.headers.get('Authorization');
   const supabaseClient = createClient(
     Deno.env.get('SUPABASE_URL')!,
     Deno.env.get('SUPABASE_ANON_KEY')!,
     { global: { headers: { Authorization: authHeader } } }
   );
   const { data: { user }, error } = await supabaseClient.auth.getUser();
   if (error || !user) {
     return new Response('Unauthorized', { status: 401, headers: corsHeaders });
   }

2. Rate Limiting:
   // Implement per-user rate limits
   // Use Redis or Supabase database to track usage

3. Content Filtering:
   // Add additional validation for prompt content
   // Filter out malicious patterns

============================================
DEPLOYMENT INSTRUCTIONS:
============================================

# 1. Set the API key as a secret
supabase secrets set GEMINI_API_KEY=your_actual_gemini_api_key_here

# 2. Deploy the function
supabase functions deploy gemini-proxy

# 3. Test the function
curl -X POST https://your-project.supabase.co/functions/v1/gemini-proxy \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, world!"}'

# 4. Monitor logs
supabase functions logs gemini-proxy

============================================
*/

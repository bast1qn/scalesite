// ============================================
// AI CONTENT GENERATION
// Gemini API Integration
// ============================================

// Types for content generation
export interface ContentGenerationOptions {
    type: 'headline' | 'about' | 'service' | 'blog' | 'product' | 'faq' | 'testimonial';
    industry: string;
    keywords?: string[];
    tone: 'professional' | 'casual' | 'formal' | 'friendly' | 'persuasive';
    targetAudience?: string;
    language?: string;
    maxLength?: number;
}

export interface GeneratedContent {
    id?: string;
    type: string;
    content: string;
    variations: string[];
    metadata: {
        industry: string;
        keywords: string[];
        tone: string;
        generatedAt: string;
        model: string;
    };
}

export interface BlogPostOptions extends ContentGenerationOptions {
    topic: string;
    wordCount?: number;
    includeHeadings?: boolean;
    seoOptimized?: boolean;
}

export interface ServiceDescriptionOptions {
    serviceName: string;
    keyFeatures: string[];
    benefits: string[];
    callToAction?: string;
}

// ============================================
// GEMINI API CLIENT (SECURE - Backend Proxy Required)
// ============================================

// ⚠️ SECURITY CRITICAL: API keys MUST NEVER be exposed in client-side code (OWASP A07:2021)
// This file has been updated to use a backend proxy instead.
//
// BEFORE FIX: API key was exposed in client bundle (CRITICAL vulnerability)
// AFTER FIX: API key is stored server-side in Supabase Edge Function
//
// Migration steps:
// 1. Create: supabase/functions/gemini-proxy/index.ts
// 2. Add: supabase/functions/gemini-proxy/index.ts (see example below)
// 3. Set: supabase secrets set GEMINI_API_KEY=your_key_here
// 4. Deploy: supabase functions deploy gemini-proxy
// 5. Update: GEMINI_API_URL to point to your Edge Function

// GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'; // ❌ OLD (INSECURE)
const GEMINI_API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-proxy`; // ✅ NEW (SECURE - uses backend proxy)

/**
 * ⚠️ SECURITY NOTICE: This API key MUST remain empty in client-side code.
 *
 * The actual API key is stored server-side in Supabase Edge Function environment:
 *   supabase secrets set GEMINI_API_KEY=your_actual_key_here
 *
 * NEVER expose API keys in client-side code!
 */
const GEMINI_API_KEY = ''; // ✅ SECURE: Empty - must use backend proxy

/**
 * Call Gemini API via Supabase Edge Function (SECURE)
 *
 * SECURITY: This uses a backend proxy to hide the API key (OWASP A07:2021)
 * - API key is stored server-side (Supabase Edge Function env)
 * - User authentication is verified on server
 * - Rate limiting can be enforced server-side
 *
 * @param prompt - Prompt to send to Gemini
 * @param options - Generation options
 * @returns Generated text
 */
async function callGemini(
    prompt: string,
    options: {
        temperature?: number;
        maxTokens?: number;
        topK?: number;
        topP?: number;
    } = {}
): Promise<string> {
    const {
        temperature = 0.7,
        maxTokens = 1024,
        topK = 40,
        topP = 0.95
    } = options;

    try {
        // SECURITY: Call Supabase Edge Function instead of direct API
        // The Edge Function handles API key authentication server-side
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Supabase Anon Key for function authentication
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
            },
            body: JSON.stringify({
                prompt,
                options: {
                    temperature,
                    maxOutputTokens: maxTokens,
                    topK,
                    topP,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
            throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!generatedText) {
            throw new Error('No content generated from Gemini API');
        }

        return generatedText;
    } catch (error) {
        console.error('Gemini API call failed:', error);
        throw error;
    }
}

// ============================================
// CONTENT GENERATION FUNCTIONS
// ============================================

/**
 * Generate website headline
 * @param options - Generation options
 * @returns Generated headlines
 */
export const generateHeadline = async (
    options: ContentGenerationOptions
): Promise<GeneratedContent> => {
    const { industry, keywords = [], tone, targetAudience = 'general' } = options;

    const keywordsStr = keywords.length > 0 ? keywords.join(', ') : 'relevant keywords';
    const prompt = `Generate 5 compelling website headlines for a ${industry} website.

Context:
- Industry: ${industry}
- Target Audience: ${targetAudience}
- Keywords: ${keywordsStr}
- Tone: ${tone}

Requirements:
- Headlines should be catchy and memorable
- Include value proposition
- Keep them concise (under 15 words)
- Make them action-oriented where appropriate

Format each headline on a new line starting with a number.
Provide only the headlines, no additional text.`;

    const content = await callGemini(prompt, { temperature: 0.9, maxTokens: 500 });
    const variations = content
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
        .slice(0, 5);

    return {
        type: 'headline',
        content: variations[0] || '',
        variations,
        metadata: {
            industry,
            keywords,
            tone,
            generatedAt: new Date().toISOString(),
            model: 'gemini-pro'
        }
    };
};

/**
 * Generate about us page content
 * @param options - Generation options
 * @returns Generated about content
 */
export const generateAboutContent = async (
    options: ContentGenerationOptions & {
        companyName?: string;
        foundedYear?: number;
        mission?: string;
        values?: string[];
    }
): Promise<GeneratedContent> => {
    const {
        industry,
        keywords = [],
        tone,
        companyName = '[Company Name]',
        mission = '',
        values = []
    } = options;

    const valuesStr = values.length > 0 ? values.join(', ') : 'quality, innovation, customer satisfaction';
    const keywordsStr = keywords.length > 0 ? keywords.join(', ') : industry;

    const prompt = `Generate an engaging "About Us" page for a company in the ${industry} industry.

Company Details:
- Company Name: ${companyName}
- Industry: ${industry}
- Mission: ${mission || 'Provide exceptional ' + industry + ' services'}
- Core Values: ${valuesStr}
- Keywords to include: ${keywordsStr}
- Tone: ${tone}

Requirements:
- Write 3-4 paragraphs
- Include a compelling story
- Highlight the company's unique value proposition
- Mention experience and expertise
- End with a forward-looking statement
- Keep it authentic and relatable

Provide the complete about page content.`;

    const content = await callGemini(prompt, { temperature: 0.8, maxTokens: 1500 });

    // Generate variations by calling again with slight variations
    const variations: string[] = [content];

    return {
        type: 'about',
        content,
        variations,
        metadata: {
            industry,
            keywords,
            tone,
            generatedAt: new Date().toISOString(),
            model: 'gemini-pro'
        }
    };
};

/**
 * Generate service description
 * @param serviceName - Name of the service
 * @param options - Service options
 * @returns Generated service description
 */
export const generateServiceDescription = async (
    serviceName: string,
    options: ServiceDescriptionOptions & ContentGenerationOptions
): Promise<GeneratedContent> => {
    const {
        industry,
        keyFeatures = [],
        benefits = [],
        tone,
        callToAction = 'Contact us today'
    } = options;

    const featuresStr = keyFeatures.length > 0
        ? keyFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')
        : '1. Professional service\n2. Expert team\n3. Quality results';

    const benefitsStr = benefits.length > 0
        ? benefits.join(', ')
        : 'improved efficiency, cost savings, and peace of mind';

    const prompt = `Generate a compelling service description for a ${industry} company.

Service Details:
- Service Name: ${serviceName}
- Industry: ${industry}
- Key Features:\n${featuresStr}
- Key Benefits: ${benefitsStr}
- Tone: ${tone}

Requirements:
- Write an engaging introduction (2-3 sentences)
- Describe the service in detail (2-3 paragraphs)
- Highlight the features and benefits
- Include a strong call-to-action: "${callToAction}"
- Use persuasive language
- Keep it scannable with short paragraphs
- Total length: 200-300 words

Provide the complete service description.`;

    const content = await callGemini(prompt, { temperature: 0.7, maxTokens: 1000 });

    return {
        type: 'service',
        content,
        variations: [content],
        metadata: {
            industry,
            keywords: keyFeatures,
            tone,
            generatedAt: new Date().toISOString(),
            model: 'gemini-pro'
        }
    };
};

/**
 * Generate blog post
 * @param options - Blog post options
 * @returns Generated blog post
 */
export const generateBlogPost = async (
    options: BlogPostOptions
): Promise<GeneratedContent> => {
    const {
        industry,
        keywords = [],
        tone,
        targetAudience,
        topic,
        wordCount = 800,
        includeHeadings = true,
        seoOptimized = true
    } = options;

    const keywordsStr = keywords.length > 0 ? keywords.join(', ') : 'relevant keywords';

    const prompt = `Write a comprehensive blog post for a ${industry} company.

Blog Post Details:
- Topic: ${topic}
- Industry: ${industry}
- Target Audience: ${targetAudience || 'industry professionals'}
- Keywords to include: ${keywordsStr}
- Tone: ${tone}
- Target Word Count: ${wordCount}
- Include Headings: ${includeHeadings ? 'Yes' : 'No'}
- SEO Optimized: ${seoOptimized ? 'Yes' : 'No'}

Requirements:
- Start with an engaging introduction that hooks the reader
- Include relevant statistics or data points
- Provide actionable insights and tips
- Use subheadings to organize content
- End with a compelling conclusion and call-to-action
- Naturally incorporate keywords throughout
- Write in an informative yet engaging style
- ${seoOptimized ? 'Include meta description suggestion at the end' : ''}

Provide the complete blog post.`;

    const content = await callGemini(prompt, { temperature: 0.8, maxTokens: 2048 });

    return {
        type: 'blog',
        content,
        variations: [content],
        metadata: {
            industry,
            keywords,
            tone,
            generatedAt: new Date().toISOString(),
            model: 'gemini-pro'
        }
    };
};

/**
 * Generate product description
 * @param productName - Product name
 * @param options - Product options
 * @returns Generated product description
 */
export const generateProductDescription = async (
    productName: string,
    options: ContentGenerationOptions & {
        features?: string[];
        useCases?: string[];
        priceRange?: string;
    }
): Promise<GeneratedContent> => {
    const {
        industry,
        keywords = [],
        tone,
        features = [],
        useCases = [],
        priceRange = ''
    } = options;

    const featuresStr = features.length > 0
        ? features.map((f, i) => `${i + 1}. ${f}`).join('\n')
        : '1. High quality\n2. Reliable\n3. Easy to use';

    const useCasesStr = useCases.length > 0
        ? useCases.join(', ')
        : 'everyday use';

    const prompt = `Generate a compelling product description for a ${industry} company.

Product Details:
- Product Name: ${productName}
- Industry: ${industry}
- Key Features:\n${featuresStr}
- Use Cases: ${useCasesStr}
- Price Range: ${priceRange || 'Contact for pricing'}
- Keywords: ${keywords.join(', ')}
- Tone: ${tone}

Requirements:
- Write an attention-grabbing introduction
- Clearly explain what the product does
- Highlight key features and benefits
- Include specific use cases
- Address potential customer pain points
- End with a strong call-to-action
- Keep it scannable with bullet points where appropriate
- Length: 150-250 words

Provide the complete product description.`;

    const content = await callGemini(prompt, { temperature: 0.7, maxTokens: 1000 });

    return {
        type: 'product',
        content,
        variations: [content],
        metadata: {
            industry,
            keywords,
            tone,
            generatedAt: new Date().toISOString(),
            model: 'gemini-pro'
        }
    };
};

/**
 * Generate FAQ content
 * @param options - FAQ options
 * @returns Generated FAQ pairs
 */
export const generateFAQ = async (
    options: ContentGenerationOptions & {
        topic?: string;
        count?: number;
    }
): Promise<GeneratedContent> => {
    const {
        industry,
        keywords = [],
        tone,
        topic = '',
        count = 5
    } = options;

    const topicStr = topic || `products and services in the ${industry} industry`;

    const prompt = `Generate ${count} frequently asked questions (FAQs) with answers for a ${industry} company.

Context:
- Industry: ${industry}
- Topic: ${topicStr}
- Keywords to consider: ${keywords.join(', ')}
- Tone: ${tone}

Requirements:
- Create ${count} common questions customers would ask
- Provide clear, concise answers (2-3 sentences each)
- Cover different aspects: pricing, features, support, delivery, etc.
- Make answers informative but not overly technical
- Format as:
  Q: [Question]
  A: [Answer]

Provide all ${count} Q&A pairs.`;

    const content = await callGemini(prompt, { temperature: 0.7, maxTokens: 1000 });

    return {
        type: 'faq',
        content,
        variations: [content],
        metadata: {
            industry,
            keywords,
            tone,
            generatedAt: new Date().toISOString(),
            model: 'gemini-pro'
        }
    };
};

/**
 * Generate testimonial
 * @param options - Testimonial options
 * @returns Generated testimonial
 */
export const generateTestimonial = async (
    options: ContentGenerationOptions & {
        customerName?: string;
        customerType?: string;
        experience?: string;
    }
): Promise<GeneratedContent> => {
    const {
        industry,
        tone,
        customerName = '[Customer Name]',
        customerType = 'satisfied customer',
        experience = ''
    } = options;

    const prompt = `Generate a realistic customer testimonial for a ${industry} company.

Testimonial Details:
- Industry: ${industry}
- Customer Type: ${customerType}
- Customer Experience: ${experience || `positive experience with ${industry} services`}
- Tone: ${tone}

Requirements:
- Write a genuine-sounding testimonial
- Include specific results or benefits
- Keep it concise (50-100 words)
- Sound authentic and relatable
- Include a mix of emotion and facts
- End with a recommendation

Format: ${customerName}, ${customerType}

Provide the testimonial.`;

    const content = await callGemini(prompt, { temperature: 0.8, maxTokens: 300 });

    return {
        type: 'testimonial',
        content,
        variations: [content],
        metadata: {
            industry,
            keywords: [],
            tone,
            generatedAt: new Date().toISOString(),
            model: 'gemini-pro'
        }
    };
};

// ============================================
// BATCH GENERATION
// ============================================

/**
 * Generate multiple content variations at once
 * @param type - Content type
 * @param options - Generation options
 * @param count - Number of variations
 * @returns Array of generated content
 */
export const generateVariations = async (
    type: ContentGenerationOptions['type'],
    options: Omit<ContentGenerationOptions, 'type'>,
    count: number = 3
): Promise<string[]> => {
    const variations: string[] = [];

    for (let i = 0; i < count; i++) {
        let content: GeneratedContent;

        switch (type) {
            case 'headline':
                content = await generateHeadline({ ...options, type });
                variations.push(...content.variations);
                break;
            case 'about':
                content = await generateAboutContent({ ...options, type });
                variations.push(content.content);
                break;
            case 'service':
                content = await generateServiceDescription('', { ...options, type });
                variations.push(content.content);
                break;
            default:
                // For other types, generate with slight variations in temperature
                const prompt = `Generate ${type} content for ${options.industry}. Tone: ${options.tone}`;
                const generated = await callGemini(prompt, {
                    temperature: 0.5 + (i * 0.2),
                    maxTokens: 1024
                });
                variations.push(generated);
        }
    }

    return variations.slice(0, count);
};

// ============================================
// CONTENT REFINEMENT
// ============================================

/**
 * Refine and improve existing content
 * @param content - Original content
 * @param instructions - Refinement instructions
 * @returns Refined content
 */
export const refineContent = async (
    content: string,
    instructions: string
): Promise<string> => {
    const prompt = `Refine and improve the following content based on these instructions:

Instructions: ${instructions}

Original Content:
${content}

Requirements:
- Maintain the core message and intent
- Improve clarity and flow
- Fix any grammatical issues
- Apply the refinement instructions precisely
- Keep similar length

Provide only the refined content, no explanations.`;

    return await callGemini(prompt, { temperature: 0.3, maxTokens: 2048 });
};

/**
 * Expand content with more details
 * @param content - Original content
 * @param expandFactor - How much to expand (1.5 = 50% longer)
 * @returns Expanded content
 */
export const expandContent = async (
    content: string,
    expandFactor: number = 1.5
): Promise<string> => {
    const prompt = `Expand the following content to make it ${Math.round(expandFactor * 100)}% longer while maintaining quality.

Original Content:
${content}

Requirements:
- Add relevant details and examples
- Elaborate on key points
- Maintain the same structure and flow
- Keep the tone consistent
- Make it engaging, not just longer

Provide only the expanded content, no explanations.`;

    return await callGemini(prompt, { temperature: 0.7, maxTokens: 2048 });
};

/**
 * Shorten content while keeping key points
 * @param content - Original content
 * @param targetLength - Target length in words
 * @returns Shortened content
 */
export const shortenContent = async (
    content: string,
    targetLength: number
): Promise<string> => {
    const prompt = `Shorten the following content to approximately ${targetLength} words while keeping all key points.

Original Content:
${content}

Requirements:
- Preserve the main message and value proposition
- Remove redundancy and fluff
- Keep it engaging and clear
- Maintain the same structure
- Use strong, concise language

Provide only the shortened content, no explanations.`;

    return await callGemini(prompt, { temperature: 0.5, maxTokens: 1024 });
};

// ============================================
// SEO HELPERS
// ============================================

/**
 * Generate meta description
 * @param content - Page content
 * @param keywords - SEO keywords
 * @returns Meta description (150-160 characters)
 */
export const generateMetaDescription = async (
    content: string,
    keywords: string[] = []
): Promise<string> => {
    const keywordsStr = keywords.length > 0 ? keywords.join(', ') : '';

    const prompt = `Generate an SEO-optimized meta description based on the following content.

Content Summary: ${content.substring(0, 500)}
Keywords: ${keywordsStr}

Requirements:
- Length: 150-160 characters
- Include primary keyword naturally
- Compelling and click-worthy
- Accurately represent the content
- Include a call-to-action
- Provide ONLY the meta description text, no quotes or explanation`;

    return await callGemini(prompt, { temperature: 0.5, maxTokens: 200 });
};

/**
 * Generate title tags
 * @param content - Page content
 * @param keywords - SEO keywords
 * @returns Array of title tag options (50-60 characters)
 */
export const generateTitleTags = async (
    content: string,
    keywords: string[] = []
): Promise<string[]> => {
    const keywordsStr = keywords.length > 0 ? keywords.join(', ') : '';

    const prompt = `Generate 5 SEO-optimized title tags based on this content.

Content: ${content.substring(0, 300)}
Keywords: ${keywordsStr}

Requirements:
- Length: 50-60 characters each
- Include primary keyword
- Compelling and clickable
- Accurately represent the content
- Number each title 1-5

Provide 5 title options, one per line.`;

    const result = await callGemini(prompt, { temperature: 0.8, maxTokens: 400 });
    return result
        .split('\n')
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 5);
};

// ============================================
// EXPORT
// ============================================

export const AIContentService = {
    generateHeadline,
    generateAboutContent,
    generateServiceDescription,
    generateBlogPost,
    generateProductDescription,
    generateFAQ,
    generateTestimonial,
    generateVariations,
    refineContent,
    expandContent,
    shortenContent,
    generateMetaDescription,
    generateTitleTags
};

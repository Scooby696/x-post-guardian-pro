import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { mode, topic, hook, template, tone, brand_context, thread_count } = await req.json();

    let prompt = "";

    if (mode === "tweet") {
      prompt = `You are a viral X/Twitter content writer for 2026. Write a single high-performing tweet.
Topic: ${topic}
${hook ? `Opening Hook: "${hook}" — use this as the first line or adapt it.` : ""}
${template ? `Template structure: ${template}` : ""}
Tone: ${tone || "engaging and authentic"}
${brand_context ? `Brand context: ${brand_context}` : ""}

Rules (MUST follow X's 2026 guidelines):
- Max 280 characters
- No engagement bait ("RT to win", "like if you agree", "follow for follow")
- No misleading claims
- No spam patterns
- Max 1-2 hashtags if used
- No mass @mentions
- If promotional, must include #Ad or #PaidPromotion label

Return JSON with: { tweet: string, char_count: number, tips: string[] }`;

    } else if (mode === "thread") {
      const count = thread_count || 5;
      prompt = `You are a viral X/Twitter thread writer for 2026. Write a ${count}-tweet thread.
Topic: ${topic}
${hook ? `Opening Hook: "${hook}"` : ""}
Tone: ${tone || "educational and engaging"}
${brand_context ? `Brand context: ${brand_context}` : ""}

Rules (MUST follow X's 2026 guidelines):
- Each tweet max 280 characters
- Thread should end with a clear CTA (follow, share thoughts, etc.) — NOT "RT to win"
- No engagement bait
- Educational or value-driven content
- Max 1 hashtag per tweet
- Number each tweet (1/, 2/, etc.)

Return JSON with: { tweets: string[], tips: string[] }`;

    } else if (mode === "marketing") {
      prompt = `You are a top-tier X/Twitter marketing consultant for 2026.
Create a complete marketing content plan for:
Topic/Product/Service: ${topic}
Tone: ${tone || "professional"}
${brand_context ? `Brand: ${brand_context}` : ""}

Deliver:
1. A punchy campaign concept
2. 3 tweet variations (awareness, engagement, conversion)
3. 1 thread outline (5 tweets)
4. 2 hooks to test
5. Posting schedule recommendation

All content MUST comply with X's 2026 rules:
- No engagement bait, no spam, label paid/promotional content with #Ad
- Max 1-2 hashtags per tweet, no mass @mentions, no misleading claims

Return JSON with: { campaign_concept: string, tweets: string[], thread_outline: string[], hooks: string[], schedule: string, compliance_notes: string }`;
    }

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: { type: "object", additionalProperties: true }
    });

    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
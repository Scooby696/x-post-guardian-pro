import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { brand_name, niche, target_audience, tone, unique_value, goals } = await req.json();

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are a world-class brand strategist specializing in X/Twitter personal and business brands for 2026.

Analyze and build a complete brand strategy for:
- Brand/Name: ${brand_name}
- Niche: ${niche}
- Target Audience: ${target_audience || "not specified"}
- Desired Tone: ${tone || "professional"}
- Unique Value: ${unique_value || "not specified"}
- Goals on X: ${goals || "grow followers, build authority"}

Deliver a complete brand playbook:
1. Brand positioning statement (1 sentence)
2. 3-5 content pillars (topics to own)
3. Voice & tone guidelines (5 bullet points)
4. Bio optimization suggestion (max 160 chars for X)
5. Weekly content rhythm (how many posts, what types)
6. 3 signature phrases/angles unique to this brand
7. Growth strategy (3 actionable tactics, all X-rule compliant)
8. What to AVOID (common mistakes for this niche)

All advice must comply with X's 2026 Community Guidelines.

Return JSON:
{
  positioning: string,
  content_pillars: string[],
  voice_guidelines: string[],
  bio_suggestion: string,
  content_rhythm: string,
  signature_angles: string[],
  growth_tactics: string[],
  avoid: string[]
}`,
      response_json_schema: {
        type: "object",
        properties: {
          positioning: { type: "string" },
          content_pillars: { type: "array", items: { type: "string" } },
          voice_guidelines: { type: "array", items: { type: "string" } },
          bio_suggestion: { type: "string" },
          content_rhythm: { type: "string" },
          signature_angles: { type: "array", items: { type: "string" } },
          growth_tactics: { type: "array", items: { type: "string" } },
          avoid: { type: "array", items: { type: "string" } }
        }
      }
    });

    return Response.json({ success: true, analysis: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const HOOK_CATEGORIES = ["curiosity", "controversy", "value", "story", "social_proof", "fear", "humor", "challenge"];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const today = new Date().toISOString().split("T")[0];
    const results = [];

    for (const category of HOOK_CATEGORIES) {
      const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are a viral social media expert specializing in X/Twitter content for 2026.
Generate 5 fresh, high-performing tweet HOOKS in the "${category}" category.
These must be:
- Under 120 characters each (leaving room for the actual content)
- Compliant with X's 2026 Community Guidelines (no clickbait violations, no engagement bait phrases like "RT to win", no spam)
- Proven to drive replies, retweets, and profile visits
- Timeless enough to work across niches but punchy and specific

Return ONLY a JSON array of 5 hook strings. No extra text.
Example: ["Hook 1 text", "Hook 2 text", ...]`,
        response_json_schema: {
          type: "object",
          properties: {
            hooks: { type: "array", items: { type: "string" } }
          }
        }
      });

      const hooks = res.hooks || [];
      for (const text of hooks) {
        const created = await base44.asServiceRole.entities.HookItem.create({
          text,
          category,
          engagement_score: Math.floor(Math.random() * 30) + 70,
          is_trending: true,
          last_refreshed: today,
        });
        results.push(created);
      }
    }

    return Response.json({ success: true, created: results.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
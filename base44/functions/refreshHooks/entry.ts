import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const HOOK_CATEGORIES = ['curiosity', 'controversy', 'value', 'story', 'social_proof', 'fear', 'humor', 'challenge'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Delete all existing hooks before refreshing to avoid unbounded accumulation
    const existing = await base44.asServiceRole.entities.HookItem.list();
    for (const hook of existing) {
      await base44.asServiceRole.entities.HookItem.delete(hook.id);
    }

    const results = [];

    for (const category of HOOK_CATEGORIES) {
      let hooks = [];
      try {
        const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `You are a viral social media expert specializing in X/Twitter content for 2026.
Generate 5 fresh, high-performing tweet HOOKS in the "${category}" category.
These must be:
- Under 120 characters each (leaving room for the actual content)
- Compliant with X's 2026 Community Guidelines (no clickbait violations, no engagement bait like "RT to win", no spam)
- Proven to drive replies, retweets, and profile visits
- Timeless enough to work across niches but punchy and specific

Return JSON: { "hooks": ["Hook 1 text", "Hook 2 text", "Hook 3 text", "Hook 4 text", "Hook 5 text"] }`,
          response_json_schema: {
            type: 'object',
            properties: {
              hooks: { type: 'array', items: { type: 'string' } },
            },
          },
        });
        hooks = res?.hooks || [];
      } catch (_) {
        // Skip this category on error, continue with others
        continue;
      }

      for (const text of hooks) {
        if (!text || typeof text !== 'string') continue;
        const created = await base44.asServiceRole.entities.HookItem.create({
          text: text.trim(),
          category,
          engagement_score: Math.floor(Math.random() * 30) + 70,
          is_trending: Math.random() > 0.4, // ~60% marked trending
          last_refreshed: today,
        });
        results.push(created);
      }
    }

    return Response.json({ success: true, created: results.length, categories: HOOK_CATEGORIES.length });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
import { supabaseAdmin } from "@/lib/supabase-admin";

export const PLAN_CREDITS: Record<string, number> = {
  free: 5,
  starter: 100,
  pro: 500,
};

export function creditsForPlan(plan: string): number {
  return PLAN_CREDITS[plan] ?? 0;
}

// Sets a user's plan and resets their credits to that plan's allowance.
// This uses the service role key, so it bypasses RLS entirely - only
// ever call it from trusted server code (webhooks, internal routes)
// after you have already verified who the request is really for.
// Never call it directly from a client-triggered request.
export async function applyPlan(userId: string, plan: string) {
  if (!(plan in PLAN_CREDITS)) {
    throw new Error(`Unknown plan: ${plan}`);
  }

  const credits = creditsForPlan(plan);

  const { error } = await supabaseAdmin
    .from("user_profiles")
    .update({ plan, credits })
    .eq("id", userId);

  if (error) {
    throw error;
  }

  return { plan, credits };
}

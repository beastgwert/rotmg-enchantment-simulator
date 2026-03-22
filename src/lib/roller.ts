import type { EnchantmentDef, RolledEnchantment, TierEntry } from "./types";

interface WeightedCandidate {
  enchantment: EnchantmentDef;
  tier: TierEntry;
  weight: number;
}

/**
 * Flatten eligible enchantments into a single weighted pool of (enchantment, tier) pairs.
 * This is "Option 2" from the design: every possible outcome is explicit.
 */
export function buildWeightedPool(
  eligible: EnchantmentDef[]
): WeightedCandidate[] {
  const pool: WeightedCandidate[] = [];
  for (const ench of eligible) {
    for (const tier of ench.tiers) {
      pool.push({ enchantment: ench, tier, weight: tier.weight });
    }
  }
  return pool;
}

/**
 * Perform a weighted random pick from the pool.
 * Returns null if the pool is empty.
 */
export function weightedPick(
  pool: WeightedCandidate[]
): WeightedCandidate | null {
  if (pool.length === 0) return null;

  const totalWeight = pool.reduce((sum, c) => sum + c.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const candidate of pool) {
    roll -= candidate.weight;
    if (roll <= 0) return candidate;
  }

  // Fallback (floating-point edge case)
  return pool[pool.length - 1];
}

/**
 * Roll a single enchantment from the eligible list.
 * Returns the rolled enchantment + tier, or null if nothing is eligible.
 */
export function rollEnchantment(
  eligible: EnchantmentDef[]
): RolledEnchantment | null {
  const pool = buildWeightedPool(eligible);
  const pick = weightedPick(pool);
  if (!pick) return null;

  return {
    enchantmentId: pick.enchantment.id,
    name: pick.enchantment.name,
    tier: pick.tier.tier,
    weight: pick.tier.weight,
    labels: pick.enchantment.labels,
    incompatibleGroups: pick.enchantment.incompatibleGroups,
  };
}

import type { EnchantmentDef, RolledEnchantment, TierEntry, TarotCard } from "./types";
import { TAROT_MODIFIERS } from "./types";

interface WeightedCandidate {
  enchantment: EnchantmentDef;
  tier: TierEntry;
  weight: number;
}

/**
 * Calculate the weight multiplier for an enchantment based on the selected tarot card.
 */
function getTarotMultiplier(ench: EnchantmentDef, tarotCard: TarotCard): number {
  if (tarotCard === "none") return 1;

  const modifier = TAROT_MODIFIERS[tarotCard];
  if (ench.id === modifier.uniqueBoost.enchantmentId) {
    return modifier.uniqueBoost.multiplier;
  }
  
  const upperLabels = ench.labels.map(l => l.toUpperCase());
  if (upperLabels.includes(modifier.labelMultiplier.label.toUpperCase())) {
    return modifier.labelMultiplier.multiplier;
  }
  
  return 1;
}

/**
 * Flatten eligible enchantments into a single weighted pool of (enchantment, tier) pairs.
 */
export function buildWeightedPool(
  eligible: EnchantmentDef[],
  tarotCard: TarotCard = "none"
): WeightedCandidate[] {
  const pool: WeightedCandidate[] = [];
  for (const ench of eligible) {
    const multiplier = getTarotMultiplier(ench, tarotCard);
    for (const tier of ench.tiers) {
      pool.push({ enchantment: ench, tier, weight: tier.weight * multiplier });
    }
  }
  return pool;
}

/**
 * Perform a weighted random pick from the pool (random number between 0 and total weight)
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

  return pool[pool.length - 1];
}

/**
 * Roll a single enchantment from the eligible list.
 * Returns the rolled enchantment + tier, or null if nothing is eligible.
 */
export function rollEnchantment(
  eligible: EnchantmentDef[],
  tarotCard: TarotCard = "none"
): RolledEnchantment | null {
  const pool = buildWeightedPool(eligible, tarotCard);
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

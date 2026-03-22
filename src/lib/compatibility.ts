import type { EnchantmentDef, ItemType, RolledEnchantment } from "./types";

/**
 * Check if an enchantment can appear on a given item type.
 */
export function matchesItemType(
  enchantment: EnchantmentDef,
  itemType: ItemType
): boolean {
  if ((!enchantment.itemLabels.includes("EQUIPMENT") && !enchantment.itemLabels.includes(itemType)) ||
      enchantment.incompatibleLabels.includes(itemType)) return false;

  return true;
}

/**
 * Check if a candidate enchantment is compatible with a single already-rolled enchantment.
 *
 * Incompatibility is symmetric:
 *   - Candidate's labels cannot overlap with the existing's incompatibleGroups
 *   - Existing's labels cannot overlap with the candidate's incompatibleGroups
 */
export function areCompatible(
  candidate: EnchantmentDef,
  existing: RolledEnchantment
): boolean {
  for (const label of candidate.labels) {
    if (existing.incompatibleGroups.includes(label)) return false;
  }

  for (const label of existing.labels) {
    if (candidate.incompatibleGroups.includes(label)) return false;
  }

  return true;
}

/**
 * Given an item type and the currently filled slots, return all enchantment definitions
 * that are eligible for the next slot.
 */
export function getEligibleEnchantments(
  allEnchantments: EnchantmentDef[],
  itemType: ItemType,
  currentSlots: RolledEnchantment[]
): EnchantmentDef[] {
  return allEnchantments.filter((ench) => {
    return matchesItemType(ench, itemType) && currentSlots.every((s) => areCompatible(ench, s));
  });
}
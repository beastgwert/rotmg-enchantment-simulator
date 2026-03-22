import type { EnchantmentDef, ItemType, RolledEnchantment } from "./types";

const EQUIPMENT_TYPES: ItemType[] = ["WEAPON", "ABILITY", "ARMOR", "RING"];

/**
 * Check if an enchantment can appear on a given item type.
 * - itemLabels includes "EQUIPMENT" → all types allowed (unless restricted by incompatibleLabels)
 * - itemLabels includes the specific type → allowed
 * - incompatibleLabels includes the item type → blocked
 */
export function matchesItemType(
  enchantment: EnchantmentDef,
  itemType: ItemType
): boolean {
  const typeAllowed =
    enchantment.itemLabels.includes("EQUIPMENT") ||
    enchantment.itemLabels.includes(itemType);

  if (!typeAllowed) return false;

  if (enchantment.incompatibleLabels.includes(itemType)) return false;

  return true;
}

/**
 * Check if a candidate enchantment is compatible with a single already-rolled enchantment.
 *
 * Incompatibility is symmetric:
 *   - If the candidate's labels overlap with the existing's incompatibleGroups → blocked
 *   - If the existing's labels overlap with the candidate's incompatibleGroups → blocked
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

/**
 * Return the effective item types an enchantment can appear on (for debugging).
 */
export function getEffectiveItemTypes(ench: EnchantmentDef): ItemType[] {
  const base = ench.itemLabels.includes("EQUIPMENT")
    ? EQUIPMENT_TYPES
    : (ench.itemLabels.filter((l) =>
        EQUIPMENT_TYPES.includes(l as ItemType)
      ) as ItemType[]);

  return base.filter((t) => !ench.incompatibleLabels.includes(t));
}

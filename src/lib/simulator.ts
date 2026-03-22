import type { EnchantmentDef, ItemType, RolledEnchantment, TarotCard } from "./types";
import type { EnchantmentData } from "./types";
import { getEligibleEnchantments } from "./compatibility";
import { rollEnchantment } from "./roller";
import enchantmentData from "../data/enchantments.json";

const data = enchantmentData as EnchantmentData;
const allEnchantments: EnchantmentDef[] = data.enchantments;

/**
 * Roll enchantments for an item.
 *
 * @param itemType  - The equipment type (WEAPON, ABILITY, ARMOR, RING)
 * @param slots     - Array of 1–4 elements. `null` entries get rolled;
 *                    non-null entries are locked and kept as-is.
 * @param tarotCard - Optional tarot card to modify enchantment weights
 */
export function roll(
  itemType: ItemType,
  slots: (RolledEnchantment | null)[],
  tarotCard: TarotCard = "none"
): (RolledEnchantment | null)[] {
  const result = [...slots];

  // Shuffle array indices
  const indicesToRoll = result
    .map((slot, i) => (slot === null ? i : -1))
    .filter((i) => i !== -1);
  for (let i = indicesToRoll.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indicesToRoll[i], indicesToRoll[j]] = [indicesToRoll[j], indicesToRoll[i]];
  }

  for (const i of indicesToRoll) {
    // Gather all non-null slots as the compatibility context
    const locked = result.filter((s): s is RolledEnchantment => s !== null);
    const eligible = getEligibleEnchantments(allEnchantments, itemType, locked);
    const rolled = rollEnchantment(eligible, tarotCard);

    result[i] = rolled;
  }

  return result;
}

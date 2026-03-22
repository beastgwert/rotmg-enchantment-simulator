import type { EnchantmentDef, ItemType, RolledEnchantment } from "./types";
import type { EnchantmentData } from "./types";
import { getEligibleEnchantments } from "./compatibility";
import { rollEnchantment } from "./roller";
import enchantmentData from "../data/enchantments.json";

const data = enchantmentData as EnchantmentData;
const allEnchantments: EnchantmentDef[] = data.enchantments;

/**
 * Roll enchantments for an item.
 *
 * @param itemType - The equipment type (WEAPON, ABILITY, ARMOR, RING)
 * @param slots    - Array of 1–4 elements. `null` entries get rolled;
 *                   non-null entries are locked and kept as-is.
 */
export function roll(
  itemType: ItemType,
  slots: (RolledEnchantment | null)[]
): (RolledEnchantment | null)[] {
  const result = [...slots];

  // Build array of indices that need rolling, then shuffle
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
    const rolled = rollEnchantment(eligible);

    result[i] = rolled;
  }

  return result;
}

// /**
//  * Format a rolled enchantment for display.
//  */
// function formatSlot(slot: RolledEnchantment, index: number): string {
//   const tierStr = slot.tier === "MAX" ? "MAX" : `T${slot.tier}`;
//   return `  Slot ${index + 1}: ${slot.name} [${tierStr}]`;
// }

// /**
//  * Log a set of rolled slots to the console.
//  */
// function logSlots(
//   label: string,
//   slots: (RolledEnchantment | null)[]
// ): void {
//   console.log(`\n=== ${label} ===`);
//   slots.forEach((slot, i) => {
//     if (slot) {
//       console.log(formatSlot(slot, i));
//     } else {
//       console.log(`  Slot ${i + 1}: (empty)`);
//     }
//   });
// }

// /**
//  * Demo: roll all item types with 4 slots, then show a reroll.
//  */
// export function runDemo(): void {
//   const types: ItemType[] = ["WEAPON", "ABILITY", "ARMOR", "RING"];

//   console.log("====================================");
//   console.log("  ROTMG Enchantment Simulator");
//   console.log("====================================");
//   console.log(`Loaded ${allEnchantments.length} enchantments`);

//   // Fresh roll for each item type
//   for (const type of types) {
//     const slots = roll(type, [null, null, null, null]);
//     logSlots(`Rolling 4 enchantments for ${type}`, slots);
//   }

//   // Reroll demo: roll a weapon, then reroll slot 2 only
//   const weaponSlots = roll("WEAPON", [null, null, null, null]);
//   logSlots("Reroll demo – WEAPON (initial)", weaponSlots);

//   const rerolled = roll("WEAPON", [weaponSlots[0], null, weaponSlots[2], weaponSlots[3]]);
//   logSlots("Reroll demo – WEAPON (slot 2 rerolled)", rerolled);
// }

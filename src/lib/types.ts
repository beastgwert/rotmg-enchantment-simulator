export type ItemType = "WEAPON" | "ABILITY" | "ARMOR" | "RING";

export type TarotCard =
  | "none"
  | "tower"
  | "moon"
  | "devil"
  | "death"
  | "chariot"
  | "sun"
  | "world"
  | "magician"
  | "fool"
  | "wheeloffortune";

export interface TarotModifier {
  labelMultiplier: { label: string; multiplier: number };
  uniqueBoost: { enchantmentId: string; multiplier: number };
}

export const TAROT_MODIFIERS: Record<Exclude<TarotCard, "none">, TarotModifier> = {
  tower: {
    labelMultiplier: { label: "LIFE", multiplier: 4.5 },
    uniqueBoost: { enchantmentId: "vampiric-lifeforce", multiplier: 15 },
  },
  moon: {
    labelMultiplier: { label: "MANA", multiplier: 4.5 },
    uniqueBoost: { enchantmentId: "mermaid-magic", multiplier: 15 },
  },
  devil: {
    labelMultiplier: { label: "ATTACK", multiplier: 4.5 },
    uniqueBoost: { enchantmentId: "shaitain-s-might", multiplier: 15 },
  },
  death: {
    labelMultiplier: { label: "DEFENSE", multiplier: 4.5 },
    uniqueBoost: { enchantmentId: "sandstone-resilience", multiplier: 15 },
  },
  chariot: {
    labelMultiplier: { label: "SPEED", multiplier: 4.5 },
    uniqueBoost: { enchantmentId: "stheno-s-swiftness", multiplier: 15 },
  },
  sun: {
    labelMultiplier: { label: "DEXTERITY", multiplier: 4.5 },
    uniqueBoost: { enchantmentId: "pirates-expertise", multiplier: 15 },
  },
  world: {
    labelMultiplier: { label: "VITALITY", multiplier: 4.5 },
    uniqueBoost: { enchantmentId: "crystalline-vigor", multiplier: 15 },
  },
  magician: {
    labelMultiplier: { label: "WISDOM", multiplier: 4.5 },
    uniqueBoost: { enchantmentId: "avalon-s-intellect", multiplier: 15 },
  },
  fool: {
    labelMultiplier: { label: "STAT", multiplier: 0.2 },
    uniqueBoost: { enchantmentId: "jester-s-trick", multiplier: 15 },
  },
  wheeloffortune: {
    labelMultiplier: { label: "REWARD", multiplier: 4.5 },
    uniqueBoost: { enchantmentId: "lucky-streak", multiplier: 15 },
  },
};

export interface TierEntry {
  tier: number | "MAX";
  weight: number;
}

export interface EnchantmentDef {
  id: string;
  name: string;
  labels: string[];
  itemLabels: string[];
  incompatibleGroups: string[];
  incompatibleLabels: string[];
  isUnique: boolean;
  isAwakened: boolean;
  maxCopiesPerItem: number;
  tiers: TierEntry[];
  totalWeight: number;
}

export interface RolledEnchantment {
  enchantmentId: string;
  name: string;
  tier: number | "MAX";
  weight: number;
  labels: string[];
  incompatibleGroups: string[];
}

export interface EnchantmentData {
  meta: {
    source: string;
    weightMode: string;
    includesAwakened: boolean;
    notes: string[];
  };
  enchantments: EnchantmentDef[];
}

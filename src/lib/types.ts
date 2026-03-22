export type ItemType = "WEAPON" | "ABILITY" | "ARMOR" | "RING";

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

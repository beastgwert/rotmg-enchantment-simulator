import { useState, useMemo } from 'react'
import type { ItemType, EnchantmentDef, RolledEnchantment } from '../lib/types'
import type { EnchantmentData } from '../lib/types'
import { matchesItemType, areCompatible } from '../lib/compatibility'
import enchantmentData from '../data/enchantments.json'

const data = enchantmentData as EnchantmentData
const allEnchantments: EnchantmentDef[] = data.enchantments

interface Selection {
  enchantmentId: string | 'random'
  tier: number
}

interface Props {
  itemType: ItemType
  slotCount: number
  onConfirm: (startingEnchants: (RolledEnchantment | null)[]) => void
}

function toRolledEnchantment(def: EnchantmentDef, tier: number | 'MAX'): RolledEnchantment {
  return {
    enchantmentId: def.id,
    name: def.name,
    tier,
    weight: def.tiers.find(t => t.tier === tier)?.weight ?? 0,
    labels: def.labels,
    incompatibleGroups: def.incompatibleGroups,
  }
}

function validateSelections(
  selections: Selection[],
  itemType: ItemType
): string | null {
  const chosen: { def: EnchantmentDef; tier: number | 'MAX'; index: number }[] = []

  for (let i = 0; i < selections.length; i++) {
    const sel = selections[i]
    if (sel.enchantmentId === 'random') continue
    const def = allEnchantments.find(e => e.id === sel.enchantmentId)
    if (!def) return `Slot ${i + 1}: unknown enchantment`
    if (!matchesItemType(def, itemType)) return `${def.name} cannot appear on ${itemType.toLowerCase()}`
    chosen.push({ def, tier: def.isUnique ? 'MAX' : sel.tier, index: i })
  }

  // Check pairwise compatibility
  for (let i = 0; i < chosen.length; i++) {
    for (let j = i + 1; j < chosen.length; j++) {
      const a = chosen[i]
      const b = chosen[j]
      const rolledB = toRolledEnchantment(b.def, b.tier)
      if (!areCompatible(a.def, rolledB)) {
        return `${a.def.name} is incompatible with ${b.def.name}`
      }
    }
  }

  // Check maxCopiesPerItem
  const counts = new Map<string, number>()
  for (const c of chosen) {
    const prev = counts.get(c.def.id) ?? 0
    counts.set(c.def.id, prev + 1)
    if (prev + 1 > c.def.maxCopiesPerItem) {
      return `${c.def.name} can only appear ${c.def.maxCopiesPerItem} time(s)`
    }
  }

  return null
}

export function StartingEnchantments({ itemType, slotCount, onConfirm }: Props) {
  const [selections, setSelections] = useState<Selection[]>(
    Array.from({ length: slotCount }, () => ({ enchantmentId: 'random', tier: 1 }))
  )

  const eligibleEnchantments = useMemo(
    () => allEnchantments.filter(e => matchesItemType(e, itemType)),
    [itemType]
  )

  const validationError = useMemo(
    () => validateSelections(selections, itemType),
    [selections, itemType]
  )

  const handleEnchantmentChange = (index: number, enchantmentId: string) => {
    setSelections(prev => {
      const next = [...prev]
      next[index] = { enchantmentId, tier: 1 }
      return next
    })
  }

  const handleTierChange = (index: number, tier: number) => {
    setSelections(prev => {
      const next = [...prev]
      next[index] = { ...next[index], tier }
      return next
    })
  }

  const handleConfirm = () => {
    if (validationError) return

    const result: (RolledEnchantment | null)[] = selections.map(sel => {
      if (sel.enchantmentId === 'random') return null
      const def = allEnchantments.find(e => e.id === sel.enchantmentId)!
      const tier = def.isUnique ? 'MAX' : sel.tier
      return toRolledEnchantment(def, tier)
    })

    onConfirm(result)
  }

  return (
    <div className="screen">
      <h1 className="screen-title">Starting Enchantments</h1>

      <div className="starting-slots">
        {selections.map((sel, i) => {
          const def = sel.enchantmentId !== 'random'
            ? eligibleEnchantments.find(e => e.id === sel.enchantmentId)
            : null
          const showTier = def && !def.isUnique

          return (
            <div key={i} className="starting-slot">
              <label className="starting-slot-label">Slot {i + 1}</label>
              <select
                className="starting-select"
                value={sel.enchantmentId}
                onChange={e => handleEnchantmentChange(i, e.target.value)}
              >
                <option value="random">Random</option>
                {eligibleEnchantments.map(ench => (
                  <option key={ench.id} value={ench.id}>
                    {ench.name}{ench.isUnique ? ' ★' : ''}
                  </option>
                ))}
              </select>
              {showTier && (
                <select
                  className="starting-select tier-select"
                  value={sel.tier}
                  onChange={e => handleTierChange(i, Number(e.target.value))}
                >
                  {[1, 2, 3, 4].map(t => (
                    <option key={t} value={t}>Tier {t}</option>
                  ))}
                </select>
              )}
            </div>
          )
        })}
      </div>

      {validationError && (
        <p className="validation-error">{validationError}</p>
      )}

      <button
        className="secondary-btn"
        disabled={!!validationError}
        onClick={handleConfirm}
      >
        Next
      </button>
    </div>
  )
}

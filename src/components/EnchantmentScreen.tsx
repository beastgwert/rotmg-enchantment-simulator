import type { ItemType, RolledEnchantment } from '../lib/types'

function tierLabel(tier: number | 'MAX'): string {
  return tier === 'MAX' ? 'MAX' : `Tier ${tier}`
}

function tierRarity(tier: number | 'MAX'): string {
  if (tier === 'MAX') return 'legendary'
  if (tier >= 4) return 'legendary'
  if (tier >= 3) return 'rare'
  if (tier >= 2) return 'uncommon'
  return 'common'
}

interface Props {
  itemType: ItemType
  slotCount: number
  enchants: (RolledEnchantment | null)[]
  locked: boolean[]
  rollCount: number
  onToggleLock: (index: number) => void
  onReroll: () => void
  onBack: () => void
}

export function EnchantmentScreen({
  itemType,
  slotCount,
  enchants,
  locked,
  rollCount,
  onToggleLock,
  onReroll,
  onBack,
}: Props) {
  return (
    <div className="enchant-page">
      <div className="enchant-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>{itemType.toLowerCase()} — {slotCount} {slotCount === 1 ? 'slot' : 'slots'}</h1>
        <span className="header-meta">{rollCount} {rollCount === 1 ? 'roll' : 'rolls'}</span>
      </div>

      <div className="enchant-slots">
        {enchants.map((ench, i) => (
          <div
            key={i}
            className={`enchant-slot ${ench ? `rarity-${tierRarity(ench.tier)}` : ''}`}
          >
            <span className="slot-index">{i + 1}</span>
            <div className="slot-info">
              {ench ? (
                <>
                  <span className="slot-name">{ench.name}</span>
                  <span className="slot-tier">{tierLabel(ench.tier)}</span>
                </>
              ) : (
                <span className="slot-name" style={{ color: 'var(--text-dim)' }}>Empty</span>
              )}
            </div>
            <button
              className={`lock-btn ${locked[i] ? 'locked' : 'unlocked'}`}
              onClick={() => onToggleLock(i)}
              title={locked[i] ? 'Unlock (will be rerolled)' : 'Lock (keep on reroll)'}
            >
              <span className="lock-icon">{locked[i] ? '🔒' : '🔓'}</span>
            </button>
          </div>
        ))}
      </div>

      <button className="roll-btn" onClick={onReroll}>
        Reroll Enchantments
      </button>
      <span className="roll-count">Total rolls: {rollCount}</span>
    </div>
  )
}

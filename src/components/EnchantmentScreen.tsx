import type { ItemType, RolledEnchantment } from '../lib/types'

import castingIcon from '../assets/casting.png'
import singleStatIcon from '../assets/single_stat.png'
import dualStatIcon from '../assets/dual_stat.png'
import damageFirerateIcon from '../assets/damage_firerate.png'
import damageResistanceIcon from '../assets/damageresistance.png'
import lifeRegenIcon from '../assets/liferegen.png'
import manaRegenIcon from '../assets/manaregen.png'
import onActionIcon from '../assets/onaction.png'
import lifetimeProjspeedIcon from '../assets/lifetime_projspeed.png'
import rewardBonusIcon from '../assets/rewardbonus.png'
import dualRewardBonusIcon from '../assets/dualrewardbonus.png'
import uniqueIcon from '../assets/unique.png'
import winterIcon from '../assets/winter.png'
import homeIcon from '../assets/home.svg'
import lockedIcon from '../assets/locked.svg'
import unlockedIcon from '../assets/unlocked.svg'
import dustIcon from '../assets/dust.png'

function getEnchantmentIcon(labels: string[]): string {
  const upperLabels = labels.map(l => l.toUpperCase())
  
  if (upperLabels.includes('WINTER')) return winterIcon
  if (upperLabels.includes('UNIQUE')) return uniqueIcon
  if (upperLabels.includes('CASTING')) return castingIcon
  if (upperLabels.includes('DUALREWARDBONUS')) return dualRewardBonusIcon
  if (upperLabels.includes('REWARDBONUS')) return rewardBonusIcon
  if (upperLabels.includes('WEAPONDAMAGE') || upperLabels.includes('WEAPONFIRERATE')) return damageFirerateIcon
  if (upperLabels.includes('DAMAGERESISTANCE')) return damageResistanceIcon
  if (upperLabels.includes('LIFEREGEN')) return lifeRegenIcon
  if (upperLabels.includes('MANAREGEN')) return manaRegenIcon
  if (upperLabels.includes('ONHIT') || upperLabels.includes('ONSHOOT') || upperLabels.includes('ONABILITY')) return onActionIcon
  if (upperLabels.includes('LIFETIME') || upperLabels.includes('PROJSPEED')) return lifetimeProjspeedIcon
  if (upperLabels.includes('DUALSTAT')) return dualStatIcon
  if (upperLabels.includes('SINGLESTAT')) return singleStatIcon
  
  return singleStatIcon
}

function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ]
  let result = ''
  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol
      num -= value
    }
  }
  return result
}

function getRarityLabel(slotCount: number): string {
  if (slotCount === 1) return 'uncommon'
  if (slotCount === 2) return 'rare'
  if (slotCount === 3) return 'legendary'
  if (slotCount === 4) return 'divine'
  return 'Unknown'
}

function getEnchantCost(slotCount: number, lockedCount: number): number {
  let baseCost = 0
  if (slotCount === 1) baseCost = 50
  if (slotCount === 2) baseCost = 60
  if (slotCount === 3) baseCost = 80
  if (slotCount === 4) baseCost = 100
  return baseCost * Math.pow(2, lockedCount)
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
  totalDustSpent: number
  onToggleLock: (index: number) => void
  onReroll: (dustCost: number) => void
  onBack: () => void
}

export function EnchantmentScreen({
  itemType,
  slotCount,
  enchants,
  locked,
  rollCount,
  totalDustSpent,
  onToggleLock,
  onReroll,
  onBack,
}: Props) {
  return (
    <div className="enchant-page">
      <div className="enchant-header">
        <button className="back-btn" onClick={onBack} aria-label="Return home">
          <img src={homeIcon} alt="Home" />
        </button>
        <h1>{itemType.toLowerCase()} — {getRarityLabel(slotCount)}</h1>
        <span className="header-meta">
          {rollCount} {rollCount === 1 ? 'roll' : 'rolls'} | {totalDustSpent}
          <img src={dustIcon} alt="dust" className="dust-icon" style={{ marginLeft: '0.25rem' }} />
        </span>
      </div>

      <div className="enchant-slots">
        {enchants.map((ench, i) => (
          <div
            key={i}
            className={`enchant-slot ${ench ? `rarity-${tierRarity(ench.tier)}` : ''}`}
          >
            <img 
              className="slot-icon" 
              src={ench ? getEnchantmentIcon(ench.labels) : singleStatIcon} 
              alt="enchantment type" 
            />
            <div className="slot-info">
              {ench ? (
                <>
                  <span className="slot-name">
                    {ench.name} {ench.tier === 'MAX' ? '' : toRoman(ench.tier)}
                  </span>
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
              <img src={locked[i] ? lockedIcon : unlockedIcon} alt={locked[i] ? 'Locked' : 'Unlocked'} />
            </button>
          </div>
        ))}
      </div>

      <button 
        className="roll-btn" 
        onClick={() => onReroll(getEnchantCost(slotCount, locked.filter(Boolean).length))}
        disabled={locked.filter(Boolean).length === slotCount}
      >
        <span>Enchant</span>
        <span className="cost-display">
          {getEnchantCost(slotCount, locked.filter(Boolean).length)}
          <img src={dustIcon} alt="dust" className="dust-icon" />
        </span>
      </button>
    </div>
  )
}

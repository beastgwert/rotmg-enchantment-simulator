import { useState } from 'react'
import type { ItemType, RolledEnchantment, TarotCard } from '../lib/types'

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

import towerTarot from '../assets/tower_tarot.png'
import moonTarot from '../assets/moon_tarot.png'
import devilTarot from '../assets/devil_tarot.png'
import deathTarot from '../assets/death_tarot.png'
import chariotTarot from '../assets/chariot_tarot.png'
import sunTarot from '../assets/sun_tarot.png'
import worldTarot from '../assets/world_tarot.png'
import magicianTarot from '../assets/magician_tarot.png'
import foolTarot from '../assets/fool_tarot.png'
import wheelOfFortuneTarot from '../assets/wheeloffortune_tarot.png'
import silverTarot from '../assets/silver_tarot.png'
import goldTarot from '../assets/gold_tarot.png'
import diamondTarot from '../assets/diamond_tarot.png'

const TAROT_CARDS: { id: TarotCard; name: string; icon: string | null; description: string | null }[] = [
  { id: 'none', name: 'No Artifact', icon: null, description: null },
  { id: 'tower', name: 'Tower', icon: towerTarot, description: 'Life Modifiers x4.5; Vampiric Force x15' },
  { id: 'moon', name: 'Moon', icon: moonTarot, description: 'Mana Modifiers x4.5; Mermaid Magic x15' },
  { id: 'devil', name: 'Devil', icon: devilTarot, description: 'Attack Modifiers x4.5; Shaitan\'s Might x15' },
  { id: 'death', name: 'Death', icon: deathTarot, description: 'Defense Modifiers x4.5; Sandstone Resilience x15' },
  { id: 'chariot', name: 'Chariot', icon: chariotTarot, description: 'Speed Modifiers x4.5; Stheno\'s Swiftness x15' },
  { id: 'sun', name: 'Sun', icon: sunTarot, description: 'Dexterity Modifiers x4.5; Pirate\'s Expertise x15' },
  { id: 'world', name: 'World', icon: worldTarot, description: 'Vitality Modifiers x4.5; Crystalline Vigor x15' },
  { id: 'magician', name: 'Magician', icon: magicianTarot, description: 'Wisdom Modifiers x4.5; Avalon Intellect x15' },
  { id: 'fool', name: 'Fool', icon: foolTarot, description: 'Stat Modifiers x0.2; Jester\'s Trick x15' },
  { id: 'wheeloffortune', name: 'Wheel of Fortune', icon: wheelOfFortuneTarot, description: 'Reward Modifiers x4.5; Lucky Streak x15' },
  { id: 'silver', name: 'Silver', icon: silverTarot, description: 'Min Tier: II; Unique Modifiers x1.8' },
  { id: 'gold', name: 'Gold', icon: goldTarot, description: 'Min Tier: III; Unique Modifiers x2.6' },
  { id: 'diamond', name: 'Diamond', icon: diamondTarot, description: 'Min Tier: IV; Unique Modifiers x3.4' },
]

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
  onReroll: (dustCost: number, tarotCard: TarotCard) => void
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
  const [showArtifactSelect, setShowArtifactSelect] = useState(false)
  const [selectedArtifact, setSelectedArtifact] = useState<TarotCard>('none')

  const handleArtifactSelect = (id: TarotCard) => {
    setSelectedArtifact(id)
    setShowArtifactSelect(false)
  }

  if (showArtifactSelect) {
    return (
      <div className="enchant-page">
        <div className="enchant-header">
          <h1>Select Artifact</h1>
        </div>

        <div className="tarot-grid">
          {TAROT_CARDS.map((card) => (
            <button
              key={card.id}
              className={`tarot-card ${selectedArtifact === card.id ? 'selected' : ''}`}
              onClick={() => handleArtifactSelect(card.id)}
            >
              {card.icon ? (
                <img src={card.icon} alt={card.name} className="tarot-icon" />
              ) : (
                <div className="no-artifact-icon">✕</div>
              )}
                <span className="tarot-name">{card.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="enchant-page">
      <div className="enchant-header">
        <button className="back-btn" onClick={onBack} aria-label="Return home">
          <img src={homeIcon} alt="Home" />
        </button>
        <h1>{itemType.toLowerCase()} — {getRarityLabel(slotCount)}</h1>
        <span className="header-meta">
          {rollCount} rolls | {totalDustSpent}
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
        onClick={() => onReroll(getEnchantCost(slotCount, locked.filter(Boolean).length), selectedArtifact)}
        disabled={locked.filter(Boolean).length === slotCount}
      >
        <span>Enchant</span>
        <span className="cost-display">
          {getEnchantCost(slotCount, locked.filter(Boolean).length)}
          <img src={dustIcon} alt="dust" className="dust-icon" />
        </span>
      </button>

      <button 
        className="artifact-btn" 
        onClick={() => setShowArtifactSelect(true)}
      >
        {selectedArtifact !== 'none' ? (
          <>
            <img 
              src={TAROT_CARDS.find(c => c.id === selectedArtifact)?.icon || ''} 
              alt="" 
              className="artifact-btn-icon" 
            />
            <span className="artifact-desc">
              {TAROT_CARDS.find(c => c.id === selectedArtifact)?.description?.split('; ').map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </span>
          </>
        ) : (
          <span>Select Artifact</span>
        )}
      </button>
    </div>
  )
}

import type { ItemType } from '../lib/types'
import uncommonImg from '../assets/uncommon.png'
import rareImg from '../assets/rare.png'
import legendaryImg from '../assets/legendary.png'
import divineImg from '../assets/divine.png'

interface Props {
  itemType: ItemType
  onSelect: (count: number) => void
}

const tiers = [
  { count: 1, label: 'Uncommon', img: uncommonImg },
  { count: 2, label: 'Rare', img: rareImg },
  { count: 3, label: 'Legendary', img: legendaryImg },
  { count: 4, label: 'Divine', img: divineImg },
]

export function CountSelection({ onSelect }: Props) {
  return (
    <div className="screen">
      <h1 className="screen-title">Enchantment Rarity</h1>
      <div className="selection-grid">
        {tiers.map((tier) => (
          <button
            key={tier.count}
            className="selection-card"
            onClick={() => onSelect(tier.count)}
          >
            <span className="card-icon">
              <img src={tier.img} alt={tier.label} className="tier-icon" />
              {tier.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

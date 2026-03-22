import type { ItemType } from '../lib/types'

import weaponIcon from '../assets/weapon.png'
import abilityIcon from '../assets/ability.png'
import armorIcon from '../assets/armor.png'
import ringIcon from '../assets/ring.png'

interface Props {
  onSelect: (type: ItemType) => void
}

export function EquipmentSelection({ onSelect }: Props) {
  return (
    <div className="screen">
      <h1 className="screen-title">ROTMG Enchantment Simulator</h1>
      <p className="screen-subtitle">Choose an equipment type</p>
      <div className="selection-grid">
          <button className="selection-card" onClick={() => onSelect('WEAPON')}>
            <img src={weaponIcon} alt="Weapon" />
            <span className="card-label">Weapon</span>
          </button>

          <button className="selection-card" onClick={() => onSelect('ABILITY')}>
            <img src={abilityIcon} alt="Ability" />
            <span className="card-label">Ability</span>
          </button>

          <button className="selection-card" onClick={() => onSelect('ARMOR')}>
            <img src={armorIcon} alt="Armor" />
            <span className="card-label">Armor</span>
          </button>

          <button className="selection-card" onClick={() => onSelect('RING')}>
            <img src={ringIcon} alt="Ring" />
            <span className="card-label">Ring</span>
          </button>
      </div>
    </div>
  )
}

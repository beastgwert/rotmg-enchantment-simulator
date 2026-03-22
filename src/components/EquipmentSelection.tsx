import type { ItemType } from '../lib/types'



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
            <img src={`../src/assets/weapon.png`} alt="Weapon" />
            <span className="card-label">Weapon</span>
          </button>

          <button className="selection-card" onClick={() => onSelect('ABILITY')}>
            <img src={`../src/assets/ability.png`} alt="ABILITY" />
            <span className="card-label">Ability</span>
          </button>

          <button className="selection-card" onClick={() => onSelect('ARMOR')}>
            <img src={`../src/assets/armor.png`} alt="ARMOR" />
            <span className="card-label">Armor</span>
          </button>

          <button className="selection-card" onClick={() => onSelect('RING')}>
            <img src={`../src/assets/ring.png`} alt="RING" />
            <span className="card-label">Ring</span>
          </button>
      </div>
    </div>
  )
}

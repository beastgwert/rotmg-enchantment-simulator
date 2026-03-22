import type { ItemType } from '../lib/types'

interface Props {
  itemType: ItemType
  onSelect: (count: number) => void
}

export function CountSelection({ onSelect }: Props) {
  return (
    <div className="screen">
      <h1 className="screen-title">Enchantment Slots</h1>
      <div className="selection-grid">
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            className="selection-card"
            onClick={() => onSelect(n)}
          >
            <span className="card-icon">{n}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

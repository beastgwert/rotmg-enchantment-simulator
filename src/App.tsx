import { useState, useCallback } from 'react'
import './App.css'
import type { ItemType, RolledEnchantment } from './lib/types'
import { roll } from './lib/simulator'
import { EquipmentSelection } from './components/EquipmentSelection'
import { CountSelection } from './components/CountSelection'
import { EnchantmentScreen } from './components/EnchantmentScreen'

type Step = 'type' | 'slots' | 'enchant'

function App() {
  const [step, setStep] = useState<Step>('type')
  const [itemType, setItemType] = useState<ItemType | null>(null)
  const [slotCount, setSlotCount] = useState<number>(0)
  const [enchants, setEnchants] = useState<(RolledEnchantment | null)[]>([])
  const [locked, setLocked] = useState<boolean[]>([])
  const [rollCount, setRollCount] = useState(0)

  const doRoll = useCallback(
    (type: ItemType, count: number, currentEnchants: (RolledEnchantment | null)[], currentLocked: boolean[]) => {
      const slots = Array.from({ length: count }, (_, i) =>
        currentLocked[i] ? currentEnchants[i] : null
      )
      const result = roll(type, slots)
      setEnchants(result)
      setRollCount((c) => c + 1)
    },
    []
  )

  const handleSelectType = (type: ItemType) => {
    setItemType(type)
    setStep('slots')
  }

  const handleSelectSlots = (count: number) => {
    setSlotCount(count)
    const initialLocked = Array(count).fill(false)
    setLocked(initialLocked)
    setRollCount(0)
    setStep('enchant')
    // Initial roll
    const slots = Array(count).fill(null)
    const result = roll(itemType!, slots)
    setEnchants(result)
    setRollCount(1)
  }

  const handleReroll = () => {
    if (!itemType) return
    doRoll(itemType, slotCount, enchants, locked)
  }

  const toggleLock = (index: number) => {
    setLocked((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  const handleBack = () => {
    if (step === 'enchant') {
      setStep('slots')
      setEnchants([])
      setLocked([])
      setRollCount(0)
    } else if (step === 'slots') {
      setStep('type')
      setItemType(null)
    }
  }

  if (step === 'type') {
    return <EquipmentSelection onSelect={handleSelectType} />
  }

  if (step === 'slots') {
    return <CountSelection itemType={itemType!} onSelect={handleSelectSlots} />
  }

  return (
    <EnchantmentScreen
      itemType={itemType!}
      slotCount={slotCount}
      enchants={enchants}
      locked={locked}
      rollCount={rollCount}
      onToggleLock={toggleLock}
      onReroll={handleReroll}
      onBack={handleBack}
    />
  )
}

export default App

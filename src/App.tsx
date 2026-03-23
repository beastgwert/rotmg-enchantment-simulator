import { useState, useCallback } from 'react'
import './App.css'
import type { ItemType, RolledEnchantment, TarotCard } from './lib/types'
import { roll } from './lib/simulator'
import { EquipmentSelection } from './components/EquipmentSelection'
import { CountSelection } from './components/CountSelection'
import { EnchantmentScreen } from './components/EnchantmentScreen'
import { StartingEnchantments } from './components/StartingEnchantments'

type Step = 'type' | 'slots' | 'starting' | 'enchant'

function App() {
  const [step, setStep] = useState<Step>('type')
  const [itemType, setItemType] = useState<ItemType | null>(null)
  const [slotCount, setSlotCount] = useState<number>(0)
  const [enchants, setEnchants] = useState<(RolledEnchantment | null)[]>([])
  const [locked, setLocked] = useState<boolean[]>([])
  const [rollCount, setRollCount] = useState(0)
  const [totalDustSpent, setTotalDustSpent] = useState(0)

  const doRoll = useCallback(
    (type: ItemType, count: number, currentEnchants: (RolledEnchantment | null)[], currentLocked: boolean[], dustCost: number, tarotCard: TarotCard = "none") => {
      const slots = Array.from({ length: count }, (_, i) =>
        currentLocked[i] ? currentEnchants[i] : null
      )
      const result = roll(type, slots, tarotCard)
      setEnchants(result)
      setRollCount((c) => c + 1)
      setTotalDustSpent((d) => d + dustCost)
    },
    []
  )

  const handleSelectType = (type: ItemType) => {
    setItemType(type)
    setStep('slots')
  }

  const handleSelectSlots = (count: number) => {
    setSlotCount(count)
    setStep('starting')
  }

  const handleStartingConfirm = (startingEnchants: (RolledEnchantment | null)[]) => {
    const initialLocked = Array(slotCount).fill(false)
    setLocked(initialLocked)
    setRollCount(0)
    setTotalDustSpent(0)
    setStep('enchant')

    // Roll unfilled slots, keep pre-selected ones
    const result = roll(itemType!, startingEnchants)
    setEnchants(result)
  }

  const handleReroll = (dustCost: number, tarotCard: TarotCard) => {
    if (!itemType) return
    doRoll(itemType, slotCount, enchants, locked, dustCost, tarotCard)
  }

  const toggleLock = (index: number) => {
    setLocked((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  const handleBackToType = () => {
    setStep('type')
    setItemType(null)
  }

  const handleBackToSlots = () => {
    setStep('slots')
  }

  const handleBackToHome = () => {
    setEnchants([])
    setLocked([])
    setRollCount(0)
    setTotalDustSpent(0)
    setStep('type')
    setItemType(null)
  }

  if (step === 'type') {
    return <EquipmentSelection onSelect={handleSelectType} />
  }

  if (step === 'slots') {
    return <CountSelection itemType={itemType!} onSelect={handleSelectSlots} onBack={handleBackToType} />
  }

  if (step === 'starting') {
    return (
      <StartingEnchantments
        itemType={itemType!}
        slotCount={slotCount}
        onConfirm={handleStartingConfirm}
        onBack={handleBackToSlots}
      />
    )
  }

  return (
    <EnchantmentScreen
      itemType={itemType!}
      slotCount={slotCount}
      enchants={enchants}
      locked={locked}
      rollCount={rollCount}
      totalDustSpent={totalDustSpent}
      onToggleLock={toggleLock}
      onReroll={handleReroll}
      onBack={handleBackToHome}
    />
  )
}

export default App

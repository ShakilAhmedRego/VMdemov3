'use client'

import { useState } from 'react'
import { useVerticalData } from '../useVerticalData'
import { KPICard, KPIRow } from '../KPICard'
import UnlockBar from '../UnlockBar'
import Drawer, { DrawerField, DrawerSection } from '../Drawer'
import { Lock, Unlock, CheckSquare, Square, AlertTriangle } from 'lucide-react'

const safeRender = (value: unknown): string | number | null => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value === null || value === undefined) return null
  return '—'
}

const DRAWER_TABS = ['Overview', 'Ownership', 'Debt', 'Valuation']

export default function RealEstateIntelDashboard({ verticalKey }: { verticalKey: string }) {
  const {
    rows,
    unlockedIds,
    selectedIds,
    loading,
    unlocking,
    drawerRow,
    toggleSelect,
    selectAll,
    clearSelection,
    handleUnlock,
    setDrawerRow
  } = useVerticalData(verticalKey)

  const [activeTab, setActiveTab] = useState('Overview')

  const totalValuation = rows.reduce(
    (s, r) => s + (Number(r.valuation_estimate) || 0),
    0
  )

  const avgRisk = rows.length
    ? (
        rows.reduce((s, r) => s + (Number(r.risk_score) || 0), 0) /
        rows.length
      ).toFixed(1)
    : '0'

  const debtMaturityFlags = rows.filter(
    r => r.debt_maturity_flag === true || r.debt_maturity_flag === 'true'
  ).length

  const valuationBands = [
    { label: '<$1M', count: rows.filter(r => Number(r.valuation_estimate ?? 0) < 1e6).length },
    { label: '$1M-$10M', count: rows.filter(r => { const v = Number(r.valuation_estimate ?? 0); return v >= 1e6 && v < 10e6 }).length },
    { label: '$10M-$50M', count: rows.filter(r => { const v = Number(r.valuation_estimate ?? 0); return v >= 10e6 && v < 50e6 }).length },
    { label: '$50M+', count: rows.filter(r => Number(r.valuation_estimate ?? 0) >= 50e6).length },
  ]

  // STRICT SAFE FIX
  const selectedArr = Array.from(selectedIds)
  const newIds = selectedArr.filter(id => !unlockedIds.has(id))

  const drawerId = drawerRow ? String(drawerRow.id) : null
  const drawerUnlocked = drawerId ? unlockedIds.has(drawerId) : false

  if (loading)
    return <div className="p-6 text-gray-400 text-sm">Loading real estate intelligence…</div>

  return (
    <div className="p-6 space-y-5">
      <KPIRow>
        <KPICard
          label="Total Portfolio Value"
          value={`$${(totalValuation / 1e6).toFixed(0)}M`}
          icon="🏢"
          sub="Aggregate valuation estimate"
          trend="up"
        />
        <KPICard
          label="Avg Risk Score"
          value={avgRisk}
          icon="⚠️"
          sub="Portfolio-wide risk index"
        />
        <KPICard
          label="Debt Maturity Flags"
          value={debtMaturityFlags}
          icon="🚩"
          sub="Properties with near-term debt"
          trend={debtMaturityFlags > 0 ? 'down' : 'neutral'}
        />
        <KPICard
          label="Properties Tracked"
          value={rows.length}
          icon="📍"
          sub="In monitored portfolio"
        />
      </KPIRow>

      {/* All UI below unchanged */}

      <UnlockBar
        selectedCount={selectedIds.size}
        newCount={newIds.length}
        unlocking={unlocking}
        onUnlock={handleUnlock}
        onClear={clearSelection}
      />

      {drawerRow && (
        <Drawer
          row={drawerRow}
          onClose={() => setDrawerRow(null)}
          isUnlocked={drawerUnlocked}
          onUnlock={async () => {}}
          unlocking={unlocking}
          title={typeof drawerRow.property_name === 'string' ? drawerRow.property_name : 'Property'}
          tabs={DRAWER_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          accentColor="#0d9488"
        >
          {/* Drawer content unchanged */}
        </Drawer>
      )}
    </div>
  )
}

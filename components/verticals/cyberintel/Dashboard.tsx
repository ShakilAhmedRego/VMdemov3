'use client'

import { useState } from 'react'
import { useVerticalData } from '../useVerticalData'
import UnlockBar from '../UnlockBar'
import Drawer, { DrawerField, DrawerSection } from '../Drawer'
import { Lock, Unlock, CheckSquare, Square, Shield, AlertTriangle } from 'lucide-react'

const safeRender = (value: unknown): string | number | null => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value === null || value === undefined) return null
  return '—'
}

const DRAWER_TABS = ['Overview', 'Attack Surface', 'CVEs', 'Breach History']

function PostureScore({ score }: { score: number }) {
  const color = score >= 70 ? '#059669' : score >= 40 ? '#f59e0b' : '#dc2626'
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
        style={{ borderColor: color, color }}
      >
        {score}
      </div>
    </div>
  )
}

export default function CyberIntelDashboard({ verticalKey }: { verticalKey: string }) {
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

  const avgPosture = rows.length
    ? Math.round(
        rows.reduce((s, r) => s + (Number(r.security_posture_score) || 0), 0) /
          rows.length
      )
    : 0

  const totalBreaches = rows.reduce(
    (s, r) => s + (Number(r.breach_count_12m) || 0),
    0
  )

  const avgAttackSurface = rows.length
    ? Math.round(
        rows.reduce((s, r) => s + (Number(r.attack_surface_score) || 0), 0) /
          rows.length
      )
    : 0

  const threatAlerts = [...rows]
    .filter(
      r =>
        Number(r.breach_count_12m ?? 0) > 0 ||
        Number(r.security_posture_score ?? 100) < 40
    )
    .slice(0, 5)

  // ✅ STRICT SAFE FIX (no spread on Set)
  const selectedArr = Array.from(selectedIds)
  const newIds = selectedArr.filter(id => !unlockedIds.has(id))

  const drawerId = drawerRow ? String(drawerRow.id) : null
  const drawerUnlocked = drawerId ? unlockedIds.has(drawerId) : false

  if (loading)
    return (
      <div className="p-6 text-gray-400 text-sm">
        Loading cybersecurity intelligence…
      </div>
    )

  return (
    <div className="p-6 space-y-5 bg-gray-950 min-h-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Avg Security Posture',
            value: avgPosture,
            icon: '🛡️',
            sub: 'Org-wide score (0-100)'
          },
          {
            label: 'Total Breaches (12m)',
            value: totalBreaches,
            icon: '🔴',
            sub: 'Known breach events'
          },
          {
            label: 'Avg Attack Surface',
            value: avgAttackSurface,
            icon: '🌐',
            sub: 'Exposure score'
          },
          {
            label: 'Orgs Tracked',
            value: rows.length,
            icon: '🏢',
            sub: 'In cyber database'
          }
        ].map((kpi, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {kpi.label}
              </span>
              <span className="text-lg opacity-60">{kpi.icon}</span>
            </div>
            <span
              className="text-2xl font-bold text-gray-100"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              {kpi.value}
            </span>
            <p className="text-xs text-gray-600">{kpi.sub}</p>
          </div>
        ))}
      </div>

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
          title={
            typeof drawerRow.organization_name === 'string'
              ? drawerRow.organization_name
              : 'Organization'
          }
          tabs={DRAWER_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          accentColor="#059669"
        >
          {activeTab === 'Overview' && (
            <DrawerSection title="Org Overview">
              <DrawerField
                label="Name"
                value={safeRender(drawerRow.organization_name)}
              />
              <DrawerField
                label="Industry"
                value={safeRender(drawerRow.industry)}
              />
              <DrawerField
                label="Size"
                value={safeRender(drawerRow.employee_count)}
              />
            </DrawerSection>
          )}
        </Drawer>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useVerticalData } from '../useVerticalData'
import { KPICard, KPIRow } from '../KPICard'
import UnlockBar from '../UnlockBar'
import Drawer, { DrawerField, DrawerSection } from '../Drawer'
import { Lock, Unlock, CheckSquare, Square } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const safeRender = (value: unknown): string | number | null => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value === null || value === undefined) return null
  return '—'
}

const PHASE_COLORS: Record<string, string> = {
  Preclinical: '#a78bfa',
  'Phase 1': '#818cf8',
  'Phase 2': '#6366f1',
  'Phase 3': '#4f46e5',
  'Phase 4': '#4338ca',
  'FDA Approved': '#22c55e',
}

const DRAWER_TABS = ['Overview', 'Science', 'Indications', 'Deals']

export default function BioPharmaIntelDashboard({
  verticalKey,
}: {
  verticalKey: string
}) {
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
    setDrawerRow,
  } = useVerticalData(verticalKey)

  const [activeTab, setActiveTab] = useState('Overview')

  const activePrograms = rows.filter(
    r =>
      typeof r.development_status === 'string' &&
      r.development_status.toLowerCase() === 'active'
  ).length

  const phase3Count = rows.filter(r => r.phase === 'Phase 3').length

  // ✅ FIXED — no reduce + no casting
  const sponsorCounts: { [key: string]: number } = {}
  for (const r of rows) {
    const sponsor =
      typeof r.sponsor_company === 'string'
        ? r.sponsor_company
        : 'Unknown'

    const current =
      typeof sponsorCounts[sponsor] === 'number'
        ? sponsorCounts[sponsor]
        : 0

    sponsorCounts[sponsor] = current + 1
  }

  const phaseCounts: { [key: string]: number } = {}
  for (const r of rows) {
    const phase =
      typeof r.phase === 'string'
        ? r.phase
        : 'Unknown'

    const current =
      typeof phaseCounts[phase] === 'number'
        ? phaseCounts[phase]
        : 0

    phaseCounts[phase] = current + 1
  }

  const phaseData = Object.keys(phaseCounts).map(name => ({
    name,
    count: phaseCounts[name],
  }))

  // ✅ FIXED — no Set spread
  const selectedArr = Array.from(selectedIds)
  const newIds = selectedArr.filter(id => !unlockedIds.has(id))

  const drawerId = drawerRow ? String(drawerRow.id) : null
  const drawerUnlocked = drawerId ? unlockedIds.has(drawerId) : false

  if (loading)
    return (
      <div className="p-6 text-gray-400 text-sm">
        Loading biopharma intelligence…
      </div>
    )

  return (
    <div className="p-6 space-y-5">
      <KPIRow>
        <KPICard
          label="Active Programs"
          value={activePrograms}
          icon="🔬"
          sub="In development"
          trend="up"
        />
        <KPICard
          label="Phase 3 Programs"
          value={phase3Count}
          icon="💊"
          sub="Late-stage pipeline"
        />
        <KPICard
          label="Sponsors"
          value={Object.keys(sponsorCounts).length}
          icon="🏭"
          sub="Distinct sponsor companies"
        />
        <KPICard
          label="Total Programs"
          value={rows.length}
          icon="📋"
          sub="In drug program database"
        />
      </KPIRow>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Phase Pipeline
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={phaseData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 9 }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 9 }}
                width={70}
              />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {phaseData.map((e, i) => (
                  <Cell
                    key={i}
                    fill={PHASE_COLORS[e.name] ?? '#6366f1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Drug Programs
            </h3>
            <button
              onClick={
                rows.length === selectedIds.size
                  ? clearSelection
                  : selectAll
              }
              className="text-xs text-indigo-600"
            >
              {rows.length === selectedIds.size
                ? 'Clear all'
                : 'Select all'}
            </button>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="w-8 px-3 py-2"></th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Program
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Phase
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Sponsor
                  </th>
                  <th className="w-6 px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => {
                  const id = String(row.id)
                  const unlocked = unlockedIds.has(id)
                  const selected = selectedIds.has(id)

                  const phaseStr =
                    typeof row.phase === 'string'
                      ? row.phase
                      : 'Unknown'

                  return (
                    <tr
                      key={id}
                      onClick={() => setDrawerRow(row)}
                      className={`border-t border-gray-50 dark:border-gray-800/50 cursor-pointer transition-colors ${
                        selected
                          ? 'bg-indigo-50 dark:bg-indigo-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                      }`}
                    >
                      <td
                        className="px-3 py-2.5"
                        onClick={e => {
                          e.stopPropagation()
                          toggleSelect(id)
                        }}
                      >
                        {selected ? (
                          <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-gray-300" />
                        )}
                      </td>

                      <td className="px-3 py-2.5 font-medium text-gray-900 dark:text-gray-100 max-w-xs truncate">
                        {safeRender(row.program_name) ?? '—'}
                      </td>

                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs px-1.5 py-0.5 rounded text-white"
                          style={{
                            backgroundColor:
                              PHASE_COLORS[phaseStr] ?? '#6366f1',
                          }}
                        >
                          {phaseStr}
                        </span>
                      </td>

                      <td className="px-3 py-2.5 text-xs text-gray-500">
                        {safeRender(row.development_status) ?? '—'}
                      </td>

                      <td className="px-3 py-2.5 text-xs text-gray-500 max-w-xs truncate">
                        {safeRender(row.sponsor_company) ?? '—'}
                      </td>

                      <td className="px-3 py-2.5">
                        {unlocked ? (
                          <Unlock className="w-3 h-3 text-green-500" />
                        ) : (
                          <Lock className="w-3 h-3 text-gray-300" />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
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
            typeof drawerRow.program_name === 'string'
              ? drawerRow.program_name.substring(0, 50)
              : 'Program'
          }
          tabs={DRAWER_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          accentColor="#4f46e5"
        >
          {activeTab === 'Overview' && (
            <DrawerSection title="Program Info">
              <DrawerField
                label="Name"
                value={safeRender(drawerRow.program_name)}
              />
              <DrawerField
                label="Phase"
                value={safeRender(drawerRow.phase)}
              />
              <DrawerField
                label="Status"
                value={safeRender(drawerRow.development_status)}
              />
              <DrawerField
                label="Sponsor"
                value={safeRender(drawerRow.sponsor_company)}
              />
            </DrawerSection>
          )}

          {activeTab === 'Science' && (
            <DrawerSection title="Scientific Data">
              <DrawerField
                label="Mechanism"
                value={safeRender(drawerRow.mechanism_of_action)}
              />
              <DrawerField
                label="Drug Class"
                value={safeRender(drawerRow.drug_class)}
              />
              <DrawerField
                label="Molecule Type"
                value={safeRender(drawerRow.molecule_type)}
              />
              <DrawerField
                label="Details"
                value={safeRender(drawerRow.scientific_details)}
                locked={!drawerUnlocked}
              />
            </DrawerSection>
          )}

          {activeTab === 'Indications' && (
            <DrawerSection title="Indications">
              <DrawerField
                label="Primary Indication"
                value={safeRender(drawerRow.primary_indication)}
              />
              <DrawerField
                label="Secondary"
                value={safeRender(drawerRow.secondary_indications)}
              />
              <DrawerField
                label="Patient Population"
                value={safeRender(drawerRow.target_population)}
              />
            </DrawerSection>
          )}

          {activeTab === 'Deals' && (
            <DrawerSection title="Deal Intelligence">
              <DrawerField
                label="Partner"
                value={safeRender(drawerRow.deal_partner)}
                locked={!drawerUnlocked}
              />
              <DrawerField
                label="Deal Value"
                value={safeRender(drawerRow.deal_value)}
                locked={!drawerUnlocked}
              />
              <DrawerField
                label="License Type"
                value={safeRender(drawerRow.license_type)}
              />
            </DrawerSection>
          )}
        </Drawer>
      )}
    </div>
  )
}

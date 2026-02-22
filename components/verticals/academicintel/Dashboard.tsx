'use client'

import { useState } from 'react'
import { useVerticalData } from '../useVerticalData'
import { KPICard, KPIRow } from '../KPICard'
import UnlockBar from '../UnlockBar'
import Drawer, { DrawerField, DrawerSection } from '../Drawer'
import { Lock, Unlock, CheckSquare, Square } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const safeRender = (value: unknown): string | number | null => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value === null || value === undefined) return null
  return '—'
}

const DRAWER_TABS = ['Overview', 'Authors', 'Metrics', 'Funding']

export default function AcademicIntelDashboard({ verticalKey }: { verticalKey: string }) {
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

  const totalCitations = rows.reduce((s, r) => {
    const val = typeof r.citation_count === 'number'
      ? r.citation_count
      : Number(r.citation_count ?? 0)
    return s + (isNaN(val) ? 0 : val)
  }, 0)

  const openAccessCount = rows.filter(
    r => r.is_open_access === true || r.is_open_access === 'true'
  ).length

  const avgCollab = rows.length
    ? (
        rows.reduce((s, r) => {
          const val =
            typeof r.collaboration_score === 'number'
              ? r.collaboration_score
              : Number(r.collaboration_score ?? 0)
          return s + (isNaN(val) ? 0 : val)
        }, 0) / rows.length
      ).toFixed(1)
    : '0'

  const buckets = [0, 10, 50, 100, 500, 1000]

  const citationBuckets = buckets.map((min, i) => {
    const max = buckets[i + 1] ?? Infinity
    const count = rows.filter(r => {
      const raw = r.citation_count
      const c =
        typeof raw === 'number' ? raw : Number(raw ?? 0)
      if (isNaN(c)) return false
      return c >= min && c < max
    }).length

    return {
      name: max === Infinity ? `${min}+` : `${min}-${max}`,
      count,
    }
  })

  // ✅ FIXED — no Set spread
  const selectedArr = Array.from(selectedIds)
  const newIds = selectedArr.filter(id => !unlockedIds.has(id))

  const drawerId = drawerRow ? String(drawerRow.id) : null
  const drawerUnlocked = drawerId ? unlockedIds.has(drawerId) : false

  if (loading)
    return (
      <div className="p-6 text-gray-400 text-sm">
        Loading academic research…
      </div>
    )

  return (
    <div className="p-6 space-y-5">
      <KPIRow>
        <KPICard
          label="Total Citations"
          value={totalCitations.toLocaleString()}
          icon="📚"
          sub="Across all tracked papers"
          trend="up"
        />
        <KPICard
          label="Open Access"
          value={openAccessCount}
          icon="🔓"
          sub="Freely available papers"
          trendValue={`${
            rows.length
              ? Math.round((openAccessCount / rows.length) * 100)
              : 0
          }%`}
        />
        <KPICard
          label="Avg Collaboration"
          value={avgCollab}
          icon="🤝"
          sub="Author network score"
        />
        <KPICard
          label="Total Papers"
          value={rows.length}
          icon="📄"
          sub="In research database"
        />
      </KPIRow>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Citation Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={citationBuckets}>
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#0284c7"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Research Papers
            </h3>
            <button
              onClick={
                rows.length === selectedIds.size
                  ? clearSelection
                  : selectAll
              }
              className="text-xs text-sky-600"
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
                    Title
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    DOI
                  </th>
                  <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Citations
                  </th>
                  <th className="text-center px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    OA
                  </th>
                  <th className="w-6 px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => {
                  const id = String(row.id)
                  const unlocked = unlockedIds.has(id)
                  const selected = selectedIds.has(id)

                  const doiStr =
                    typeof row.doi === 'string'
                      ? row.doi.substring(0, 20) + '…'
                      : '—'

                  const citationVal =
                    typeof row.citation_count === 'number'
                      ? row.citation_count
                      : Number(row.citation_count ?? 0)

                  return (
                    <tr
                      key={id}
                      onClick={() => setDrawerRow(row)}
                      className={`border-t border-gray-50 dark:border-gray-800/50 cursor-pointer transition-colors ${
                        selected
                          ? 'bg-sky-50 dark:bg-sky-900/20'
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
                          <CheckSquare className="w-3.5 h-3.5 text-sky-600" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-gray-300" />
                        )}
                      </td>

                      <td className="px-3 py-2.5 font-medium text-gray-900 dark:text-gray-100 max-w-xs truncate">
                        {safeRender(row.title) ?? '—'}
                      </td>

                      <td className="px-3 py-2.5 text-gray-400 text-xs font-mono">
                        {doiStr}
                      </td>

                      <td className="px-3 py-2.5 text-right font-bold text-sky-600 dark:text-sky-400 text-xs">
                        {isNaN(citationVal)
                          ? '0'
                          : citationVal.toLocaleString()}
                      </td>

                      <td className="px-3 py-2.5 text-center">
                        {row.is_open_access === true ||
                        row.is_open_access === 'true' ? (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
                            OA
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
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
            typeof drawerRow.title === 'string'
              ? drawerRow.title.substring(0, 50)
              : 'Paper'
          }
          tabs={DRAWER_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          accentColor="#0284c7"
        >
          {activeTab === 'Overview' && (
            <DrawerSection title="Paper Info">
              <DrawerField
                label="Title"
                value={safeRender(drawerRow.title)}
              />
              <DrawerField
                label="Journal"
                value={safeRender(drawerRow.journal)}
              />
              <DrawerField
                label="Published"
                value={safeRender(drawerRow.published_date)}
              />
              <DrawerField
                label="DOI"
                value={safeRender(drawerRow.doi)}
              />
            </DrawerSection>
          )}

          {activeTab === 'Authors' && (
            <DrawerSection title="Authors">
              <DrawerField
                label="Authors"
                value={safeRender(drawerRow.authors)}
                locked={!drawerUnlocked}
              />
              <DrawerField
                label="Institution"
                value={safeRender(drawerRow.institution)}
              />
              <DrawerField
                label="Collab Score"
                value={safeRender(drawerRow.collaboration_score)}
              />
            </DrawerSection>
          )}

          {activeTab === 'Metrics' && (
            <DrawerSection title="Impact Metrics">
              <DrawerField
                label="Citations"
                value={safeRender(drawerRow.citation_count)}
              />
              <DrawerField
                label="h-index"
                value={safeRender(drawerRow.h_index)}
              />
              <DrawerField
                label="Impact Factor"
                value={safeRender(drawerRow.impact_factor)}
              />
            </DrawerSection>
          )}

          {activeTab === 'Funding' && (
            <DrawerSection title="Funding Sources">
              <DrawerField
                label="Funder"
                value={safeRender(drawerRow.funding_source)}
                locked={!drawerUnlocked}
              />
              <DrawerField
                label="Grant ID"
                value={safeRender(drawerRow.grant_id)}
                locked={!drawerUnlocked}
              />
            </DrawerSection>
          )}
        </Drawer>
      )}
    </div>
  )
}

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

const EMAIL_STATUS_COLORS: Record<string, string> = {
  verified: '#16a34a',
  valid: '#22c55e',
  invalid: '#dc2626',
  risky: '#f59e0b',
  unknown: '#6b7280',
}

const DRAWER_TABS = ['Overview', 'Contact', 'Signals', 'Verification']

export default function SalesIntelDashboard({ verticalKey }: { verticalKey: string }) {
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

  const highPriority = rows.filter(
    r => Number(r.priority_score ?? r.intelligence_score ?? 0) >= 70
  ).length

  const verifiedEmails = rows.filter(
    r =>
      typeof r.email_status === 'string' &&
      r.email_status.toLowerCase() === 'verified'
  ).length

  const avgIntel = rows.length
    ? Math.round(
        rows.reduce(
          (s, r) => s + (Number(r.intelligence_score) || 0),
          0
        ) / rows.length
      )
    : 0

  // ✅ Fully typed reducer — strict and stable
  const statusCounts = rows.reduce<Record<string, number>>((acc, r) => {
    const st =
      typeof r.email_status === 'string'
        ? r.email_status.toLowerCase()
        : 'unknown'

    acc[st] = (acc[st] ?? 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(statusCounts).map(([name, count]) => ({
    name,
    count,
  }))

  const drawerId = drawerRow ? String((drawerRow as any).id) : null
  const drawerUnlocked = drawerId ? unlockedIds.has(drawerId) : false

  const selectedArr = Array.from(selectedIds)
  const newIds = selectedArr.filter(id => !unlockedIds.has(id))

  if (loading)
    return (
      <div className="p-6 text-gray-400 text-sm">
        Loading sales intelligence…
      </div>
    )

  return (
    <div className="p-6 space-y-5">
      <KPIRow>
        <KPICard label="Total Leads" value={rows.length} icon="🎯" sub="In active database" />
        <KPICard
          label="High Priority"
          value={highPriority}
          icon="⚡"
          sub="Score ≥ 70"
          trend="up"
          trendValue={`${rows.length ? Math.round((highPriority / rows.length) * 100) : 0}%`}
        />
        <KPICard label="Verified Emails" value={verifiedEmails} icon="✅" sub="Email deliverability confirmed" />
        <KPICard label="Avg Intel Score" value={avgIntel} icon="🧠" sub="Lead quality index" />
      </KPIRow>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Email Status Funnel
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={EMAIL_STATUS_COLORS[entry.name] ?? '#6b7280'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              B2B Leads
            </h3>
            <button
              onClick={rows.length === selectedIds.size ? clearSelection : selectAll}
              className="text-xs text-green-600"
            >
              {rows.length === selectedIds.size ? 'Clear all' : 'Select all'}
            </button>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="w-8 px-3 py-2"></th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Status</th>
                  <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Employees</th>
                  <th className="w-6 px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => {
                  const id = String((row as any).id)
                  const unlocked = unlockedIds.has(id)
                  const selected = selectedIds.has(id)

                  const emailStatus =
                    typeof row.email_status === 'string'
                      ? row.email_status.toLowerCase()
                      : 'unknown'

                  return (
                    <tr
                      key={id}
                      onClick={() => setDrawerRow(row)}
                      className={`border-t border-gray-50 dark:border-gray-800/50 cursor-pointer transition-colors ${
                        selected
                          ? 'bg-green-50 dark:bg-green-900/20'
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
                          <CheckSquare className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-gray-300" />
                        )}
                      </td>

                      <td className="px-3 py-2.5 font-medium text-gray-900 dark:text-gray-100">
                        {safeRender(row.company) ?? '—'}
                      </td>

                      <td className="px-3 py-2.5 text-gray-500 text-xs">
                        {safeRender(row.title) ?? '—'}
                      </td>

                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full text-white"
                          style={{
                            backgroundColor:
                              EMAIL_STATUS_COLORS[emailStatus] ?? '#6b7280',
                          }}
                        >
                          {emailStatus}
                        </span>
                      </td>

                      <td className="px-3 py-2.5 text-right text-gray-600 dark:text-gray-400 font-mono text-xs">
                        {row.employee_count
                          ? Number(row.employee_count).toLocaleString()
                          : '—'}
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
            typeof drawerRow.company === 'string'
              ? drawerRow.company
              : 'Lead'
          }
          tabs={DRAWER_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          accentColor="#16a34a"
        >
          {activeTab === 'Overview' && (
            <DrawerSection title="Lead Overview">
              <DrawerField label="Company" value={safeRender(drawerRow.company)} />
              <DrawerField label="Industry" value={safeRender(drawerRow.industry)} />
              <DrawerField label="Employee Count" value={safeRender(drawerRow.employee_count)} />
              <DrawerField label="Revenue Range" value={safeRender(drawerRow.revenue_range)} />
            </DrawerSection>
          )}

          {activeTab === 'Contact' && (
            <DrawerSection title="Contact Details">
              <DrawerField label="Full Name" value={safeRender(drawerRow.full_name)} locked={!drawerUnlocked} />
              <DrawerField label="Email" value={safeRender(drawerRow.email)} locked={!drawerUnlocked} />
              <DrawerField label="Phone" value={safeRender(drawerRow.phone)} locked={!drawerUnlocked} />
              <DrawerField label="LinkedIn" value={safeRender(drawerRow.linkedin_url)} locked={!drawerUnlocked} />
            </DrawerSection>
          )}

          {activeTab === 'Signals' && (
            <DrawerSection title="Intent Signals">
              <DrawerField label="Priority Score" value={safeRender(drawerRow.priority_score ?? drawerRow.intelligence_score)} />
              <DrawerField label="Intent Signal" value={safeRender(drawerRow.intent_signal)} />
              <DrawerField label="Last Activity" value={safeRender(drawerRow.last_activity)} />
              <DrawerField label="Workflow Status" value={safeRender(drawerRow.workflow_status)} />
            </DrawerSection>
          )}

          {activeTab === 'Verification' && (
            <DrawerSection title="Email Verification">
              <DrawerField label="Email Status" value={safeRender(drawerRow.email_status)} />
              <DrawerField label="Verified Date" value={safeRender(drawerRow.verified_at)} />
              <DrawerField label="Bounce Risk" value={safeRender(drawerRow.bounce_risk)} />
            </DrawerSection>
          )}
        </Drawer>
      )}
    </div>
  )
}

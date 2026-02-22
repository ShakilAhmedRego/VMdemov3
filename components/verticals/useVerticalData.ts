'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { VERTICALS } from '@/lib/verticals'

export interface UseVerticalDataReturn {
  rows: Record<string, unknown>[]
  unlockedIds: Set<string>
  selectedIds: Set<string>
  loading: boolean
  unlocking: boolean
  drawerRow: Record<string, unknown> | null
  toggleSelect: (id: string) => void
  selectAll: () => void
  clearSelection: () => void
  handleUnlock: () => Promise<void>
  setDrawerRow: (row: Record<string, unknown> | null) => void
  refresh: () => Promise<void>
}

export function useVerticalData(verticalKey: string): UseVerticalDataReturn {
  const { user, refreshCredits } = useAuth()
  const vertical = VERTICALS[verticalKey]
  
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [unlocking, setUnlocking] = useState(false)
  const [drawerRow, setDrawerRow] = useState<Record<string, unknown> | null>(null)

  const fetchData = useCallback(async () => {
    if (!vertical) return
    setLoading(true)

    const [rowsRes, accessRes] = await Promise.all([
      supabase.from(vertical.table).select('*').limit(100),
      user
        ? supabase
            .from(vertical.accessTable)
            .select(vertical.accessIdField)
            .eq('user_id', user.id)
        : Promise.resolve({ data: [] as Record<string, unknown>[] })
    ])

    // ✅ Safe normalization (fixes union typing issue)
    const rowsData = Array.isArray(rowsRes.data)
      ? (rowsRes.data as Record<string, unknown>[])
      : []

    setRows(rowsData)

    const accessData = Array.isArray(accessRes.data)
      ? accessRes.data
      : []

    const ids = new Set(
      accessData
        .filter((r): r is Record<string, unknown> => typeof r === 'object' && r !== null)
        .map(r => String((r as any)[vertical.accessIdField]))
    )

    setUnlockedIds(ids)
    setLoading(false)
  }, [vertical, user])

  useEffect(() => {
    fetchData()
    setSelectedIds(new Set())
  }, [fetchData])

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    setSelectedIds(
      new Set(
        rows.map(r =>
          String(r[vertical?.idField ?? 'id'] ?? (r as any).id)
        )
      )
    )
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  async function handleUnlock() {
    if (!vertical || selectedIds.size === 0) return

    const newIds = Array.from(selectedIds).filter(
      id => !unlockedIds.has(id)
    )

    if (newIds.length === 0) return

    setUnlocking(true)

    const { error } = await supabase.rpc(vertical.rpc, {
      [vertical.rpcParam]: newIds
    })

    if (!error) {
      // ✅ No spread on Set (fixes ES target issue)
      setUnlockedIds(prev => {
        const next = new Set(prev)
        newIds.forEach(id => next.add(id))
        return next
      })

      await refreshCredits()
    }

    setUnlocking(false)
    setSelectedIds(new Set())
  }

  return {
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
    refresh: fetchData,
  }
}

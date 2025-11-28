/**
 * Zustand state management stores
 */

import { create } from 'zustand'
import type { Employee, Alert, XPLevel } from '@/types'
import { calculateLevel } from './utils'

/**
 * Employee Store
 */
interface EmployeeStore {
  employees: Employee[]
  selectedEmployee: Employee | null
  searchQuery: string
  filterBranch: string
  filterNationality: string
  setEmployees: (employees: Employee[]) => void
  setSelectedEmployee: (employee: Employee | null) => void
  setSearchQuery: (query: string) => void
  setFilterBranch: (branch: string) => void
  setFilterNationality: (nationality: string) => void
  getFilteredEmployees: () => Employee[]
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  selectedEmployee: null,
  searchQuery: '',
  filterBranch: '',
  filterNationality: '',
  setEmployees: (employees) => set({ employees }),
  setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterBranch: (branch) => set({ filterBranch: branch }),
  setFilterNationality: (nationality) => set({ filterNationality: nationality }),
  getFilteredEmployees: () => {
    const { employees, searchQuery, filterBranch, filterNationality } = get()
    let filtered = employees

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(query) ||
          emp.id.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query)
      )
    }

    if (filterBranch) {
      filtered = filtered.filter((emp) => emp.branch === filterBranch)
    }

    if (filterNationality) {
      filtered = filtered.filter((emp) => emp.nationality === filterNationality)
    }

    return filtered
  },
}))

/**
 * Alert Store
 */
interface AlertStore {
  alerts: Alert[]
  selectedSeverity: string
  setAlerts: (alerts: Alert[]) => void
  setSelectedSeverity: (severity: string) => void
  resolveAlert: (alertId: string) => void
  getFilteredAlerts: () => Alert[]
}

export const useAlertStore = create<AlertStore>((set, get) => ({
  alerts: [],
  selectedSeverity: 'all',
  setAlerts: (alerts) => set({ alerts }),
  setSelectedSeverity: (severity) => set({ selectedSeverity: severity }),
  resolveAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId
          ? { ...alert, resolved: true, resolvedAt: new Date().toISOString() }
          : alert
      ),
    }))
  },
  getFilteredAlerts: () => {
    const { alerts, selectedSeverity } = get()
    if (!selectedSeverity || selectedSeverity === 'all') {
      return alerts
    }
    return alerts.filter((alert) => alert.severity === selectedSeverity)
  },
}))

/**
 * XP/Level Store
 */
interface XPStore {
  xp: number
  level: number
  currentLevelXP: number
  nextLevelXP: number
  progress: number
  addXP: (amount: number) => void
  setXP: (xp: number) => void
}

export const useXPStore = create<XPStore>((set, get) => ({
  xp: 4750,
  ...calculateLevel(4750),
  addXP: (amount) => {
    const currentXP = get().xp
    const newXP = currentXP + amount
    set({
      xp: newXP,
      ...calculateLevel(newXP),
    })
  },
  setXP: (xp) => {
    set({
      xp,
      ...calculateLevel(xp),
    })
  },
}))

/**
 * Upload Store
 */
interface UploadStore {
  isUploading: boolean
  uploadProgress: number
  uploadedFile: File | null
  parsedData: any[]
  setIsUploading: (uploading: boolean) => void
  setUploadProgress: (progress: number) => void
  setUploadedFile: (file: File | null) => void
  setParsedData: (data: any[]) => void
  resetUpload: () => void
}

export const useUploadStore = create<UploadStore>((set) => ({
  isUploading: false,
  uploadProgress: 0,
  uploadedFile: null,
  parsedData: [],
  setIsUploading: (uploading) => set({ isUploading: uploading }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setParsedData: (data) => set({ parsedData: data }),
  resetUpload: () =>
    set({
      isUploading: false,
      uploadProgress: 0,
      uploadedFile: null,
      parsedData: [],
    }),
}))

/**
 * UI Store
 */
interface UIStore {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}))


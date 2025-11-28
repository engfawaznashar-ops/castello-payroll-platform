/**
 * Real API Client for Castello Coffee Platform
 * Connects to live backend endpoints with proper error handling
 */

import type {
  Employee,
  Alert,
  AIInsight,
  MonthlyTrend,
  NationalityDistribution,
  BranchSalary,
  DataQualityScore,
  KPIData,
  AIPrediction,
  UserProfile,
  PayrollHistory,
} from '@/types'

/**
 * Base fetch wrapper with credentials and error handling
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(endpoint, {
    cache: 'no-store',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get all employees with optional filters
 */
export async function getEmployees(params?: {
  search?: string
  branch?: string
  nationality?: string
}): Promise<Employee[]> {
  const queryParams = new URLSearchParams()
  if (params?.search) queryParams.append('search', params.search)
  if (params?.branch) queryParams.append('branch', params.branch)
  if (params?.nationality) queryParams.append('nationality', params.nationality)

  const query = queryParams.toString()
  return apiFetch<Employee[]>(`/api/employees${query ? `?${query}` : ''}`)
}

/**
 * Get single employee by ID
 */
export async function getEmployee(id: string): Promise<Employee | undefined> {
  try {
    return await apiFetch<Employee>(`/api/employees/${id}`)
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error)
    return undefined
  }
}

/**
 * Search employees by name
 */
export async function searchEmployees(query: string): Promise<Employee[]> {
  return getEmployees({ search: query })
}

/**
 * Filter employees by branch
 */
export async function getEmployeesByBranch(branch: string): Promise<Employee[]> {
  return getEmployees({ branch })
}

/**
 * Filter employees by nationality
 */
export async function getEmployeesByNationality(nationality: string): Promise<Employee[]> {
  return getEmployees({ nationality })
}

/**
 * Get all alerts with optional filters
 */
export async function getAlerts(params?: {
  severity?: string
  status?: string
  type?: string
}): Promise<Alert[]> {
  const queryParams = new URLSearchParams()
  if (params?.severity) queryParams.append('severity', params.severity)
  if (params?.status) queryParams.append('status', params.status)
  if (params?.type) queryParams.append('type', params.type)

  const query = queryParams.toString()
  return apiFetch<Alert[]>(`/api/alerts${query ? `?${query}` : ''}`)
}

/**
 * Get alerts by severity
 */
export async function getAlertsBySeverity(severity: string): Promise<Alert[]> {
  if (!severity || severity === 'all') {
    return getAlerts()
  }
  return getAlerts({ severity: severity.toUpperCase() })
}

/**
 * Resolve an alert and award XP
 */
export async function resolveAlert(alertId: string): Promise<{ success: boolean; xpGained: number }> {
  return apiFetch(`/api/alerts/${alertId}/resolve`, {
    method: 'POST',
  })
}

/**
 * Get AI insights (using dummy data for now as AI endpoint not implemented yet)
 */
export async function getAIInsights(): Promise<AIInsight[]> {
  // TODO: Replace with real AI insights endpoint when available
  const { aiInsights } = await import('./dummy-data')
  return aiInsights
}

/**
 * Get AI insights by priority
 */
export async function getAIInsightsByPriority(priority: string): Promise<AIInsight[]> {
  const insights = await getAIInsights()
  if (!priority || priority === 'all') return insights
  return insights.filter(insight => insight.priority === priority)
}

/**
 * Get monthly salary trends
 */
export async function getMonthlyTrends(): Promise<MonthlyTrend[]> {
  return apiFetch<MonthlyTrend[]>('/api/dashboard/trends')
}

/**
 * Get nationality distribution
 */
export async function getNationalityDistribution(): Promise<NationalityDistribution[]> {
  return apiFetch<NationalityDistribution[]>('/api/dashboard/nationality')
}

/**
 * Get branch salaries
 */
export async function getBranchSalaries(): Promise<BranchSalary[]> {
  return apiFetch<BranchSalary[]>('/api/dashboard/branches')
}

/**
 * Get KPI data
 */
export async function getKPIData(): Promise<KPIData[]> {
  const data = await apiFetch<{
    totalSalaries: number
    totalDeductions: number
    totalAdvances: number
    netSalaries: number
    changes?: {
      salariesChange: number
      deductionsChange: number
      advancesChange: number
      netChange: number
    }
  }>('/api/dashboard/kpis')

  // Transform to KPIData format expected by components
  return [
    {
      label: 'إجمالي الرواتب',
      value: data.totalSalaries,
      change: data.changes?.salariesChange || 0,
      changeType: (data.changes?.salariesChange || 0) >= 0 ? 'increase' : 'decrease',
      icon: 'DollarSign',
    },
    {
      label: 'إجمالي الخصومات',
      value: data.totalDeductions,
      change: Math.abs(data.changes?.deductionsChange || 0),
      changeType: (data.changes?.deductionsChange || 0) >= 0 ? 'increase' : 'decrease',
      icon: 'MinusCircle',
    },
    {
      label: 'إجمالي السلف',
      value: data.totalAdvances,
      change: Math.abs(data.changes?.advancesChange || 0),
      changeType: (data.changes?.advancesChange || 0) >= 0 ? 'increase' : 'decrease',
      icon: 'TrendingUp',
    },
    {
      label: 'صافي الرواتب',
      value: data.netSalaries,
      change: Math.abs(data.changes?.netChange || 0),
      changeType: (data.changes?.netChange || 0) >= 0 ? 'increase' : 'decrease',
      icon: 'Wallet',
    },
  ]
}

/**
 * Get data quality score
 */
export async function getDataQuality(): Promise<DataQualityScore> {
  return apiFetch<DataQualityScore>('/api/quality/score')
}

/**
 * Get XP data for current user
 */
export async function getXPData(): Promise<{
  xp: number
  level: number
  currentLevelXP: number
  nextLevelXP: number
  progress: number
}> {
  return apiFetch('/api/xp')
}

/**
 * Get advance predictions (using dummy data for now)
 */
export async function getAdvancePredictions(): Promise<AIPrediction[]> {
  // TODO: Implement real AI prediction endpoint
  const { advancePredictions } = await import('./dummy-data')
  return advancePredictions
}

/**
 * Get salary predictions (using dummy data for now)
 */
export async function getSalaryPredictions(): Promise<AIPrediction[]> {
  // TODO: Implement real AI prediction endpoint
  const { salaryPredictions } = await import('./dummy-data')
  return salaryPredictions
}

/**
 * Get current user profile (from session)
 */
export async function getCurrentUser(): Promise<UserProfile> {
  // This should ideally come from the session on the server side
  // For now, return a placeholder that matches the session user
  const { currentUser } = await import('./dummy-data')
  return currentUser
}

/**
 * Get payroll history for an employee
 */
export async function getPayrollHistory(employeeId: string): Promise<PayrollHistory[]> {
  // This is included in the employee detail endpoint
  const employee = await getEmployee(employeeId)
  if (!employee || !('payrollHistory' in employee)) {
    return []
  }
  return (employee as any).payrollHistory || []
}

/**
 * Get alerts for specific employee
 */
export async function getEmployeeAlerts(employeeId: string): Promise<Alert[]> {
  // This is included in the employee detail endpoint
  const employee = await getEmployee(employeeId)
  if (!employee || !('alerts' in employee)) {
    return []
  }
  return (employee as any).alerts || []
}

/**
 * Update employee completion percentage (not implemented in backend yet)
 */
export async function updateEmployeeCompletion(
  employeeId: string,
  percentage: number
): Promise<boolean> {
  // TODO: Implement backend endpoint for this
  console.warn('updateEmployeeCompletion not yet implemented in backend')
  return false
}

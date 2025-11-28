/**
 * Core TypeScript types for Castello Coffee Platform
 */

export type Nationality = 'سعودي' | 'مصري' | 'سوري' | 'يمني' | 'أردني' | 'فلسطيني' | 'لبناني' | 'سوداني' | 'باكستاني' | 'هندي' | 'بنغلاديشي' | 'فلبيني'

export type Branch = 'الرياض - الرئيسي' | 'جدة - الكورنيش' | 'الدمام - العزيزية' | 'مكة - العوالي' | 'المدينة - العيون'

export type DocumentType = 'جواز السفر' | 'الإقامة' | 'عقد العمل' | 'شهادة الصحة' | 'بطاقة الهوية' | 'شهادة التأمينات'

export type AlertSeverity = 'info' | 'warning' | 'critical'

export type AlertType = 'missing_data' | 'expiring_document' | 'calculation_error' | 'duplicate_entry' | 'bank_issue' | 'salary_delay'

export type AIInsightPriority = 'urgent' | 'short_term' | 'long_term'

export type QualityIssueSeverity = 'info' | 'warning' | 'critical'

export interface Employee {
  id: string
  name: string
  email: string
  avatar?: string
  position: string
  branch: string // Changed from Branch to string (API returns string)
  branchCity?: string // Added for API response
  nationality: string // Changed from Nationality to string (API returns string)
  iqamaNumber: string
  iqamaExpiry?: string // Made optional (not in API)
  passportNumber?: string
  passportExpiry?: string
  hireDate: string
  bankAccount: string
  bankName?: string // Made optional (not in API)
  baseSalary: number
  allowances: number
  advances?: number // Made optional (not in API)
  deductions: number
  netSalary: number
  completionPercentage: number
  phone?: string // Made optional (not in API)
  status?: string // Added from API
  documents: DocumentStatus[]
  payrollHistory?: PayrollHistory[] // Added from API
  alerts: Alert[]
}

export interface DocumentStatus {
  id: string // Added from API
  type: string // Changed from DocumentType to string (API returns string)
  name: string // Added from API
  status: 'valid' | 'expiring_soon' | 'expired' | 'missing' | 'expiring' // Added expiring_soon
  issueDate?: string // Added from API
  expiryDate?: string
  fileUrl?: string // Changed from url to fileUrl to match API
}

export interface PayrollData {
  employeeId: string
  employeeName: string
  month: string
  year: number
  baseSalary: number
  allowances: number
  overtime: number
  bonus: number
  grossSalary: number
  advances: number
  deductions: number
  tax: number
  netSalary: number
  paymentDate: string
  status: 'pending' | 'paid' | 'processing'
}

export interface PayrollHistory {
  month: string
  gross: number
  deductions: number
  net: number
}

export interface KPIData {
  label: string
  value: number
  change: number
  changeType: 'increase' | 'decrease'
  icon: string
  trend?: number[]
}

export interface ChartData {
  name: string
  value: number
  [key: string]: string | number
}

export interface MonthlyTrend {
  month: string
  salary: number
  advances: number
  deductions: number
  net: number
}

export interface NationalityDistribution {
  nationality: Nationality
  count: number
  percentage: number
  color: string
}

export interface BranchSalary {
  branch: Branch
  totalSalary: number
  employeeCount: number
  averageSalary: number
}

export interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  description: string
  employeeId?: string
  employeeName?: string
  branch?: Branch
  xpReward: number
  createdAt: string
  resolvedAt?: string
  resolved: boolean
  metadata?: Record<string, any>
}

export interface AIInsight {
  id: string
  priority: AIInsightPriority
  category: string
  title: string
  description: string
  impact: string
  recommendation: string
  potentialSavings?: number
  implementationTime?: string
  confidence: number
}

export interface AIPrediction {
  month: string
  predicted: number
  lower: number
  upper: number
  actual?: number
}

export interface QualityIssue {
  id: string
  type: 'missing_values' | 'incorrect_calculations' | 'duplicate_employees' | 'invalid_bank' | 'missing_documents'
  severity: QualityIssueSeverity
  title: string
  description: string
  count: number
  affectedEmployees: string[]
  details: string[]
}

export interface DataQualityScore {
  overall: number
  infoCount: number
  warningCount: number
  criticalCount: number
  issues: QualityIssue[]
  lastUpdated: string
}

export interface UploadResult {
  success: boolean
  fileName: string
  rowCount: number
  validRows: number
  errors: ValidationError[]
  warnings: ValidationWarning[]
  data: any[]
}

export interface ValidationError {
  row: number
  field: string
  message: string
  value?: any
}

export interface ValidationWarning {
  row: number
  field: string
  message: string
  value?: any
}

export interface XPLevel {
  level: number
  xp: number
  currentLevelXP: number
  nextLevelXP: number
  progress: number
}

export interface UserProfile {
  name: string
  email: string
  role: string
  avatar: string
  xp: number
}



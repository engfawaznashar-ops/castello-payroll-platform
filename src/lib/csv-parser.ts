/**
 * CSV/Excel parsing utilities
 */

import Papa from 'papaparse'
import type { UploadResult, ValidationError, ValidationWarning } from '@/types'

interface ParsedRow {
  [key: string]: string | number
}

/**
 * Parse CSV file
 */
export function parseCSV(file: File): Promise<UploadResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validation = validatePayrollData(results.data as ParsedRow[])
        resolve({
          success: validation.errors.length === 0,
          fileName: file.name,
          rowCount: results.data.length,
          validRows: results.data.length - validation.errors.length,
          errors: validation.errors,
          warnings: validation.warnings,
          data: results.data,
        })
      },
      error: (error) => {
        resolve({
          success: false,
          fileName: file.name,
          rowCount: 0,
          validRows: 0,
          errors: [{
            row: 0,
            field: 'file',
            message: `فشل تحليل الملف: ${error.message}`,
          }],
          warnings: [],
          data: [],
        })
      },
    })
  })
}

/**
 * Validate payroll data
 */
function validatePayrollData(data: ParsedRow[]): {
  errors: ValidationError[]
  warnings: ValidationWarning[]
} {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const seenEmployees = new Set<string>()

  data.forEach((row, index) => {
    const rowNum = index + 2 // +2 because of header row and 1-based indexing

    // Required fields validation
    const requiredFields = ['employee_id', 'name', 'base_salary', 'net_salary']
    requiredFields.forEach(field => {
      if (!row[field] || row[field] === '') {
        errors.push({
          row: rowNum,
          field,
          message: `الحقل "${field}" مطلوب`,
        })
      }
    })

    // Duplicate employee check
    const employeeId = row['employee_id'] as string
    if (employeeId) {
      if (seenEmployees.has(employeeId)) {
        errors.push({
          row: rowNum,
          field: 'employee_id',
          message: 'رقم الموظف مكرر',
          value: employeeId,
        })
      }
      seenEmployees.add(employeeId)
    }

    // Numeric validation
    const numericFields = ['base_salary', 'allowances', 'deductions', 'advances', 'net_salary']
    numericFields.forEach(field => {
      const value = row[field]
      if (value !== undefined && value !== '' && isNaN(Number(value))) {
        errors.push({
          row: rowNum,
          field,
          message: `يجب أن يكون "${field}" رقماً`,
          value,
        })
      }
    })

    // Calculation validation
    const baseSalary = Number(row['base_salary']) || 0
    const allowances = Number(row['allowances']) || 0
    const deductions = Number(row['deductions']) || 0
    const advances = Number(row['advances']) || 0
    const netSalary = Number(row['net_salary']) || 0
    const expectedNet = baseSalary + allowances - deductions - advances

    if (Math.abs(expectedNet - netSalary) > 1) {
      warnings.push({
        row: rowNum,
        field: 'net_salary',
        message: `صافي الراتب قد يكون غير صحيح. المتوقع: ${expectedNet}، الموجود: ${netSalary}`,
      })
    }

    // Negative values warning
    if (baseSalary < 0 || allowances < 0) {
      warnings.push({
        row: rowNum,
        field: baseSalary < 0 ? 'base_salary' : 'allowances',
        message: 'القيمة سالبة - يرجى المراجعة',
      })
    }

    // IBAN validation (if present)
    const iban = row['bank_account'] as string
    if (iban && !isValidIBAN(iban)) {
      warnings.push({
        row: rowNum,
        field: 'bank_account',
        message: 'رقم IBAN قد يكون غير صحيح',
        value: iban,
      })
    }
  })

  return { errors, warnings }
}

/**
 * Basic IBAN validation for Saudi Arabia
 */
function isValidIBAN(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, '')
  // Saudi IBAN should start with SA and be 24 characters
  if (!cleaned.startsWith('SA') || cleaned.length !== 24) {
    return false
  }
  return /^SA\d{22}$/.test(cleaned)
}

/**
 * Export data to CSV
 */
export function exportToCSV(data: any[], filename: string): void {
  const csv = Papa.unparse(data, {
    header: true,
  })
  
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}



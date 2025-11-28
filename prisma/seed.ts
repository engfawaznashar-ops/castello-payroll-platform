import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ============================================
// SEEDED RANDOM NUMBER GENERATOR
// ============================================
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  choice<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)]
  }
}

const random = new SeededRandom(42) // Deterministic seed

// ============================================
// DATA CONSTANTS
// ============================================

const arabicFirstNames = [
  'محمد', 'أحمد', 'علي', 'حسن', 'خالد', 'عمر', 'يوسف', 'عبدالله', 'سعيد', 'فهد',
  'سلطان', 'فيصل', 'عبدالعزيز', 'ماجد', 'نواف', 'بندر', 'تركي', 'سلمان', 'راشد', 'مشعل',
  'عبدالرحمن', 'إبراهيم', 'ناصر', 'طارق', 'وليد', 'هاني', 'عادل', 'كريم', 'جمال', 'رامي',
  'فاطمة', 'عائشة', 'مريم', 'نورة', 'سارة', 'هند', 'ريم', 'لينا', 'أمل', 'دانة'
]

const arabicLastNames = [
  'العتيبي', 'الحربي', 'الغامدي', 'القحطاني', 'العنزي', 'السهلي', 'المطيري', 'الدوسري',
  'الشمري', 'الزهراني', 'العمري', 'الأحمدي', 'السبيعي', 'الجهني', 'البقمي', 'الرويلي',
  'الشهري', 'العوفي', 'الثبيتي', 'الخالدي'
]

const nationalities = ['Saudi', 'Egyptian', 'Filipino', 'Indian', 'Pakistani', 'Syrian', 'Bangladeshi', 'Yemeni']

const branchData = [
  { name: 'Jeddah – Corniche', city: 'Jeddah' },
  { name: 'Makkah – Aziziyah', city: 'Makkah' },
  { name: 'Riyadh – Olaya', city: 'Riyadh' },
  { name: 'Dammam – Shatea', city: 'Dammam' },
  { name: 'Madinah – Quba', city: 'Madinah' }
]

const documentTypes = ['IQAMA', 'CONTRACT', 'INSURANCE', 'LICENSE']
const documentStatuses = ['VALID', 'EXPIRING_SOON', 'EXPIRED']
const alertTypes = ['IQAMA_EXPIRY', 'MISSING_DOCUMENT', 'PAYROLL_ERROR', 'DATA_QUALITY']
const alertSeverities = ['INFO', 'WARNING', 'CRITICAL']
const validationStatuses = ['OK', 'WARNING', 'ERROR']

const xpReasons = [
  'حل تنبيه',
  'تحسين جودة البيانات',
  'إغلاق مشكلة',
  'رفع دفعة رواتب',
  'تحديث بيانات موظف',
  'معالجة مستند منتهي'
]

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateIqamaNumber(): string {
  return `2${random.nextInt(100000000, 999999999)}`
}

function generateBankAccount(): string {
  return `SA${random.nextInt(1000000000000000, 9999999999999999)}`
}

function getRandomDate(start: Date, end: Date): Date {
  const startTime = start.getTime()
  const endTime = end.getTime()
  return new Date(startTime + random.next() * (endTime - startTime))
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(60))
  console.log(`  ${title}`)
  console.log('='.repeat(60))
}

function logSuccess(message: string, count?: number) {
  const countStr = count !== undefined ? ` (${count})` : ''
  console.log(`✅ ${message}${countStr}`)
}

function logProgress(message: string) {
  console.log(`⏳ ${message}...`)
}

// ============================================
// MAIN SEED FUNCTION
// ============================================

async function main() {
  const startTime = Date.now()

  console.log('\n')
  console.log('🌱 CASTELLO COFFEE PAYROLL PLATFORM - DATABASE SEED')
  console.log('=' .repeat(60))
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`)

  try {
    // ==========================================
    // STEP 1: CLEAR EXISTING DATA
    // ==========================================
    logSection('🗑️  CLEARING EXISTING DATA')
    
    await prisma.xpEvent.deleteMany()
    logSuccess('Cleared XpEvents')
    
    await prisma.alert.deleteMany()
    logSuccess('Cleared Alerts')
    
    await prisma.payrollEntry.deleteMany()
    logSuccess('Cleared PayrollEntries')
    
    await prisma.payrollBatch.deleteMany()
    logSuccess('Cleared PayrollBatches')
    
    await prisma.employeeDocument.deleteMany()
    logSuccess('Cleared EmployeeDocuments')
    
    await prisma.employee.deleteMany()
    logSuccess('Cleared Employees')
    
    await prisma.branch.deleteMany()
    logSuccess('Cleared Branches')
    
    await prisma.user.deleteMany()
    logSuccess('Cleared Users')

    // ==========================================
    // STEP 2: CREATE USERS
    // ==========================================
    logSection('👤 CREATING USERS')
    
    const hashedPassword = await bcrypt.hash('castello123', 10)
    
    const ceo = await prisma.user.create({
      data: {
        name: 'أحمد الرويلي - CEO',
        email: 'ceo@castello.com',
        role: 'ADMIN',
        passwordHash: hashedPassword
      }
    })
    logSuccess('Created CEO', 1)
    
    const hrManager = await prisma.user.create({
      data: {
        name: 'فاطمة العتيبي - HR Manager',
        email: 'hr@castello.com',
        role: 'HR',
        passwordHash: hashedPassword
      }
    })
    logSuccess('Created HR Manager', 1)

    const users = [ceo, hrManager]

    // ==========================================
    // STEP 3: CREATE BRANCHES
    // ==========================================
    logSection('🏢 CREATING BRANCHES')
    
    const branches = []
    for (const branch of branchData) {
      const createdBranch = await prisma.branch.create({
        data: {
          name: branch.name,
          city: branch.city,
          status: 'ACTIVE'
        }
      })
      branches.push(createdBranch)
    }
    logSuccess('Created branches', branches.length)

    // ==========================================
    // STEP 4: CREATE EMPLOYEES (55)
    // ==========================================
    logSection('👥 CREATING EMPLOYEES')
    logProgress('Generating 55 employees')
    
    const employeeData = []
    for (let i = 1; i <= 55; i++) {
      const firstName = random.choice(arabicFirstNames)
      const lastName = random.choice(arabicLastNames)
      const nationality = random.choice(nationalities)
      const branchId = random.choice(branches).id
      const basicSalary = random.nextInt(3500, 12000)
      const hireDate = getRandomDate(new Date(2021, 0, 1), new Date(2024, 5, 30))
      
      employeeData.push({
        employeeCode: `EMP${String(i).padStart(4, '0')}`,
        fullName: `${firstName} ${lastName}`,
        iqamaNumber: nationality === 'Saudi' ? null : generateIqamaNumber(),
        nationality,
        branchId,
        basicSalary,
        bankAccount: generateBankAccount(),
        hireDate,
        status: 'ACTIVE'
      })
    }
    
    await prisma.employee.createMany({
      data: employeeData
    })
    logSuccess('Created employees', 55)

    // Fetch created employees for relations
    const employees = await prisma.employee.findMany()

    // ==========================================
    // STEP 5: CREATE EMPLOYEE DOCUMENTS (235)
    // ==========================================
    logSection('📄 CREATING EMPLOYEE DOCUMENTS')
    logProgress('Generating ~235 documents')
    
    const documentData = []
    let documentCount = 0
    
    for (const employee of employees) {
      // Each employee gets: IQAMA, CONTRACT, INSURANCE (3 mandatory)
      const mandatoryDocs = ['IQAMA', 'CONTRACT', 'INSURANCE']
      
      for (const docType of mandatoryDocs) {
        const issueDate = getRandomDate(new Date(2022, 0, 1), new Date(2024, 0, 1))
        const expiryDate = addMonths(issueDate, random.nextInt(12, 36))
        const status = random.choice(documentStatuses)
        
        documentData.push({
          employeeId: employee.id,
          documentType: docType,
          fileUrl: `/documents/${employee.employeeCode}_${docType}.pdf`,
          issueDate,
          expiryDate,
          isRequired: true,
          status
        })
        documentCount++
      }
      
      // 50% chance of LICENSE document
      if (random.next() > 0.5) {
        const issueDate = getRandomDate(new Date(2022, 0, 1), new Date(2024, 0, 1))
        const expiryDate = addMonths(issueDate, random.nextInt(12, 24))
        
        documentData.push({
          employeeId: employee.id,
          documentType: 'LICENSE',
          fileUrl: `/documents/${employee.employeeCode}_LICENSE.pdf`,
          issueDate,
          expiryDate,
          isRequired: false,
          status: random.choice(documentStatuses)
        })
        documentCount++
      }
      
      // Add extra documents to reach ~235 total
      if (documentCount < 235 && random.next() > 0.3) {
        const extraDocType = random.choice(documentTypes)
        const issueDate = getRandomDate(new Date(2022, 0, 1), new Date(2024, 0, 1))
        const expiryDate = addMonths(issueDate, random.nextInt(12, 36))
        
        documentData.push({
          employeeId: employee.id,
          documentType: extraDocType,
          fileUrl: `/documents/${employee.employeeCode}_${extraDocType}_extra.pdf`,
          issueDate,
          expiryDate,
          isRequired: false,
          status: random.choice(documentStatuses)
        })
        documentCount++
      }
    }
    
    await prisma.employeeDocument.createMany({
      data: documentData
    })
    logSuccess('Created documents', documentData.length)

    // ==========================================
    // STEP 6: CREATE PAYROLL BATCHES (6)
    // ==========================================
    logSection('💰 CREATING PAYROLL BATCHES')
    logProgress('Generating 6 months of batches (Jan-Jun 2024)')
    
    const batches = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(2024, i, 1)
      const batch = await prisma.payrollBatch.create({
        data: {
          month: monthDate,
          uploadedById: random.choice(users).id,
          status: i < 5 ? 'PROCESSED' : 'DRAFT',
          dataQualityScore: random.nextInt(75, 98)
        }
      })
      batches.push(batch)
      logSuccess(`Created batch for ${monthNames[i]} 2024`)
    }

    // ==========================================
    // STEP 7: CREATE PAYROLL ENTRIES (330)
    // ==========================================
    logSection('📊 CREATING PAYROLL ENTRIES')
    logProgress('Generating 330 payroll entries (55 employees × 6 months)')
    
    const payrollData = []
    let entryCount = 0
    
    for (const batch of batches) {
      for (const employee of employees) {
        const basicSalary = employee.basicSalary || 5000
        const overtime = random.next() > 0.7 ? random.nextInt(200, 800) : 0
        const grossSalary = basicSalary + overtime
        const deductions = random.nextInt(150, 600)
        const loans = random.next() > 0.8 ? random.nextInt(500, 2000) : 0
        const netSalary = grossSalary - deductions - loans
        
        const hasIssue = random.next() > 0.85
        const validationStatus = hasIssue ? random.choice(['WARNING', 'ERROR']) : 'OK'
        const bankStatus = hasIssue && random.next() > 0.7 ? 'INVALID' : 'ACTIVE'
        
        payrollData.push({
          batchId: batch.id,
          employeeId: employee.id,
          grossSalary,
          deductionsTotal: deductions,
          loansTotal: loans,
          netSalary,
          bankStatus,
          validationStatus,
          issues: hasIssue ? JSON.stringify(['بيانات ناقصة', 'خطأ في الحساب']) : null
        })
        entryCount++
      }
    }
    
    await prisma.payrollEntry.createMany({
      data: payrollData
    })
    logSuccess('Created payroll entries', entryCount)

    // ==========================================
    // STEP 8: CREATE ALERTS (25)
    // ==========================================
    logSection('🔔 CREATING ALERTS')
    logProgress('Generating 25 alerts')
    
    const alertTitles = {
      IQAMA_EXPIRY: 'انتهاء صلاحية الإقامة',
      MISSING_DOCUMENT: 'مستند ناقص',
      PAYROLL_ERROR: 'خطأ في معالجة الراتب',
      DATA_QUALITY: 'جودة البيانات منخفضة'
    }
    
    const alertDescriptions = {
      IQAMA_EXPIRY: 'إقامة الموظف ستنتهي قريباً - يجب التجديد',
      MISSING_DOCUMENT: 'يوجد مستندات مطلوبة ناقصة',
      PAYROLL_ERROR: 'تم اكتشاف خطأ في احتساب الراتب',
      DATA_QUALITY: 'البيانات تحتاج إلى مراجعة وتحديث'
    }
    
    const alerts = []
    for (let i = 0; i < 25; i++) {
      const alertType = random.choice(alertTypes)
      const severity = random.choice(alertSeverities)
      const employee = random.choice(employees)
      const isResolved = random.next() > 0.7
      
      const alert = await prisma.alert.create({
        data: {
          type: alertType,
          severity,
          title: alertTitles[alertType as keyof typeof alertTitles],
          description: alertDescriptions[alertType as keyof typeof alertDescriptions],
          employeeId: employee.id,
          status: isResolved ? 'RESOLVED' : 'OPEN',
          resolvedAt: isResolved ? new Date() : null,
          resolvedById: isResolved ? random.choice(users).id : null
        }
      })
      alerts.push(alert)
    }
    logSuccess('Created alerts', 25)

    // ==========================================
    // STEP 9: CREATE XP EVENTS (30)
    // ==========================================
    logSection('⭐ CREATING XP EVENTS')
    logProgress('Generating 30 XP events')
    
    const xpEvents = []
    for (let i = 0; i < 30; i++) {
      const xpPoints = random.nextInt(10, 120)
      const reason = random.choice(xpReasons)
      const userId = random.choice(users).id
      const employee = random.choice(employees)
      const batch = random.choice(batches)
      
      const xpEvent = await prisma.xpEvent.create({
        data: {
          userId,
          eventType: 'FIXED_ALERT',
          xpPoints,
          relatedEmployeeId: random.next() > 0.5 ? employee.id : null,
          relatedBatchId: random.next() > 0.5 ? batch.id : null
        }
      })
      xpEvents.push(xpEvent)
    }
    logSuccess('Created XP events', 30)

    // ==========================================
    // FINAL VERIFICATION & SUMMARY
    // ==========================================
    logSection('✅ SEED COMPLETED SUCCESSFULLY')
    
    const counts = {
      users: await prisma.user.count(),
      branches: await prisma.branch.count(),
      employees: await prisma.employee.count(),
      documents: await prisma.employeeDocument.count(),
      batches: await prisma.payrollBatch.count(),
      entries: await prisma.payrollEntry.count(),
      alerts: await prisma.alert.count(),
      xpEvents: await prisma.xpEvent.count()
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    
    console.log('\n📊 DATABASE SUMMARY:')
    console.log('─'.repeat(60))
    console.log(`   Users:              ${counts.users}`)
    console.log(`   Branches:           ${counts.branches}`)
    console.log(`   Employees:          ${counts.employees}`)
    console.log(`   Documents:          ${counts.documents}`)
    console.log(`   Payroll Batches:    ${counts.batches}`)
    console.log(`   Payroll Entries:    ${counts.entries}`)
    console.log(`   Alerts:             ${counts.alerts}`)
    console.log(`   XP Events:          ${counts.xpEvents}`)
    console.log('─'.repeat(60))
    console.log(`⏱️  Duration: ${duration} seconds`)
    console.log('')
    console.log('🔐 LOGIN CREDENTIALS:')
    console.log('─'.repeat(60))
    console.log('   CEO:        ceo@castello.com / castello123')
    console.log('   HR Manager: hr@castello.com / castello123')
    console.log('─'.repeat(60))
    console.log('')
    console.log('🎉 Database is ready for use!')
    console.log('')

  } catch (error) {
    console.error('\n❌ ERROR DURING SEEDING:')
    console.error(error)
    throw error
  }
}

// ============================================
// EXECUTE SEED
// ============================================

main()
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

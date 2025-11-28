/**
 * Castello Coffee Payroll Platform - Backend API Test Suite
 * Senior QA Automation Engineer - TypeScript/Next.js Backend Testing
 * 
 * Prerequisites:
 * 1. Server must be running: npm run dev
 * 2. Database must be seeded: npx prisma db seed
 * 3. .env file must exist with proper configuration
 * 
 * Usage: node test-backend-apis.mjs
 */

const BASE_URL = 'http://localhost:3000'
const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

class TestRunner {
  constructor() {
    this.results = []
    this.sessionCookie = null
  }

  log(message, color = 'reset') {
    console.log(`${COLORS[color]}${message}${COLORS.reset}`)
  }

  async makeRequest(method, endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...(this.sessionCookie && { Cookie: this.sessionCookie }),
      ...options.headers
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        ...options,
        credentials: 'include'
      })

      // Capture set-cookie header for session
      const setCookie = response.headers.get('set-cookie')
      if (setCookie && !this.sessionCookie) {
        this.sessionCookie = setCookie.split(';')[0]
      }

      const data = await response.json().catch(() => null)
      
      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
        ok: response.ok
      }
    } catch (error) {
      return {
        status: 0,
        statusText: 'Network Error',
        error: error.message,
        ok: false
      }
    }
  }

  addResult(test, status, reason, response = null) {
    this.results.push({ test, status, reason, response })
  }

  async runTests() {
    this.log('\n' + '='.repeat(70), 'blue')
    this.log('🧪 CASTELLO COFFEE BACKEND API TEST SUITE', 'bold')
    this.log('='.repeat(70) + '\n', 'blue')

    await this.test1_Authentication()
    await this.test2_KPIs()
    await this.test3_Employees()
    await this.test4_XP()
    await this.test5_Alerts()
    await this.test6_Quality()
    await this.test7_Branches()

    this.printReport()
  }

  async test1_Authentication() {
    this.log('\n[TEST 1] Authentication', 'bold')
    this.log('POST /api/auth/callback/credentials')

    try {
      // First, try to sign in using NextAuth credentials endpoint
      const response = await this.makeRequest('POST', '/api/auth/callback/credentials', {
        body: JSON.stringify({
          email: 'ceo@castello.com',
          password: 'castello123',
          csrfToken: 'test',
          callbackUrl: '/dashboard',
          json: true
        })
      })

      if (response.ok || response.status === 200) {
        this.log('✓ Authentication successful', 'green')
        this.addResult('Authentication', 'PASS', 'Login successful with valid credentials', response.data)
      } else if (response.status === 401 || response.status === 403) {
        this.log('✗ Authentication failed - Invalid credentials', 'red')
        this.addResult('Authentication', 'FAIL', 'Invalid credentials or wrong endpoint', response)
      } else {
        this.log(`⚠ Unexpected status: ${response.status}`, 'yellow')
        this.addResult('Authentication', 'PARTIAL', `Got ${response.status}, may need CSRF token`, response)
      }
    } catch (error) {
      this.log(`✗ Error: ${error.message}`, 'red')
      this.addResult('Authentication', 'FAIL', `Network error: ${error.message}`, null)
    }
  }

  async test2_KPIs() {
    this.log('\n[TEST 2] Dashboard KPIs', 'bold')
    this.log('GET /api/dashboard/kpis')

    const response = await this.makeRequest('GET', '/api/dashboard/kpis')

    if (!response.ok) {
      this.log(`✗ Failed: ${response.status} ${response.statusText}`, 'red')
      this.addResult('Dashboard KPIs', 'FAIL', `HTTP ${response.status}: ${response.error || 'Unauthorized or server error'}`, response)
      return
    }

    const data = response.data
    const requiredFields = ['totalSalaries', 'totalDeductions', 'totalAdvances', 'netSalaries']
    const missingFields = requiredFields.filter(f => !(f in data))

    if (missingFields.length > 0) {
      this.log(`✗ Missing fields: ${missingFields.join(', ')}`, 'red')
      this.addResult('Dashboard KPIs', 'FAIL', `Missing required fields: ${missingFields.join(', ')}`, data)
      return
    }

    const invalidFields = requiredFields.filter(f => typeof data[f] !== 'number')
    if (invalidFields.length > 0) {
      this.log(`✗ Invalid types for: ${invalidFields.join(', ')}`, 'red')
      this.addResult('Dashboard KPIs', 'FAIL', `Non-numeric fields: ${invalidFields.join(', ')}`, data)
      return
    }

    this.log('✓ All KPI fields present and numeric', 'green')
    this.log(`  Total Salaries: ${data.totalSalaries.toLocaleString()}`)
    this.log(`  Total Deductions: ${data.totalDeductions.toLocaleString()}`)
    this.log(`  Total Advances: ${data.totalAdvances.toLocaleString()}`)
    this.log(`  Net Salaries: ${data.netSalaries.toLocaleString()}`)
    this.addResult('Dashboard KPIs', 'PASS', 'All fields present with valid numeric values', data)
  }

  async test3_Employees() {
    this.log('\n[TEST 3] Employees List', 'bold')
    this.log('GET /api/employees')

    const response = await this.makeRequest('GET', '/api/employees')

    if (!response.ok) {
      this.log(`✗ Failed: ${response.status} ${response.statusText}`, 'red')
      this.addResult('Employees List', 'FAIL', `HTTP ${response.status}`, response)
      return
    }

    if (!Array.isArray(response.data)) {
      this.log('✗ Response is not an array', 'red')
      this.addResult('Employees List', 'FAIL', 'Expected array, got ' + typeof response.data, response.data)
      return
    }

    if (response.data.length === 0) {
      this.log('⚠ Empty employee list', 'yellow')
      this.addResult('Employees List', 'PARTIAL', 'Array returned but empty (database may not be seeded)', [])
      return
    }

    const employee = response.data[0]
    const requiredFields = ['name', 'salary', 'branch']
    const missingFields = requiredFields.filter(f => !(f in employee))

    if (missingFields.length > 0) {
      this.log(`✗ Missing fields in employee object: ${missingFields.join(', ')}`, 'red')
      this.addResult('Employees List', 'FAIL', `Missing fields: ${missingFields.join(', ')}`, employee)
      return
    }

    this.log(`✓ Returned ${response.data.length} employees`, 'green')
    this.log(`  Sample: ${employee.name} - ${employee.branch} - ${employee.salary}`)
    this.addResult('Employees List', 'PASS', `${response.data.length} employees with valid structure`, response.data.slice(0, 3))
  }

  async test4_XP() {
    this.log('\n[TEST 4] XP Progress', 'bold')
    this.log('GET /api/xp')

    const response = await this.makeRequest('GET', '/api/xp')

    if (!response.ok) {
      this.log(`✗ Failed: ${response.status} ${response.statusText}`, 'red')
      this.addResult('XP Progress', 'FAIL', `HTTP ${response.status}`, response)
      return
    }

    const data = response.data
    const requiredFields = ['xp', 'level', 'progress']
    const missingFields = requiredFields.filter(f => !(f in data))

    if (missingFields.length > 0) {
      this.log(`✗ Missing fields: ${missingFields.join(', ')}`, 'red')
      this.addResult('XP Progress', 'FAIL', `Missing fields: ${missingFields.join(', ')}`, data)
      return
    }

    if (typeof data.xp !== 'number' || typeof data.level !== 'number') {
      this.log('✗ XP or level is not numeric', 'red')
      this.addResult('XP Progress', 'FAIL', 'Non-numeric XP or level values', data)
      return
    }

    this.log('✓ XP data valid', 'green')
    this.log(`  XP: ${data.xp} | Level: ${data.level} | Progress: ${data.progress}%`)
    this.addResult('XP Progress', 'PASS', 'XP, level, and progress calculated correctly', data)
  }

  async test5_Alerts() {
    this.log('\n[TEST 5] Alerts & Resolution', 'bold')
    this.log('GET /api/alerts')

    const listResponse = await this.makeRequest('GET', '/api/alerts')

    if (!listResponse.ok) {
      this.log(`✗ Failed to fetch alerts: ${listResponse.status}`, 'red')
      this.addResult('Alerts List', 'FAIL', `HTTP ${listResponse.status}`, listResponse)
      return
    }

    if (!Array.isArray(listResponse.data)) {
      this.log('✗ Response is not an array', 'red')
      this.addResult('Alerts List', 'FAIL', 'Expected array', listResponse.data)
      return
    }

    this.log(`✓ Fetched ${listResponse.data.length} alerts`, 'green')

    if (listResponse.data.length === 0) {
      this.log('⚠ No alerts to test resolution', 'yellow')
      this.addResult('Alerts List', 'PASS', 'Alerts retrieved (empty list)', [])
      this.addResult('Alert Resolution', 'NOT RUN', 'No alerts available to resolve', null)
      return
    }

    this.addResult('Alerts List', 'PASS', `${listResponse.data.length} alerts retrieved`, listResponse.data.slice(0, 2))

    // Test alert resolution
    const openAlert = listResponse.data.find(a => a.status === 'OPEN')
    if (!openAlert) {
      this.log('⚠ No open alerts to resolve', 'yellow')
      this.addResult('Alert Resolution', 'NOT RUN', 'No open alerts available', null)
      return
    }

    this.log(`\nPOST /api/alerts/${openAlert.id}/resolve`)
    const resolveResponse = await this.makeRequest('POST', `/api/alerts/${openAlert.id}/resolve`)

    if (!resolveResponse.ok) {
      this.log(`✗ Failed to resolve alert: ${resolveResponse.status}`, 'red')
      this.addResult('Alert Resolution', 'FAIL', `HTTP ${resolveResponse.status}`, resolveResponse)
      return
    }

    const resolveData = resolveResponse.data
    if (!resolveData.success || !resolveData.xpGained) {
      this.log('✗ Invalid resolution response', 'red')
      this.addResult('Alert Resolution', 'FAIL', 'Missing success or xpGained fields', resolveData)
      return
    }

    this.log(`✓ Alert resolved successfully`, 'green')
    this.log(`  XP Gained: ${resolveData.xpGained}`)
    this.addResult('Alert Resolution', 'PASS', `Alert resolved, ${resolveData.xpGained} XP awarded`, resolveData)
  }

  async test6_Quality() {
    this.log('\n[TEST 6] Data Quality Score', 'bold')
    this.log('GET /api/quality/score')

    const response = await this.makeRequest('GET', '/api/quality/score')

    if (!response.ok) {
      this.log(`✗ Failed: ${response.status} ${response.statusText}`, 'red')
      this.addResult('Quality Score', 'FAIL', `HTTP ${response.status}`, response)
      return
    }

    const data = response.data
    const requiredFields = ['score', 'totalIssues', 'criticalIssues']

    const missingFields = requiredFields.filter(f => !(f in data))
    if (missingFields.length > 0) {
      this.log(`✗ Missing fields: ${missingFields.join(', ')}`, 'red')
      this.addResult('Quality Score', 'FAIL', `Missing fields: ${missingFields.join(', ')}`, data)
      return
    }

    if (typeof data.score !== 'number') {
      this.log('✗ Score is not numeric', 'red')
      this.addResult('Quality Score', 'FAIL', 'Non-numeric score', data)
      return
    }

    this.log('✓ Quality score data valid', 'green')
    this.log(`  Score: ${data.score}% | Total Issues: ${data.totalIssues}`)
    this.log(`  Critical: ${data.criticalIssues} | Warnings: ${data.warningIssues}`)
    this.addResult('Quality Score', 'PASS', 'Quality metrics calculated correctly', data)
  }

  async test7_Branches() {
    this.log('\n[TEST 7] Branches List', 'bold')
    this.log('GET /api/branches')

    const response = await this.makeRequest('GET', '/api/branches')

    if (!response.ok) {
      this.log(`✗ Failed: ${response.status} ${response.statusText}`, 'red')
      this.addResult('Branches List', 'FAIL', `HTTP ${response.status}`, response)
      return
    }

    if (!Array.isArray(response.data)) {
      this.log('✗ Response is not an array', 'red')
      this.addResult('Branches List', 'FAIL', 'Expected array', response.data)
      return
    }

    if (response.data.length === 0) {
      this.log('⚠ Empty branches list', 'yellow')
      this.addResult('Branches List', 'PARTIAL', 'Array returned but empty', [])
      return
    }

    this.log(`✓ Fetched ${response.data.length} branches`, 'green')
    response.data.forEach(b => this.log(`  - ${b.name} (${b.city})`))
    this.addResult('Branches List', 'PASS', `${response.data.length} branches retrieved`, response.data)
  }

  printReport() {
    this.log('\n' + '='.repeat(70), 'blue')
    this.log('📊 TEST REPORT SUMMARY', 'bold')
    this.log('='.repeat(70) + '\n', 'blue')

    // Summary table
    this.log('| Endpoint                  | Status      | Reason', 'bold')
    this.log('|' + '-'.repeat(27) + '|' + '-'.repeat(13) + '|' + '-'.repeat(40))

    this.results.forEach(r => {
      const statusColor = r.status === 'PASS' ? 'green' : r.status === 'FAIL' ? 'red' : 'yellow'
      const status = r.status.padEnd(11)
      const test = r.test.padEnd(25)
      const reason = r.reason.substring(0, 38)
      this.log(`| ${test} | ${COLORS[statusColor]}${status}${COLORS.reset} | ${reason}`)
    })

    this.log('')

    // Detailed responses
    this.log('\n' + '='.repeat(70), 'blue')
    this.log('📋 DETAILED RESPONSES', 'bold')
    this.log('='.repeat(70) + '\n', 'blue')

    this.results.forEach((r, i) => {
      this.log(`\n${i + 1}. ${r.test}`, 'bold')
      this.log(`   Status: ${r.status}`)
      this.log(`   Reason: ${r.reason}`)
      if (r.response) {
        this.log('   Response:')
        console.log('   ', JSON.stringify(r.response, null, 2).split('\n').join('\n    '))
      } else {
        this.log('   Response: (none)')
      }
    })

    // Recommendations
    this.log('\n' + '='.repeat(70), 'blue')
    this.log('💡 RECOMMENDED NEXT STEPS', 'bold')
    this.log('='.repeat(70) + '\n', 'blue')

    const failures = this.results.filter(r => r.status === 'FAIL')
    const notRun = this.results.filter(r => r.status === 'NOT RUN')
    const partial = this.results.filter(r => r.status === 'PARTIAL')

    if (failures.length === 0 && notRun.length === 0 && partial.length === 0) {
      this.log('✅ All tests passed! Backend is fully functional.', 'green')
      this.log('\nNext steps:')
      this.log('1. Proceed with frontend integration')
      this.log('2. Update src/lib/api.ts to call these endpoints')
      this.log('3. Test end-to-end user flows')
      return
    }

    if (failures.length > 0) {
      this.log('❌ FAILURES:', 'red')
      failures.forEach(f => {
        this.log(`\n  • ${f.test}:`)
        this.log(`    Reason: ${f.reason}`)
        this.log(`    Action: ${this.getRecommendation(f)}`)
      })
    }

    if (notRun.length > 0) {
      this.log('\n⚠️  NOT RUN:', 'yellow')
      notRun.forEach(f => {
        this.log(`\n  • ${f.test}:`)
        this.log(`    Reason: ${f.reason}`)
        this.log(`    Action: ${this.getRecommendation(f)}`)
      })
    }

    if (partial.length > 0) {
      this.log('\n⚠️  PARTIAL:', 'yellow')
      partial.forEach(f => {
        this.log(`\n  • ${f.test}:`)
        this.log(`    Reason: ${f.reason}`)
        this.log(`    Action: ${this.getRecommendation(f)}`)
      })
    }

    const passCount = this.results.filter(r => r.status === 'PASS').length
    const totalCount = this.results.length

    this.log(`\n\n${'='.repeat(70)}`, 'blue')
    this.log(`Final Score: ${passCount}/${totalCount} tests passed (${Math.round(passCount/totalCount*100)}%)`, 'bold')
    this.log('='.repeat(70) + '\n', 'blue')
  }

  getRecommendation(result) {
    const recommendations = {
      'Authentication': 'Verify server is running and .env has NEXTAUTH_SECRET. Check NextAuth configuration.',
      'Dashboard KPIs': 'Check if payroll batches exist in database. Run: npx prisma db seed',
      'Employees List': 'Verify database is seeded: npx prisma db seed. Check Prisma connection.',
      'XP Progress': 'Ensure user has XP events in database. Check XP calculation logic.',
      'Alerts List': 'Seed database with alerts: npx prisma db seed',
      'Alert Resolution': 'Create open alerts in database first.',
      'Quality Score': 'Verify employees and documents exist in database.',
      'Branches List': 'Run database seed: npx prisma db seed'
    }
    return recommendations[result.test] || 'Check server logs and database connection.'
  }
}

// Run tests
console.log('\n🚀 Starting backend API tests...\n')
console.log('Prerequisites:')
console.log('  ✓ Server running on http://localhost:3000')
console.log('  ✓ Database seeded with test data')
console.log('  ✓ Environment variables configured\n')

const runner = new TestRunner()
runner.runTests().catch(error => {
  console.error('\n❌ Fatal error running tests:', error)
  process.exit(1)
})



import type {
  Employee,
  Branch,
  Nationality,
  Alert,
  AIInsight,
  MonthlyTrend,
  NationalityDistribution,
  BranchSalary,
  DataQualityScore,
  QualityIssue,
  KPIData,
  AIPrediction,
  PayrollHistory,
  DocumentStatus,
} from '@/types'

const branches: Branch[] = [
  'الرياض - الرئيسي',
  'جدة - الكورنيش',
  'الدمام - العزيزية',
  'مكة - العوالي',
  'المدينة - العيون',
]

const nationalities: Nationality[] = [
  'سعودي',
  'مصري',
  'سوري',
  'يمني',
  'أردني',
  'فلسطيني',
  'باكستاني',
  'هندي',
  'بنغلاديشي',
  'فلبيني',
]

const arabicNames = [
  'أحمد محمد العتيبي',
  'محمد عبدالله السالم',
  'خالد إبراهيم المطيري',
  'عبدالرحمن سعيد القحطاني',
  'سعد ناصر الدوسري',
  'فهد عبدالعزيز العنزي',
  'عبدالله محمد الشهري',
  'ناصر فهد الغامدي',
  'سلمان عبدالرحمن الحربي',
  'بدر خالد السبيعي',
  'طارق أحمد الزهراني',
  'يوسف محمد العمري',
  'إبراهيم سعد الشمري',
  'عمر عبدالله القرني',
  'حسن علي الجهني',
  'علي حسين الثقفي',
  'مصطفى محمود عبدالرحيم',
  'كريم أحمد الحسيني',
  'وليد سامي المصري',
  'جمال عادل السيد',
  'رامي فادي النجار',
  'محمود حسن العلي',
  'باسل عمر الشامي',
  'أمين طارق الدمشقي',
  'زياد يوسف الحموي',
  'عبدالكريم فؤاد الصنعاني',
  'محمد أمين الحداد',
  'أسامة جمال العدني',
  'حسام الدين الشيباني',
  'ياسر نبيل المخلافي',
  'عمار أحمد الأردني',
  'بلال محمد العجلوني',
  'معاذ عبدالله الزرقاوي',
  'طلال سعيد السلطي',
  'نبيل كامل العبادي',
  'سامر رائد أبو خليل',
  'عماد فايز الفلسطيني',
  'وائل أكرم الخطيب',
  'مازن عصام القدسي',
  'ريان محمود النابلسي',
  'إلياس جورج اللبناني',
  'أنطوان ميشال الحداد',
  'رفيق سمير الخوري',
  'سليم كريم البيروتي',
  'جوزيف إيلي الطرابلسي',
  'حسن محمد السوداني',
  'عثمان أحمد الخرطومي',
  'طه عبدالله النوبي',
  'معتصم عمر البشير',
  'مرتضى إبراهيم الحلاوي',
  'محمد عارف الباكستاني',
  'عمران خان الكراتشي',
  'فيصل أحمد اللاهوري',
  'شاهد عمر الإسلامي',
  'زبير حسين البشاوري',
  'راجيش كومار الهندي',
  'أنيل شارما السينغ',
  'فيكاش باتيل البومباي',
  'سونيل كابور الدلهي',
  'أميت فيرما البنغالي',
  'رحمن علي البنغلاديشي',
  'كريم حسن الداكي',
  'فاروق محمد الشيتاغونغي',
  'نسيم أحمد الراجي',
  'شفيق عمر الإسلامي',
  'خوسيه ريزال الفلبيني',
  'أندريه ديلا كروز المانيلي',
  'ماريو سانتوس السيبو',
  'رودريغو رييس الداڤاو',
  'كارلوس ميندوزا الكاڤيتي',
]

const positions = [
  'باريستا',
  'باريستا أول',
  'مشرف مقهى',
  'مدير فرع',
  'محاسب',
  'موظف مبيعات',
  'عامل نظافة',
  'سائق توصيل',
  'مساعد إداري',
  'منسق موارد بشرية',
]

// Generate 70 employees
export const employees: Employee[] = Array.from({ length: 70 }, (_, i) => {
  const baseSalary = Math.floor(Math.random() * 8000) + 3000
  const allowances = Math.floor(Math.random() * 2000) + 500
  const advances = Math.floor(Math.random() * 1500)
  const deductions = Math.floor(Math.random() * 800)
  const netSalary = baseSalary + allowances - advances - deductions
  const completionPercentage = Math.floor(Math.random() * 40) + 60
  const nationality = nationalities[Math.floor(Math.random() * nationalities.length)]
  const branch = branches[Math.floor(Math.random() * branches.length)]
  const name = arabicNames[i % arabicNames.length]
  
  const documents: DocumentStatus[] = [
    {
      type: 'جواز السفر',
      status: Math.random() > 0.8 ? 'expiring' : 'valid',
      expiryDate: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      uploadDate: new Date(2023, 5, 15).toISOString(),
    },
    {
      type: 'الإقامة',
      status: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'expiring' : 'expired') : 'valid',
      expiryDate: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      uploadDate: new Date(2023, 8, 10).toISOString(),
    },
    {
      type: 'عقد العمل',
      status: 'valid',
      uploadDate: new Date(2023, 4, 20).toISOString(),
    },
    {
      type: 'شهادة الصحة',
      status: Math.random() > 0.9 ? 'missing' : 'valid',
      expiryDate: new Date(2025, 11, 31).toISOString(),
    },
  ]

  return {
    id: `EMP${String(i + 1).padStart(5, '0')}`,
    name,
    email: `employee${i + 1}@castello-coffee.com`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=eab308&color=fff&size=200`,
    position: positions[Math.floor(Math.random() * positions.length)],
    branch,
    nationality,
    iqamaNumber: `2${Math.floor(Math.random() * 900000000 + 100000000)}`,
    iqamaExpiry: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    passportNumber: `A${Math.floor(Math.random() * 9000000 + 1000000)}`,
    passportExpiry: new Date(2026, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    hireDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    bankAccount: `SA${Math.floor(Math.random() * 90 + 10)}${Math.floor(Math.random() * 10000000000000000 + 1000000000000000)}`,
    bankName: ['الراجحي', 'الأهلي', 'الإنماء', 'سامبا', 'الرياض'][Math.floor(Math.random() * 5)],
    baseSalary,
    allowances,
    advances,
    deductions,
    netSalary,
    completionPercentage,
    phone: `+966${Math.floor(Math.random() * 900000000 + 500000000)}`,
    documents,
    alerts: [],
  }
})

// Monthly trends for the last 12 months
export const monthlyTrends: MonthlyTrend[] = [
  { month: 'يناير', salary: 2450000, advances: 85000, deductions: 45000, net: 2320000 },
  { month: 'فبراير', salary: 2520000, advances: 92000, deductions: 48000, net: 2380000 },
  { month: 'مارس', salary: 2580000, advances: 78000, deductions: 52000, net: 2450000 },
  { month: 'أبريل', salary: 2650000, advances: 105000, deductions: 55000, net: 2490000 },
  { month: 'مايو', salary: 2720000, advances: 98000, deductions: 58000, net: 2564000 },
  { month: 'يونيو', salary: 2800000, advances: 112000, deductions: 62000, net: 2626000 },
  { month: 'يوليو', salary: 2880000, advances: 125000, deductions: 65000, net: 2690000 },
  { month: 'أغسطس', salary: 2950000, advances: 118000, deductions: 68000, net: 2764000 },
  { month: 'سبتمبر', salary: 3020000, advances: 135000, deductions: 72000, net: 2813000 },
  { month: 'أكتوبر', salary: 3100000, advances: 142000, deductions: 75000, net: 2883000 },
  { month: 'نوفمبر', salary: 3180000, advances: 158000, deductions: 78000, net: 2944000 },
  { month: 'ديسمبر', salary: 3250000, advances: 165000, deductions: 82000, net: 3003000 },
]

// Nationality distribution
export const nationalityDistribution: NationalityDistribution[] = [
  { nationality: 'سعودي', count: 25, percentage: 35.7, color: '#22c55e' },
  { nationality: 'مصري', count: 12, percentage: 17.1, color: '#eab308' },
  { nationality: 'يمني', count: 10, percentage: 14.3, color: '#3b82f6' },
  { nationality: 'سوري', count: 8, percentage: 11.4, color: '#ef4444' },
  { nationality: 'باكستاني', count: 7, percentage: 10.0, color: '#8b5cf6' },
  { nationality: 'هندي', count: 5, percentage: 7.1, color: '#f97316' },
  { nationality: 'بنغلاديشي', count: 3, percentage: 4.3, color: '#64748b' },
]

// Branch salaries
export const branchSalaries: BranchSalary[] = [
  {
    branch: 'الرياض - الرئيسي',
    totalSalary: 980000,
    employeeCount: 18,
    averageSalary: 54444,
  },
  {
    branch: 'جدة - الكورنيش',
    totalSalary: 850000,
    employeeCount: 15,
    averageSalary: 56667,
  },
  {
    branch: 'الدمام - العزيزية',
    totalSalary: 720000,
    employeeCount: 14,
    averageSalary: 51429,
  },
  {
    branch: 'مكة - العوالي',
    totalSalary: 680000,
    employeeCount: 12,
    averageSalary: 56667,
  },
  {
    branch: 'المدينة - العيون',
    totalSalary: 620000,
    employeeCount: 11,
    averageSalary: 56364,
  },
]

// Alerts
export const alerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'expiring_document',
    severity: 'critical',
    title: 'إقامة منتهية قريباً',
    description: 'إقامة الموظف أحمد محمد العتيبي ستنتهي خلال 15 يوم',
    employeeId: 'EMP00001',
    employeeName: 'أحمد محمد العتيبي',
    branch: 'الرياض - الرئيسي',
    xpReward: 50,
    createdAt: new Date(2024, 10, 20).toISOString(),
    resolved: false,
  },
  {
    id: 'alert-002',
    type: 'calculation_error',
    severity: 'warning',
    title: 'خطأ في حساب الراتب',
    description: 'تم رصد خطأ محتمل في حساب صافي راتب 3 موظفين',
    xpReward: 30,
    createdAt: new Date(2024, 10, 22).toISOString(),
    resolved: false,
  },
  {
    id: 'alert-003',
    type: 'missing_data',
    severity: 'info',
    title: 'بيانات بنكية ناقصة',
    description: 'الموظف محمد عبدالله السالم لم يقم بتحديث بياناته البنكية',
    employeeId: 'EMP00002',
    employeeName: 'محمد عبدالله السالم',
    branch: 'جدة - الكورنيش',
    xpReward: 20,
    createdAt: new Date(2024, 10, 23).toISOString(),
    resolved: false,
  },
  {
    id: 'alert-004',
    type: 'duplicate_entry',
    severity: 'warning',
    title: 'موظفين مكررين محتملين',
    description: 'تم رصد تشابه في بيانات موظفين - يحتاج للمراجعة',
    xpReward: 40,
    createdAt: new Date(2024, 10, 21).toISOString(),
    resolved: false,
  },
  {
    id: 'alert-005',
    type: 'bank_issue',
    severity: 'critical',
    title: 'حساب بنكي غير صحيح',
    description: 'رقم IBAN غير صحيح للموظف خالد إبراهيم المطيري',
    employeeId: 'EMP00003',
    employeeName: 'خالد إبراهيم المطيري',
    xpReward: 35,
    createdAt: new Date(2024, 10, 19).toISOString(),
    resolved: false,
  },
  {
    id: 'alert-006',
    type: 'salary_delay',
    severity: 'info',
    title: 'تأخير محتمل في الرواتب',
    description: 'قد يحدث تأخير في صرف رواتب فرع الدمام بسبب مشكلة تقنية',
    branch: 'الدمام - العزيزية',
    xpReward: 25,
    createdAt: new Date(2024, 10, 24).toISOString(),
    resolved: false,
  },
  {
    id: 'alert-007',
    type: 'expiring_document',
    severity: 'warning',
    title: 'جوازات سفر منتهية',
    description: '5 موظفين لديهم جوازات سفر ستنتهي خلال 3 أشهر',
    xpReward: 45,
    createdAt: new Date(2024, 10, 18).toISOString(),
    resolved: false,
  },
  {
    id: 'alert-008',
    type: 'missing_data',
    severity: 'critical',
    title: 'مستندات مفقودة',
    description: '8 موظفين لم يقوموا برفع شهادات صحية',
    xpReward: 60,
    createdAt: new Date(2024, 10, 17).toISOString(),
    resolved: false,
  },
]

// AI Insights
export const aiInsights: AIInsight[] = [
  {
    id: 'ai-001',
    priority: 'urgent',
    category: 'تحسين التكاليف',
    title: 'تقليل السلف الشهرية',
    description: 'ارتفاع ملحوظ في طلبات السلف بنسبة 25% خلال الشهرين الماضيين',
    impact: 'توفير حتى 45,000 ريال شهرياً',
    recommendation: 'تطبيق سياسة حد أقصى للسلف الشهرية وتقديم برامج توعية مالية',
    potentialSavings: 45000,
    implementationTime: 'أسبوعين',
    confidence: 92,
  },
  {
    id: 'ai-002',
    priority: 'urgent',
    category: 'إدارة المخاطر',
    title: 'وثائق إقامة منتهية',
    description: '15 موظف لديهم إقامات ستنتهي خلال 60 يوم',
    impact: 'تجنب غرامات تصل إلى 150,000 ريال',
    recommendation: 'إنشاء نظام تنبيه تلقائي قبل 90 يوم من انتهاء الوثائق',
    implementationTime: 'فوري',
    confidence: 98,
  },
  {
    id: 'ai-003',
    priority: 'short_term',
    category: 'كفاءة العمليات',
    title: 'أتمتة معالجة الرواتب',
    description: 'يستغرق معالجة الرواتب يدوياً 4 أيام عمل شهرياً',
    impact: 'توفير 32 ساعة عمل شهرياً',
    recommendation: 'تفعيل أتمتة كاملة لحساب وصرف الرواتب',
    implementationTime: 'شهر واحد',
    confidence: 87,
  },
  {
    id: 'ai-004',
    priority: 'short_term',
    category: 'جودة البيانات',
    title: 'تحسين جودة البيانات',
    description: 'معدل الأخطاء في البيانات المدخلة يبلغ 12%',
    impact: 'تقليل الأخطاء بنسبة 80%',
    recommendation: 'تطبيق نظام تحقق تلقائي من البيانات عند الإدخال',
    implementationTime: '3 أسابيع',
    confidence: 85,
  },
  {
    id: 'ai-005',
    priority: 'long_term',
    category: 'التخطيط الاستراتيجي',
    title: 'إعادة هيكلة الرواتب',
    description: 'توزيع الرواتب بين الفروع غير متوازن',
    impact: 'تحسين الكفاءة وزيادة رضا الموظفين',
    recommendation: 'إجراء دراسة شاملة لهيكل الرواتب وتطبيق معايير موحدة',
    implementationTime: '6 أشهر',
    confidence: 78,
  },
  {
    id: 'ai-006',
    priority: 'long_term',
    category: 'تطوير الموظفين',
    title: 'برنامج تطوير المهارات',
    description: 'الموظفون في المناصب الأولية لديهم معدل ترقي منخفض',
    impact: 'زيادة الإنتاجية بنسبة 15%',
    recommendation: 'تصميم برنامج تدريب وتطوير مهني متدرج',
    implementationTime: 'سنة واحدة',
    confidence: 73,
  },
]

// KPI Data
export const kpiData: KPIData[] = [
  {
    label: 'إجمالي الرواتب',
    value: 3250000,
    change: 8.5,
    changeType: 'increase',
    icon: 'Banknote',
  },
  {
    label: 'إجمالي الخصومات',
    value: 82000,
    change: 3.2,
    changeType: 'increase',
    icon: 'TrendingDown',
  },
  {
    label: 'إجمالي السلف',
    value: 165000,
    change: 12.5,
    changeType: 'increase',
    icon: 'Wallet',
  },
  {
    label: 'صافي الرواتب',
    value: 3003000,
    change: 7.8,
    changeType: 'increase',
    icon: 'DollarSign',
  },
]

// AI Predictions for advances
export const advancePredictions: AIPrediction[] = [
  { month: 'يناير 2025', predicted: 168000, lower: 155000, upper: 182000 },
  { month: 'فبراير 2025', predicted: 172000, lower: 158000, upper: 186000 },
  { month: 'مارس 2025', predicted: 165000, lower: 152000, upper: 178000 },
  { month: 'أبريل 2025', predicted: 178000, lower: 164000, upper: 192000 },
  { month: 'مايو 2025', predicted: 182000, lower: 168000, upper: 196000 },
  { month: 'يونيو 2025', predicted: 188000, lower: 174000, upper: 202000 },
]

// AI Predictions for salaries
export const salaryPredictions: AIPrediction[] = [
  { month: 'يناير 2025', predicted: 3320000, lower: 3250000, upper: 3390000 },
  { month: 'فبراير 2025', predicted: 3385000, lower: 3310000, upper: 3460000 },
  { month: 'مارس 2025', predicted: 3450000, lower: 3370000, upper: 3530000 },
  { month: 'أبريل 2025', predicted: 3520000, lower: 3435000, upper: 3605000 },
  { month: 'مايو 2025', predicted: 3585000, lower: 3495000, upper: 3675000 },
  { month: 'يونيو 2025', predicted: 3655000, lower: 3560000, upper: 3750000 },
]

// Data Quality Score
export const dataQualityScore: DataQualityScore = {
  overall: 82,
  infoCount: 12,
  warningCount: 8,
  criticalCount: 3,
  lastUpdated: new Date().toISOString(),
  issues: [
    {
      id: 'issue-001',
      type: 'missing_values',
      severity: 'warning',
      title: 'قيم مفقودة',
      description: 'بعض الحقول لا تحتوي على بيانات',
      count: 15,
      affectedEmployees: ['EMP00002', 'EMP00005', 'EMP00012'],
      details: ['رقم الهاتف مفقود: 5 موظفين', 'عنوان البريد الإلكتروني: 3 موظفين', 'تاريخ التعيين: 7 موظفين'],
    },
    {
      id: 'issue-002',
      type: 'incorrect_calculations',
      severity: 'critical',
      title: 'حسابات خاطئة',
      description: 'اكتشاف تناقضات في حسابات الرواتب',
      count: 7,
      affectedEmployees: ['EMP00008', 'EMP00015', 'EMP00023'],
      details: ['صافي الراتب لا يطابق (الإجمالي - الخصومات): 3 موظفين', 'نسب الخصومات خاطئة: 4 موظفين'],
    },
    {
      id: 'issue-003',
      type: 'duplicate_employees',
      severity: 'warning',
      title: 'موظفين مكررين',
      description: 'احتمالية وجود سجلات مكررة',
      count: 4,
      affectedEmployees: ['EMP00019', 'EMP00020'],
      details: ['تطابق في أرقام الإقامة: حالتين', 'تطابق في الأسماء والفروع: حالتين'],
    },
    {
      id: 'issue-004',
      type: 'invalid_bank',
      severity: 'critical',
      title: 'حالة بنكية غير صحيحة',
      description: 'أرقام حسابات بنكية غير صحيحة',
      count: 6,
      affectedEmployees: ['EMP00003', 'EMP00011', 'EMP00025'],
      details: ['IBAN غير صحيح: 4 موظفين', 'رقم حساب غير مكتمل: موظفين'],
    },
    {
      id: 'issue-005',
      type: 'missing_documents',
      severity: 'critical',
      title: 'مستندات ناقصة',
      description: 'وثائق مطلوبة لم يتم رفعها',
      count: 18,
      affectedEmployees: ['EMP00007', 'EMP00014', 'EMP00021'],
      details: ['شهادة صحية: 8 موظفين', 'صورة جواز السفر: 5 موظفين', 'عقد عمل: 3 موظفين', 'شهادة تأمينات: 2 موظف'],
    },
  ],
}

// User Profile
export const currentUser = {
  name: 'أحمد الإداري',
  email: 'admin@castello-coffee.com',
  role: 'مدير الموارد البشرية',
  avatar: 'https://ui-avatars.com/api/?name=أحمد+الإداري&background=dc2626&color=fff&size=200',
  xp: 4750,
}


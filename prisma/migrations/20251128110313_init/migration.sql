-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "passwordHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE'
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeCode" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "iqamaNumber" TEXT,
    "nationality" TEXT,
    "branchId" INTEGER,
    "basicSalary" REAL,
    "bankAccount" TEXT,
    "hireDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "Employee_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeDocument" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT,
    "issueDate" DATETIME,
    "expiryDate" DATETIME,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'MISSING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmployeeDocument_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PayrollBatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" DATETIME NOT NULL,
    "uploadedById" INTEGER,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "dataQualityScore" REAL,
    CONSTRAINT "PayrollBatch_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PayrollEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "batchId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "grossSalary" REAL NOT NULL,
    "deductionsTotal" REAL NOT NULL,
    "loansTotal" REAL NOT NULL,
    "netSalary" REAL NOT NULL,
    "bankStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "validationStatus" TEXT NOT NULL DEFAULT 'OK',
    "issues" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PayrollEntry_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "PayrollBatch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PayrollEntry_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "employeeId" INTEGER,
    "payrollEntryId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME,
    "resolvedById" INTEGER,
    CONSTRAINT "Alert_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Alert_payrollEntryId_fkey" FOREIGN KEY ("payrollEntryId") REFERENCES "PayrollEntry" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Alert_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "XpEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "xpPoints" INTEGER NOT NULL,
    "relatedEmployeeId" INTEGER,
    "relatedBatchId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "XpEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "XpEvent_relatedEmployeeId_fkey" FOREIGN KEY ("relatedEmployeeId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "XpEvent_relatedBatchId_fkey" FOREIGN KEY ("relatedBatchId") REFERENCES "PayrollBatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeCode_key" ON "Employee"("employeeCode");

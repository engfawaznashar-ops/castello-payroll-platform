# 🔧 دليل إعداد Supabase - Setup Guide

## خطوة بخطوة: الحصول على Connection String الصحيح

### 1. افتح Supabase Dashboard
```
https://supabase.com/dashboard/projects
```

### 2. اختر مشروعك
```
Project: rkqqnsegffkpsssdtpfu
```

### 3. اذهب إلى إعدادات قاعدة البيانات
```
Settings (⚙️) → Database → Connection string
```

### 4. اختر نوع الاتصال

#### الخيار A: Session Mode (للتطوير المحلي)
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.rkqqnsegffkpsssdtpfu.supabase.co:5432/postgres"
```

#### الخيار B: Transaction Mode (موصى به للإنتاج)
```env
DATABASE_URL="postgresql://postgres.rkqqnsegffkpsssdtpfu:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### 5. استبدل [YOUR-PASSWORD]

إذا كانت كلمة المرور: `F@waz1980`

قم بتشفير @ إلى %40:
```
F%40waz1980
```

### 6. Connection String الكامل (مثال)

```env
# Session Mode
DATABASE_URL="postgresql://postgres:F%40waz1980@db.rkqqnsegffkpsssdtpfu.supabase.co:5432/postgres"

# Transaction Mode (مع Connection Pooling)
DATABASE_URL="postgresql://postgres.rkqqnsegffkpsssdtpfu:F%40waz1980@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

---

## اختبار الاتصال

### الطريقة 1: باستخدام Prisma
```powershell
npx prisma db push
```

إذا نجح، ستشاهد:
```
✔ Generated Prisma Client
✔ Database schema synchronized with Prisma schema
```

### الطريقة 2: باستخدام psql (إذا متوفر)
```powershell
psql "postgresql://postgres:F%40waz1980@db.rkqqnsegffkpsssdtpfu.supabase.co:5432/postgres"
```

### الطريقة 3: من Supabase Dashboard
```
1. اذهب إلى Database → Tables
2. إذا كان يمكنك رؤية الجداول = الاتصال يعمل
```

---

## حل المشاكل الشائعة

### مشكلة: Can't reach database server

**الحلول:**

1. **تحقق من حالة المشروع:**
   - في Supabase Dashboard، تأكد أن المشروع ليس معلقاً (Paused)
   - إذا كان معلقاً، اضغط "Resume project"

2. **تحقق من IP المسموح:**
   - Settings → Database → Connection pooling
   - تأكد أن "IPv4 Address" مضافة أو استخدم `0.0.0.0/0` للسماح لجميع IPs

3. **استخدم Connection Pooler:**
   - جرب Transaction mode بدلاً من Direct connection

4. **تحقق من جدار الحماية:**
   - قد يكون المنفذ 5432 محظوراً
   - جرب منفذ 6543 (Connection Pooler)

5. **استخدام Supabase CLI للاختبار:**
```bash
npm install -g supabase
supabase link --project-ref rkqqnsegffkpsssdtpfu
```

---

## بعد نجاح الاتصال

### 1. Push Schema
```powershell
npx prisma db push
```

### 2. Generate Prisma Client
```powershell
npx prisma generate
```

### 3. Run Seed
```powershell
npx prisma db seed
```

### 4. Verify with Prisma Studio
```powershell
npx prisma studio
```
يفتح على: `http://localhost:5555`

---

## النتيجة المتوقعة بعد Seed

### الجداول المتوقعة:
- ✅ User (2 records)
- ✅ Branch (5 records)
- ✅ Employee (55 records)
- ✅ EmployeeDocument (235 records)
- ✅ PayrollBatch (6 records)
- ✅ PayrollEntry (330 records)
- ✅ Alert (25 records)
- ✅ XpEvent (30 records)

---

## معلومات الاتصال السريعة

```
Host: db.rkqqnsegffkpsssdtpfu.supabase.co
Port: 5432 (direct) or 6543 (pooler)
Database: postgres
User: postgres
Password: F@waz1980
Schema: public
SSL Mode: require
```

---

## أوامر مفيدة

```powershell
# فحص schema الحالي
npx prisma db pull

# إعادة تعيين قاعدة البيانات (خطر!)
npx prisma migrate reset

# التحقق من حالة Migrations
npx prisma migrate status

# توليد Prisma Client
npx prisma generate
```

---

## الخطوة التالية

بعد نجاح الاتصال والـ seed، ارجع إلى:
```
DEPLOYMENT_STATUS.md
```
لمتابعة باقي خطوات النشر.



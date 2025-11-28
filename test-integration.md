# 🧪 Integration Testing Guide

## Quick Test Commands

### 1. Start Development Server
```bash
# Terminal 1
npm run dev
```

### 2. Verify Server Running
Open browser: `http://localhost:3000`

Expected: Redirect to `/login`

---

## Test Scenarios

### ✅ Scenario 1: Authentication Flow
```
1. Navigate to: http://localhost:3000
   Expected: Redirect to /login

2. Enter credentials:
   Email: ceo@castello.com
   Password: castello123

3. Click login button
   Expected: Redirect to /dashboard

4. Check Navbar
   Expected: Shows user name "أحمد المدير" or session user

5. Click logout icon (red button)
   Expected: Redirect back to /login
```

**Alternative User:**
```
Email: hr@castello.com
Password: castello123
```

---

### ✅ Scenario 2: Dashboard Data
```
1. Login and navigate to /dashboard

2. Verify XP Bar:
   - Shows level number
   - Shows progress percentage
   - Gold gradient animation

3. Verify KPI Cards (4 cards):
   - إجمالي الرواتب
   - إجمالي الخصومات
   - إجمالي السلف
   - صافي الرواتب
   - All show numbers (not 0)
   - Percentage changes displayed

4. Verify Charts:
   - Line chart shows monthly trends
   - Donut chart shows nationality distribution
   - Bar chart shows branch salaries
   - All have data points
```

---

### ✅ Scenario 3: Employees List
```
1. Navigate to: /employees

2. Verify employee list loads:
   - Shows multiple employees
   - Each has avatar (generated)
   - Shows salary, deductions, net
   - Shows completion percentage

3. Click on first employee
   Expected: Navigate to detail page

4. On detail page verify:
   - Employee info displayed
   - Documents section shows
   - Payroll history (table)
   - Employee alerts (if any)
```

---

### ✅ Scenario 4: Alert Resolution & XP
```
1. Navigate to: /alerts

2. Find an unresolved alert (not grayed out)

3. Note current XP level in navbar area

4. Click "تم الحل" button on alert

5. Verify:
   - Button shows spinner "جاري الحل..."
   - Alert becomes grayed out
   - Green checkmark appears
   - +XP animation bounces (e.g., +50 XP)

6. Check XP bar:
   - XP total increased
   - Progress bar moved forward
   - Level may have increased
```

---

### ✅ Scenario 5: Data Quality
```
1. Navigate to: /quality

2. Verify quality score displays:
   - Large percentage number
   - Color-coded ring (green/yellow/red)

3. Verify issue cards:
   - Shows different issue types
   - Each has count and severity
   - Icons match severity
```

---

## API Testing (curl)

### Test Employees Endpoint
```bash
curl http://localhost:3000/api/employees \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Test KPIs Endpoint
```bash
curl http://localhost:3000/api/dashboard/kpis \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Test XP Endpoint
```bash
curl http://localhost:3000/api/xp \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

---

## Automated Test Script

Run the backend API test suite:
```bash
node test-backend-apis.mjs
```

This will:
- Test all API endpoints
- Verify response formats
- Check authentication
- Validate data structure

---

## Troubleshooting

### Issue: Can't login
**Solution:**
```bash
# Re-seed database
npx prisma db seed
```

### Issue: No data showing
**Solution:**
```bash
# Check database exists
ls prisma/dev.db

# If not, run migrations and seed
npx prisma migrate dev
npx prisma db seed
```

### Issue: Server won't start
**Solution:**
```bash
# Kill any existing processes
taskkill /F /IM node.exe

# Clear build cache
Remove-Item -Path .next -Recurse -Force

# Restart
npm run dev
```

### Issue: 401 Unauthorized on API calls
**Solution:**
- Make sure you're logged in
- Check browser console for session cookie
- Try logging out and back in

---

## Expected Results Summary

✅ **Authentication:** Login/logout works  
✅ **Dashboard:** KPIs and charts show real data  
✅ **Employees:** List and details load properly  
✅ **Alerts:** Can resolve and earn XP  
✅ **XP System:** Updates in real-time  
✅ **Quality:** Score calculates correctly  

---

## Database Inspection

Use Prisma Studio to view database:
```bash
npx prisma studio
```

Opens GUI at `http://localhost:5555`

Check:
- Users table (2 users)
- Employees table (55 employees)
- Alerts table (25 alerts)
- XpEvent table (XP records)
- PayrollBatch table (6 batches)

---

## Performance Checks

1. **Initial Load Time:** < 3 seconds
2. **Alert Resolution:** < 1 second
3. **XP Update:** Immediate
4. **Chart Rendering:** < 2 seconds
5. **Employee List:** < 2 seconds

---

## Next Steps After Testing

If all tests pass:
1. ✅ System is production-ready
2. ✅ Deploy to staging environment
3. ✅ Configure production database
4. ✅ Set up environment variables
5. ✅ Enable production optimizations

If any tests fail:
1. Check console logs (F12)
2. Verify database is seeded
3. Check API routes in `/api/` folders
4. Review `INTEGRATION_COMPLETE.md` for details



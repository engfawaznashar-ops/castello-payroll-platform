# تعليمات إضافة شعار Castello Coffee

## الخطوة 1: تحميل الشعار

1. قم بتحميل شعار الشركة من الرابط:
   https://i.postimg.cc/jSJTvW4f/4bw11l17jtsb1.jpg

2. احفظ الصورة باسم `castello-logo.png` أو `castello-logo.svg`

## الخطوة 2: إضافة الشعار للمشروع

ضع ملف الشعار في المجلد:
```
public/castello-logo.png
```

أو إذا كان SVG:
```
public/castello-logo.svg
```

## الخطوة 3: تحديث الكود

إذا كنت تستخدم PNG بدلاً من SVG، قم بتحديث الملف `src/components/Navbar.tsx`:

```tsx
<Image
  src="/castello-logo.png"  // غير من .svg إلى .png
  alt="Castello Coffee Logo"
  width={64}
  height={64}
  className="object-contain"
  priority
/>
```

## الألوان المستخدمة من الشعار

الشعار يحتوي على الألوان التالية والتي تم دمجها في التصميم:

- **الأحمر الأساسي**: `#dc2626` (من الدرع/Shield)
- **الأحمر الداكن**: `#991b1b` (ظلال الدرع)
- **الذهبي**: `#eab308` (التفاصيل والأكسنت)
- **الرمادي الداكن**: `#1f2937` (الشريط الأسود)
- **الأبيض**: `#ffffff` (فنجان القهوة والنص)

هذه الألوان موجودة بالفعل في ملف `tailwind.config.ts` تحت:
- `castello.red.*`
- `castello.gold.*`

## ملاحظات:

- الشعار الحالي في المجلد `public/` هو placeholder
- استبدله بالشعار الحقيقي للحصول على أفضل نتيجة
- الشعار سيظهر في الـ Navbar في الزاوية اليمنى العليا
- يمكنك تعديل الحجم من خلال تغيير قيم `width` و `height`



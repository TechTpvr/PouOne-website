# PouOne — وب‌سایت رسمی

وب‌سایت تک‌صفحه‌ای و استاتیک مجموعه PouOne (دامنه: **pouone.ir**) با محصولات SharePou، RoutePou، PrintPou و ConnectPou.

- بدون بک‌اند، بدون دیتابیس، بدون ابزار Build؛ فقط HTML + CSS + JavaScript
- فارسی و راست‌چین (RTL)، تم تیره، کاملاً ریسپانسیو
- با انتخاب هر محصول، بخش توضیحات و دانلود همان محصول پایین کارت‌ها باز می‌شود

## ساختار پروژه

```
.
├── index.html                  صفحه اصلی (تنها صفحه سایت)
├── assets/
│   ├── css/style.css           تمام استایل‌ها
│   ├── js/
│   │   ├── config.js           ← لینک‌های دانلود و اطلاعات تماس (اینجا ویرایش کنید)
│   │   ├── products.js         ← متن کامل محصولات
│   │   └── app.js              منطق صفحه
│   └── img/                    لوگوها، آیکون‌ها و تصویر اشتراک‌گذاری
├── CNAME                       دامنه pouone.ir برای GitHub Pages
├── .nojekyll
├── .github/workflows/pages.yml انتشار خودکار (اختیاری)
├── robots.txt
└── sitemap.xml
```

## اجرا روی کامپیوتر

فایل `index.html` را مستقیم در مرورگر باز کنید، یا برای شبیه‌سازی دقیق‌تر یک سرور محلی اجرا کنید:

```bash
python3 -m http.server 8080
# سپس: http://localhost:8080
```

## افزودن لینک دانلود

فایل `assets/js/config.js` را باز کنید و آدرس هر نسخه را بنویسید:

```js
sharepou: { android: "https://pouone.ir/downloads/SharePou.apk", windows: "https://..." },
```

- مقدار خالی (`""`) یعنی دکمه به‌صورت غیرفعال و با برچسب «به‌زودی» نمایش داده شود.
- فقط لینک‌های `https://` یا فایل‌های همین سایت پذیرفته می‌شوند.

## اطلاعات تماس

در همان فایل `config.js` بخش `contact` را پر کنید (ایمیل، تلگرام، اینستاگرام، تلفن). موارد خالی نمایش داده نمی‌شوند و هیچ اطلاعات ساختگی‌ای در سایت وجود ندارد.

## ویرایش متن‌ها

- نام و توضیح کوتاه هر محصول: کارت‌های `index.html`
- توضیح کامل و کاربردها: `assets/js/products.js`
- متن‌های محصولات بر پایه توضیحات اولیه نوشته شده‌اند؛ پیش از انتشار آن‌ها را با ویژگی‌های واقعی هر نرم‌افزار تطبیق دهید (به‌ویژه ConnectPou).

## فونت Vazirmatn

فونت از Google Fonts بارگذاری می‌شود. چون بخشی از کاربران ایران ممکن است به Google Fonts دسترسی پایدار نداشته باشند، **توصیه می‌شود فونت را روی خود سایت قرار دهید**:

1. فایل `Vazirmatn[wght].woff2` را از [مخزن رسمی Vazirmatn](https://github.com/rastikerdar/vazirmatn) دانلود کنید و در `assets/fonts/` بگذارید.
2. در `assets/css/style.css` (بالای فایل) اضافه کنید:
   ```css
   @font-face {
     font-family: "Vazirmatn";
     src: url("../fonts/Vazirmatn[wght].woff2") format("woff2");
     font-weight: 100 900;
     font-display: swap;
   }
   ```
3. در `index.html` سه تگ `preconnect` و `stylesheet` مربوط به `fonts.googleapis.com` را حذف کنید و در متا‌تگ `Content-Security-Policy` عبارت‌های `https://fonts.googleapis.com` و `https://fonts.gstatic.com` را بردارید.

تا قبل از این کار، در صورت نرسیدن فونت، سایت با Tahoma / فونت سیستم نمایش داده می‌شود و کاملاً قابل استفاده است.

## انتشار روی GitHub Pages با دامنه pouone.ir

1. مخزن جدید بسازید و محتوای این پوشه را در شاخه `main` قرار دهید.
2. یکی از دو روش را انتخاب کنید:
   - **ساده (بدون Actions):** Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`. در این حالت پوشه `.github/workflows` را حذف کنید.
   - **با Actions:** Settings → Pages → Source: *GitHub Actions*. با هر Push، `pages.yml` سایت را منتشر می‌کند.
3. در بخش Pages، Custom domain را `pouone.ir` بگذارید (فایل `CNAME` از قبل آماده است) و پس از صدور گواهی، **Enforce HTTPS** را فعال کنید.
4. در DNS دامنه:
   - برای دامنه اصلی (apex) چهار رکورد `A`: `185.199.108.153`، `185.199.109.153`، `185.199.110.153`، `185.199.111.153`
   - برای `www` یک رکورد `CNAME` به `USERNAME.github.io`

   (آدرس‌های بالا طبق مستندات فعلی GitHub Pages است؛ پیش از ثبت، آن‌ها را در [مستندات GitHub](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site) بررسی کنید.)

## نکات فنی

- امنیت: سیاست `Content-Security-Policy` محدود، بدون اسکریپت یا استایل درون‌خطی، لینک‌های دانلود اعتبارسنجی‌شده، ساخت DOM با `textContent`
- دسترس‌پذیری: لینک «رفتن به محتوا»، فوکوس قابل‌مشاهده، کنترل کامل با کیبورد (Enter برای باز کردن، Esc برای بستن پنل)، احترام به `prefers-reduced-motion`
- سرعت: تصاویر WebP کوچک‌شده، بدون کتابخانه خارجی، انیمیشن‌ها فقط با `transform` و `opacity`
- سئو: عنوان و توضیح، Open Graph، `canonical`، `robots.txt`، `sitemap.xml` و داده ساختاریافته سازمان

لوگوها از فایل ارسالی خود شما برش داده و بهینه شده‌اند و بازطراحی نشده‌اند.

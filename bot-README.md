
# Nyzro Discord Bot - Railway হোস্টিং গাইড (বাংলা)

এই গাইডে আমরা Railway প্ল্যাটফর্মে Nyzro বটটি হোস্ট করার সম্পূর্ণ প্রক্রিয়া ধাপে ধাপে শিখব!

---

## ১. Railway-এ বট হোস্ট করার পূর্বশর্তসমূহ

Railway-এ বট হোস্ট করার জন্য নিচের সবগুলো জিনিস প্রস্তুত থাকা প্রয়োজন:

### ১.১ Railway অ্যাকাউন্ট
Railway-তে নতুন অ্যাকাউন্ট তৈরি করতে:
1. [Railway ওয়েবসাইট](https://railway.app/) এ যান
2. **Sign Up** বাটনে ক্লিক করে GitHub বা Email দিয়ে অ্যাকাউন্ট তৈরি করুন
3. Email verify করুন (প্রয়োজনে)

### ১.২ GitHub রিপোজিটরি
আপনার বটের কোড একটি GitHub রিপোজিটরিতে আপলোড করা থাকতে হবে! (আমরা আগেই এটি করে ফেলেছি! 😊)

### ১.৩ Discord Developer Portal থেকে বটের তথ্য
Discord Developer Portal থেকে নিচের তথ্য সংগ্রহ করে রাখুন:
- **Bot Token**
- **Application ID**
- **Guild ID** (প্রয়োজনে)

---

## ২. ধাপে ধাপে Railway-এ হোস্টিং প্রক্রিয়া

### ধাপ ১: Railway-এ নতুন প্রজেক্ট তৈরি করা
1. Railway Dashboard-এ গিয়ে **New Project** বাটনে ক্লিক করুন
2. **Deploy from GitHub repo** সিলেক্ট করুন
3. GitHub অ্যাকাউন্টের সাথে Railway কানেক্ট করুন (প্রথমবার হলে)
4. আপনার Nyzro-Community-Bot রিপোজিটরি সিলেক্ট করুন

### ধাপ ২: Deploy Configure করা
1. Railway আপনার repo detect করে নেয়!
2. **Root Directory** হিসেবে `bot/` সিলেক্ট করুন (কারণ আমাদের বটের কোড `bot/` ফোল্ডারে আছে)
3. **Custom Start Command** হিসেবে `python CodeX.py` সেট করুন (Railway-এর Settings → Deployments → Start Command)
4. **Deploy** বাটনে ক্লিক করুন!

---

## ৩. .env ফাইল ও Environment Variables

### ৩.১ কোন কোন Variables প্রয়োজন?
আমাদের বটের জন্য নিচের Environment Variables (Railway-এ যোগ করতে হবে):
| Variable Name | কাজ | উদাহরণ |
| ------------- | --- | ------ |
| `TOKEN` | Discord Bot Token | `MTA1Mj...` |
| `OWNER_IDS` | বটের Owner Discord ID (কমা দিয়ে আলাদা করে একাধিক যোগ করা যায়) | `870179991462236170` |
| `brand_name` | বটের নাম | `Nyzro` |
| `CMD_WEBHOOK_URL` | Command Log Webhook URL (optional) | `https://discord.com/api/webhooks/...` |
| `API_ENABLED` | API Enable/Disable করে | `true` |
| `API_PORT` | API Port Number | `8000` |
| `CORS_ORIGINS` | CORS Allowed Origins (optional) | `https://your-dashboard.vercel.app` |
| `TUNNEL_ENABLED` | Cloudflare Tunnel Enable/Disable | `true` |
| `CF_TUNNEL_TOKEN` | Cloudflare Tunnel Token | `eyJhI...` |
| `CF_TUNNEL_URL` | Cloudflare Tunnel URL | `https://your-tunnel-url.com` |
| `LAVALINK_HOST` | Lavalink Host | `lava.link` |
| `LAVALINK_PORT` | Lavalink Port | `443` |
| `LAVALINK_PASSWORD` | Lavalink Password | `youshallnotpass` |
| `LAVALINK_SECURE` | Lavalink Secure? | `true` |

### ৩.২ Railway Dashboard-এ Variables যোগ করা
1. Railway Dashboard-ে আপনার প্রজেক্টে গিয়ে **Variables** সেকশনে ক্লিক করুন
2. **New Variable** বাটনে ক্লিক করে প্রতিটি Variable-এর **Name** এবং **Value** ইনপুট করুন
3. **Add** করুন! সব Variables যোগ করা হলে **Deploy** আবার করুন (পরিবর্তন প্রয়োগের জন্য)

---

## ৪. Railway Dashboard এর বিভিন্ন সেকশন বিস্তারিত

### ৪.১ Deployments
এই সেকশনে আপনার বটের সব Deployment ইতিহাস দেখতে পাবেন! প্রতিটি Deployment-এর সময়, status, log সব দেখা যায়!

### ৪.২ Logs
এই সেকশনে বটের রানটাইম লগ দেখতে পাবেন! কোনো সমস্যা হলে আগে এখানে চেক করুন!

### ৪.৩ Metrics
এখানে বটের CPU, Memory, Network Usage-এর রিয়েলটাইম ডেটা দেখতে পাবেন!

### ৪.৪ Settings
এই সেকশনে আপনি:
- প্রজেক্টের নাম পরিবর্তন করতে পারেন
- Environment Variables add/edit করতে পারেন
- Redeploy করতে পারেন
- প্রজেক্ট ডিলিট করতে পারেন

---

## ৫. সাধারণ সমস্যা ও সমাধান

### ৫.১ বট অনলাইন আসছে না?
1. **Railway Logs** চেক করুন! কি error দেখাচ্ছে?
2. .env Variables সব সঠিকভাবে সেট করা আছে কিনা?
3. Discord Bot Token সঠিক কিনা?

### ৫.২ Music কাজ করছে না?
Lavalink Host, Port, Password সব সঠিক কিনা চেক করুন!

### ৫.৩ Railway-এ Redeploy করা কিভাবে?
Dashboard-ে **Deployments** → **Redeploy** বাটনে ক্লিক করলেই হবে!

---

## ৬. বটের সচলতা যাচাই করা
1. Discord-ে আপনার বটটিকে একটি সার্ভারে যোগ করুন
2. `/help` command চালান! বট যদি reply দেয় → সফল! 😊
3. Railway Logs-ও চেক করুন, কোনো error না থাকলে সব ঠিক আছে!

---

শুভকামনা! আপনার Nyzro বটটি Railway-এ সফলভাবে হোস্ট হোক! 🚀

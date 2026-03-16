# 🔧 M-Pesa Callback Setup Guide

## The Problem

M-Pesa sends payment callbacks to a publicly accessible URL. **Localhost URLs like `http://localhost:3000` will NOT work** because M-Pesa's servers cannot reach your local development machine.

## Solution Options

### Option 1: Development with ngrok (Recommended for Testing)

ngrok creates a secure tunnel to your localhost, giving you a public URL.

#### Step 1: Install ngrok
```bash
# Using npm
npm install -g ngrok

# Or download from https://ngrok.com/download
```

#### Step 2: Start your development server
```bash
pnpm dev
# Server runs on http://localhost:3000
```

#### Step 3: Start ngrok (in a new terminal)
```bash
ngrok http 3000
```

You'll see output like:
```
Session Status                online
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

#### Step 4: Update your .env file
```bash
# Add this to your .env file
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
```

#### Step 5: Restart your dev server
```bash
# Stop the server (Ctrl+C) and restart
pnpm dev
```

#### Step 6: Test the payment
1. Go to `https://abc123.ngrok.io` (use the ngrok URL, not localhost)
2. Login as hospital admin
3. Initiate payment
4. M-Pesa callback will now reach your local dev server!

---

### Option 2: Production Deployment (Vercel/Railway/etc)

When deployed, your app already has a public URL.

#### For Vercel:
```bash
# In your .env.production or Vercel dashboard
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### For Railway:
```bash
# In your .env.production or Railway dashboard
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
```

#### For Custom Domain:
```bash
# In your .env.production
NEXT_PUBLIC_APP_URL=https://clinintelai.com
```

---

### Option 3: Use Daraja Callback Endpoint (Testing Only)

If you don't set `NEXT_PUBLIC_APP_URL`, the system falls back to the Daraja server's callback endpoint. This allows STK push to work, but **callbacks won't update your database**.

**This is useful for testing the STK push UI flow only.**

---

## How It Works

The callback URL is constructed in `/lib/services/mpesa-payment.ts`:

```typescript
const callbackUrl = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`  // Your app
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/api/payments/callback`   // Vercel deployment
  : 'https://daraja-node.vercel.app/api/callback';              // Fallback (won't update DB)
```

---

## Verification

### Check your logs
When you initiate a payment, you should see:
```
Initiating STK Push: {
  phoneNumber: '254712345678',
  amount: 1,
  hospitalId: 'xxx',
  callbackUrl: 'https://abc123.ngrok.io/api/payments/callback'  // ✅ PUBLIC URL
}
```

If you see `http://localhost:3000`, the callback will fail!

### Test the callback endpoint
Open your browser and visit:
```
https://abc123.ngrok.io/api/payments/callback
```

You should see:
```json
{
  "message": "M-Pesa callback endpoint",
  "method": "GET"
}
```

---

## Common Issues

### Issue 1: `checkoutRequestId=undefined`
**Cause**: Frontend not extracting the checkoutRequestId correctly  
**Fix**: ✅ Already fixed in latest code

### Issue 2: Callbacks not reaching your app
**Cause**: Using localhost URL or no `NEXT_PUBLIC_APP_URL` set  
**Fix**: Use ngrok or deploy to production

### Issue 3: Payment successful but subscription not activated
**Cause**: Callback reached Daraja server instead of your app  
**Fix**: Set `NEXT_PUBLIC_APP_URL` in .env

---

## Quick Test Script

```bash
#!/bin/bash
# test-mpesa-callback.sh

echo "🧪 Testing M-Pesa Callback Setup"
echo "================================"

# Check if NEXT_PUBLIC_APP_URL is set
if [ -z "$NEXT_PUBLIC_APP_URL" ]; then
  echo "❌ NEXT_PUBLIC_APP_URL not set"
  echo "Set it to your ngrok URL or production URL"
  exit 1
fi

echo "✅ NEXT_PUBLIC_APP_URL = $NEXT_PUBLIC_APP_URL"

# Test callback endpoint
echo "Testing callback endpoint..."
curl -s "$NEXT_PUBLIC_APP_URL/api/payments/callback" | jq

echo ""
echo "✅ Setup looks good! Try a payment now."
```

---

## Production Checklist

- [ ] `NEXT_PUBLIC_APP_URL` set in environment variables
- [ ] Callback endpoint accessible: `https://yourapp.com/api/payments/callback`
- [ ] SSL certificate valid (HTTPS required)
- [ ] Database connection working
- [ ] Test payment with real M-Pesa number
- [ ] Verify callback updates database
- [ ] Check subscription status updates to ACTIVE

---

## Support

If you're still having issues:

1. **Check logs**: Look for "Initiating STK Push" in your console
2. **Verify URL**: Make sure callbackUrl is a public HTTPS URL
3. **Test callback**: Visit `/api/payments/callback` in your browser
4. **Check database**: Verify Payment records are created with correct checkoutRequestId

Need help? Contact support or check the [M-Pesa API documentation](https://developer.safaricom.co.ke/).

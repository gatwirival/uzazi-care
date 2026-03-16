#!/bin/bash

# Test M-Pesa Callback Handler
# This script simulates an M-Pesa callback to test your endpoint

echo "🧪 Testing M-Pesa Callback Handler"
echo "===================================="
echo ""

# Check if server is running
echo "1️⃣ Checking if server is running..."
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ Server not running on http://localhost:3000"
    echo "Start with: pnpm dev"
    exit 1
fi
echo "✅ Server is running"
echo ""

# Test callback endpoint
echo "2️⃣ Sending test callback..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:3000/api/payments/callback \
  -H "Content-Type: application/json" \
  -d '{
    "Body": {
      "stkCallback": {
        "MerchantRequestID": "25505-162427436-1",
        "CheckoutRequestID": "ws_CO_07012024170905625768168060",
        "ResultCode": 0,
        "ResultDesc": "The service request is processed successfully.",
        "CallbackMetadata": {
          "Item": [
            {
              "Name": "Amount",
              "Value": 10
            },
            {
              "Name": "MpesaReceiptNumber",
              "Value": "SA77CVC7PZ"
            },
            {
              "Name": "Balance"
            },
            {
              "Name": "TransactionDate",
              "Value": 20240107170703
            },
            {
              "Name": "PhoneNumber",
              "Value": 254768168060
            }
          ]
        }
      }
    }
  }')

echo "Response from server:"
echo "$RESPONSE" | jq .
echo ""

# Check if response is valid
if echo "$RESPONSE" | jq -e '.ResultCode == 0' > /dev/null 2>&1; then
    echo "✅ Callback endpoint is working!"
    echo ""
    echo "Expected in terminal logs:"
    echo "  - === M-PESA PAYMENT CALLBACK RECEIVED ==="
    echo "  - 📋 Callback Details"
    echo "  - 🔍 Searching for payment record..."
    echo ""
    echo "Note: Payment record won't be found (this is a test)"
    echo "To test with real payment:"
    echo "  1. Register a hospital"
    echo "  2. Initiate payment"
    echo "  3. Complete on phone"
    echo "  4. M-Pesa will call this endpoint automatically"
else
    echo "❌ Callback endpoint returned error"
    echo "Check server logs for details"
fi

echo ""
echo "Done!"

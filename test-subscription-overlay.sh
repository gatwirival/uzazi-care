#!/bin/bash

# Subscription Overlay Test Script
# This script helps test the subscription overlay fix

echo "🧪 Subscription Overlay Test Script"
echo "===================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable not set"
    echo "   Please set it in your .env file"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Function to show menu
show_menu() {
    echo "Select a test scenario:"
    echo "1. Set hospital to EXPIRED (test overlay for hospital admin)"
    echo "2. Set hospital to PENDING_PAYMENT (test overlay for hospital admin)"
    echo "3. Set hospital to SUSPENDED (test overlay)"
    echo "4. Set hospital to ACTIVE (test no overlay)"
    echo "5. Set hospital to TRIAL (test no overlay)"
    echo "6. Check current subscription status"
    echo "7. Exit"
    echo ""
}

# Function to update subscription status
update_status() {
    local status=$1
    echo ""
    echo "Enter hospital email address:"
    read -r hospital_email
    
    echo ""
    echo "Updating subscription status to: $status"
    echo "Hospital: $hospital_email"
    echo ""
    
    # Use npx prisma db execute to run SQL
    npx prisma db execute --stdin <<EOF
UPDATE "Hospital" 
SET "subscriptionStatus" = '$status' 
WHERE email = '$hospital_email';
EOF
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully updated subscription status to: $status"
        echo ""
        echo "📋 Next Steps:"
        echo "   1. Login as hospital admin: $hospital_email"
        
        if [ "$status" = "ACTIVE" ] || [ "$status" = "TRIAL" ]; then
            echo "   2. Expected: No overlay, full access to dashboard"
        else
            echo "   2. Expected: Payment overlay appears (non-dismissible)"
            echo "   3. For doctors: Contact admin overlay appears (no payment button)"
        fi
        
        echo ""
        echo "   To test, visit: http://localhost:3000/auth/login"
        echo ""
    else
        echo "❌ Error updating subscription status"
    fi
}

# Function to check status
check_status() {
    echo ""
    echo "Fetching hospital subscription statuses..."
    echo ""
    
    npx prisma db execute --stdin <<'EOF'
SELECT 
  name AS "Hospital Name",
  email AS "Email",
  "subscriptionStatus" AS "Status",
  "isActive" AS "Active",
  "trialEndsAt" AS "Trial Ends",
  "nextBillingDate" AS "Next Billing"
FROM "Hospital"
ORDER BY name;
EOF
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice (1-7): " choice
    
    case $choice in
        1)
            update_status "EXPIRED"
            ;;
        2)
            update_status "PENDING_PAYMENT"
            ;;
        3)
            update_status "SUSPENDED"
            ;;
        4)
            update_status "ACTIVE"
            ;;
        5)
            update_status "TRIAL"
            ;;
        6)
            check_status
            ;;
        7)
            echo ""
            echo "👋 Exiting test script"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please select 1-7"
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    clear
done

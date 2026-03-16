#!/bin/bash

# Quick M-Pesa Setup Script for Development
# This script helps you set up ngrok for M-Pesa callbacks

set -e

echo "🚀 ClinIntelAI M-Pesa Development Setup"
echo "========================================"
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "📦 ngrok not found. Installing..."
    
    # Check OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Detected Linux. Please install ngrok manually:"
        echo "  curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null"
        echo "  echo 'deb https://ngrok-agent.s3.amazonaws.com buster main' | sudo tee /etc/apt/sources.list.d/ngrok.list"
        echo "  sudo apt update && sudo apt install ngrok"
        echo ""
        echo "Or use npm:"
        echo "  npm install -g ngrok"
        exit 1
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Detected macOS. Installing via Homebrew..."
        brew install ngrok
    else
        echo "Please install ngrok manually: npm install -g ngrok"
        exit 1
    fi
else
    echo "✅ ngrok is already installed"
fi

echo ""
echo "🔧 Setting up ngrok tunnel..."
echo ""
echo "1. Make sure your dev server is running on port 3000"
echo "   Run: pnpm dev"
echo ""
echo "2. Starting ngrok tunnel (press Ctrl+C to stop)..."
echo ""

# Start ngrok and capture the URL
ngrok http 3000 &
NGROK_PID=$!

# Wait for ngrok to start
sleep 3

# Get the ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok\.io' | head -1)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Failed to get ngrok URL"
    kill $NGROK_PID
    exit 1
fi

echo ""
echo "✅ ngrok tunnel created!"
echo "📍 Public URL: $NGROK_URL"
echo ""
echo "📝 Next steps:"
echo "1. Add this to your .env file:"
echo "   NEXT_PUBLIC_APP_URL=$NGROK_URL"
echo ""
echo "2. Restart your dev server (Ctrl+C and run 'pnpm dev' again)"
echo ""
echo "3. Access your app at: $NGROK_URL"
echo ""
echo "4. M-Pesa callbacks will now work!"
echo ""
echo "Press Ctrl+C to stop ngrok"
echo ""

# Keep ngrok running
wait $NGROK_PID

#!/bin/bash

# Bike Marketplace API Test Script
# This script provides curl commands to test the authentication APIs

BASE_URL="http://localhost"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Bike Marketplace - API Testing Script${NC}"
echo -e "${BLUE}================================================${NC}\n"

# 1. Register User
echo -e "${GREEN}1. Register New User${NC}"
read -p "Enter name (default: John Doe): " NAME
NAME=${NAME:-"John Doe"}
read -p "Enter email (default: john@example.com): " EMAIL
EMAIL=${EMAIL:-"john@example.com"}
read -p "Enter password (default: password123): " PASSWORD
PASSWORD=${PASSWORD:-"password123"}

REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$NAME\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"password_confirmation\": \"$PASSWORD\",
    \"phone\": \"0123456789\",
    \"role\": \"user\"
  }")

echo "Response:"
echo "$REGISTER_RESPONSE" | jq . 2>/dev/null || echo "$REGISTER_RESPONSE"

# Extract tokens
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.access_token' 2>/dev/null)
REFRESH_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.refresh_token' 2>/dev/null)

if [ "$ACCESS_TOKEN" != "null" ] && [ ! -z "$ACCESS_TOKEN" ]; then
  echo -e "\n${GREEN}✓ Registration successful!${NC}\n"
  
  # Save tokens to file
  echo "ACCESS_TOKEN=$ACCESS_TOKEN" > /tmp/bike_tokens.env
  echo "REFRESH_TOKEN=$REFRESH_TOKEN" >> /tmp/bike_tokens.env
  echo "SAVE EMAIL: $EMAIL"
  
else
  echo -e "\n${RED}✗ Registration failed${NC}"
  exit 1
fi

# 2. Get Current User
echo -e "${GREEN}2. Get Current User Info${NC}"
curl -s -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

# 3. Logout
echo -e "\n${GREEN}3. Logout${NC}"
curl -s -X POST "$BASE_URL/api/auth/logout" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

# 4. Login Again
echo -e "\n${GREEN}4. Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "Response:"
echo "$LOGIN_RESPONSE" | jq .

NEW_ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.access_token' 2>/dev/null)
NEW_REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.refresh_token' 2>/dev/null)

# 5. Refresh Token
echo -e "\n${GREEN}5. Refresh Access Token${NC}"
REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{
    \"refresh_token\": \"$NEW_REFRESH_TOKEN\"
  }")

echo "Response:"
echo "$REFRESH_RESPONSE" | jq .

# 6. Forgot Password
echo -e "\n${GREEN}6. Forgot Password${NC}"
curl -s -X POST "$BASE_URL/api/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\"
  }" | jq .

echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}API Testing Complete!${NC}"
echo -e "${GREEN}================================================${NC}\n"

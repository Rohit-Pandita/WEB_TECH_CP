#!/bin/bash

echo "🚀 Setting up Voting System with Node.js Backend..."
echo ""

# Check if MySQL is installed and running
echo "✓ Checking MySQL..."
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    echo "  Download from: https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

# Navigate to backend directory
cd backend

echo "✓ Installing Node.js dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "📊 Setting up database..."
read -p "Enter MySQL root password (press Enter if no password): " mysql_pass

if [ -z "$mysql_pass" ]; then
    mysql -u root < db/init.sql
else
    mysql -u root -p"$mysql_pass" < db/init.sql
fi

if [ $? -ne 0 ]; then
    echo "❌ Failed to initialize database"
    exit 1
fi

echo ""
echo "✅ Backend setup completed!"
echo ""
echo "📝 Next steps:"
echo "  1. Update .env file with your database credentials if needed"
echo "  2. Start backend: npm start"
echo "  3. In another terminal, go to frontend/"
echo "  4. Run: npm install && npm run dev"
echo ""
echo "🌐 Access the application at: http://localhost:5173"
echo "📡 API runs on: http://localhost:5000"

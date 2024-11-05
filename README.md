# Blockchain Price Tracker

A NestJS application that tracks Ethereum and Polygon prices on mainnet, with automated price alerts and email notifications.

## Features

- Automatically tracks ETH and POLYGON prices every 5 minutes
- Email notifications for significant price changes (>3% in an hour)
- Custom price alerts via API
- Hourly price history for the last 24 hours
- Swagger API documentation

## Prerequisites

- Docker and Docker Compose
- Moralis API key (contact me if you need one)
- SMTP credentials (for email notifications)

## Supported Tokens

This project currently only supports mainnet tokens:
- Ethereum (ETH)
- Polygon (MATIC)

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd blockchain-price-tracker
```

2. Create and configure your environment variables:
```bash
cp .env.example .env
```

Required environment variables:
```env
# Server Configuration
PORT=5000
DB_PORT=5432

# Database Configuration
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=pricetracker

# Moralis API
MORALIS_API_KEY=your_moralis_api_key  # Contact me if you need one

# SMTP Configuration (Required for email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password  # Gmail App Password, not your regular password
```

Note: To enable email notifications, you need to:
1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to Google Account Settings → Security
   - Under "2-Step Verification", find "App passwords"
   - Generate a password and use it as SMTP_PASS

3. Run the application:
```bash
docker compose up --build
```

The application will be available at:
- API: http://localhost:5000
- Swagger Documentation: http://localhost:5000/api

## API Endpoints

Visit the Swagger documentation at `http://localhost:5000/api` for detailed API documentation. Key endpoints include:

1. Price History:
   ```
   GET /prices/{chain}
   ```
   Returns hourly prices for the last 24 hours

2. Price Alerts:
   ```
   POST /alerts
   ```
   Set price alerts with email notifications

Example alert request:
```json
{
  "chain": "ethereum",
  "targetPrice": 2000,
  "email": "your.email@example.com"
}
```

## Architecture

- NestJS framework
- PostgreSQL database
- Moralis API for real-time price data
- Nodemailer for email notifications
- Docker containerization

## Limitations

- Assumes only mainnet
- Assumes only ETH and POLYGON tokens

## Troubleshooting

1. Email sending fails:
   - Verify SMTP credentials
   - Ensure you're using an App Password, not regular Gmail password
   - Check if 2-Step Verification is enabled

2. Price tracking not working:
   - Verify Moralis API key
   - Check network connectivity
   - Ensure Docker containers are running

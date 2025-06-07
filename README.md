# Winnger

A comprehensive driver and restaurant management platform built with React, Node.js, and PostgreSQL.

## Features

- Driver Registration with document verification
- Restaurant Registration and management
- Integrated payment processing with Stripe
- Background check integration
- Real-time photo capture
- Google Maps integration for address selection
- Email notifications
- Secure file uploads to AWS S3

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **File Storage**: AWS S3
- **Payment Processing**: Stripe
- **Maps Integration**: Google Maps API
- **Email Service**: SMTP

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- AWS Account
- Stripe Account
- Google Maps API Key

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd Winnger
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env` in the server directory
- Fill in your environment variables

4. Initialize the database:
```bash
# From the server directory
npm run db:migrate
```

5. Start the development servers:
```bash
# Start the backend server
cd server
npm run dev

# Start the frontend client
cd client
npm start
```

## Environment Variables

### Server
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `POSTGRES_*`: Database configuration
- `JWT_*`: JWT configuration
- `AWS_*`: AWS credentials and configuration
- `SMTP_*`: Email service configuration
- `STRIPE_*`: Stripe API keys and webhook secret

## Project Structure

```
Winnger/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   └── package.json
│
└── server/                # Node.js backend
    ├── src/
    │   ├── config/       # Configuration files
    │   ├── controllers/  # Route controllers
    │   ├── models/       # Database models
    │   ├── routes/       # API routes
    │   └── utils/        # Utility functions
    └── package.json
```

## API Documentation

The API documentation is available at `/api-docs` when running the server in development mode.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
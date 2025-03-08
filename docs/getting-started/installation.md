# Installation Guide

## System Requirements

### Minimum Requirements
- Node.js v18 or higher
- npm v7 or higher (or yarn v1.22+)
- Git
- 2GB RAM minimum
- 1GB free disk space

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/nebula-suite.git
cd nebula-suite
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Update the following variables in `.env.local`:
- `NEXT_PUBLIC_API_URL`
- `DATABASE_URL`
- `AUTH_SECRET`

### 4. Database Setup
```bash
npm run db:migrate
# or
yarn db:migrate
```

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Verification
1. Open your browser and navigate to `http://localhost:3000`
2. Verify that the landing page loads correctly
3. Try logging in with the default admin credentials

## Troubleshooting

### Common Issues

1. **Node Version Mismatch**
   - Use `nvm` to switch to the correct Node version
   - Run `node -v` to verify

2. **Port Already in Use**
   - Check if another process is using port 3000
   - Change the port in `next.config.js` if needed

3. **Database Connection Issues**
   - Verify database credentials in `.env.local`
   - Ensure database service is running

## Next Steps
- Continue to [Configuration Guide](./configuration.md)
- Read our [Development Guidelines](../development/README.md)
- Check out the [Architecture Overview](../architecture/README.md)

## Support
If you encounter any issues not covered in this guide:
1. Check our [Troubleshooting Guide](../user-guides/troubleshooting.md)
2. Open an issue on GitHub
3. Contact our support team
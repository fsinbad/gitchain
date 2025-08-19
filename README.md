
# GigChain - Decentralized Task Marketplace

GigChain is a decentralized task marketplace built on Circle's CCTP (Cross-Chain Transfer Protocol) and Thirdweb Engine, enabling gasless USDC payments for micro-tasks with AI-powered verification.

## Features

- **Gasless USDC Payments**: Workers receive payments without gas fees using Circle's paymaster
- **AI Task Verification**: Automated verification of task completion through image/video proof
- **Cross-Chain Payments**: Seamless payments across multiple blockchain networks
- **Decentralized Workforce**: Global access without traditional employment barriers
- **Real-time Task Management**: Browse, create, and complete tasks with instant payouts

## Supported Task Types

- Data Entry
- Content Moderation
- Surveys & Research
- Image/Video Annotation
- Content Creation
- Virtual Assistance

## Architecture

### Core Components

1. **Task Management System**
   - Create and browse available tasks
   - Set requirements and rewards in USDC
   - Track task progress and completion

2. **AI Verification Service**
   - Automated proof verification using AI
   - Support for image and video submissions
   - Quality scoring and approval automation

3. **Cross-Chain Payment Infrastructure**
   - CCTP integration for seamless USDC transfers
   - Gasless transactions using Circle's paymaster
   - Multi-chain wallet management

4. **Worker Dashboard**
   - Browse available tasks by category
   - Submit work and track earnings
   - Real-time balance updates

## Environment Setup

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_THIRDWEB_CREDENTIAL_ID=your_thirdweb_credential_id
NEXT_PUBLIC_THIRDWEB_ENGINE_ACCESS_TOKEN=your_thirdweb_access_token
NEXT_PUBLIC_CIRCLE_API_KEY=your_circle_api_key
THIRDWEB_ENGINE_URL=http://0.0.0.0:3005
```

### Required Services

1. **Thirdweb Engine**: Backend wallet management and transaction handling
2. **Circle Developer Account**: USDC and CCTP integration
3. **AI Verification Service**: Task completion verification

## Getting Started

### 1. Setup Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.sample` to `.env.local` and fill in your credentials:
- Get Thirdweb credentials from [Thirdweb Dashboard](https://thirdweb.com/dashboard)
- Create Circle API key from [Circle Developer Console](https://console.circle.com/)

### 3. Start Thirdweb Engine

Ensure Thirdweb Engine is running on port 3005. For Replit deployment, use:
- Engine URL: `http://0.0.0.0:3005`
- Configure proper CORS settings for cross-origin requests

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or your Replit URL).

## Usage Guide

### For Task Creators

1. **Create Wallet**: Generate a wallet on your preferred blockchain
2. **Fund Wallet**: Add USDC and native tokens for gas fees
3. **Create Tasks**: 
   - Set clear requirements and deliverables
   - Define reward amount in USDC
   - Choose verification method (AI or manual)
   - Set deadline and maximum workers

### For Workers

1. **Browse Tasks**: Filter by category, reward, and time commitment
2. **Accept Task**: Review requirements and accept suitable tasks
3. **Complete Work**: Follow task guidelines and submit proof
4. **Get Paid**: Receive instant USDC payment upon verification

## Supported Networks

- **Ethereum Sepolia** (Testnet)
- **Base Sepolia** (Testnet)
- **Avalanche Fuji** (Testnet)
- **Linea Sepolia** (Testnet)

*Production deployments will support mainnet versions of these networks.*

## API Endpoints

### Task Management
- `POST /api/tasks/create` - Create new task
- `GET /api/tasks` - List available tasks
- `POST /api/tasks/submit` - Submit task completion

### Wallet Operations
- `POST /api/wallet/create` - Create new wallet
- `GET /api/wallet/balance` - Check wallet balance
- `POST /api/wallet/transfer` - Execute payments

### AI Verification
- `POST /api/ai/verify` - Submit proof for AI verification

## Development

### Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   └── page.tsx           # Main application
├── services/              # Business logic
│   ├── taskService.ts     # Task management
│   ├── cctpService.ts     # CCTP and wallet operations
│   └── aiVerificationService.ts # AI verification
└── types/                 # TypeScript definitions
    ├── gigchain.ts        # GigChain types
    └── cctp.ts           # CCTP types
```

### Key Technologies

- **Next.js 15**: Full-stack React framework
- **Circle CCTP**: Cross-chain USDC transfers
- **Thirdweb Engine**: Wallet management and transactions
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling

## Security Considerations

- All API keys are stored as environment variables
- Wallet private keys are managed by Thirdweb Engine
- AI verification prevents fraud and ensures quality
- Cross-chain transfers use Circle's audited smart contracts

## Deployment on Replit

This project is optimized for Replit deployment:

1. **Fork this Repl**
2. **Set Environment Variables** using Replit's Secrets tool
3. **Configure Thirdweb Engine** to run on `0.0.0.0:3005`
4. **Deploy** using Replit's deployment feature

## Troubleshooting

### Common Issues

1. **Wallet Creation Failed**
   - Ensure Thirdweb Engine is running on correct port
   - Verify environment variables are set correctly
   - Check network connectivity

2. **Payment Failures**
   - Confirm sufficient USDC balance
   - Verify gas fees are available
   - Check destination address validity

3. **AI Verification Issues**
   - Ensure proof files meet requirements
   - Check file size and format limits
   - Verify API key permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Support

For questions and support:
- GitHub Issues: [Create an Issue](https://github.com/yourusername/gigchain/issues)
- Discord: Join the Circle Developer Community
- Documentation: [Circle Docs](https://developers.circle.com/)

---

**Note**: This is a demonstration project. For production use, implement additional security measures, comprehensive testing, and proper error handling.

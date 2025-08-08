# FraudGuard - AI-Powered Fraud Detection System

A comprehensive fraud detection system built with Next.js 14, Supabase, and TypeScript. Features real-time transaction monitoring, AI-powered fraud detection, and a complete dashboard for fraud analysts.

#Team Godzilla

1.Ayush 24BCE1548
2.Prince 24BCE1606
3.Shobhit 24BCE1535    
4.Om Kurkute 24BCE5159    
5.Vineet 24BCE1611

## 🚀 Features

- **Real-time Fraud Detection**: AI-powered algorithms detect fraudulent transactions in real-time
- **Comprehensive Dashboard**: Complete overview of transactions, alerts, and system performance
- **User Authentication**: Secure authentication with Supabase Auth (email/password + Google OAuth)
- **Transaction Monitoring**: Real-time transaction processing and analysis
- **Alert Management**: Comprehensive alert system with different severity levels
- **Reporting System**: Generate detailed fraud detection reports
- **Performance Analytics**: Monitor system performance and detection accuracy
- **Security Management**: Advanced security settings and monitoring
- **User Management**: Complete user administration system
- **Rule Engine**: Configurable fraud detection rules
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Authentication**: Supabase Auth with SSR
- **Database**: PostgreSQL with Row Level Security

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd fraud-detection-system
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Copy and paste the entire content from `scripts/supabase-schema.sql`
4. Run the SQL to create all tables and functions

### 4. Configure Environment Variables

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update `.env.local` with your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

The system includes the following main tables:

- **users**: User profiles and metadata
- **transactions**: Transaction data with AI analysis
- **alerts**: Fraud alerts and notifications
- **fraud_rules**: Configurable detection rules
- **reports**: Generated reports and analytics
- **security_events**: Security monitoring events
- **performance_metrics**: System performance data
- **audit_logs**: Complete audit trail

## 🔐 Authentication

The system uses Supabase Auth with:

- Email/password authentication
- Google OAuth integration
- Row Level Security (RLS) for data protection
- Automatic user profile creation
- Session management with SSR

## 🎯 Key Features

### Dashboard Overview
- Real-time transaction statistics
- Fraud detection metrics
- System performance monitoring
- Recent alerts and notifications

### Transaction Monitoring
- Live transaction processing
- Risk level assessment
- AI-powered fraud detection
- Transaction history and filtering

### Alert Management
- Real-time fraud alerts
- Alert categorization and prioritization
- Investigation workflow
- Alert resolution tracking

### Reporting System
- Automated report generation
- Custom report parameters
- Export functionality
- Scheduled reports

### Security Management
- Security event monitoring
- System security settings
- Access control management
- Audit trail tracking

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔧 Development

### Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── ui/               # UI components (shadcn/ui)
│   └── dashboard-*.tsx   # Dashboard components
├── lib/                  # Utility functions
│   ├── supabase/        # Supabase client configuration
│   └── utils.ts         # Helper functions
└── scripts/             # Database scripts
    └── supabase-schema.sql
\`\`\`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the team Godzilla.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

## 🔄 Updates

The system includes:
- Automatic security updates
- Real-time data synchronization
- Performance monitoring
- Error tracking and reporting

---

Built using Next.js, Supabase, and TypeScript.

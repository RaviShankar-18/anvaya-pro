# Anvaya CRM - Frontend

A modern, responsive CRM application built with React and Bootstrap for managing leads, sales agents, and tracking performance.

## 🚀 Features

- **Dashboard**: Real-time lead statistics and overview
- **Lead Management**: Create, edit, and track leads through the sales pipeline
- **Sales Agents**: Manage your sales team and track performance
- **Reports**: Comprehensive analytics with charts and insights
- **Role-Based Access**: Admin, Sales Manager, and Sales Agent roles
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Bootstrap 5
- **Styling**: Bootstrap CSS with custom styles
- **Charts**: Chart.js / React Chart.js 2
- **Icons**: Bootstrap Icons
- **Routing**: React Router Dom
- **HTTP Client**: Axios

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+
- npm

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd anvaya-crm-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_TOKEN_KEY=anvaya_auth_token
```

4. **Start development server**
```bash
npm run dev
```

### Environment Configuration

For production deployment, set these environment variables:
```env
VITE_API_URL=https://your-backend-api.vercel.app/api
VITE_TOKEN_KEY=anvaya_auth_token
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📱 Application Structure

```
src/
├── components/          # Reusable components
│   ├── layout/         # Layout components (Header, Sidebar)
│   ├── modals/         # Modal components
│   └── forms/          # Form components
├── pages/              # Page components
├── context/            # React context providers
├── utils/              # Utility functions
└── Styles.css          # Global styles
```

## 🔐 Authentication

The application supports three user roles:
- **Admin**: Full access to all features
- **Sales Manager**: Team management and lead oversight
- **Sales Agent**: Personal lead management

## 🌐 API Integration

The frontend connects to the Anvaya CRM Backend API:
- **Production**: `https://anvaya-crm-backend-coral.vercel.app/api`
- **Development**: `http://localhost:5000/api`

**Backend Repository**: [Anvaya CRM Backend](https://github.com/RaviShankar-18/anvaya-crm-backend)
```

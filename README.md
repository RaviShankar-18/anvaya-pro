# Anvaya CRM

A modern, responsive CRM application built with React and Bootstrap for managing leads, sales agents, and tracking performance.  
Built with React 18, Vite, Bootstrap 5, and role-based authentication for comprehensive sales management.

---

## Demo Link

[Live Demo](https://anvaya-crm-frontend.vercel.app)  

---

## Login

> **Admin Account**  
> Username: `admin@anvaya.com`  
> Password: `admin123`

> **Sales Manager Account**  
> Username: `manager@anvaya.com`  
> Password: `manager123`

> **Sales Agent Account**  
> Username: `agent@anvaya.com`  
> Password: `agent123`

---

## Quick Start

```
git clone https://github.com/RaviShankar-18/anvaya-crm-frontend.git
cd anvaya-crm-frontend
npm install
npm run dev
```

## Technologies
- React 18
- Vite
- Bootstrap 5
- Chart.js
- React Router Dom
- Axios
- Bootstrap Icons

## Features
**Dashboard & Analytics**
- Real-time lead statistics and performance overview
- Comprehensive analytics with interactive charts and insights
- Visual reporting for sales tracking and team performance
- Key metrics display for quick decision making

**Lead Management System**
- Create, edit, and track leads through complete sales pipeline
- Lead status management with customizable pipeline stages
- Advanced lead filtering and search capabilities
- Lead assignment and distribution to sales agents

**Sales Team Management**
- Manage sales agents and track individual performance
- Role-based access control (Admin, Sales Manager, Sales Agent)
- Team performance monitoring and reporting
- Agent workload distribution and management

**User Experience**
- Fully responsive design for desktop and mobile devices
- Modern Bootstrap 5 interface with custom styling
- Intuitive navigation and user-friendly workflows
- Real-time updates and notifications

## API Reference

### **POST /api/auth/login**
User authentication with role-based access  
Sample Response:
```json
{ "token": "jwt_token", "user": { "id": "...", "role": "admin", "name": "..." } }
```

### **GET /api/leads**
Get all leads with filtering options  
Sample Response:
```json
[{ "_id": "...", "name": "...", "status": "qualified", "agent": "...", "value": 5000 }]
```

### **POST /api/leads**
Create new lead  
Sample Response:
```json
{ "_id": "...", "name": "...", "email": "...", "status": "new", "createdAt": "..." }
```

### **GET /api/agents**
Get all sales agents  
Sample Response:
```json
[{ "_id": "...", "name": "...", "email": "...", "role": "sales_agent", "leadsCount": 15 }]
```

### **GET /api/reports/dashboard**
Get dashboard statistics  
Sample Response:
```json
{ "totalLeads": 150, "qualifiedLeads": 45, "totalRevenue": 250000, "activeAgents": 12 }
```

### **PUT /api/leads/:id**
Update lead information  
Sample Response:
```json
{ "_id": "...", "name": "...", "status": "qualified", "updatedAt": "..." }
```

## Contact
For bugs or feature requests, please reach out to ravishankarkumar.work@gmail.com

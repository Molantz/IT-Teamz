# IT-Teamz Management System

A comprehensive employee and attendance management system with ZKTeco BioTime integration, ID card management, and advanced reporting.

## Features

### Core Management
- **User Management**: Role-based access (superuser, manager, supervisor, technicians, etc.)
- **Company & Department Management**: Multi-company support with hierarchical structure
- **Employee Management**: Complete employee profiles with photos and signatures
- **ID Card Management**: Printable cards with QR codes and barcodes

### ZKTeco BioTime Integration
- **Device Management**: Add and manage ZKTeco biometric devices
- **Attendance Tracking**: Real-time attendance monitoring and reporting
- **Employee Enrollment**: Sync employees to biometric devices
- **Attendance Dashboard**: Filter, search, and export attendance data

### Advanced Features
- **Image/Signature Uploads**: Cloudinary integration for employee photos
- **Advanced Search & Filtering**: Multi-criteria search across all modules
- **Batch Operations**: Bulk actions for cards, employees, and attendance
- **Audit Trail**: Complete logging of all system actions
- **Notifications**: In-app and email notifications
- **Reports**: CSV/PDF export capabilities

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **File Storage**: Cloudinary
- **Charts**: Chart.js with react-chartjs-2
- **QR/Barcode**: qrcode.react, react-barcode

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` with:
```env
# Database
DATABASE_URL=your_neon_postgres_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP (for email notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=your_from_email

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Database Setup
Run the database migration:
```bash
psql $DATABASE_URL -f db/schema.sql
```

### 4. Start Development Server
```bash
npm run dev
```

## Usage

### Navigation
- **Dashboard**: Overview with KPIs and charts
- **Users**: Manage system users and roles
- **Companies**: Add and manage companies
- **Departments**: Organize departments within companies
- **Employees**: Manage employee profiles and data
- **ID Cards**: Create and print employee ID cards
- **Devices**: Manage ZKTeco biometric devices
- **Attendance**: View and export attendance records
- **Audit Log**: Review system activity logs
- **Notifications**: View and manage notifications

### Key Features

#### ID Card Management
- Create cards with employee photos and signatures
- Print cards with QR codes and barcodes
- Batch operations for multiple cards
- Advanced filtering and search

#### ZKTeco Integration
- Add devices by IP address and port
- Sync employees to biometric devices
- Real-time attendance monitoring
- Export attendance data to CSV

#### Advanced Search
- Search across all modules
- Date range filtering
- Status-based filtering
- Real-time results

## Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Ensure all environment variables are set in your deployment platform:
- `DATABASE_URL`: Production PostgreSQL connection
- `JWT_SECRET`: Strong secret for authentication
- `CLOUDINARY_*`: Cloudinary credentials for file uploads
- `SMTP_*`: Email service credentials
- `NEXT_PUBLIC_BASE_URL`: Your production domain

## Security

- JWT-based authentication
- Role-based access control
- Audit trail for all actions
- Secure file uploads
- HTTPS enforcement in production

## Support

For issues or questions:
1. Check the audit log for system errors
2. Verify environment variables are set correctly
3. Ensure database connection is working
4. Check ZKTeco device connectivity

## License

© 2024 IT-Teamz Management System

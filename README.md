# Store Rating System - FullStack Application

A comprehensive web application that allows users to submit ratings for stores registered on the platform. The system supports three distinct user roles with different functionalities and access levels.

## 🚀 Tech Stack

### Backend
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi & Express-validator
- **Email Service:** Nodemailer

### Frontend
- **Framework:** React 18 with TypeScript
- **Routing:** React Router DOM
- **State Management:** React Hooks (useState, useEffect)
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form
- **Notifications:** React Hot Toast

### Database
- **Primary Database:** PostgreSQL
- **ORM:** Prisma Client
- **Migrations:** Prisma Migrate

## 📋 Features Overview

### 🔐 User Roles & Authentication

#### 1. System Administrator
- ✅ Add new stores, normal users, and admin users
- ✅ Comprehensive dashboard with analytics
- ✅ User management with filtering capabilities
- ✅ Store management with rating insights
- ✅ View detailed user and store information

#### 2. Normal User
- ✅ User registration and authentication
- ✅ Password management
- ✅ Store browsing with search functionality
- ✅ Submit and modify store ratings (1-5 scale)
- ✅ View personal rating history

#### 3. Store Owner
- ✅ Secure login system
- ✅ Password management
- ✅ View store ratings and analytics
- ✅ Customer rating insights dashboard

## 🏗️ Project Structure

```
store-rating-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   ├── storeController.ts
│   │   │   └── ratingController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   └── errorHandler.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── stores.ts
│   │   │   └── ratings.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── userService.ts
│   │   │   ├── storeService.ts
│   │   │   ├── ratingService.ts
│   │   │   └── ratingCalculationService.ts
│   │   ├── types/
│   │   │   ├── authTypes.ts
│   │   │   ├── userTypes.ts
│   │   │   ├── storeTypes.ts
│   │   │   └── ratingTypes.ts
│   │   ├── config/
│   │   │   └── db.ts
│   │   └── app.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── admin/
│   │   │   ├── user/
│   │   │   └── store-owner/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   ├── user/
│   │   │   └── store-owner/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn package manager
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd store-rating-system
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
```

#### Environment Configuration (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/store_rating_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV="development"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

#### Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed database with sample data
npx prisma db seed
```

#### Start Backend Server
```bash
npm run dev  # Development mode
npm run build && npm start  # Production mode
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create environment file
cp .env.example .env
```

#### Environment Configuration (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME="Store Rating System"
```

#### Start Frontend Application
```bash
npm start  # Development mode
npm run build  # Production build
```

## 📊 Database Schema

### Core Models

#### User Model
```sql
- id: Integer (Primary Key)
- name: String (3-60 characters)
- email: String (Unique)
- password: String (Hashed)
- address: String (Max 400 characters)
- role: Enum (ADMIN, USER, STORE_OWNER)
- createdAt: DateTime
- updatedAt: DateTime
```

#### Store Model
```sql
- id: Integer (Primary Key)
- name: String
- email: String (Unique)
- address: String
- avgRating: Float (Auto-calculated)
- totalRatings: Integer (Auto-calculated)
- ownerId: Integer (Foreign Key -> User)
- createdAt: DateTime
- updatedAt: DateTime
```

#### Rating Model
```sql
- id: Integer (Primary Key)
- value: Integer (1-5 scale)
- userId: Integer (Foreign Key -> User)
- storeId: Integer (Foreign Key -> Store)
- createdAt: DateTime
- updatedAt: DateTime
- Unique: [userId, storeId]
```

## 🔌 API Endpoints

### Authentication Routes
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
POST /api/auth/logout         # User logout
PUT  /api/auth/change-password # Change password
GET  /api/auth/profile        # Get user profile
```

### User Management (Admin Only)
```
GET    /api/users             # Get all users with filters
POST   /api/users             # Create new user
GET    /api/users/:id         # Get user by ID
PUT    /api/users/:id         # Update user
DELETE /api/users/:id         # Delete user
GET    /api/users/stats       # Get user statistics
```

### Store Management
```
GET    /api/stores            # Get stores (with search/filter)
POST   /api/stores            # Create store (Admin only)
GET    /api/stores/:id        # Get store details
PUT    /api/stores/:id        # Update store
DELETE /api/stores/:id        # Delete store (Admin only)
```

### Rating System
```
GET    /api/ratings/store/:storeId  # Get store ratings
POST   /api/ratings                 # Submit rating
PUT    /api/ratings/:id             # Update rating
DELETE /api/ratings/:id             # Delete rating
```

### Dashboard & Analytics
```
GET /api/dashboard/admin      # Admin dashboard stats
GET /api/dashboard/store/:id  # Store owner dashboard
```

## 🎨 Frontend Features

### Common Components
- **Navigation Bar:** Role-based navigation
- **Loading Spinners:** Enhanced UX during API calls
- **Toast Notifications:** Success/error feedback
- **Protected Routes:** Role-based access control
- **Form Validation:** Client-side validation with error display

### Admin Dashboard
- **User Analytics:** Total users, new registrations
- **Store Analytics:** Total stores, average ratings
- **Rating Analytics:** Total ratings, rating distribution
- **Management Tables:** Sortable, filterable data tables
- **CRUD Operations:** Create, edit, delete users and stores

### User Interface
- **Store Listing:** Grid/list view with search functionality
- **Rating System:** Interactive star rating component
- **Profile Management:** Update personal information
- **Rating History:** View submitted ratings

### Store Owner Dashboard
- **Store Analytics:** Rating insights and trends
- **Customer Reviews:** Detailed rating breakdown
- **Performance Metrics:** Rating statistics over time

## ✅ Form Validations

### Registration/User Creation
- **Name:** 20-60 characters, letters and spaces only
- **Email:** Valid email format, uniqueness check
- **Password:** 8-16 characters, 1 uppercase, 1 special character
- **Address:** Maximum 400 characters
- **Role:** Valid enum value

### Store Management
- **Store Name:** Required, 3-100 characters
- **Email:** Valid email format, unique per store
- **Address:** Required, maximum 400 characters

### Rating Submission
- **Rating Value:** Integer between 1-5
- **Store Validation:** Ensure store exists
- **User Validation:** Prevent duplicate ratings

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens:** Secure session management
- **Password Hashing:** bcrypt with salt rounds
- **Role-based Access:** Middleware protection
- **Route Protection:** Frontend and backend validation

### Data Security
- **Input Sanitization:** Prevent XSS attacks
- **SQL Injection Protection:** Prisma ORM safety
- **Rate Limiting:** Prevent abuse
- **CORS Configuration:** Controlled cross-origin requests

### Validation & Error Handling
- **Server-side Validation:** Joi schema validation
- **Client-side Validation:** React Hook Form
- **Error Boundaries:** Graceful error handling
- **Audit Logging:** Track important operations

## 📱 Responsive Design

### Mobile-First Approach
- **Breakpoints:** Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- **Navigation:** Responsive hamburger menu
- **Tables:** Horizontal scroll on mobile
- **Forms:** Touch-friendly input fields
- **Cards:** Flexible grid layouts

### Accessibility Features
- **Keyboard Navigation:** Full keyboard support
- **Screen Reader Support:** ARIA labels and roles
- **Color Contrast:** WCAG compliant color schemes
- **Focus Management:** Clear focus indicators

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
```bash
# Build application
npm run build

# Set environment variables on platform
# Deploy using platform-specific commands
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build application
npm run build

# Deploy build folder
# Set environment variables on platform
```

### Database Deployment
- **Production Database:** Use managed PostgreSQL service
- **Environment Variables:** Update DATABASE_URL
- **Migrations:** Run `npx prisma migrate deploy`

## 🧪 Testing

### Backend Testing
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Frontend Testing
```bash
npm test              # Run React tests
npm run test:e2e      # End-to-end tests
```

## 📈 Performance Optimization

### Backend Optimizations
- **Database Indexing:** Optimized queries
- **Caching:** Redis for session management
- **Compression:** Gzip middleware
- **Rate Limiting:** Prevent overload

### Frontend Optimizations
- **Code Splitting:** Lazy loading components
- **Bundle Optimization:** Webpack optimization
- **Image Optimization:** Compressed assets
- **Memoization:** React.memo for performance

## 🐛 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check PostgreSQL service
sudo service postgresql status

# Verify DATABASE_URL format
postgresql://username:password@host:port/database
```

#### Authentication Issues
```bash
# Clear localStorage
localStorage.clear()

# Check JWT token expiration
# Verify JWT_SECRET in environment
```

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run clean
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/feature-name`
5. Submit pull request

### Code Standards
- **TypeScript:** Strict type checking
- **ESLint:** Code linting rules
- **Prettier:** Code formatting
- **Commit Messages:** Conventional commit format

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support or questions:
- **Email:** support@example.com
- **Documentation:** [Wiki](link-to-wiki)
- **Issues:** [GitHub Issues](link-to-issues)

## 🙏 Acknowledgments

- **Express.js Community:** Backend framework
- **React Team:** Frontend library
- **Prisma Team:** Database ORM
- **Tailwind CSS:** Styling framework
- **TypeScript Team:** Type safety

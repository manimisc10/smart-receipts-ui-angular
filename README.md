# Smart Receipts - Receipt Scanner App

A modern, responsive web application for scanning, organizing, and analyzing receipts with AI-powered OCR technology. Built with Angular and Material Design.

## 🚀 Features

### Core Functionality
- **Smart Receipt Scanning**: Use camera or upload images/PDFs for instant data extraction
- **AI-Powered OCR**: Automatic extraction of merchant info, items, and totals
- **Receipt Management**: Organize and categorize receipts with search and filtering
- **Expense Analytics**: Visual insights into spending patterns and trends
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Key Pages
- **Landing Page**: Attractive introduction with feature highlights
- **Dashboard**: Overview with quick stats and recent receipts
- **Scan Page**: Camera interface and file upload for receipt scanning
- **Receipt Details**: View and edit extracted receipt data
- **History**: Searchable list of all receipts with advanced filtering
- **Analytics**: Spending insights with charts and reports
- **Profile**: User account management and settings

## 🛠️ Technology Stack

- **Frontend**: Angular 17 (Standalone Components)
- **UI Framework**: Angular Material Design
- **Styling**: SCSS with responsive design
- **State Management**: RxJS Observables
- **Authentication**: JWT-based auth (simulated)
- **Charts**: Chart.js integration (ready for implementation)

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Angular CLI** (will be installed automatically)

## 🚀 Getting Started

### 1. Clone and Navigate
```bash
cd smart-receipts
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
ng serve
```

The application will be available at `http://localhost:4200`

### 4. Build for Production
```bash
ng build
```

## 🔐 Demo Credentials

For testing the application, use these demo credentials:

- **Email**: `demo@example.com`
- **Password**: `password`

## 📱 Features Overview

### Landing Page
- Modern hero section with app introduction
- Feature highlights with icons and descriptions
- Call-to-action buttons for registration and login
- Responsive design for all devices

### Authentication
- Secure login with form validation
- User registration with password confirmation
- JWT-based authentication (simulated)
- Protected routes with auth guards

### Dashboard
- Welcome message with user's name
- Quick action buttons (Scan, History, Analytics)
- Statistics cards with colorful icons
- Recent receipts list with navigation

### Receipt Scanning
- Camera access for mobile devices
- File upload for desktop users
- Real-time processing simulation
- Progress indicators and status updates

### Receipt Management
- Detailed receipt view with extracted data
- Editable fields for manual corrections
- Export options (PDF/CSV - placeholder)
- Delete functionality with confirmation

### Search and Filtering
- Text search by merchant name or items
- Date range filtering
- Price range filtering
- Real-time results update

### Analytics
- Total spending overview
- Monthly spending trends
- Category-based analysis
- Percentage change indicators

## 🎨 Design Features

- **Material Design**: Modern, clean interface
- **Responsive Layout**: Works on all screen sizes
- **Color-coded Icons**: Different colors for different card types
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: ARIA labels and keyboard navigation

## 📁 Project Structure

```
src/
├── app/
│   ├── pages/
│   │   ├── landing/           # Landing page
│   │   ├── auth/
│   │   │   ├── login/         # Login component
│   │   │   └── register/      # Registration component
│   │   ├── dashboard/         # Main dashboard
│   │   ├── scan/             # Receipt scanning
│   │   ├── receipt-details/   # Receipt view/edit
│   │   ├── history/          # Receipt history
│   │   ├── analytics/        # Spending analytics
│   │   └── profile/          # User profile
│   ├── services/
│   │   ├── auth.service.ts    # Authentication logic
│   │   └── receipt.service.ts # Receipt data management
│   ├── guards/
│   │   └── auth.guard.ts      # Route protection
│   └── app.component.*        # Main app component
├── styles.scss               # Global styles
└── main.ts                   # Application entry point
```

## 🔧 Configuration

### Environment Variables
The application is configured to work with mock data. For production, you would need to:

1. Create a `.env` file
2. Add API endpoints for:
   - Authentication (`/api/auth`)
   - Receipt scanning (`/api/scan`)
   - Receipt management (`/api/receipts`)

### API Integration
The current implementation uses mock services. To integrate with real APIs:

1. Update service methods to make HTTP calls
2. Replace mock data with actual API responses
3. Implement proper error handling
4. Add loading states and retry logic

## 🚀 Deployment

### Build for Production
```bash
ng build --configuration production
```

### Deploy to Various Platforms
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **Firebase**: Use Firebase Hosting
- **AWS S3**: Upload to S3 bucket

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔮 Future Enhancements

- **Real OCR Integration**: Connect to Azure Document Intelligence or Google Vision API
- **Cloud Storage**: Implement cloud storage for receipt images
- **Advanced Analytics**: Add more detailed charts and insights
- **Export Features**: Implement actual PDF and CSV export
- **Mobile App**: Create native mobile applications
- **Multi-language Support**: Add internationalization
- **Receipt Sharing**: Allow sharing receipts with others
- **Budget Tracking**: Add budget limits and alerts

---

**Smart Receipts** - Transform your expense management with AI-powered receipt scanning! 📱💳

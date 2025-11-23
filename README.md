# Adong Food Dashboard

A modern, responsive food management dashboard built with Next.js 14, TypeScript, and Bootstrap 5. This application provides comprehensive management tools for restaurants and food businesses, including order management, dish catalog, ingredient tracking, and supplier relationships.

## 🚀 Features

### Core Management
- **Order Management**: Create, view, and manage customer orders with detailed tracking
- **Dish Catalog**: Organize and maintain your restaurant's menu items
- **Ingredient Tracking**: Monitor and manage inventory ingredients
- **Supplier Management**: Maintain relationships with suppliers and track pricing
- **Kitchen Operations**: Manage kitchen standards and favorite suppliers

### Technical Features
- **Internationalization**: Multi-language support with i18next
- **Authentication**: Secure user authentication with NextAuth.js
- **Data Visualization**: Charts and analytics with Chart.js
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Type Safety**: Full TypeScript implementation
- **API Integration**: RESTful API with SWR for data fetching
- **Testing**: E2E testing with Cypress
- **Containerization**: Docker support for easy deployment

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Bootstrap 5 + SCSS
- **Icons**: FontAwesome
- **Charts**: Chart.js with react-chartjs-2
- **State Management**: SWR for server state
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: React Bootstrap, React Select

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint (Airbnb config)
- **Formatting**: Prettier
- **Testing**: Cypress (E2E)
- **Container**: Docker with multi-stage builds

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 9+
- Docker (optional, for containerized deployment)

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd adongfood/fe

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# The app will be available at http://localhost:3000
```

### Build & Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🧪 Testing

```bash
# Open Cypress test runner
pnpm cypress:open

# Run Cypress tests headlessly
pnpm cypress:run

# Run tests with dev server
pnpm test
```

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm cypress:open` | Open Cypress test runner |
| `pnpm cypress:run` | Run Cypress tests |
| `pnpm test` | Run tests with dev server |

## 🐳 Docker Deployment

### Build and Run

```bash
# Build Docker image
docker build -t adong-food-dashboard .

# Run container
docker run -p 3000:3000 adong-food-dashboard
```

### Multi-stage Build

The Dockerfile uses a multi-stage approach:
- **deps**: Installs dependencies with layer caching
- **builder**: Builds the Next.js application
- **runner**: Production-ready image with minimal footprint

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (authentication)/   # Authentication routes
│   ├── (dashboard)/        # Dashboard routes
│   │   ├── dishes/         # Dish management
│   │   ├── orders/         # Order management
│   │   ├── ingredients/    # Ingredient tracking
│   │   ├── suppliers/      # Supplier management
│   │   └── kitchens/       # Kitchen operations
│   └── api/                # API routes
├── components/             # Reusable React components
│   ├── Common/            # Common UI components
│   ├── Form/              # Form components
│   ├── Image/             # Image components
│   └── Page/              # Page-specific components
├── data/                  # Static data and mock data
├── hooks/                 # Custom React hooks
├── locales/               # Internationalization files
├── models/                # TypeScript models and types
├── services/              # API service functions
├── styles/                # Global styles and SCSS files
├── themes/                # Theme configurations
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── zod/                   # Zod schemas for validation
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
API_BASE_URL=http://localhost:8000
```

### Path Aliases

The project uses path aliases configured in `tsconfig.json`:

```typescript
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["src/*"]
  }
}
```

## 🌍 Internationalization

The application supports multiple languages using i18next:

- **Supported Languages**: English, Vietnamese (add more as needed)
- **Locale Files**: Located in `src/locales/`
- **Dynamic Loading**: Locales are loaded based on user preference or browser settings

## 🎨 Styling

- **CSS Framework**: Bootstrap 5
- **Preprocessor**: SCSS
- **Custom Theme**: Configurable theme in `src/themes/`
- **Responsive**: Mobile-first responsive design
- **Icons**: FontAwesome icons throughout the application

## 🔐 Authentication

Authentication is handled by NextAuth.js with support for:

- Multiple authentication providers
- Session management
- Protected routes
- API authentication

## 📊 Data Fetching

The application uses SWR for data fetching with features like:

- Automatic revalidation
- Error handling
- Loading states
- Cache management
- Optimistic updates

## 🧩 Common Components

The application includes a comprehensive set of reusable components to ensure consistency and reduce boilerplate code.

### Core UI Components

#### ActionButton
A versatile button component with loading states, icons, and multiple variants.
- **Features**: Loading spinner, FontAwesome icons, configurable variants
- **Use Cases**: Form submissions, navigation actions, CRUD operations

#### SaveButton
Specialized button for form submissions with internationalized labels.
- **Features**: Auto-loading states, localized text, consistent styling
- **Use Cases**: Form save operations, data submission

#### LoadingState
Reusable loading components with spinners and customizable messages.
- **Features**: Full-height support, size variants, custom messages
- **Use Cases**: Page loading, data fetching states, component loading

### Master Data Components

#### MasterDataListPage
Complete list page template with search, pagination, and CRUD operations.
- **Features**: Search functionality, pagination, sorting, delete confirmations
- **Used By**: Ingredients, Dishes, Suppliers, Kitchens, Recipe Standards
- **Benefits**: Consistent UI/UX across all list pages

#### MasterDataFormPage
Form page template with error handling and validation.
- **Features**: Error/success messages, cancel/submit actions, loading states
- **Used By**: All creation and edit forms
- **Benefits**: Standardized form behavior and appearance

### Modal Components

#### SingleSelectionModal
Modal for selecting a single item from a searchable list.
- **Features**: Search functionality, item details, custom rendering
- **Use Cases**: Kitchen selection, supplier selection, dish selection

#### MultiSelectionModal
Modal for selecting multiple items with checkboxes.
- **Features**: Bulk selection, search, additional form fields, confirmation flow
- **Use Cases**: Adding dishes to orders, selecting multiple suppliers

### Layout Components

#### Dashboard Layout
Main application layout with navigation, sidebar, and header.
- **Features**: Responsive navigation, user menu, breadcrumbs, theme switching
- **Components**: Sidebar, Header, Footer, Navigation items

## 📄 Page Structure

### Dashboard (`/`)
**Purpose**: Main landing page with quick actions and overview
**Features**:
- Welcome message with internationalization
- Quick action buttons for common tasks
- Navigation cards for different modules
- Recent activity summaries

### Order Management (`/orders`)
**Purpose**: Complete order lifecycle management
**Pages**:
- **List Page** (`/orders`): View all orders with filtering and pagination
- **Create Page** (`/orders/create`): Create new orders with dish selection
- **Detail Page** (`/orders/[id]`): View order details, ingredient summary, and status

**Key Features**:
- Order creation with multi-dish selection
- Ingredient requirement calculation
- Order status tracking
- Supplier assignment capabilities

### Dish Management (`/dishes`)
**Purpose**: Menu item and recipe management
**Pages**:
- **List Page** (`/dishes`): Browse and search dishes
- **Create/Edit Pages** (`/dishes/create`, `/dishes/[id]/edit`): Manage dish recipes

**Key Features**:
- Recipe composition with ingredients
- Ingredient quantity management
- Dish categorization
- Cost calculation based on ingredients

### Ingredient Management (`/ingredients`)
**Purpose**: Raw material and inventory tracking
**Pages**:
- **List Page** (`/ingredients`): View all ingredients with stock levels
- **Create/Edit Pages**: Manage ingredient details and suppliers

**Key Features**:
- Stock level tracking
- Supplier relationships
- Unit of measurement management
- Pricing information

### Supplier Management (`/suppliers`)
**Purpose**: Vendor and supplier relationship management
**Pages**:
- **List Page** (`/suppliers`): View and manage suppliers
- **Create/Edit Pages**: Supplier information and contact details

**Key Features**:
- Contact information management
- Supply capabilities tracking
- Price list management
- Performance metrics

### Kitchen Management (`/kitchens`)
**Purpose**: Kitchen location and operational management
**Pages**:
- **List Page** (`/kitchens`): View all kitchen locations
- **Create/Edit Pages**: Kitchen setup and configuration

**Key Features**:
- Location management
- Capacity tracking
- Equipment inventory
- Staff assignment

### Recipe Standards (`/recipe-standards`)
**Purpose**: Standardized recipe and quality control
**Pages**:
- **List Page** (`/recipe-standards`): View recipe standards
- **Create/Edit Pages**: Define standard recipes and procedures

**Key Features**:
- Standardized ingredient ratios
- Quality control metrics
- Preparation procedures
- Cost standardization

### Supplier Pricing (`/supplier-prices`)
**Purpose**: Price tracking and comparison across suppliers
**Pages**:
- **List Page** (`/supplier-prices`): Compare prices across suppliers
- **Create/Edit Pages**: Manage price lists and agreements

**Key Features**:
- Price comparison tools
- Historical price tracking
- Bulk pricing management
- Contract price integration

## 🚦 API Integration

The app integrates with a RESTful API through:

- Centralized API client in `src/utils/api_client.ts`
- Service functions in `src/services/`
- Type-safe API responses
- Error handling and retry logic

## 🧪 Code Quality

The project maintains high code quality with:

- **ESLint**: Airbnb configuration with TypeScript support
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Git Hooks**: Pre-commit hooks for code quality
- **Testing**: E2E tests with Cypress

## 📈 Performance

Optimizations include:

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic code splitting
- **Lazy Loading**: Component and route lazy loading
- **Caching**: SWR caching and Next.js caching
- **Bundle Analysis**: Built-in bundle analyzer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

---

Built with ❤️ for the food service industry
